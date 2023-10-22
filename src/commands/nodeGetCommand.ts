import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import { input } from "@inquirer/prompts";
import { getNodeClient } from "../ewc/Config";
import { Network } from "@fleet-sdk/core";


export const NODE_GET_TYPES = ["box", "height", "lastheaders", "tokeninfo", "nodeinfo", "utxos"];

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
        const box = await NodeClient.boxByBoxId(boxId);
        output.messages.push(box);
    }
    if (type === "height") {
        const height = await NodeClient.currentHeight();
        output.messages.push({ height: height });
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
    if (type === "utxos") {
        let address = id;
        if (address === '') {
            address = await input({ message: 'Enter the address' });
        }
        const utxos = await NodeClient.unspentBoxesFor(address);
        output.messages.push(utxos);
    }

    return output;
}