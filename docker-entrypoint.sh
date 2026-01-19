#!/bin/sh
set -eu

CONFIG="/usr/share/nginx/html/runtime-config.js"

if [ -f "$CONFIG" ]; then
  if [ -n "${API_BASE_URL:-}" ]; then
    sed -i "s|__API_BASE_URL__|$API_BASE_URL|g" "$CONFIG"
  fi

  if [ -n "${APP_TOKEN:-}" ]; then
    sed -i "s|__APP_TOKEN__|$APP_TOKEN|g" "$CONFIG"
  fi
fi

exec "$@"
