import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';
import { NodeClient } from '../ergo/node';
const path = require( "path" );

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
    return new NodeClient(conf.getNodeURL(network));
}