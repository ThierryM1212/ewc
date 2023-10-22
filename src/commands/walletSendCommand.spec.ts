import JSONBigInt from 'json-bigint';
import { CommandOutput } from "./EWCCommand";
import { walletSendCommand } from "./walletSendCommand";
import { newWalletCommand } from "./newWalletCommand";
import { BalanceInfo } from '../ewc/BalanceInfo';
import { readFileSync } from 'fs';



test('Test walletSendCommand 0', async () => {
    let output: CommandOutput = await walletSendCommand('test', "test", {
        ergAmount: "0.1",
        //tokenId: undefined,
        //tokenAmount: undefined,
        balanceFile: undefined,
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages[0].outputs.length).toBe(3);
    expect(output.messages[0].inputs.length).toBeGreaterThanOrEqual(1);
});

test('Test walletSendCommand 1', async () => {
    let output: CommandOutput = await walletSendCommand('test', "test", {
        ergAmount: "0.1",
        tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        tokenAmount: "10",
        balanceFile: undefined,
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages[0].outputs.length).toBe(3);
    expect(output.messages[0].inputs.length).toBeGreaterThanOrEqual(1);
});

test('Test walletSendCommand 2', async () => {
    let output: CommandOutput = await walletSendCommand('test', "test", {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: "./tests/test_balance.json",
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages[0].outputs.length).toBe(3);
    expect(output.messages[0].inputs.length).toBeGreaterThanOrEqual(1);
});

test('Test walletSendCommand 3', async () => {
    let inquirer = require('@inquirer/prompts');
    inquirer.password = (question) => Promise.resolve("test");
    inquirer.editor = (question) => Promise.resolve(readFileSync("./tests/test_balance.json").toString('ascii'));
    inquirer.input = (question) => Promise.resolve("3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c");
    let output: CommandOutput = await walletSendCommand('test', undefined, {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: " ",
        sendAddress: "",
        sign: true,
        send: false
    })
    expect(output.messages[0].outputs.length).toBe(3);
    expect(output.messages[0].inputs.length).toBeGreaterThanOrEqual(1);
});

test('Test walletSendCommand 4', async () => {
    let output: CommandOutput = await walletSendCommand('test', undefined, {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: "./tests/wrong_balance.json",
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages).toEqual(["Cannot build the balance of the transaction"]);
});

test('Test walletSendCommand 5', async () => {
    let output: CommandOutput = await walletSendCommand('not_a_wallet', undefined, {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: "./tests/test_balance.json",
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages).toEqual(["Failed to load the wallet not_a_wallet"]);
});

test('Test walletSendCommand 6', async () => {
    let output: CommandOutput = await walletSendCommand('testWallet_invalid', undefined, {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: "./tests/test_balance.json",
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false
    })
    expect(output.messages).toEqual(["Failed to load the wallet testWallet_invalid"]);
});