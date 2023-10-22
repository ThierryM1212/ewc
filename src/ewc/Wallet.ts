import { decrypt, encrypt } from '../utils/crypto';
import { WalletAccount } from './WalletAccount';
import JSONBigInt from 'json-bigint';
import { ErgoHDKey } from "@fleet-sdk/wallet";
import { Network, TokenTargetAmount, EIP12UnsignedTransaction, SignedTransaction } from '@fleet-sdk/common';
import { ErgoBox, BoxSelector, ErgoUnsignedInput, TransactionBuilder, OutputBuilder, ErgoAddress, RECOMMENDED_MIN_FEE_VALUE } from '@fleet-sdk/core';
import { WalletAddress } from './WalletAddress';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { NodeClient } from '../ergo/node';
import { getWalletForAddresses, signTransaction } from '../ergo/wasm';
import { getNodeClient } from './Config';
import { BalanceInfo } from './BalanceInfo';
var path = require('path');


const WALLET_EXTENSION = ".wallet";
const WALLET_DIR = path.resolve(__dirname, '../../build/wallets');

export type SelectionTarget = {
    nanoErgs?: bigint;
    tokens?: TokenTargetAmount<bigint>[];
};

type Mnemonic = {
    mnemonic: string;
    passphrase: string;
};

export class Wallet {
    private _name: string;
    private _accountList: Array<WalletAccount>;
    private _changeAddress: string;
    private _encryptedMnemonic: string;
    private _network: Network;

    constructor(name: string, accountList: Array<WalletAccount> = [], encryptedMnemonic: string = "", changeAddress: string = "", network: Network = Network.Mainnet) {
        this._name = name;
        this._accountList = accountList;
        this._changeAddress = changeAddress;
        this._encryptedMnemonic = encryptedMnemonic;
        this._network = network;
    }

    public async updateUsedAdrresses(walletPassword: string): Promise<void> {
        const mnemonic = this.getDecryptedMnemonic(walletPassword);

        // BIP-44 Address discovery
        let accountId: number = 0, txForAccountFound: boolean = true, accounts: Array<WalletAccount> = [], unusedAddresses: Array<WalletAddress> = [];
        const numberOfUnusedAddress = 3;
        while (txForAccountFound) {
            let index = 0, indexMax = 20, accountAddrressList: Array<WalletAddress> = [];
            txForAccountFound = false;
            unusedAddresses = [];
            while (index < indexMax) {
                let newPath = "m/44'/429'/" + accountId + "'/0";
                //console.log(newPath);
                const w: ErgoHDKey = await ErgoHDKey.fromMnemonic(mnemonic.mnemonic, { passphrase: mnemonic.passphrase, path: newPath });
                let newAddressStr = w.deriveChild(index).address.encode(this._network);
                const nodeClient: NodeClient = getNodeClient(this._network);
                if (await nodeClient.addressHasTransactions(newAddressStr)) {
                    indexMax = index + 20;
                    txForAccountFound = true
                    accountAddrressList.push(new WalletAddress(newAddressStr, index, true));
                } else {
                    if (unusedAddresses.length < numberOfUnusedAddress) {
                        unusedAddresses.push(new WalletAddress(newAddressStr, index, false));
                        accountAddrressList.push(new WalletAddress(newAddressStr, index, false));
                    }
                }
                index++;
            }
            accounts.push(new WalletAccount(accountId, accountAddrressList));
            accountId++;
        }
        this._accountList = accounts;
        if (this._changeAddress === "") {
            this._changeAddress = accounts[0].addressList[0].pk;
        }
        this.save();
    }

    public async getUnspentBoxes(): Promise<Array<ErgoBox>> {
        const nodeClient = getNodeClient(this._network);
        let addrList: Array<string> = this.getAddressList();
        let boxesList: Array<ErgoBox> = (await (Promise.all(addrList.map(async a => await nodeClient.unspentBoxesFor(a))))).flat();
        return boxesList;
    }

    public async createSendTx(txBalance: BalanceInfo, addressSendTo: string, txFee: bigint = RECOMMENDED_MIN_FEE_VALUE): Promise<EIP12UnsignedTransaction> {
        let target: SelectionTarget = txBalance.getSelectionTarget(txFee);
        const boxes = await this.getUnspentBoxes();
        //console.log("boxes: ", JSONBigInt.stringify(boxes));
        if (boxes.length === 0) {
            throw("No unspent boxes found for the wallet")
        }

        const selector = new BoxSelector(boxes.map((box) => new ErgoUnsignedInput(box))).orderBy(
            (box) => box.creationHeight
        );
        let selection!: ErgoUnsignedInput[];

        try {
            selection = selector.select(target);
        } catch {
            throw("Not able to select boxes for the balance");
        }

        //console.log("selection: ", JSONBigInt.stringify(selection));
        const nodeClient = getNodeClient(this._network);
        const height = await nodeClient.currentHeight();

        let outpoutB = new OutputBuilder(
            txBalance.nanoERG.toString(),
            ErgoAddress.fromBase58(addressSendTo)
        )
        if (target.tokens) {
            for (let t of target.tokens) {
                if (t.amount) {
                    outpoutB.addTokens({ 
                        tokenId: t.tokenId, 
                        amount: t.amount 
                      })
                }
            }
        }
        
        const unsignedTx = new TransactionBuilder(height)
            .from(selection) // add inputs from dApp Connector
            .to(outpoutB)
            .sendChangeTo(ErgoAddress.fromBase58(this._changeAddress)) // Set the change address to the waller change address
            .payFee(txFee)
            .build() // build the transaction
            .toEIP12Object(); // converts the ErgoUnsignedTransaction instance to an dApp Connector compatible plain object
        //console.log("unsignedTx: ", JSONBigInt.stringify(unsignedTx));
        return unsignedTx;
    }

    public async signTransaction(unsignedTx: EIP12UnsignedTransaction, walletPassword: string): Promise<SignedTransaction> {
        const mnemonic = this.getDecryptedMnemonic(walletPassword);
        //console.log("mnemonic: " , mnemonic, passphrase);
        const wasmWallet = await getWalletForAddresses(this._network, mnemonic.mnemonic, mnemonic.passphrase, this.getAddressList());
        const signedTx = await signTransaction(this._network, unsignedTx, unsignedTx.inputs, unsignedTx.dataInputs, wasmWallet)
        //console.log("signedTx: ", signedTx);
        return signedTx;
    }

    //public async sendERG(walletPassword: string, amountNano: number, addressSendTo: string) {
    //    const unsignedTx = await this.createSendErgTx(amountNano, addressSendTo);
    //    const mnemonic = this.getDecryptedMnemonic(walletPassword);
    //    //console.log("mnemonic: " , mnemonic, passphrase);
    //    const wasmWallet = await getWalletForAddresses(this._network, mnemonic.mnemonic, mnemonic.passphrase, this.getAddressList());
    //    const signedTx = await signTransaction(this._network, unsignedTx, unsignedTx.inputs, unsignedTx.dataInputs, wasmWallet)
    //    console.log("signedTx: ", signedTx);
    //    
    //}

    public getDecryptedMnemonic(walletPassword: string): Mnemonic {
        const [mnemonic, passphrase] = decrypt(this._encryptedMnemonic, walletPassword).toString().split("_");
        return {
            mnemonic: mnemonic,
            passphrase: passphrase
        };
    }

    public save(walletDir: string = WALLET_DIR): void {
        const fileName = getWalletFilePath(this._name);
        if (!existsSync(walletDir)) {
            mkdirSync(walletDir);
        }
        writeFileSync(fileName, JSON.stringify(this));
        //console.log('Wallet successfully saved to the disk: ' + fileName);
    }

    public getAddressList(): Array<string> {
        let addrList: Array<WalletAddress> = [];
        let accountId: number = 0;
        for (let acc of this._accountList) {
            for (let add of acc.addressList) {
                addrList.push(add);
            }
            accountId++;
        }
        return addrList.map(a => a.pk);
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get accountList(): Array<WalletAccount> {
        return this._accountList;
    }
    public set accountList(value: Array<WalletAccount>) {
        this._accountList = value;
    }

    public get changeAddress(): string {
        return this._changeAddress;
    }
    public set changeAddress(value: string) {
        this._changeAddress = value;
    }

    public get encryptedMnemonic(): string {
        return this._encryptedMnemonic;
    }
    public set encryptedMnemonic(value: string) {
        this._encryptedMnemonic = value;
    }

    public get network(): Network {
        return this._network;
    }
    public set network(value: Network) {
        this._network = value;
    }

}

export function getWalletFilePath(walletName: string): string {
    return path.join(WALLET_DIR, walletName + WALLET_EXTENSION);
}

export async function initWallet(name: string, mnemonic: string, password: string, passphrase: string = "", network: Network = Network.Mainnet): Promise<Wallet | undefined> {
    try {
        const w: ErgoHDKey = await ErgoHDKey.fromMnemonic(mnemonic, { passphrase: passphrase });
        const encrypted: string = encrypt(Buffer.from(mnemonic + '_' + passphrase), password);

        // add the three first addresses of the account(0)
        let addressList0: Array<WalletAddress> = [];
        for (let i = 0; i < 3; i++) {
            let a = new WalletAddress(w.deriveChild(i).address.encode(network), i);
            await a.updateAddressUsed(network);
            addressList0.push(a);
        }
        let account0: WalletAccount = new WalletAccount(0, addressList0);
        
        let res: Wallet = new Wallet(name, [account0], encrypted, "", network);
        await res.updateUsedAdrresses(password);
        res.save();
        return res;
    } catch (error) {
        console.log('An error has occurred ', error);
        return;
    }
}


export function loadWallet(walletName: string): Wallet | undefined {
    try {
        const walletFilePath = getWalletFilePath(walletName);
        const wa = JSON.parse(readFileSync(walletFilePath, 'ascii'));
        if (wa._accountList) {
            let accountList: Array<WalletAccount> = [];
            for (let acc of wa._accountList) {
                let accountIndex = acc._index;
                let addressList: Array<WalletAddress> = [];
                if (acc._addressList) {
                    for (let add of acc._addressList) {
                        addressList.push(new WalletAddress(add._pk, add._index, add._used))
                    }
                } else {
                    throw('Invalid wallet no _addressList for account ' + accountIndex);
                }
                accountList.push(new WalletAccount(accountIndex, addressList))
            }
            //console.log('Wallet ' + walletFilePath + ' successfully loaded from disk.');
            return new Wallet(walletName, accountList, wa._encryptedMnemonic, wa._changeAddress, wa._network);
        } else {
            throw('Invalid wallet no _accountList');
        }
    } catch (error) {
        console.log('An error has occurred ', error);
    }
}

