#!/bin/bash
set -e

FRONTEND_DIR=/home/ubuntu/QuizMaster/frontend
DEST=/var/www/quizmaster

# 1) Install & build as ubuntu (so EFS permissions work)
cd "$FRONTEND_DIR"
npm ci
npm run build

# 2) Copy into nginx’s web root (requires root)
sudo rm -rf "${DEST:?}/"*
sudo mkdir -p "$DEST"
sudo cp -r dist/* "$DEST"
