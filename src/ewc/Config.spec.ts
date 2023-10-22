import { getNodeClient } from "./Config";
import { Network } from '@fleet-sdk/common';

describe('Test Config.ts', () => {
  test('Node URL - 0', async () => {
    let nodeMainNetClient = getNodeClient(Network.Mainnet);
    expect(nodeMainNetClient.url).toBe('http://51.77.221.96:9053/');
    let nodeTestNetClient = getNodeClient(Network.Testnet);
    expect(nodeTestNetClient.url).toBe('http://51.77.221.96:9052/');
  })
});