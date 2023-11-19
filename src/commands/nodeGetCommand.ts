import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { getNodeClientForNetwork } from "../ewc/Config";
import { ErgoBox, Network } from "@fleet-sdk/core";
import { BalanceInfo } from "../ewc/BalanceInfo";
import { BlockHeader, BoxId, SortingDirection } from "@fleet-sdk/common";
import { TokenInfo, ChainProviderBox, BoxSource } from "@fleet-sdk/blockchain-providers";


export type NodeGetOptions = {
    testNet: boolean,
    limit: number,
    offset: number,
    sort: string,
    includeUnconfirmed: boolean,
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
    let sorting: SortingDirection = 'desc';
    if (options.sort === 'asc') {
        sorting = 'asc';
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
        const headers: BlockHeader[] = await nodeClient.getHeaders({ take: options.lastHeaders });
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
    let boxFrom: BoxSource = "blockchain"
    if (options.includeUnconfirmed) {
        boxFrom = "blockchain+mempool"
    }
    if (options.utxosByAddress) {
        const utxos: Array<ChainProviderBox> = await nodeClient.getBoxes({
            where: { address: options.utxosByAddress },
            from: boxFrom,
            limit: options.limit,
            sort: sorting,
            offset: options.offset,
        });
        output.messages.push(utxos);
    }
    if (options.utxosByErgotree) {
        const utxos: Array<ChainProviderBox> = await nodeClient.getBoxes({
            where: { ergoTree: options.utxosByErgotree },
            from: boxFrom,
            limit: options.limit,
            sort: sorting,
            offset: options.offset,
        });
        output.messages.push(utxos);
    }
    if (options.utxosByTokenid) {
        const utxos: Array<ChainProviderBox> = await nodeClient.getBoxes({
            where: { tokenId: options.utxosByTokenid },
            from: boxFrom,
            limit: options.limit,
            sort: sorting,
            offset: options.offset,
        });
        output.messages.push(utxos);
    }

    // BOXES
    if (options.boxByIndex) {
        const box: ChainProviderBox = await nodeClient.getBoxByIndex(options.boxByIndex);
        output.messages.push(box);
    }
    if (options.boxById) {
        const box: ChainProviderBox = await nodeClient.getBoxByBoxId(options.boxById);
        output.messages.push(box);
    }
    if (options.boxesByAddress) {
        const boxes: Array<ChainProviderBox> = await nodeClient.getBoxesByAddress(
            options.boxesByAddress,
            options.limit,
            options.offset);
        output.messages.push(boxes);
    }
    if (options.boxesByErgotree) {
        const boxes: Array<ChainProviderBox> = await nodeClient.getBoxesByErgotree(
            options.boxesByErgotree,
            options.limit,
            options.offset);
        output.messages.push(boxes);
    }
    if (options.boxesByTokenid) {
        const boxes: Array<ChainProviderBox> = await nodeClient.getBoxesByTokenId(
            options.boxesByTokenid,
            options.limit,
            options.offset);
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
        const transactions = await nodeClient.getTransactionsByAddress(
            options.txByAddress,
            options.limit,
            options.offset);
        output.messages.push(transactions);
    }
    if (options.unconfirmedTx) {
        const transactions = await nodeClient.getUnconfirmedTransactions(
            options.limit,
            options.offset
        );
        output.messages.push(transactions);
    }
    if (options.unconfirmedTxById) {
        const transaction = await nodeClient.getUnconfirmedTransactionsByTransactionId(options.unconfirmedTxById);
        output.messages.push(transaction);
    }
    if (options.unconfirmedTxByErgotree) {
        const transactions = await nodeClient.getUnconfirmedTransactionsByErgoTree(
            options.unconfirmedTxByErgotree,
            options.limit,
            options.offset);
        output.messages.push(transactions);
    }


    return output;
}