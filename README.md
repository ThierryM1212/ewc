# EWC - Ergo Wallet CLI
Command line interface tool for Ergo built with Fleet SDK and typescript

## Features
- Ergo wallet: create or restore a wallet, sign, send transactions, check the balances
- Node get: get information from configured ergo node with additional indexes
- Compile ergoscript using node or Fleet SDK
- Decode ergobox register values
- Support mainnet and testnet
- Tests with 100% code coverage

## Setup
- Require Nodejs 18+
- `$ git clone https://github.com/ThierryM1212/ewc.git`
- `$ cd ewc`
- `$ npm install`
- Build: `$ npm run build`
- Test: `$ npm run test`
- Build and install ewc command: `$ npm run localinstall`

## Configuration
- The configuration file `./src/ewc.config.js` is copied to `./build/ewc.config.js` at build time
- `./build/ewc.config.js` is used by the ewc command
```
{
    "node": {
        "mainnet": {
            "url": "http://51.77.221.96:9053/"
        },
        "testnet": {
            "url": "http://51.77.221.96:9052/"
        }
    },
    "storage": {
        "walletDir": "wallets"
    }
}
```
- The walletDir can be configured with the full path to store the wallets

## Usage
See EWC_HELP_FULL.txt or execute `$ ewc help-full` to get the command syntax.

