#!/usr/bin/env bash
# Source from hook scripts so Node always comes from nvm, never proto shims.
# Pre-commit hooks are isolated processes — PATH from setup.sh does not carry over.

_repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Drop moon/proto shims so they cannot intercept node/npx/pnpm via .nvmrc detection.
_new_path=""
_old_ifs=$IFS
IFS=:
for _p in $PATH; do
  case "$_p" in
    *'/.proto/'* | */.proto) ;;
    *)
      if [ -n "$_new_path" ]; then
        _new_path="$_new_path:$_p"
      else
        _new_path="$_p"
      fi
      ;;
  esac
done
IFS=$_old_ifs
export PATH="$_new_path"
unset _new_path _old_ifs _p

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm not found at $NVM_DIR. Install nvm and the Node version from .nvmrc." >&2
  return 1 2>/dev/null || exit 1
fi

# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"

# Must run in this shell (not a subshell) so PATH updates stick.
_prev_pwd=$PWD
cd "$_repo_root"
nvm use >/dev/null
cd "$_prev_pwd"
unset _repo_root _prev_pwd
