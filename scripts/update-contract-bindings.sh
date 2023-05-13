#!/usr/bin/env bash

set -e

echo "updating contract bindings (typechain)"
echo "account-abstraction -> frontend"

(cd ./account-abstraction && yarn && yarn compile && cd ./contracts && yarn prepack)