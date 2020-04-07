#!/bin/sh

output=$(docker run --rm otp-gen -m hotp --counter 0 12345678901234567890)

if [ "755224" != "$output" ]; then
    echo "Test case failed! " "Expected [755224], Actual [$output]"
    exit 1
fi