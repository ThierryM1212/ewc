import { CommandOutput } from "./EWCCommand";
import { newWalletCommand } from "./newWalletCommand";
import { walletMintCommand } from "./walletMintCommand";


test('Test walletMintCommand 0', async () => {
    const output0: CommandOutput = await newWalletCommand({
        name: 'testWalletWM0',
        password: "testWallet2",
        mnemonic: "kiss water essence horse scan useless floor panel vast apart fall chimney",
        force: true,
        passphrase: "test",
        strength: '12',
        testNet: false
    })
    let inquirer = require('@inquirer/prompts');
    inquirer.password = (question) => Promise.resolve("testWallet2");
    let output: CommandOutput = await walletMintCommand('testWalletWM0', undefined, {
        name: "TestToken",
        amount: 1000,
        decimals: 2,
        description: "test tokens",
        sign: true,
        send: false,
        skipConfirm: true,
    })
    expect(output.messages[0]).toBe("NOT IMPLEMENTED YET");

    output = await walletMintCommand('testWalletWM0', undefined, {
        name: "TestToken",
        amount: 1000,
        decimals: 2,
        description: "test tokens",
        sign: false,
        send: true,
        skipConfirm: true,
    })
    expect(output.messages[0]).toBe("NOT IMPLEMENTED YET");

    output = await walletMintCommand('not_exists_wallet', undefined, {
        name: "TestToken",
        amount: 1000,
        decimals: 2,
        description: "test tokens",
        sign: true,
        send: true,
        skipConfirm: true,
    })
    expect(output.messages[0]).toBe("Failed to load the wallet not_exists_wallet");
});