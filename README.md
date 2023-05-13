# eth-global-lisbon-hackathon

# deps
NodeJS >= v18.12

# setup

```bash
./scripts/setup.sh
```

# run

## chain & bundler

### one script

```bash
./scripts/runs.sh
```
When terminating closing, also run:

```bash
fuser -k 8545/tcp
```

### multi step/terminal

Start hardhat rpc node in one terminal
```bash
cd ./bundler
yarn hardhat-node
```

In another terminal, deploy Entrypoint & SimpleAccountFactory
```bash
cd ./account-abstraction
DEBUG=true yarn deploy --network dev
```

Finally, start the bundler
```bash
cd ../bundler
yarn bundler --unsafe --auto
```

## frontend

In a new terminal
```bash
cd ./frontend
yarn dev
```

## update contract bindings (typechain)

```bash
./scripts/update-contract-bindings.sh
```
