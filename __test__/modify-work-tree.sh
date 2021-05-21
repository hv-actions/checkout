#!/bin/bash

if [ ! -f "./basic/checkout/basic-file.txt" ]; then
    echo "Expected basic file does not exist"
    exit 1
fi

echo hello >> ./basic/checkout/basic-file.txt
echo hello >> ./basic/checkout/new-file.txt
git -C ./basic/checkout status