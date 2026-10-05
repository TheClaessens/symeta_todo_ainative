#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=./ensure-node.sh
. "$(cd "$(dirname "$0")" && pwd)/ensure-node.sh"

cd "$ROOT_DIR/apps/server"
npx -y nestjs-doctor@latest . --verbose
