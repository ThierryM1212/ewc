import { CommandOutput, getDefaultOutput } from "./EWCCommand";
import JSONBigInt from 'json-bigint';
const { TypeObj, ValueObj } = require("sigmastate-js/main");
var util = require('util');
let utf8decoder = new TextDecoder();
import { ECIES_CONFIG, PrivateKey, PublicKey, decrypt, encrypt } from "eciesjs";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { getSecretForAddress } from "../ergo/wasm";
import { SecretKey } from "ergo-lib-wasm-nodejs";
import { Wallet, loadWallet } from "../ewc/Wallet";
import { password } from "@inquirer/prompts";
import { HexString } from "@fleet-sdk/common";
let ergolib = import('ergo-lib-wasm-nodejs');

export type encryptOptions = {
    utf8Text: boolean,
}

export type encryptedOutput = {
    clearTextValue: string,
    hexEncryptedValue: string,
    address: string,
    isUTF8string: boolean,
    registerValue: string,
}

export type decryptedOutput = {
    decryptedHex: HexString,
    decryptedUtf8: string,
    address: string,
    isUTF8string: boolean,
    registerValue: string,
}

// Get ECIES public key from an ergo address
function getErgoAddressPubKey(address: ErgoAddress): PublicKey {
    const ergoAddressPubKey: Uint8Array = address.getPublicKeys()[0];
    const pk = new PublicKey(ergoAddressPubKey)

    return pk;
}

// Encrypt arbitrary data using ECIES public key, output a hex string
function encrypt_data(pk: PublicKey, data: Buffer): HexString {
    const encrypted: Buffer = encrypt(pk.toBytes(), data)
    return encrypted.toString('hex');
}

export async function encryptData(data: string, address: string, options: encryptOptions): Promise<CommandOutput> {
    const Eaddr: ErgoAddress = ErgoAddress.fromBase58(address);

    const pk = getErgoAddressPubKey(Eaddr);

    var dataBuffer: Buffer;
    if (options.utf8Text) {
        dataBuffer = Buffer.from(data, 'utf8');
    } else {
        dataBuffer = Buffer.from(data, 'hex');
        if (dataBuffer.length == 0) {
            return { error: true, messages: ["Invalid hexadecimal string: " + data] };
        }
    }

    // Encrypt data using the public key
    const encrypted: HexString = encrypt_data(pk, dataBuffer)

    const output: encryptedOutput = {
        clearTextValue: data,
        hexEncryptedValue: encrypted,
        address: address,
        isUTF8string: options.utf8Text,
        registerValue: "",
    }

    let p = ValueObj.fromHex(encrypted);
    output.registerValue = (await ergolib).Constant.from_byte_array(Buffer.from(output.hexEncryptedValue, 'hex')).encode_to_base16()

    return { error: false, messages: [output] };

}

export async function decryptData(data: string, walletName: string, address: string, walletPassword: string = '', options: encryptOptions): Promise<CommandOutput> {
    const wal: Wallet | undefined = loadWallet(walletName);
    if (wal) {
        // prompt password if required
        if (!walletPassword) {
            walletPassword = await password({ message: 'Enter the spending password of the wallet ' + walletName });
        }

        const ErgoSecretKey: SecretKey = await getSecretForAddress(Network.Mainnet, wal.getDecryptedMnemonic(walletPassword).mnemonic, "", address);
        // Get ECIES secret key from ergo private key bytes
        const sk = new PrivateKey(ErgoSecretKey.to_bytes());

        // Decrypt the data
        const decrypted = decrypt(sk.secret, Buffer.from(data, 'hex'));
        //console.log("decrypted", decrypted.toString())
        //console.log("ECIES_CONFIG", ECIES_CONFIG)
        var output = {
            decryptedHex: decrypted.toString('hex'),
            decryptedUtf8: "",
            address: address,
            isUTF8string: options.utf8Text,
            registerValue: "",
        }
        if (options.utf8Text) {
            output.decryptedUtf8 = decrypted.toString('utf8');
        }

        output.registerValue = (await ergolib).Constant.from_byte_array(Buffer.from(output.decryptedHex, 'hex')).encode_to_base16()

        return { error: false, messages: [output] };

    } else {
        return { error: true, messages: ["Failed to load the wallet " + walletName] }
    }

}