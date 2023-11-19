import { Wallet } from "../ewc/Wallet";
import JSONBigInt from 'json-bigint';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { loadWallet } from "../ewc/Wallet";
import { password, select } from "@inquirer/prompts";
import { getNodeClientForNetwork } from "../ewc/Config";
import { BalanceInfo } from "../ewc/BalanceInfo";
import { ErgoBox } from "@fleet-sdk/core";
import { ChainProviderBox } from "@fleet-sdk/blockchain-providers";


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
        //console.log("options", options)
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
            const nodeClient = getNodeClientForNetwork(wal.network);
            let addrList: Array<string> = [];
            if (typeof options.balance === 'string') {
                if (options.balance === "all" || options.balance === "details") {
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
                    name: "details",
                    value: "details",
                    description: 'balance per address',
                })
                choices.unshift({
                    name: "all",
                    value: "all",
                    description: 'balance for all addresses ',
                })
                const answer = await select({
                    message: message,
                    choices: choices,
                });
                if (answer !== "all" && answer !== "details") {
                    addrList = [answer];
                } else {
                    options.balance = answer;
                }
            }
            //console.log("addrList", addrList)
            let balList: Array<BalanceInfo> = await Promise.all(addrList.map(async addr => {
                let balance = await nodeClient.getBalanceByAddress(addr)
                let balanceInfo = new BalanceInfo(balance.nanoERG, balance.tokens, balance.confirmed);
                return balanceInfo;
            }));
            
            if (options.balance === "details") {
                let confirmedBalList: Array<BalanceInfo> = balList.map(b => b);
                let res: any = {};
                for (let i = 0; i < confirmedBalList.length; i++) {
                    if (confirmedBalList[i].nanoERG > BigInt(0)) {
                        res[addrList[i]] = confirmedBalList[i].getBalanceH();
                    }
                }
                output.messages.push(res);
            } else {
                let confirmedBalance: BalanceInfo = new BalanceInfo(BigInt(0), [])
                for (let i = 0; i < balList.length; i++) {
                    confirmedBalance.add(balList[i])
                }
                //console.log("confirmedBalance", confirmedBalance)
                output.messages.push(confirmedBalance.getBalanceH());
            }
            
        }

        if (options.unspentBoxes) {
            let boxesList: Array<ChainProviderBox> = await wal.getUnspentBoxes();
            output.messages.push(boxesList);
        }
    } else {
        output.error = true;
        output.messages = ["Failed to load the wallet " + walletName];
    }

    return output;
}