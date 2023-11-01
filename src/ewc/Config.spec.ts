import { getNodeClientForNetwork } from "./Config";
import { Network } from '@fleet-sdk/common';
import config from '../ewc.config.json';

describe('Test Config.ts', () => {
  test('Node URL - 0', async () => {
    let nodeMainNetClient = getNodeClientForNetwork(Network.Mainnet);
    expect(nodeMainNetClient.nodeOptions.url).toBe(config.node.mainnet.url);
    let nodeTestNetClient = getNodeClientForNetwork(Network.Testnet);
    expect(nodeTestNetClient.nodeOptions.url).toBe(config.node.testnet.url);
  })
});
