import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import JSONBigInt from 'json-bigint';
import { getNodeClient } from "../ewc/Config";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { compile } from "@fleet-sdk/compiler";
import { readFileSync } from "fs";



export type compileOptions = {
    compilerVersion: "0" | "1" | 0 | 1,
    segregateConstants: boolean,
    nodeCompile: boolean,
    testNet: boolean,
}

export async function compileCommand(path: string, options: compileOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();
    let network = Network.Mainnet;
    if (options.testNet) {
        network = Network.Testnet;
    }
    const ergoscript = readFileSync(path, 'ascii')
    let compiledOutput = {
        address: "",
        ergotree: "",
        version: 0,
        segregatedConstants: true,
    }
    if (options.nodeCompile) {
        const nodeClient = getNodeClient(network);
        const scriptAddress = await nodeClient.compileErgoscript(ergoscript);
        if (scriptAddress.address) {
            const ergoAddress = ErgoAddress.fromBase58(scriptAddress.address);
            compiledOutput.address = scriptAddress.address;
            compiledOutput.ergotree = ergoAddress.ergoTree;
        } else {
            return { error: true, messages: [scriptAddress] }
        }
    } else {
        try {
            const tree0 = compile(ergoscript, { version: compilerVersionToNum(options.compilerVersion), segregateConstants: options.segregateConstants, map: {} });
            compiledOutput.address = tree0.toAddress().encode(network);
            compiledOutput.ergotree = tree0.toHex();
            compiledOutput.version = compilerVersionToNum(options.compilerVersion);
            compiledOutput.segregatedConstants = options.segregateConstants;
        } catch (e) {
            return { error: true, messages: [e] }
        }
    }
    output.messages = [compiledOutput]
    return output;
}

function compilerVersionToNum(version: "0" | "1" | 0 | 1): 0 | 1 {
    if (version === "0") {
        return 0;
    }
    if (version === "1") {
        return 1;
    }
    return version;
}