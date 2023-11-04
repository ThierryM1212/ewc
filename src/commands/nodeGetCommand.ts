import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { getNodeClientForNetwork } from "../ewc/Config";
import { ErgoBox, Network } from "@fleet-sdk/core";
import { BalanceInfo } from "../ewc/BalanceInfo";
import { BoxId } from "@fleet-sdk/common";


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
    balance?: string,
}

export async function nodeGetCommand(options: NodeGetOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    let network = Network.Mainnet;
    if (options.testNet) {
        network = Network.Testnet;
    }

    const nodeClient = getNodeClientForNetwork(network);
    if (options.boxByIndex) {
        const box: ErgoBox = await nodeClient.getBoxByIndex(options.boxByIndex);
        output.messages.push(box);
    }
    if (options.boxById) {
        const box: ErgoBox = await nodeClient.getBoxByBoxId(options.boxById);
        output.messages.push(box);
    }
    if (options.height) {
        const height = await nodeClient.getCurrentHeight();
        output.messages.push({ height: height });
    }
    if (options.indexedHeight) {
        const iheight = await nodeClient.getIndexedHeight();
        output.messages.push({ indexedHeight: iheight });
    }
    if (options.lastHeaders) {
        const headers = await nodeClient.getLastHeaders(options.lastHeaders);
        output.messages.push(headers);
    }
    if (options.tokenInfo) {
        const tokenInfo = await nodeClient.getTokenInfo(options.tokenInfo);
        output.messages.push(tokenInfo);
    }
    if (options.nodeInfo) {
        const info = await nodeClient.getNodeInfo();
        output.messages.push(info);
    }
    if (options.utxosByAddress) {
        const utxos = await nodeClient.getUnspentBoxesByAddress(options.utxosByAddress);
        output.messages.push(utxos);
    }
    if (options.balance) {
        const balance = await nodeClient.getBalanceByAddress(options.balance);
        const balanceInfo = new BalanceInfo(balance.nanoERG, balance.tokens, balance.confirmed);
        output.messages.push(balanceInfo.getBalanceH());
    }

    return output;
}