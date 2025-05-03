#!/bin/bash
TARGET=/home/ubuntu/QuizMaster
if [ -d "$TARGET" ]; then
  rm -rf "${TARGET:?}/"*
fi
