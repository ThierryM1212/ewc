import { decrypt } from '../utils/crypto';
import { Wallet, initWallet, loadWallet } from './Wallet';
import { WalletAccount } from './WalletAccount';
import { WalletAddress } from "./WalletAddress";
import { ErgoBox } from '@fleet-sdk/core';
import { Network, EIP12UnsignedTransaction, SignedTransaction } from '@fleet-sdk/common';
import { rmSync } from 'fs';
import JSONBigInt from 'json-bigint';
import { BalanceInfo } from './BalanceInfo';

let ergolib = import('ergo-lib-wasm-nodejs');

describe('Test Wallet.ts', () => {
    let add0 = new WalletAddress("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa", 0, false);
    let add1 = new WalletAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", 1, false);
    let acc = new WalletAccount(0, [add0, add1]);
    let w = new Wallet('testWallet', [acc], "pk9rArM7nYkj72c5t/hjzOul8GozXeO/cnCvM3DQlvrnMimfia/qcjbDh4EVaaQ2PXJgAUoL5MRsS4IT1R3o3j7CTpP2jJM96PWHMVJK1T9Q9iGM11/hsE8pK1HcJQ==")
    test('Wallet - 0', () => {
        expect(w.name).toBe('testWallet');
        expect(w.accountList[0]).toEqual(acc);
        expect(decrypt(w.encryptedMnemonic, 'a')).toEqual("kiss water essence horse scan useless floor panel vast apart fall chimney_test");
    })
    test('Wallet - 1', async () => {
        let w1 = await initWallet('testWallet1', "kiss water essence horse scan useless floor panel vast apart fall chimney", "a", "test", Network.Mainnet);
        if (w1) {
            expect(w1.name).toBe('testWallet1');
            w1.name = 'testWallet1updated';
            expect(w1.name).toBe('testWallet1updated');
            w1.accountList = [acc];
            expect(w1.accountList).toEqual([acc]);
            expect(decrypt(w1.encryptedMnemonic, 'a')).toBe("kiss water essence horse scan useless floor panel vast apart fall chimney_test");
            w1.encryptedMnemonic = "test";
            expect(w1.encryptedMnemonic).toBe('test');
            w1.network = Network.Testnet;
            expect(w1.network).toEqual(Network.Testnet);
            w1.changeAddress = 'test';
            expect(w1.changeAddress).toBe('test');
            var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            var random = ("" + Math.random()).substring(2, 8);
            var random_number = timestamp + random;
            var dir_name = "wallets_" + random_number;
            w1.save(dir_name);
            rmSync(dir_name, { recursive: true, force: true });
        }
    })
    test('Wallet - 2', async () => {
        let w3 = await initWallet('testWallet1', "kiss water essence horse scan useless floor panel vast apart fall chimney", "a", "test", Network.Mainnet);
        let w2 = loadWallet('testWallet1');
        if (w2 && w3) {
            expect(w2.name).toBe('testWallet1');
            expect(w2.accountList).toEqual(w3.accountList);
            expect(decrypt(w2.encryptedMnemonic, 'a')).toBe(decrypt(w3.encryptedMnemonic, 'a'));
            expect(w2.changeAddress).toBe('9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa');
            const seed = (await ergolib).Mnemonic.to_seed("kiss water essence horse scan useless floor panel vast apart fall chimney", "test");
            const rootSecret = (await ergolib).ExtSecretKey.derive_master(seed);
            const key = rootSecret.derive((await ergolib).DerivationPath.from_string("m/44'/429'/0'/0"))
            const changeAddressWASM = key.child("0")
            expect(changeAddressWASM.public_key().to_address().to_base58(Network.Mainnet)).toBe(w2.changeAddress);
        } else {
            expect(w3).toBeUndefined();
        }
    })
    test('Wallet - 3 invalid mnemonic', async () => {
        let w4 = await initWallet('testWallet3', "invalid mnemonic", 'a');
        expect(w4).toBeUndefined();
    })
    test('Wallet - 4 empty address list', async () => {
        let w5 = loadWallet('testWallet_empty_address_list');
        let acc1 = w5?.accountList[0];
        expect(acc1?.addressList).toBeUndefined();
    })
    test('Wallet - 5 empty account list', async () => {
        let w6 = loadWallet('testWallet_empty_account_list');
        expect(w6?.accountList).toBeUndefined();
    })
    test('Wallet - 6 wallet not exists', async () => {
        let w7 = loadWallet('not_a_wallet');
        expect(w7).toBeUndefined();
    })
    test('Wallet - 7 wallet with tx', async () => {
        let w8 = loadWallet('testT');
        if (w8) {
            await w8.updateUsedAdrresses('testT');
            expect(w8.name).toBe('testT');
            const boxes = await w8.getUnspentBoxes();
            expect(boxes).toBeInstanceOf(Array<ErgoBox>);
        } else {
            expect(w8).toEqual(w);
        }

    })
    test('Wallet - 8 address list', async () => {
        let w8 = loadWallet('testT');
        if (w8) {
            expect(w8.getAddressList()[0]).toEqual("9fKzwRCsTe5UFu25DBocTTw6jYtXnHW4QRdjwQzda5599HXm4oF");
        } else {
            expect(w8).toEqual(w);
        }

    })
    test('Wallet - 9 create tx', async () => {
        let w8 = loadWallet('test');
        if (w8) {
            const unsignedTx: EIP12UnsignedTransaction = await w8.createSendTx(
                new BalanceInfo(BigInt(1000000), [{ tokenId: "ce3e5715b86ed3be1d46c8d654e9b20a9b59ba9f28ad8005bd740e81a2e3b9c7", amount: BigInt(1) }]),
                "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c");
            expect(unsignedTx.inputs.length).toBeGreaterThanOrEqual(1);
            expect(unsignedTx.outputs.length).toBeGreaterThan(1);
            const signedTx: SignedTransaction = await w8.signTransaction(unsignedTx, 'test')
            expect(signedTx.inputs.length).toBeGreaterThanOrEqual(1);
            expect(signedTx.outputs.length).toBeGreaterThan(1);
            expect(signedTx.outputs[0].assets.length).toBe(1);
        }
    })
    test('Wallet - 10 create tx fail', async () => {
        let w8 = loadWallet('testWallet1');
        if (w8) {
            try {
                const unsignedTx: EIP12UnsignedTransaction = await w8.createSendTx(new BalanceInfo(BigInt(1000000), []), "9fKzwRCsTe5UFu25DBocTTw6jYtXnHW4QRdjwQzda5599HXm4oF");
            } catch (e) {
                expect(JSONBigInt.stringify(e).includes("No unspent boxes found for the wallet")).toBe(true);
            }
        }
    })
    test('Wallet - 11 create tx fail', async () => {
        let w8 = loadWallet('test');
        if (w8) {
            try {
                const unsignedTx: EIP12UnsignedTransaction = await w8.createSendTx(new BalanceInfo(BigInt(100000000000), []), "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c");
            } catch (e) {
                expect(JSONBigInt.stringify(e).includes("Not able to select boxes for the balance")).toBe(true);
            }
        }
    })

    // with encrypted wallet file
    test('Wallet - 12', async () => {
        process.env.EWC_ENC_KEY = "Test_Enc_Key";

        let w3 = await initWallet('testWallet1Enc', "kiss water essence horse scan useless floor panel vast apart fall chimney", "a", "test", Network.Mainnet);
        let w2 = loadWallet('testWallet1Enc');
        if (w2 && w3) {
            console.log("w2 && w3")
            expect(w2.name).toBe('testWallet1Enc');
            expect(w2.accountList).toEqual(w3.accountList);
            expect(decrypt(w2.encryptedMnemonic, 'a')).toBe(decrypt(w3.encryptedMnemonic, 'a'));
            expect(w2.changeAddress).toBe('9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa');
            const seed = (await ergolib).Mnemonic.to_seed("kiss water essence horse scan useless floor panel vast apart fall chimney", "test");
            const rootSecret = (await ergolib).ExtSecretKey.derive_master(seed);
            const key = rootSecret.derive((await ergolib).DerivationPath.from_string("m/44'/429'/0'/0"))
            const changeAddressWASM = key.child("0")
            expect(changeAddressWASM.public_key().to_address().to_base58(Network.Mainnet)).toBe(w2.changeAddress);
        } else {
            expect(w3).toBeUndefined();
        }

        let w = loadWallet('testWallet1');
        if(w) {
            expect(w.name).toBe('testWallet1');
        } else {
            expect(w).toBeUndefined();
        }

        process.env.EWC_ENC_KEY = "Bad_Test_Enc_Key";
        w = loadWallet('testWallet1Enc');
        if(w) {
            expect(w.name).toBe('testWallet1Enc');
        } else {
            expect(w).toBeUndefined();
        }

        delete process.env.EWC_ENC_KEY;
    })



});

