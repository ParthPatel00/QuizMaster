#!/bin/bash
set -e
# 1. Install dependencies and build
cd /home/ubuntu/QuizMaster/frontend
npm ci
npm run build

# 2. Deploy built assets
DEST=/var/www/quizmaster
sudo rm -rf "${DEST:?}/"*
sudo mkdir -p "$DEST"
sudo cp -r dist/* "$DEST"
