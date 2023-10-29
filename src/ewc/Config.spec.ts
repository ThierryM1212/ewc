import { getNodeClient } from "./Config";
import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';

describe('Test Config.ts', () => {
  test('Node URL - 0', async () => {
    let nodeMainNetClient = getNodeClient(Network.Mainnet);
    expect(nodeMainNetClient.nodeOptions.url).toBe(config.node.mainnet.url);
    let nodeTestNetClient = getNodeClient(Network.Testnet);
    expect(nodeTestNetClient.nodeOptions.url).toBe(config.node.testnet.url);
  })
});
