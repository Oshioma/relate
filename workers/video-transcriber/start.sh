#!/bin/sh
# Sites change their players constantly and yt-dlp ships fixes within days.
# Upgrading on every boot means "redeploy/restart" is the fix for most
# "suddenly can't download" problems. Set YTDLP_AUTO_UPDATE=0 to pin instead.
set -e
if [ "${YTDLP_AUTO_UPDATE:-1}" != "0" ]; then
  pip install --no-cache-dir --quiet --upgrade "yt-dlp[default]" || echo "yt-dlp upgrade failed; using the installed version"
fi
exec uvicorn app:app --host 0.0.0.0 --port "${PORT:-8080}" --workers 1
