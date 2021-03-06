#!/bin/sh

if [ ! -f "./basic/checkout/basic-file.txt" ]; then
    echo "Expected basic file does not exist"
    exit 1
fi

if [ "$1" = "--archive" ]; then
  # Verify no .git folder
  if [ -d "./basic/checkout/.git" ]; then
    echo "Did not expect ./basic/checkout/.git folder to exist"
    exit 1
  fi
else
  # Verify .git folder
  if [ ! -d "./basic/checkout/.git" ]; then
    echo "Expected ./basic/checkout/.git folder to exist"
    exit 1
  fi

  # Verify auth token
  cd basic
  git fetch --no-tags --depth=1 origin +refs/heads/main:refs/remotes/origin/main
fi
