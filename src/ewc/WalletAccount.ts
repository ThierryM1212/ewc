import { WalletAddress } from './WalletAddress';

export class WalletAccount {
    private _index: number;
    private _addressList: Array<WalletAddress>;
    
    constructor(index: number, addressList: Array<WalletAddress> = []) {
        this._index = index;
        this._addressList = addressList;
    }

    public addAddress(address: WalletAddress): void {
        this._addressList.push(address);
    }

    public removeAddress(address: string): void {
        let res: Array<WalletAddress> = [];
        for (let a of this._addressList) {
            if (a.pk !== address) {
                res.push(a);
            }
        }
        this._addressList = res;
    }

    public get index(): number {
        return this._index;
    }
    public set index(value: number) {
        this._index = value;
    }

    public get addressList(): Array<WalletAddress> {
        return this._addressList;
    }
    public set addressList(value: Array<WalletAddress>) {
        this._addressList = value;
    }

}