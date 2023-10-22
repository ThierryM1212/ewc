import { TokenId, NewToken, Network } from '@fleet-sdk/common';
import JSONBigInt from 'json-bigint';
import { getNodeClient } from './Config';
import { NANOERG_TO_ERG } from '../utils/constants';
import { SelectionTarget } from './Wallet';
import { RECOMMENDED_MIN_FEE_VALUE } from '@fleet-sdk/core';
import { formatERGAmount, formatTokenAmount } from '../utils/utils';

// Human balance token amount, needs to be adjusted with token decimals for the transaction
export type TokenH = {
    tokenId: string,
    amount: string
}
// Human balance, amountERG float string in ERG
export type BalanceH = {
    amountERG: string,
    tokens: Array<TokenH>
}

export async function getBalanceInfo(balanceH: BalanceH, network: Network): Promise<BalanceInfo | undefined> {
    try {
        const nodeClient = getNodeClient(network)
        let tokensInfo: Array<NewToken<bigint>> = await Promise.all(balanceH.tokens.map(async t => {
            const i = await nodeClient.getTokenInfo(t.tokenId);
            //console.log("i: " + JSONBigInt.stringify(i, null, 2))
            if (!i.decimals) {
                throw ("Invalid token Id");
            }
            const ti: NewToken<bigint> = {
                amount: BigInt(Math.round(parseFloat(t.amount) * Math.pow(10, i.decimals))),
                tokenId: i.id,
                decimals: i.decimals,
                name: i.name
            };
            return ti;
        }));
        const nanoERGAmount = BigInt(Math.round(parseFloat(balanceH.amountERG) * NANOERG_TO_ERG));
        const bal: BalanceInfo = new BalanceInfo(nanoERGAmount, tokensInfo);
        //console.log("bal: " + JSONBigInt.stringify(bal, null, 2))
        return bal;
    } catch (e) {
        console.log("An error occured", e)
    }
}

export class BalanceInfo {
    private _nanoERG: bigint;
    private _tokens: Array<NewToken<bigint>>;
    private _confirmed: boolean;

    constructor(nanoERG: bigint, tokens: Array<NewToken<bigint>>, confirmed: boolean = true) {
        this._nanoERG = nanoERG;
        this._tokens = tokens;
        this._confirmed = confirmed;
    }

    public add(addedBalance: BalanceInfo) {
        this._nanoERG += addedBalance._nanoERG;
        for (let tokToAdd of addedBalance._tokens) {
            //console.log("Adding tokens "+JSON.stringify(this.getTokenIdList()))
            if (tokToAdd.tokenId && this.getTokenIdList().includes(tokToAdd.tokenId)) {
                //console.log("Adding tokens "+tokToAdd.tokenId)
                let tok = this.getToken(tokToAdd.tokenId);
                if (tok) {
                    tok.amount = tok.amount + tokToAdd.amount;
                }
            } else {
                this._tokens.push(tokToAdd);
            }
        }
    }

    public getTokenIdList(): Array<TokenId> {
        return this._tokens.map(t => t.tokenId ?? "");
    }

    public getToken(tokenId: TokenId): NewToken<bigint> | undefined {
        for (let tok of this._tokens) {
            if (tok.tokenId === tokenId) {
                return tok;
            }
        }
    }

    public getSelectionTarget(fee: bigint = RECOMMENDED_MIN_FEE_VALUE): SelectionTarget {
        return {
            nanoErgs: BigInt(this._nanoERG) + BigInt(fee),
            tokens: this._tokens.map(t => { return { tokenId: t.tokenId ?? "", amount: t.amount } }).filter(t => t.tokenId !== "")
        }
    }

    public getBalanceH(): BalanceH {
        let ergAmount = formatERGAmount(this._nanoERG);
        let tokensH: Array<TokenH> = this._tokens.map(t => {return {tokenId: t.tokenId ?? "", amount: formatTokenAmount(t.amount, t.decimals ?? 0)}})
        return {
            amountERG: ergAmount,
            tokens: tokensH
        };
    }

    public get nanoERG(): bigint {
        return this._nanoERG;
    }
    public set nanoERG(value: bigint) {
        this._nanoERG = value;
    }

    public get tokens(): Array<NewToken<bigint>> {
        return this._tokens;
    }
    public set tokens(value: Array<NewToken<bigint>>) {
        this._tokens = value;
    }

    public get confirmed(): boolean {
        return this._confirmed;
    }
    public set confirmed(value: boolean) {
        this._confirmed = value;
    }
}
