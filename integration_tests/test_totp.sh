#!/bin/sh

output=$(docker run --rm otp-gen -m totp --epoch 0 JBSWY3DPEHPK3PXP)

if [ "282760" != "$output" ]; then
    echo "Test case failed! " "Expected [755224], Actual [$output]"
    exit 1
fi
