#!/bin/bash

cd /home/ubuntu/QuizMaster/frontend

echo "Installing dependencies..."
npm install

echo "Building app..."
npm run build

echo "Deploying build..."
sudo rm -rf /var/www/quizmaster/*
sudo cp -r dist/* /var/www/quizmaster/

echo "Restarting nginx..."
sudo systemctl restart nginx
