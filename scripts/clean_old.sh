#!/bin/bash
set -e

TARGET=/home/ubuntu/QuizMaster

if [ -d "$TARGET" ]; then
  # delete everything inside, including hidden files, without failing on empty
  find "$TARGET" -mindepth 1 -delete
fi
