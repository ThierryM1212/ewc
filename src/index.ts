#! /usr/bin/env node


import { Command } from 'commander';
import { newWalletCommand } from './commands/newWalletCommand';
import { CommandOutput, printOutput } from './commands/EWCCommand';
import { walletGetCommand } from './commands/walletGetCommand';
import { walletSendCommand } from './commands/walletSendCommand';
import { nodeGetCommand } from './commands/nodeGetCommand';
import { compileCommand } from './commands/compileCommand';
import { decodeRegister } from './commands/decodeRegister';
import { walletMintCommand } from './commands/walletMintCommand';

const program = new Command();


program
  .name('ewc')
  .description('Ergo wallet CLI')
  .version('0.1.0')
  .option('--text', 'Text output', false)
  ;

program.command('new-wallet')
  .description('Create a new wallet')
  .alias('nw')
  .option('-n, --name <string>', 'Wallet name')
  .option('-p, --password <string>', 'Spending password')
  .option('-m, --mnemonic <string>', 'If not provided, a new mnemonic is generated')
  .option('-a, --passphrase <string>', 'passphrase', '')
  .option('-s, --strength <number>', 'Number of words for the mnemonic [12, 15, 18, 21, 24]', '24')
  .option('-t, --test-net', 'Testnet wallet', false)
  .option('-f, --force', 'Force wallet override if it exists', false)
  .action(async (options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await newWalletCommand(options);
    printOutput(output, options.text);
  });

program.command('wallet-get')
  .description('Information about a wallet')
  .alias('wg')
  .argument('<walletName>', 'Wallet name')
  .argument('[walletPassword]', 'password for user, if required', undefined)
  .option('-l, --list-address', 'list adresses', false)
  .option('-u, --update-used-addresses', 'Update the used addresses', false)
  .option('-m, --mnemonic', 'Show wallet mnemonic in clear text', false)
  .option('-b, --balance [string]', 'Display the balance of an address, "all" for the aggregated wallet balance, "details" for the balance per address', undefined)
  .option('-x, --unspent-boxes', 'Get unspent boxes for the wallet', false)
  .action(async (walletName, walletPassword, options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await walletGetCommand(walletName, walletPassword, options);
    printOutput(output, options.text);
  });

program.command('wallet-send')
  .description('Send transaction with a wallet')
  .alias('ws')
  .argument('<walletName>', 'Wallet name')
  .argument('[walletPassword]', 'password for user, if required', undefined)
  .option('-e, --erg-amount <number>', 'Amount of ERGs to send')
  .option('-t, --token-id <string>', 'Token id to send')
  .option('-u, --token-amount <number>', 'Token amount to send')
  .option('-b, --balance-file [string]', 'Path to the json balance of the transaction, empty to open an editor', "")
  .option('-a, --send-address <string>', 'Send to address')
  .option('-s, --sign', 'Sign the transaction', false)
  .option('-x, --send', 'Sign and send the transaction', false)
  .option('-c, --check', 'Sign and check the transaction', false)
  .option('-y, --skip-confirm', 'Send the transaction without asking confirmation', false)
  .option('--unsigned-tx <string>', 'Path to an EIP12 json unsigned transaction')
  .option('--signed-tx <string>', 'Path to an EIP12 json signed transaction')
  .action(async (walletName, walletPassword, options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await walletSendCommand(walletName, walletPassword, options);
    printOutput(output, options.text);
  });

program.command('wallet-mint')
  .description('Mint a token')
  .alias('wm')
  .argument('<walletName>', 'Wallet name')
  .argument('[walletPassword]', 'password for user, if required', undefined)
  .option('-n, --name <string>', 'Name of the token')
  .option('-a, --amount <number>', 'Number of token to mint')
  .option('-d, --decimals [number]', 'Number of decimals', "0")
  .option('-l, --description [string]', 'Description of the token', "")
  .option('-s, --sign', 'Sign the transaction', false)
  .option('-x, --send', 'Sign and send the transaction', false)
  .option('-y, --skip-confirm', 'Send the transaction without asking confirmation', false)
  .action(async (walletName, walletPassword, options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await walletMintCommand(walletName, walletPassword, options);
    printOutput(output, options.text);
  });

program.command('node-get')
  .description('get from node')
  .alias('ng')
  .option('-t, --test-net', 'Testnet node', false)
  .option('--box-by-id <string>', 'Get box by boxId')
  .option('--box-by-index <number>', 'Get box by box index')
  .option('--height', 'Current node height', false)
  .option('--indexed-height', 'Current node indexed height', false)
  .option('--last-headers <number>', 'Get the [n] last headers')
  .option('--token-info <string>', 'Information about the token [tokenId]')
  .option('--node-info', 'Information about node', false)
  .option('--utxos-by-address <string>', 'Get unspent boxes for an [address]')
  .option('--utxos-by-ergotree <string>', 'Get unspent boxes for an [ergotree]')
  .option('--utxos-by-tokenid <string>', 'Get unspent boxes by [tokenid]')
  .option('--boxes-by-address <string>', 'Get boxes for an [address]')
  .option('--boxes-by-ergotree <string>', 'Get boxes for an [ergotree]')
  .option('--boxes-by-tokenid <string>', 'Get boxes by [tokenid]')
  .option('--balance <string>', 'Get the balance for an [address]')
  .option('--tx-by-id <string>', 'Transaction by transaction id [txId]')
  .option('--tx-by-index <number>', 'Transaction by transaction index [index]')
  .option('--tx-by-address <string>', 'Transactions for an [address]')
  .option('--unconfirmed-tx', 'Unconfirmed transactions', false)
  .option('--unconfirmed-tx-by-id <string>', 'Unconfirmed transactions by transaction id')
  .action(async (options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await nodeGetCommand(options);
    printOutput(output, options.text);
  });

program.command('compile')
  .description('Compile ergoscript with fleet or node')
  .alias('c')
  .argument('<path>', 'Path to ergoscript file')
  .option('-v, --compiler-version <number>', 'Compiler version [0, 1]', "0")
  .option('-s, --segregate-constants', 'Segregate Constants', false)
  .option('-n, --node-compile', 'Compile with the ergo node (v0, segregated)', false)
  .option('-t, --test-net', 'Testnet address', false)
  .action(async (path, options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await compileCommand(path, options);
    printOutput(output, options.text);
  });

program.command('decode-register')
  .description('Decode ergobox register value (R4->R9)')
  .alias('dr')
  .argument('<value>', 'Register value to decode')
  .action(async (value, options) => {
    options = { ...options, ...program.optsWithGlobals() }
    const output: CommandOutput = await decodeRegister(value, options);
    printOutput(output, options.text);
  });

program.command('help-full')
  .description('Show the complete help page')
  .alias('hf')
  .action(async () => {
    program.outputHelp();
    console.log('--------------------------------------------------------------------------------');
    for (let c of program.commands) {
      c.outputHelp();
      console.log('--------------------------------------------------------------------------------');
    }
  });

program.parse();
