import { generateMnemonic } from "@scure/bip39";
import { wordlist } from '@scure/bip39/wordlists/english';
import { Network } from '@fleet-sdk/core';
import { input, password, confirm } from '@inquirer/prompts';
import { initWallet, getWalletFilePath } from '../ewc/Wallet';
import { existsSync } from 'fs';
import { MNEMONIC_STRENGTH_WORD_NUMBER } from '../utils/constants';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";


export type NewWalletOptions = {
    name?: string,
    password?: string,
    mnemonic?: string,
    passphrase: string,
    strength: string,
    testNet: boolean,
    force: boolean,
}

export async function newWalletCommand(options: NewWalletOptions): Promise<CommandOutput> {
    let walletName = "", walletPassword = "", output: CommandOutput = getDefaultOutput();
    if (options.name) {
        walletName = options.name;
    } else {
        walletName = await input({ message: 'Enter the name of the wallet' });
    }
    let createWallet = true;
    if (!options.force && existsSync(getWalletFilePath(walletName))) {
        createWallet = await confirm({ message: 'Overrride the existing wallet ' + walletName + " ?" })
    }
    if (createWallet) {
        if (options.password) {
            walletPassword = options.password;
        } else {
            walletPassword = await password({ message: 'Enter the spending password of the wallet' });
            let walletPasswordConfirm = await password({ message: 'Confirm the spending password of the wallet' });
            if (walletPassword !== walletPasswordConfirm) {
                output = { error: true, messages: ['Passwords do not match.'] }
                return output;
            }
        }
        let mnemonic = options.mnemonic ?? generateMnemonic(wordlist, MNEMONIC_STRENGTH_WORD_NUMBER[options.strength]);
        let passphrase = options.passphrase;
        let network = Network.Mainnet;
        if (options.testNet) {
            network = Network.Testnet;
        }
        const w3 = await initWallet(walletName, mnemonic, walletPassword, passphrase, network)
        if (w3) {
            output.messages.push("Wallet " + walletName + " created in " + getWalletFilePath(walletName));
        } else {
            output = { error: true, messages: ['Wallet not created.'] }
        }
    } else {
        output = { error: true, messages: ["Wallet creation aborted, use the --force option to override the existing wallet"] }
    }
    return output;
}