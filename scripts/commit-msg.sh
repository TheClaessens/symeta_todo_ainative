#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=./ensure-node.sh
. "$(cd "$(dirname "$0")" && pwd)/ensure-node.sh"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT_DIR/scripts/commit-msg.mjs" "$@"
