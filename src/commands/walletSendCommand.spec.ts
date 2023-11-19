import { CommandOutput } from "./EWCCommand";
import { walletSendCommand } from "./walletSendCommand";
import { readFileSync } from 'fs';


test('Test walletSendCommand 0', async () => {
    let output: CommandOutput = await walletSendCommand('test', "test", {
        ergAmount: "0.1",
        //tokenId: undefined,
        //tokenAmount: undefined,
        balanceFile: undefined,
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: false,
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
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
        send: false,
        check: false,
        skipConfirm: true
    })
    expect(output.messages).toEqual(["Failed to load the wallet testWallet_invalid"]);
});

test('Test walletSendCommand 7', async () => {
    let output: CommandOutput = await walletSendCommand('test', 'bad_password', {
        ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        balanceFile: undefined,
        sendAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        sign: true,
        send: false,
        check: false,
        skipConfirm: true
    })
    expect(output.messages[0]).toContain("Failed to sign the transaction:");
});

test('Test walletSendCommand 8', async () => {
    let output: CommandOutput = await walletSendCommand('test', 'test', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        unsignedTx: "./tests/sample_unsigned_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: true,
        send: false,
        check: false,
        skipConfirm: true
    })
    expect(output.messages[0].id).toBe("39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b");
    expect(output.messages[0].inputs[0].spendingProof).toBeDefined();
});

test('Test walletSendCommand 9', async () => {
    let output: CommandOutput = await walletSendCommand('testWallet0', 'testWallet0', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        signedTx: "./tests/sample_signed_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: false,
        send: true,
        check: false,
        skipConfirm: true
    })
    expect(output.error).toBe(true);
});

test('Test walletSendCommand 9', async () => {
    let output: CommandOutput = await walletSendCommand('testWallet0', 'testWallet0', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        signedTx: "./tests/sample_signed_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: false,
        send: false,
        check: true,
        skipConfirm: true
    })
    expect(output.error).toBe(true);
});

test('Test walletSendCommand 10', async () => {
    let output: CommandOutput = await walletSendCommand('test', 'test', {
        ergAmount: "10000",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        //signedTx: "./tests/sample_signed_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: false,
        send: false,
        check: false,
        skipConfirm: true
    })
    expect(output.error).toBe(true);
    expect(output.messages[0]).toContain("Failed to build the transaction");
});

test('Test walletSendCommand 11', async () => {
    let { ErgoNodeProvider } = require('@fleet-sdk/blockchain-providers')
    const mockPostTx = jest.fn();
    ErgoNodeProvider.prototype.submitTransaction = mockPostTx;
    mockPostTx.mockReturnValue(Promise.resolve({ success: true, transactionId: "39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b" }));
    let output: CommandOutput = await walletSendCommand('test', 'test', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        unsignedTx: "./tests/sample_unsigned_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: true,
        send: true,
        check: false,
        skipConfirm: true
    })
    expect(output.messages[0].transactionId).toBe("39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b");
});

test('Test walletSendCommand checkTransaction', async () => {
    let { ErgoNodeProvider } = require('@fleet-sdk/blockchain-providers')
    const mockPostTx = jest.fn();
    ErgoNodeProvider.prototype.checkTransaction = mockPostTx;
    mockPostTx.mockReturnValue(Promise.resolve({ success: true, transactionId: "39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b" }));
    let output: CommandOutput = await walletSendCommand('test', 'test', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        unsignedTx: "./tests/sample_unsigned_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: true,
        send: false,
        check: true,
        skipConfirm: true
    })
    expect(output.messages[0].transactionId).toBe("39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b");
});

test('Test walletSendCommand 12', async () => {
    let { ErgoNodeProvider } = require('@fleet-sdk/blockchain-providers')
    const mockPostTx = jest.fn();
    ErgoNodeProvider.prototype.sendTransaction = mockPostTx;
    mockPostTx.mockReturnValue(Promise.resolve("39f4bf3bdd01dded9fd4641b6c40847586a63415925ebfc804ac937ad735d99b"));

    let inquirer = require('@inquirer/prompts');
    inquirer.confirm = (question) => Promise.resolve(false);

    let output: CommandOutput = await walletSendCommand('test', 'test', {
        //ergAmount: "0.1",
        //tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7",
        //tokenAmount: "10",
        unsignedTx: "./tests/sample_unsigned_tx.json",
        balanceFile: undefined,
        sendAddress: "9hnCTig84y2NwHLtjbNDdiX3cy6B26zWCkhZZ9kZw7vRorF5Gn7",
        sign: true,
        send: true,
        check: false,
        skipConfirm: false
    })
    expect(output.error).toBe(true);
    expect(output.messages[0]).toBe("Send transaction cancelled.");
});