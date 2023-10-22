import { Wallet } from "../ewc/Wallet";
import JSONBigInt from 'json-bigint';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { loadWallet } from "../ewc/Wallet";
import { password, select } from "@inquirer/prompts";
import { getNodeClient } from "../ewc/Config";
import { BalanceInfo } from "../ewc/BalanceInfo";
import { ErgoBox } from "@fleet-sdk/core";


export type WalletGetOptions = {
    listAddress: boolean,
    updateUsedAddresses: boolean,
    mnemonic: boolean,
    balance: string | undefined | boolean,
    unspentBoxes: boolean,
}

export async function walletGetCommand(walletName: string, walletPassword: string | undefined, options: WalletGetOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    const wal: Wallet | undefined = loadWallet(walletName);
    if (wal) {

        // prompt password if required
        if (!walletPassword && (options.updateUsedAddresses || options.mnemonic)) {
            walletPassword = await password({ message: 'Enter the spending password of the wallet' });
        }

        if (options.updateUsedAddresses && walletPassword) {
            await wal.updateUsedAdrresses(walletPassword);
        }

        if (options.mnemonic && walletPassword) {
            const res = wal.getDecryptedMnemonic(walletPassword);
            output.messages.push(res);
        }

        if (options.listAddress) {
            let addrList: Array<string> = wal.getAddressList();
            output.messages.push(addrList);
        }

        if (options.balance) {
            const nodeClient = getNodeClient(wal.network);
            let addrList: Array<string> = [];
            if (typeof options.balance === 'string') {
                if (options.balance === "all") {
                    addrList = wal.getAddressList();
                } else {
                    addrList = [options.balance];
                }
            } else {
                addrList = wal.getAddressList();
                let message = "Select the address for the balance";
                let choices = addrList.map(a => {
                    return {
                        name: a,
                        value: a,
                        description: 'balance for address ' + a,
                    }
                });
                choices.unshift({
                    name: "all",
                    value: "all",
                    description: 'balance for all addresses ',
                })
                const answer = await select({
                    message: message,
                    choices: choices,
                });
                if (answer !== "all") {
                    addrList = [answer];
                }
            }
            //console.log("addrList", addrList)
            let balList: Array<[BalanceInfo, BalanceInfo]> = await Promise.all(addrList.map(async addr => await nodeClient.getBalanceForAddress(addr)));
            let confirmedBalance: BalanceInfo = new BalanceInfo(BigInt(0), [])
            for (let i = 0; i < balList.length; i++) {
                confirmedBalance.add(balList[i][0])
            }
            //console.log("confirmedBalance", confirmedBalance)
            output.messages.push(confirmedBalance);
        }

        if (options.unspentBoxes) {
            let boxesList: Array<ErgoBox> = await wal.getUnspentBoxes();
            output.messages.push(boxesList);
        }
    } else {
        output.error = true;
        output.messages = ["Failed to load the wallet " + walletName];
    }

    return output;
}