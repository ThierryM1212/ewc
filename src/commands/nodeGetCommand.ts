import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { input } from "@inquirer/prompts";
import { getNodeClient } from "../ewc/Config";
import { Network } from "@fleet-sdk/core";
import { BalanceInfo } from "../ewc/BalanceInfo";


export const NODE_GET_TYPES = ["box", "iheight", "height", "lastheaders", "tokeninfo", "nodeinfo", "utxos", "balance"];

export type NodeGetOptions = {
    testNet: boolean,
}

export async function nodeGetCommand(type: string, id: string, options: NodeGetOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    let network = Network.Mainnet;
    if (options.testNet) {
        network = Network.Testnet;
    }
    if (!NODE_GET_TYPES.includes(type)) {
        output = { error: true, messages: ["Type '" + type + "' is not supported for node-get. Supported types: " + NODE_GET_TYPES.join(', ')] }
        return output;
    }
    const NodeClient = getNodeClient(network);
    if (type === "box") {
        let boxId = id;
        if (boxId === '') {
            boxId = await input({ message: 'Enter the box ID' });
        }
        const box = await NodeClient.getBoxByBoxId(boxId);
        output.messages.push(box);
    }
    if (type === "height") {
        const height = await NodeClient.getCurrentHeight();
        output.messages.push({ height: height });
    }
    if (type === "iheight") {
        const height = await NodeClient.getIndexedHeight();
        output.messages.push({ indexedHeight: height });
    }
    if (type === "lastheaders") {
        let limit = 10;
        if (!isNaN(parseInt(id))) {
            limit = parseInt(id);
        }
        const headers = await NodeClient.getLastHeaders(limit);
        output.messages.push(headers);
    }
    if (type === "tokeninfo") {
        let tokenId = id;
        if (tokenId === '') {
            tokenId = await input({ message: 'Enter the token ID' });
        }
        const tokenInfo = await NodeClient.getTokenInfo(tokenId);
        output.messages.push(tokenInfo);
    }
    if (type === "nodeinfo") {
        const info = await NodeClient.getNodeInfo();
        output.messages.push(info);
    }
    if (type === "utxos" || type === "balance") {
        let address = id;
        if (address === '') {
            address = await input({ message: 'Enter the address' });
        }
        if (type === "utxos") {
            const utxos = await NodeClient.getUnspentBoxesByAddress(address);
            output.messages.push(utxos);
        }
        if (type === "balance") {
            const balance = await NodeClient.getBalanceByAddress(address);
            const balanceInfo = new BalanceInfo(balance.nanoERG, balance.tokens, balance.confirmed);
            output.messages.push(balanceInfo.getBalanceH());
        }
    }
    
    return output;
}