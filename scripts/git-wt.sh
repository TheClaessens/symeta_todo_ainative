#!/bin/bash
#
# git-wt.sh — Create a git worktree and start working in it
# =========================================================
#
# WHAT IT DOES
#   1. Creates a git worktree in a sibling directory next to the original repo
#      that owns the common .git directory (e.g. ../<name>). If a branch named
#      <name> already exists it is checked out; otherwise a new branch <name>
#      is created from <base-ref> (default: the branch checked out where you
#      run the script). This keeps new worktrees
#      rooted from the original checkout, even when the script is launched
#      from another linked worktree.
#   2. Copies the local (gitignored) .env files into the worktree. A worktree
#      does NOT inherit the main checkout's untracked files, and this monorepo
#      keeps secret-bearing .env files in apps/* and packages/* — so they are
#      discovered with `find apps packages -name .env` and copied over,
#      preserving their subdirectory paths.
#   3. Opens the selected tool on the new worktree root (VS Code by default).
#
# USAGE
#   ./scripts/git-wt.sh [--ide=<ide>] <worktree-name> [base-ref]
#
#   <worktree-name>   Name for the branch AND the worktree directory.
#                     Use your branch naming convention, e.g.:
#                       ./scripts/git-wt.sh feature/123-my-thing
#                     Slashes create subdirectories under the parent folder.
#   [base-ref]        Start point for a NEW branch (default: the currently
#                     checked-out branch). Ignored when the branch already
#                     exists. Lets you fork from origin/main, a tag, another
#                     feature branch, etc.
#   --ide=<ide>       IDE to open on the worktree root. One of:
#                       vscode (default), cursor, webstorm, pycharm, none
#                     Uses the IDE's CLI launcher if installed, otherwise
#                     falls back to `open -na <App>` on macOS. The default can
#                     be set via the GIT_WT_IDE environment variable.
#
# EXAMPLES
#   ./scripts/git-wt.sh fix/login-bug              # new branch off the current branch + worktree at ../fix/login-bug
#   ./scripts/git-wt.sh feature/96911              # checks out the branch if it exists
#   ./scripts/git-wt.sh feature/spike origin/main  # new branch off origin/main
#   ./scripts/git-wt.sh --ide=cursor fix/login-bug # open the worktree in Cursor
#   GIT_WT_IDE=pycharm ./scripts/git-wt.sh api/foo # choose the default via env var
#
# NOTES
#   - Run from anywhere inside the repository.
#   - This script intentionally does NOT install dependencies. The new worktree
#     has no node_modules / .venv / generated code yet. Before `pnpm dev`, run
#     in the worktree:  pnpm install  (and `uv sync`, `pnpm build` as needed).
#   - IDE configuration is not copied. Commit shared configuration so Git
#     checks it out in every worktree.
#   - If the selected launcher is not installed, the script prints the worktree
#     path so you can open it manually.
#
# CLEANUP (when you're done with a worktree)
#   git worktree remove ../<worktree-name>
#   git branch -D <worktree-name>        # if you also want to delete the branch

set -euo pipefail

IDE="${GIT_WT_IDE:-vscode}"

usage() {
    echo "Usage: $0 [--ide=vscode|cursor|webstorm|pycharm|none] <worktree-name> [base-ref]"
}

usage_error() {
    echo "❌ Error: $1"
    usage
    exit 1
}

# Parse leading options and leave the worktree name and optional base ref in
# the positional parameters for validation below. `--` ends option parsing.
while [ "$#" -gt 0 ]; do
    case "$1" in
        --ide=*)
            IDE=${1#--ide=}
            if [ -z "$IDE" ]; then
                usage_error "Option --ide requires a value."
            fi
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        --)
            shift
            break
            ;;
        -*)
            usage_error "Unknown option '$1'."
            ;;
        *)
            break
            ;;
    esac
done

if [ "$#" -lt 1 ]; then
    usage_error "Please provide a name for the worktree/branch."
fi

if [ "$#" -gt 2 ]; then
    usage_error "Too many arguments."
fi

WORKTREE_NAME=$1
BASE_REF=${2:-HEAD}
IDE_COMMAND=""

case "$IDE" in
    vscode)
        IDE_COMMAND="code"
        ;;
    cursor|webstorm|pycharm)
        IDE_COMMAND=$IDE
        ;;
    none) ;;
    *)
        usage_error "Unknown IDE '$IDE'."
        ;;
esac

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: This command must be run inside a Git repository."
    exit 1
fi

# Resolve the current worktree root so local files are copied from the checkout
# you are actively working in, regardless of the cwd. Resolve the original
# checkout from Git's common directory only to decide where the new worktree
# directory should be created.
CURRENT_WORKTREE_ROOT=$(git rev-parse --show-toplevel)
GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir)
ORIGINAL_REPO_ROOT=$(dirname "$GIT_COMMON_DIR")
TARGET_DIR="$(dirname "$ORIGINAL_REPO_ROOT")/$WORKTREE_NAME"

if [ -e "$TARGET_DIR" ]; then
    echo "❌ Error: Target directory already exists: $TARGET_DIR"
    echo "   If it is a stale worktree, remove it first:  git worktree remove \"$TARGET_DIR\""
    exit 1
fi

EXISTING_WORKTREE=$(git worktree list --porcelain | awk -v branch_ref="refs/heads/$WORKTREE_NAME" \
    '$1 == "worktree" { worktree_path = $2 } $1 == "branch" && $2 == branch_ref { print worktree_path }')
if [ -n "$EXISTING_WORKTREE" ]; then
    echo "❌ Error: Branch '$WORKTREE_NAME' is already checked out at: $EXISTING_WORKTREE"
    exit 1
fi

echo "🌳 Setup started for worktree: $WORKTREE_NAME"

if git show-ref --verify --quiet "refs/heads/$WORKTREE_NAME"; then
    echo "🌿 Branch '$WORKTREE_NAME' already exists. Checking it out..."
    git worktree add "$TARGET_DIR" "$WORKTREE_NAME"
else
    if ! git rev-parse --verify --quiet "$BASE_REF^{commit}" > /dev/null; then
        echo "❌ Error: Base ref '$BASE_REF' does not exist."
        exit 1
    fi
    echo "🌿 Creating new branch '$WORKTREE_NAME' from '$(git rev-parse --abbrev-ref "$BASE_REF")'..."
    git worktree add -b "$WORKTREE_NAME" "$TARGET_DIR" "$BASE_REF"
fi

echo "🔒 Copying environment and secret files..."

# This is a pnpm/Turborepo monorepo: the real (gitignored) .env files live in
# apps/* and packages/* subdirectories, not at the repo root. Discover them
# dynamically — same approach as scripts/kickstart.sh — so new apps/packages are
# picked up automatically. Paths are relative to the current worktree root, so
# .env files come from the checkout you launched this script from.
COPIED_COUNT=0

while IFS= read -r -d '' file; do
    # "$file" is relative to CURRENT_WORKTREE_ROOT, e.g. apps/server/.env — preserve layout.
    mkdir -p "$TARGET_DIR/$(dirname "$file")"
    cp "$CURRENT_WORKTREE_ROOT/$file" "$TARGET_DIR/$file"
    echo "   ✓ Copied $file"
    COPIED_COUNT=$((COPIED_COUNT + 1))
done < <(cd "$CURRENT_WORKTREE_ROOT" && find apps packages -name ".env" -type f -print0 2>/dev/null)

if [ "$COPIED_COUNT" -eq 0 ]; then
    echo "   ℹ No matching .env files found to copy."
fi

echo "✅ Success! Worktree is ready at: $TARGET_DIR"

open_selected_ide() {
    if command -v "$IDE_COMMAND" > /dev/null 2>&1; then
        "$IDE_COMMAND" "$TARGET_DIR" > /dev/null 2>&1 &
    elif [ "$(uname)" = "Darwin" ] && open -Ra "$IDE_COMMAND" 2>/dev/null; then
        open -na "$IDE_COMMAND" --args "$TARGET_DIR"
    else
        echo "   ℹ Could not find a launcher for '$IDE_COMMAND'. Open the IDE manually:"
        echo "       $TARGET_DIR"
        return
    fi

    echo "🖥  Opening $IDE_COMMAND at $TARGET_DIR..."
}

if [ "$IDE" != "none" ]; then
    open_selected_ide
fi
