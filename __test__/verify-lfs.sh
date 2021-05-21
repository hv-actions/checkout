#!/bin/bash

if [ ! -f "./lfs/checkout/regular-file.txt" ]; then
    echo "Expected regular file does not exist"
    exit 1
fi

if [ ! -f "./lfs/checkout/lfs-file.bin" ]; then
    echo "Expected lfs file does not exist"
    exit 1
fi
