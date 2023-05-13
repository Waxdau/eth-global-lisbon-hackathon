#!/usr/bin/env bash

set -e

# git submodules
echo "init git submodules"
git submodule init && git submodule update

# account-abstraction
echo "setting up account-abstraction..."
(cd ./account-abstraction && yarn && yarn compile && cd ./contracts && yarn prepack)

# bundler
echo "setting up bundler..."
(cd ./bundler && yarn && yarn preprocess)

# trampoline
# echo "setting up trampoline..."
# (cd ./trampoline && yarn)

# setup frontend
(cd ./frontend && yarn install)
