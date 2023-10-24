import JSONBigInt from 'json-bigint';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { walletGetCommand } from "./walletGetCommand";
import { newWalletCommand } from "./newWalletCommand";
import { BalanceInfo } from '../ewc/BalanceInfo';



test('Test walletGetCommand 0', async () => {
    const output0: CommandOutput = await newWalletCommand({
        name: 'testWalletNWC1',
        password: "testWallet1",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    let output: CommandOutput = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: true,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages[0]).toEqual(["9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa", "9es2fpzi4vT1VPGdnTwALPQfeJL6m5pRrSSDGaMEtp58e5ZVhe5", "9g6qqFkZC1Uyzn8EqrY5JgkQnNUWKk5GemPUuQJ8peQ5dN7zyPN"]);
    output = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: false,
        updateUsedAddresses: true,
        mnemonic: false,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages).toEqual([]);
    output = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: true,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages).toEqual([{ "mnemonic": "kiss water essence horse scan useless floor panel vast apart fall chimney", "passphrase": "test" }]);
    output = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: "all",
        unspentBoxes: false
    })
    expect(output.messages[0]).toHaveProperty('amountERG');
    expect(output.messages[0]).toHaveProperty('tokens');
    output = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: "9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa",
        unspentBoxes: false
    })
    expect(output.messages[0]).toHaveProperty('amountERG');
    expect(output.messages[0]).toHaveProperty('tokens');
    output = await walletGetCommand('testWalletNWC1', "testWallet1", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: undefined,
        unspentBoxes: true
    })
    expect(output.messages[0]).toEqual([]);
});

test('Test walletGetCommand 1', async () => {
    const output0: CommandOutput = await newWalletCommand({
        name: 'testWalletNWC2',
        password: "testWallet2",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    let inquirer = require('@inquirer/prompts');
    inquirer.password = (question) => Promise.resolve("testWallet2");
    let output: CommandOutput = await walletGetCommand('testWalletNWC2', undefined, {
        listAddress: false,
        updateUsedAddresses: true,
        mnemonic: false,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages).toEqual([]);
    output = await walletGetCommand('testWalletNWC2', undefined, {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: true,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages).toEqual([{ "mnemonic": "kiss water essence horse scan useless floor panel vast apart fall chimney", "passphrase": "test" }]);
    output = await walletGetCommand('not_a_wallet', undefined, {
        listAddress: false,
        updateUsedAddresses: true,
        mnemonic: false,
        balance: undefined,
        unspentBoxes: false
    })
    expect(output.messages).toEqual(["Failed to load the wallet not_a_wallet"]);
});

test('Test walletGetCommand 2', async () => {
    const output0: CommandOutput = await newWalletCommand({
        name: 'testWalletNWC2',
        password: "testWallet2",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    let inquirer = require('@inquirer/prompts');
    inquirer.select = (question) => Promise.resolve("all");
    let output: CommandOutput = await walletGetCommand('testWalletNWC2', "testWallet2", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: true,
        unspentBoxes: false
    })
    expect(output.messages[0]).toHaveProperty('amountERG');
    expect(output.messages[0]).toHaveProperty('tokens');

    inquirer.select = (question) => Promise.resolve("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa");
    output = await walletGetCommand('testWalletNWC2', "testWallet2", {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: true,
        unspentBoxes: false
    })
    expect(output.messages[0]).toHaveProperty('amountERG');
    expect(output.messages[0]).toHaveProperty('tokens');
   
});

test('Test walletGetCommand 3', async () => {

    let inquirer = require('@inquirer/prompts');
    inquirer.select = (question) => Promise.resolve("details");
    let output: CommandOutput = await walletGetCommand('test', undefined, {
        listAddress: false,
        updateUsedAddresses: false,
        mnemonic: false,
        balance: true,
        unspentBoxes: false
    })
    expect(output.messages[0]).toHaveProperty("3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c");
    
   
});