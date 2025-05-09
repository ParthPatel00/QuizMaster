#!/bin/bash
set -e

FRONTEND_DIR=/home/ubuntu/QuizMaster/frontend
DEST=/var/www/quizmaster

# 1) Install deps & build as ubuntu
cd "$FRONTEND_DIR"
npm ci
npm run build

# 2) Copy built assets into nginx webroot (needs root)
sudo rm -rf "${DEST:?}/"*
sudo mkdir -p "$DEST"
sudo cp -r dist/* "$DEST"
