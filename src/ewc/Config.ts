import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';
import { NodeClient } from '../ergo/node';
import { DEFAULT_HEADERS, RequestOptions } from '../utils/rest';
import JSONBigInt from 'json-bigint';


export class Config {
    private _mainnetNodeURL: string;
    private _testnetNodeURL: string;

    constructor() {
        this._mainnetNodeURL = config.node.mainnet.url;
        this._testnetNodeURL = config.node.testnet.url;
    }

    public getNodeURL(network: Network) {
        if (network === Network.Mainnet) {
            return this._mainnetNodeURL;
        } else {
            return this._testnetNodeURL;
        }
    }

}

export function getNodeClient(network: Network) {
    const conf = new Config();
    const nodeOptions: RequestOptions = {
        url: conf.getNodeURL(network),
        parser: JSONBigInt,
        fetcher: fetch,
        headers: DEFAULT_HEADERS,
    }
    return new NodeClient(nodeOptions);
}
