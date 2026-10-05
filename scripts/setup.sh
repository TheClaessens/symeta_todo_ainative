#!/usr/bin/env bash
# Setup environment for pre-commit hooks (loads nvm, strips proto from PATH).
set -euo pipefail
# shellcheck source=./ensure-node.sh
. "$(cd "$(dirname "$0")" && pwd)/ensure-node.sh"

# Fail early if Node is still missing or intercepted after ensure-node.
node -v >/dev/null
command -v npx >/dev/null
