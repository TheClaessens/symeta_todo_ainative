#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=./ensure-node.sh
. "$(cd "$(dirname "$0")" && pwd)/ensure-node.sh"

npx lint-staged
