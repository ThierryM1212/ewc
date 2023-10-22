import { getNodeClient } from '../ewc/Config';
import { Network, BlockHeader } from '@fleet-sdk/common';
import { ErgoBox } from '@fleet-sdk/core';
import { BalanceInfo } from '../ewc/BalanceInfo';


test('node - 0', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const height = await nodeClient.currentHeight();
    expect(height).toBeGreaterThan(1000000);
    const addressWithTx = await nodeClient.addressHasTransactions("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(addressWithTx).toBe(true);
    const addressWithoutTx = await nodeClient.addressHasTransactions("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa");
    expect(addressWithoutTx).toBe(false);
    const addressWithoutTx2 = await nodeClient.addressHasTransactions("");
    expect(addressWithoutTx2).toBe(false);
    const unspentBoxes = await nodeClient.unspentBoxesFor("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(unspentBoxes).toBeInstanceOf(Array<ErgoBox>);
    const tx = await nodeClient.getTransactionsForAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", 10);
    expect(tx.items.length).toBe(10);
    nodeClient.url = "";
    expect(nodeClient.url).toBe("");
})

test('node - 1', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const tx = await nodeClient.getTransactionsForAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", 101);
    expect(tx.items.length).toBeGreaterThan(101);
})

test('node - 2', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const box = await nodeClient.boxByBoxId("45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6");
    expect(box).toBeInstanceOf(ErgoBox);
    const box2 = await nodeClient.boxByBoxId("");
    expect(box2).toBeUndefined();
})

test('node - 3', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const bal = await nodeClient.getBalanceForAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(bal[0]).toBeInstanceOf(BalanceInfo);
    const headerArray = await nodeClient.getLastHeaders();
    expect(headerArray).toBeInstanceOf(Array<BlockHeader>);
    expect(headerArray.length).toBe(10);

})

test('node - 4', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const tokenInfo = await nodeClient.getTokenInfo("fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40");
    expect(tokenInfo).toEqual({
        "boxId": "00ef11830d923c432b5a85ee78a151c717d65ef8a280d1e2e8afb32a7ca32ac1",
        "decimals": 0,
        "description": "A token to support and memorialize nanoergs.",
        "emissionAmount": 1000000000,
        "id": "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        "name": "kushti",
    });
    const res = await nodeClient.postTx({});
    expect(res.error).toBe(400);

})

test('node - 5', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const nodeInfo = await nodeClient.getNodeInfo();
    expect(nodeInfo.appVersion).toBeDefined();

})

test('node - 6', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const compiled = await nodeClient.compileErgoscript("HEIGHT > 100");
    expect(compiled.address).toBe("5yE8zxMTsrGEPw5WM5ET");

})

test('node - 7', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const tx = await nodeClient.getTransactionsForAddress("", 101);
    expect(tx.items.length).toBe(0);
})

test('node - 8', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const bal = await nodeClient.getBalanceForAddress("2iHkR7CWvD1R4j1yZg5bkeDRQavjAaVPeTDFGGLZduHyfWMuYpmhHocX8GJoaieTx78FntzJbCBVL6rf96ocJoZdmWBL2fci7NqWgAirppPQmZ7fN9V6z13Ay6brPriBKYqLp1bT2Fk4FkFLCfdPpe");
    expect(bal[0]).toBeInstanceOf(BalanceInfo);
    const headerArray = await nodeClient.getLastHeaders();
    expect(headerArray).toBeInstanceOf(Array<BlockHeader>);
    expect(headerArray.length).toBe(10);

})