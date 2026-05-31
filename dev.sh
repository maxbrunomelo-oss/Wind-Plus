#!/bin/sh
export PATH="/Users/maxbruno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/tmp:$PATH"
exec node /tmp/package/bin/npm-cli.js run dev
