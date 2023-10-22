import { Wallet } from "../ewc/Wallet";
import JSONBigInt from 'json-bigint';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { loadWallet } from "../ewc/Wallet";
import { editor, input, password } from "@inquirer/prompts";
import { BalanceH, getBalanceInfo } from "../ewc/BalanceInfo";
import { existsSync, readFileSync } from "fs";


export type WalletSendOptions = {
    ergAmount?: string,
    tokenId?: string,
    tokenAmount?: string,
    balanceFile: string | undefined,
    sendAddress: string,
    sign: boolean,
    send: boolean,
}


export async function walletSendCommand(walletName: string, walletPassword: string | undefined, options: WalletSendOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    const wal: Wallet | undefined = loadWallet(walletName);
    if (wal) {
        // prompt password if required
        if (!walletPassword && (options.sign || options.send)) {
            walletPassword = await password({ message: 'Enter the spending password of the wallet ' + walletName });
        }
        let txBalanceH: BalanceH = { amountERG: "0", tokens: [{ tokenId: "", amount: "" },] };
        // build the transaction balance
        if (options.balanceFile) {
            if (existsSync(options.balanceFile)) {
                let fileBal = readFileSync(options.balanceFile, 'ascii');
                txBalanceH = JSONBigInt.parse(fileBal.toString())
            } else {
                const answer = await editor({
                    message: 'Edit the transaction balance',
                    default: JSONBigInt.stringify(txBalanceH, null, 2)
                });
                txBalanceH = JSONBigInt.parse(answer)
            }
        } else { // no balance option, use the erg-amount and the token amount
            if (options.ergAmount && parseFloat(options.ergAmount)) {
                txBalanceH.amountERG = options.ergAmount;
            }
            if (options.tokenId && options.tokenAmount && BigInt(options.tokenAmount) > 0) {
                txBalanceH.tokens = [{ tokenId: options.tokenId, amount: options.tokenAmount }];
            } else {
                txBalanceH.tokens = [];
            }
        }

        const txBalance = await getBalanceInfo(txBalanceH, wal.network);
        console.log("txBalance", txBalance)
        // Send to address
        let addressSendTo = "";
        if (options.sendAddress && options.sendAddress !== "") {
            addressSendTo = options.sendAddress;
        } else {
            addressSendTo = await input({ message: 'Enter the ERG address to send the transaction' })
        }
        console.log("addressSendTo", addressSendTo)
        // create the tx
        if (txBalance) {
            const unsinedTx = await wal.createSendTx(txBalance, addressSendTo);
            output.messages.push(unsinedTx);
        } else {
            output = { error: true, messages: ["Cannot build the balance of the transaction"] }
        }
    } else {
        output = { error: true, messages: ["Failed to load the wallet " + walletName] }
    }
    
    return output;
}