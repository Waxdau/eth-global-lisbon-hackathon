#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

set -meuo pipefail

function cleanup {
  jobs -p | xargs kill
}

trap cleanup EXIT

echo "starting hardhat node..."
cd ./bundler
yarn hardhat-node &
cd ..

"${SCRIPT_DIR}/wait-for-rpc.sh"

echo "deploying entrypoint..."
(cd ./account-abstraction && \
    # use default hardhat mnemonic
    DEBUG=true yarn deploy --network dev)

# TODO record entrypoint address

# TODO Is this needed? Looks like factory is deployed with entrypoint
# echo "deploying factory..."
# (cd ./trampoline && npx hardhat deploy --network localhost)

# TODO record factory address

# TODO Configure bundler
# 4. Edit `bundler.config.json` at `packages/bundler/localconfig`:
#   a. Edit `network` to your local hardhat node
#   b. Edit the `entryPoint` address that you got while deploying it using instructions above.
#   c. Make sure your mnemonic & beneficiary are setup correctly.

echo "starting bundler..."
cd ./bundler
yarn bundler --unsafe --auto &
cd ..

# echo "starting trampoline..."
# cd ./trampoline
# yarn start &
# cd ..

fg
