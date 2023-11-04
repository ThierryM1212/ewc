import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { getNodeClientForNetwork } from "../ewc/Config";
import { ErgoBox, Network } from "@fleet-sdk/core";
import { BalanceInfo } from "../ewc/BalanceInfo";
import { BlockHeader, BoxId } from "@fleet-sdk/common";
import { TokenInfo } from "@fleet-sdk/node-client";


export type NodeGetOptions = {
    testNet: boolean,
    boxById?: BoxId,
    boxByIndex?: number,
    height?: boolean,
    indexedHeight?: boolean,
    lastHeaders?: number,
    tokenInfo?: string,
    nodeInfo?: boolean,
    utxosByAddress?: string,
    utxosByErgotree?: string,
    utxosByTokenid?: string,
    boxesByAddress?: string,
    boxesByErgotree?: string,
    boxesByTokenid?: string,
    balance?: string,
    txById?: string,
    txByIndex?: number,
    txByAddress?: string,
    unconfirmedTx?: boolean,
    unconfirmedTxById?: string,
    unconfirmedTxByErgotree?: string,
}

export async function nodeGetCommand(options: NodeGetOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    let network = Network.Mainnet;
    if (options.testNet) {
        network = Network.Testnet;
    }

    const nodeClient = getNodeClientForNetwork(network);
    if (options.height) {
        const height: number = await nodeClient.getCurrentHeight();
        output.messages.push({ height: height });
    }
    if (options.indexedHeight) {
        const iheight: number = await nodeClient.getIndexedHeight();
        output.messages.push({ indexedHeight: iheight });
    }
    if (options.lastHeaders) {
        const headers: Array<BlockHeader> = await nodeClient.getLastHeaders(options.lastHeaders);
        output.messages.push(headers);
    }
    if (options.tokenInfo) {
        const tokenInfo: TokenInfo = await nodeClient.getTokenInfo(options.tokenInfo);
        output.messages.push(tokenInfo);
    }
    if (options.nodeInfo) {
        const info = await nodeClient.getNodeInfo();
        output.messages.push(info);
    }

    // UTXOS
    if (options.utxosByAddress) {
        const utxos: Array<ErgoBox> = await nodeClient.getUnspentBoxesByAddress(options.utxosByAddress);
        output.messages.push(utxos);
    }
    if (options.utxosByErgotree) {
        const utxos: Array<ErgoBox> = await nodeClient.getUnspentBoxesByErgotree(options.utxosByErgotree);
        output.messages.push(utxos);
    }
    if (options.utxosByTokenid) {
        const utxos: Array<ErgoBox> = await nodeClient.getUnspentBoxesByTokenId(options.utxosByTokenid);
        output.messages.push(utxos);
    }
    
    // BOXES
    if (options.boxByIndex) {
        const box: ErgoBox = await nodeClient.getBoxByIndex(options.boxByIndex);
        output.messages.push(box);
    }
    if (options.boxById) {
        const box: ErgoBox = await nodeClient.getBoxByBoxId(options.boxById);
        output.messages.push(box);
    }
    if (options.boxesByAddress) {
        const boxes: Array<ErgoBox> = await nodeClient.getBoxesByAddress(options.boxesByAddress);
        output.messages.push(boxes);
    }
    if (options.boxesByErgotree) {
        const boxes: Array<ErgoBox> = await nodeClient.getBoxesByErgotree(options.boxesByErgotree);
        output.messages.push(boxes);
    }
    if (options.boxesByTokenid) {
        const boxes: Array<ErgoBox> = await nodeClient.getBoxesByTokenId(options.boxesByTokenid);
        output.messages.push(boxes);
    }
    
    // BALANCE
    if (options.balance) {
        const balance = await nodeClient.getBalanceByAddress(options.balance);
        const balanceInfo = new BalanceInfo(balance.nanoERG, balance.tokens, balance.confirmed);
        output.messages.push(balanceInfo.getBalanceH());
    }

    // TRANSACTIONS
    if (options.txById) {
        const transaction = await nodeClient.getTransactionByTransactionId(options.txById);
        output.messages.push(transaction);
    }
    if (options.txByIndex) {
        const transaction = await nodeClient.getTransactionByIndex(options.txByIndex);
        output.messages.push(transaction);
    }
    if (options.txByAddress) {
        const transactions = await nodeClient.getTransactionsByAddress(options.txByAddress);
        output.messages.push(transactions);
    }
    if (options.unconfirmedTx) {
        const transactions = await nodeClient.getUnconfirmedTransactions();
        output.messages.push(transactions);
    }
    if (options.unconfirmedTxById) {
        const transactions = await nodeClient.getUnconfirmedTransactionsByTransactionId(options.unconfirmedTxById);
        output.messages.push(transactions);
    }
    if (options.unconfirmedTxByErgotree) {
        const transactions = await nodeClient.getUnconfirmedTransactionsByErgoTree(options.unconfirmedTxByErgotree);
        output.messages.push(transactions);
    }

    
    return output;
}