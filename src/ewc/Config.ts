import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';
import { NodeClient } from '../ergo/node';

export class Config {
    private _mainnetNodeURL: string;
    private _testnetNodeURL: string;
    private _walletDir: string;

    constructor() {
        this._mainnetNodeURL = config.node.mainnet.url;
        this._testnetNodeURL = config.node.testnet.url;
        this._walletDir = config.storage.walletDir;
    }

    public getNodeURL(network: Network) {
        if (network === Network.Mainnet) {
            return this._mainnetNodeURL;
        } else {
            return this._testnetNodeURL;
        }
    }

    public getWalletDir() {
        return this._walletDir;
    }
}

export function getNodeClient(network: Network) {
    const conf = new Config();
    return new NodeClient(conf.getNodeURL(network));
}