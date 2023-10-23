import { Amount, BlockHeader, Box, Network, NewToken, NonMandatoryRegisters, SignedTransaction, TokenId } from '@fleet-sdk/common';
import { ErgoBox, } from '@fleet-sdk/core';
import { get, post } from '../utils/rest';
import { range } from '../utils/utils';
import { BalanceInfo } from '../ewc/BalanceInfo';


export class NodeClient {
    private _url: string;

    constructor(nodeURL: string) {
        this._url = nodeURL;
    }

    public async getTransactionsForAddress(addr: string, limit: number = -1): Promise<any> {
        if (limit <= 100) {
            const res = await this.postRequest(`blockchain/transaction/byAddress?offset=0&limit=${limit}`, addr);
            //console.log("getTransactionsForAddress res: " + JSON.stringify(res));
            return res.data;
        } else {
            const offsets = range(0, limit, 100);
            const addressTransactionsList = await Promise.all(offsets.map(async (offset) => {
                const tx = await this.postRequest(`blockchain/transaction/byAddress?limit=100&offset=${offset}`, addr)
                return tx.data;
            }));
            var items: Array<SignedTransaction> = []; var total = 0;
            //console.log("addressTransactionsList", addressTransactionsList);
            for (const txList of addressTransactionsList) {
                if (txList.items) {
                    items = items.concat(txList.items);
                    total += parseInt(txList.total);
                }
            }
            //console.log("items", items, total)
            return { "items": items, "total": total };
        }
    }

    public async addressHasTransactions(addr: string): Promise<boolean> {
        const txList = await this.getTransactionsForAddress(addr, 1);
        if (txList.items) {
            return (txList.items.length > 0);
        } else {
            return false;
        }
    }

    public async boxByBoxId(boxId: string): Promise<ErgoBox | undefined> {
        const res = await this.getRequest(`blockchain/box/byId/${boxId}`);
        if (res.data.error) {
            console.log("Box id '" + boxId + "' not found.");
            return;
        }
        const ergoBox = new ErgoBox(res.data);
        return ergoBox;
    }

    public async currentHeight(): Promise<number> {
        const res = await this.getRequest('blocks/lastHeaders/1');
        //console.log("currentHeight", res);
        return res.data[0].height;
    }

    public async unspentBoxesFor(address: string, limit: number = 50) {
        const res = await this.postRequest(`blockchain/box/unspent/byAddress?offset=0&limit=${limit}`, address);
        const boxes: Array<ErgoBox> = res.data.map((b: Box<Amount, NonMandatoryRegisters>) => new ErgoBox(b));
        //console.log("unspentBoxesFor", address, res)
        return boxes;
    }

    public async getBalanceForAddress(address: string): Promise<[BalanceInfo, BalanceInfo]> {
        const res = await this.postRequest(`blockchain/balance`, address);
        let confirmedBalance = new BalanceInfo(BigInt(0), [], true);
        let unConfirmedBalance = new BalanceInfo(BigInt(0), [], true);
        if (res.data && res.data.confirmed && res.data.confirmed.tokens) {
            if (res.data.confirmed.nanoErgs) {
                confirmedBalance.nanoERG = BigInt(res.data.confirmed.nanoErgs);
            }
            if (res.data.unconfirmed.tokens) {
                let confirmedTokens: Array<NewToken<bigint>> = res.data.confirmed.tokens;
                confirmedBalance.tokens = confirmedTokens;
            }
        }
        if (res.data && res.data.unconfirmed) {
            if (res.data.unconfirmed.nanoErgs) {
                unConfirmedBalance.nanoERG = BigInt(res.data.unconfirmed.nanoErgs);
            }
            if (res.data.unconfirmed.tokens) {
                let unConfirmedTokens: Array<NewToken<bigint>> = res.data.unconfirmed.tokens;
                unConfirmedBalance.tokens = unConfirmedTokens;
            }
        }
        //console.log("getBalanceForAddress", address, JSONBigInt.stringify([confirmedBalance, unConfirmedBalance]))
        return [confirmedBalance, unConfirmedBalance];
    }

    public async getLastHeaders(limit: number = 10): Promise<Array<BlockHeader>> {
        const res = await this.getRequest(`blocks/lastHeaders/${limit}`);
        return res.data;
    }

    public async getTokenInfo(tokenId: TokenId): Promise<any> {
        const tokenInfo = await this.getRequest(`blockchain/token/byId/${tokenId}`);
        return tokenInfo.data;
    }

    public async getNodeInfo(): Promise<any> {
        const tokenInfo = await this.getRequest(`info`);
        return tokenInfo.data;
    }

    public async compileErgoscript(script: string): Promise<any> {
        const compiled = await this.postRequest(`script/p2sAddress`, { source: script });
        return compiled.data;
    }

    public async postTx(tx: any): Promise<any> {
        const res = await this.postRequest('transactions', tx);
        return res.data;
    }

    private async getRequest(url: string): Promise<any> {
        const res = await get(this._url + url);
        return { data: res };
    }

    private async postRequest(url: string, body: any = {}): Promise<any> {
        const res = await post(this._url + url, body)
        return { data: res };
    }

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

}
