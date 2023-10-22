import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import JSONBigInt from 'json-bigint';
const { TypeObj, ValueObj } = require("sigmastate-js/main");
var util = require('util'); 
let utf8decoder = new TextDecoder();

export type decodeRegisterOutput = {
    registerValue: string,
    type: string,
    value: string,
    utf8Value?: string,
}

export type decodeRegisterOptions = {
    text: boolean,
}

export async function decodeRegister(value: string, options: decodeRegisterOptions): Promise<CommandOutput> {
    let output: CommandOutput = getDefaultOutput();

    try {
        
        let p = ValueObj.fromHex(value);
        let registerOutput: decodeRegisterOutput = {
            registerValue: value,
            type: p.tpe.name,
            value: p.data
        };
        if (registerOutput.type === 'Coll[Byte]') {
            let utf8out = utf8decoder.decode(new Uint8Array(p.data));
            if (utf8out !== '') {
                registerOutput.utf8Value = utf8out;
            } 
        }
        output.messages = [registerOutput]
    } catch (e) {
        output = { error: true, messages: [JSON.stringify(e)] }
    }

    return output;
}

