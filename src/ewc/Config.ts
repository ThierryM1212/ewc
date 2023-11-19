import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';
import { getErgoNodeProvider } from '@fleet-sdk/blockchain-providers';
//import { DEFAULT_HEADERS, RequestOptions } from '../utils/rest';
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

export function getNodeClientForNetwork(network: Network) {
    const conf = new Config();
    const nodeURL = conf.getNodeURL(network);
    return getErgoNodeProvider(nodeURL, JSONBigInt, fetch);
}
