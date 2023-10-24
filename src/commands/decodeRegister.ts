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
    hexValue?: string | Array<string>,
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
            let hexValue = buf2hex((new Uint8Array(p.data)).buffer);
            if (hexValue) {
                registerOutput.hexValue = hexValue;
            }
        }
        if (registerOutput.type === 'Coll[Coll[Byte]]') {
            let hexValues = [];
            for (let a of p.data) {
                let hexValue = buf2hex((new Uint8Array(a)).buffer);
                if (hexValue) {
                    hexValues.push(hexValue)
                }
            }
            registerOutput.hexValue = hexValues;
        }
        output.messages = [registerOutput]
    } catch (e) {
        output = { error: true, messages: [JSON.stringify(e)] }
    }

    return output;
}

function buf2hex(buffer: ArrayBuffer): string { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}