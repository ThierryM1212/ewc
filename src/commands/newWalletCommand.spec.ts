import { Config } from '../ewc/Config';
import { CommandOutput } from './EWCCommand';
import { newWalletCommand } from './newWalletCommand';

const config = new Config();


test('Test NewWalletCommand 0', async () => {
    const output: CommandOutput = await newWalletCommand({
        name: 'testWalletEWC0',
        password: "testWallet0",
        force: true,
        passphrase: "",
        strength: '24',
        testNet: false
    })
    expect(output.messages[0].trim()).toContain('Wallet testWalletEWC0 created in ');
})


test('Test NewWalletCommand 1', async () => {
    let inquirer = require('@inquirer/prompts');
    inquirer.input = (question) => Promise.resolve("testWalletEWC1");
    inquirer.password = (question) => Promise.resolve("testWallet1");
    inquirer.confirm = (question) => Promise.resolve(true);
    const output: CommandOutput = await newWalletCommand({
        force: false,
        passphrase: "",
        strength: '24',
        testNet: true
    })
    expect(output.messages[0].trim()).toContain('Wallet testWalletEWC1 created in ');
})

test('Test NewWalletCommand 2', async () => {
    let inquirer = require('@inquirer/prompts');
    inquirer.input = (question) => Promise.resolve("testWalletEWC1");
    inquirer.password = (question) => Promise.resolve(Math.random().toString());
    inquirer.confirm = (question) => Promise.resolve(true);
    const output: CommandOutput = await newWalletCommand({
        force: false,
        passphrase: "",
        strength: '24',
        testNet: true
    })
    expect(output.messages[0].trim()).toContain('Passwords do not match.');
})

test('Test NewWalletCommand 3', async () => {
    const output: CommandOutput = await newWalletCommand({
        name: 'testWalletEWC1',
        password: "testWallet1",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    expect(output.messages[0].trim()).toContain('Wallet testWalletEWC1 created in ');
})

test('Test NewWalletCommand 4', async () => {
    const output: CommandOutput = await newWalletCommand({
        name: 'testWalletEWC2',
        password: "testWallet2",
        mnemonic: "bad mnemonic",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    expect(output.messages[0].trim()).toBe('Wallet not created.');
})

test('Test NewWalletCommand 5', async () => {
    let inquirer = require('@inquirer/prompts');
    inquirer.confirm = (question) => Promise.resolve(false);
    const output: CommandOutput = await newWalletCommand({
        name: 'testWalletEWC1',
        password: "testWallet1",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: false,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    expect(output.messages[0].trim()).toBe('Wallet creation aborted, use the --force option to override the existing wallet');
})