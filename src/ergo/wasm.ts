import { getNodeClientForNetwork } from '../ewc/Config';
import { Network, SignedTransaction } from '@fleet-sdk/common';
import JSONBigInt from 'json-bigint';
import { Wallet, ExtSecretKey, SecretKey, DerivationPath, ErgoStateContext } from 'ergo-lib-wasm-nodejs';

let ergolib = import('ergo-lib-wasm-nodejs');


export async function getErgoStateContext(network: Network): Promise<ErgoStateContext> {
    const nodeClient = getNodeClientForNetwork(network);
    const blockHeaders = await nodeClient.getLastHeaders(10);
    //console.log("blockHeaders",blockHeaders)
    const block_headers = (await ergolib).BlockHeaders.from_json(blockHeaders);
    const pre_header = (await ergolib).PreHeader.from_block_header(block_headers.get(0));
    return new (await ergolib).ErgoStateContext(pre_header, block_headers);
}

export async function signTransaction(network: Network, unsignedTx: any, inputs: any, dataInputs: any, wallet: Wallet): Promise<SignedTransaction> {
    //console.log("signTransaction1", unsignedTx, inputs, dataInputs);
    const unsignedTransaction = (await ergolib).UnsignedTransaction.from_json(JSONBigInt.stringify(unsignedTx));
    const inputBoxes = (await ergolib).ErgoBoxes.from_boxes_json(inputs);
    const dataInputsBoxes = (await ergolib).ErgoBoxes.from_boxes_json(dataInputs);
    const ctx = await getErgoStateContext(network);
    //console.log("signTransaction2", unsignedTx, inputs, dataInputs, ctx);
    const signedTx: SignedTransaction = JSONBigInt.parse(wallet.sign_transaction(ctx, unsignedTransaction, inputBoxes, dataInputsBoxes).to_json());
    return signedTx;
}

export async function getWalletForAddresses(network: Network, mnemonic: string, passphrase: string, addressList: Array<string>): Promise<Wallet> {
    var secretKeys = new (await ergolib).SecretKeys();
    for (const addr of addressList) {
        //console.log("getWalletForAddresses", addr)
        const secret = await getSecretForAddress(network, mnemonic, passphrase, addr);
        secretKeys.add(secret);
    }
    return (await ergolib).Wallet.from_secrets(secretKeys);
}

async function getSecretForAddress(network: Network, mnemonic: string, passphrase: string, address: string): Promise<SecretKey> {
    //console.log("getSecretForAddress", address);
    const seed = (await ergolib).Mnemonic.to_seed(mnemonic, passphrase);
    const rootSecret: ExtSecretKey = (await ergolib).ExtSecretKey.derive_master(seed);
    const changePath = await getDerivationPathForAddress(network, rootSecret, address);
    //console.log("changePath", address, changePath.toString());
    const changeSecretKey = rootSecret.derive(changePath);
    //const changePubKey = changeSecretKey.public_key();
    //const changeAddress = (await ergolib).NetworkAddress.new((await ergolib).NetworkPrefix.Mainnet, changePubKey.to_address());
    //console.log(`address: ${changeAddress.to_base58()}`);

    const dlogSecret = (await ergolib).SecretKey.dlog_from_bytes(changeSecretKey.secret_key_bytes());
    return dlogSecret;
}

async function getDerivationPathForAddress(network: Network, rootSecret: ExtSecretKey, address: string): Promise<DerivationPath> {
    //console.log("getDerivationPathForAddress", address);
    let path = (await ergolib).DerivationPath.new(0, new Uint32Array([0]));
    var subsequentsMaxes = [10, 100];

    for (const max of subsequentsMaxes) {
        var i = 0, j = 0, found = false;
        while (i < max && !found) {
            j = 0;
            while (j < max && !found) {
                let path = (await ergolib).DerivationPath.new(i, new Uint32Array([j]));
                //console.log("getDerivationPathForAddress", i, j, path.toString());
                const changeSecretKey = rootSecret.derive(path);
                const changePubKey = changeSecretKey.public_key();
                const changeAddress = (await ergolib).NetworkAddress.new(network, changePubKey.to_address()).to_base58();
                if (changeAddress === address) {
                    found = true;
                    return (await ergolib).DerivationPath.new(i, new Uint32Array([j]));
                }
                j++;
            }
            i++;
        }
    }
    return path;
}