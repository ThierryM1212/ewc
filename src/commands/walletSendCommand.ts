import { Wallet } from "../ewc/Wallet";
import JSONBigInt from 'json-bigint';
import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { loadWallet } from "../ewc/Wallet";
import { confirm, editor, input, password } from "@inquirer/prompts";
import { BalanceH, BalanceInfo, getBalanceInfo } from "../ewc/BalanceInfo";
import { existsSync, readFileSync } from "fs";
import { EIP12UnsignedTransaction, SignedTransaction } from "@fleet-sdk/common";
import { getNodeClientForNetwork } from "../ewc/Config";


export type WalletSendOptions = {
    ergAmount?: string,
    tokenId?: string,
    tokenAmount?: string,
    signedTx?: string,
    unsignedTx?: string,
    balanceFile: string | undefined,
    sendAddress: string,
    sign: boolean,
    send: boolean,
    check: boolean,
    skipConfirm: boolean,
}


export async function walletSendCommand(walletName: string, walletPassword: string | undefined, options: WalletSendOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    const wal: Wallet | undefined = loadWallet(walletName);
    if (wal) {
        let unsignedTx: EIP12UnsignedTransaction = { inputs: [], outputs: [], dataInputs: [] };
        let signedTx: SignedTransaction = { id: "", inputs: [], outputs: [], dataInputs: [] };

        // prompt password if required
        if (!walletPassword && (options.sign || options.send || options.check || options.unsignedTx)) {
            walletPassword = await password({ message: 'Enter the spending password of the wallet ' + walletName });
        }

        if (options.unsignedTx) {
            unsignedTx = JSONBigInt.parse(readFileSync(options.unsignedTx, 'ascii'));
            options.sign = true;
        } else if (options.signedTx) {
            signedTx = JSONBigInt.parse(readFileSync(options.signedTx, 'ascii'));
        } else {
            // build the transaction balance
            let txBalanceH: BalanceH = { amountERG: "0", tokens: [{ tokenId: "", amount: "" },] };
            if (options.balanceFile) {
                txBalanceH = await loadBalanceFile(options.balanceFile);
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
            //console.log("txBalance", txBalance)

            // Send to address
            let addressSendTo = "";
            if (options.sendAddress && options.sendAddress !== "") {
                addressSendTo = options.sendAddress;
            } else {
                addressSendTo = await input({ message: 'Enter the ERG address to send the transaction' })
            }
            //console.log("addressSendTo", addressSendTo)

            // create the tx
            const txBalance: BalanceInfo | undefined = await getBalanceInfo(txBalanceH, wal.network);
            if (txBalance) {
                try {
                    unsignedTx = await wal.createSendTx(txBalance, addressSendTo);
                    if (!options.sign) {
                        output.messages.push(unsignedTx);
                    }
                } catch (e) {
                    return { error: true, messages: ["Failed to build the transaction: " + JSON.stringify(e)] }
                }
            } else {
                return { error: true, messages: ["Cannot build the balance of the transaction"] }
            }
        }

        // sign tx
        if ((options.sign) && walletPassword) {
            try {
                signedTx = await wal.signTransaction(unsignedTx, walletPassword);
                if (!options.send && !options.check) {
                    output.messages.push(signedTx);
                }
            } catch (e) {
                return { error: true, messages: ["Failed to sign the transaction: " + e] }
            }
        }

        // send tx
        if (options.send) {
            let sendTx = true;
            if (!options.skipConfirm) {
                console.log(JSONBigInt.stringify(signedTx, null, 2));
                sendTx = await confirm({ message: "Send the transaction ?" })
            }
            if (sendTx) {
                const nodeClient = getNodeClientForNetwork(wal.network);
                const txRes = await nodeClient.submitTransaction(signedTx);
                if (!txRes.success) {
                    return { error: true, messages: ["Failed to send the transaction: " + JSON.stringify(txRes)] }
                }
                output.messages.push({ transactionId: txRes.transactionId });
            } else {
                return { error: true, messages: ["Send transaction cancelled."] }
            }
        }

        // check tx
        if (options.check) {
            const nodeClient = getNodeClientForNetwork(wal.network);
            const txRes = await nodeClient.checkTransaction(signedTx);
            if (!txRes.success) {
                return { error: true, messages: ["Failed to send the transaction: " + JSON.stringify(txRes)] }
            }
            output.messages.push({ transactionId: txRes.transactionId });
        }
    } else {
        output = { error: true, messages: ["Failed to load the wallet " + walletName] }
    }

    return output;
}

async function loadBalanceFile(balanceFile: string): Promise<BalanceH> {
    let txBalanceH: BalanceH = { amountERG: "0", tokens: [{ tokenId: "", amount: "" },] };
    if (existsSync(balanceFile)) {
        let fileBal = readFileSync(balanceFile, 'ascii');
        txBalanceH = JSONBigInt.parse(fileBal.toString())
    } else {
        const answer = await editor({
            message: 'Edit the transaction balance',
            default: JSONBigInt.stringify(txBalanceH, null, 2)
        });
        txBalanceH = JSONBigInt.parse(answer)
    }
    return txBalanceH;
}