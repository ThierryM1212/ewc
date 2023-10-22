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
    }
}
```

## Usage
See EWC_HELP_FULL.txt or execute `$ ewc help-full` to get the command syntax.

### Sample commands
- Create a new wallet named "wall1" with password "secret" a new mnemonic is generated
```
$ ewc new-wallet -n wall1 -p secret
Wallet wall1 created in C:\Users\thier\Ergo\ewc\build\wallets\wall1.wallet
```

- Show the addresses of the new wallet
```
$ ewc wg wall1 -l
[
  "9hxgxWDnvxaUqrY9aDu9BHUtm6Y6hNo1TaHDD4xdsLiPDHdnx8z",
  "9h6PvojDXqao8yraEfnto2Likzrg9AXfYH42zD36cKsENrxbdat",
  "9h9CS2L6WSJtJXqQniMfdhpHMqLxPV25QgNB2HqpXQABkuigmrn"
]
```

- Show the addresses of the new wallet in text format
```
$ ewc wg wall1 -l --text
┌───┬───────────────────────────────────────────────────────┐
│ 0 │ 9hxgxWDnvxaUqrY9aDu9BHUtm6Y6hNo1TaHDD4xdsLiPDHdnx8z   │
├───┼───────────────────────────────────────────────────────┤
│ 1 │ 9h6PvojDXqao8yraEfnto2Likzrg9AXfYH42zD36cKsENrxbdat   │
├───┼───────────────────────────────────────────────────────┤
│ 2 │ 9h9CS2L6WSJtJXqQniMfdhpHMqLxPV25QgNB2HqpXQABkuigmrn   │
└───┴───────────────────────────────────────────────────────┘
```

- Create a new wallet, providing the mnemonic, be prompted for the spending password
```
$ ewc nw -n wall2 -m "also sense mobile grocery heart artist sun useless jealous excite average keep skate sausage donkey blame unaware rifle aerobic crater correct mask neutral taste" 
? Enter the spending password of the wallet
Wallet wall2 created in C:\Users\thier\Ergo\ewc\build\wallets\wall2.wallet
```

- Generate an EIP12 unsigned transaction to send 0.1 ERG to an address
```
$ ewc ws wall1 -e 0.1 -a 9hxgxWDnvxaUqrY9aDu9BHUtm6Y6hNo1TaHDD4xdsLiPDHdnx8z 
{
  "inputs": [
    {
      "boxId": "07b5b4aad7e93c94c93957794c99fd678518f2402c81920248e2e94676ca1456",
      ...
    }
  ]
}
```

- Generate an EIP12 signed transaction to send 0.1 ERG to an address
```
$ ewc ws wall1 -e 0.1 -a 9hxgxWDnvxaUqrY9aDu9BHUtm6Y6hNo1TaHDD4xdsLiPDHdnx8z -s
{
  "inputs": [
    {
      "boxId": "07b5b4aad7e93c94c93957794c99fd678518f2402c81920248e2e94676ca1456",
      ...
    }
  ]
}
```

- Compile an ergoscript contract
```
$ ewc c tests/test_script.es --text
┌─────────────────────┬────────────────────────┐
│ address             │ 5seLxZkQx9zXcXFkrqdZ   │
├─────────────────────┼────────────────────────┤
│ ergotree            │ 00d1917ea3050580890f   │
├─────────────────────┼────────────────────────┤
│ version             │ 0                      │
├─────────────────────┼────────────────────────┤
│ segregatedConstants │ false                  │
└─────────────────────┴────────────────────────┘
```

- Decode a register value
```
$ ewc dr 0e0954657374546f6b656e        
{
  "registerValue": "0e0954657374546f6b656e",
  "type": "Coll[Byte]",
  "value": "[84,101,115,116,84,111,107,101,110]",
  "utf8Value": "TestToken"
}
```