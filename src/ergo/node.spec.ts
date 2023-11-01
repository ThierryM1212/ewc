import { getNodeClient } from '../ewc/Config';
import { Network, BlockHeader, SignedTransaction } from '@fleet-sdk/common';
import { ErgoBox } from '@fleet-sdk/core';
import { BalanceInfo } from '../ewc/BalanceInfo';
import {
    mockCompileScript, mockGetBalance, mockGetBoxById, mockLastHeaders, mockTransactionList,
    mockTokenInfo, mockNodeInfo, mockUTXOByAddress, mockCompileError, mockPostTxSuccess, mockPostTxError
} from "../../tests/node_mocks";


test('node - 0', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const get = jest.spyOn(rest, 'get');
    get.mockImplementation(() => Promise.resolve(mockLastHeaders));

    const height = await nodeClient.getCurrentHeight();
    expect(height).toBe(1123070);

    const headerArray = await nodeClient.getLastHeaders();
    expect(headerArray).toBeInstanceOf(Array<BlockHeader>);
    expect(headerArray.length).toBe(10);
})


test('node - 1', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'post');
    post.mockImplementation(() => Promise.resolve(mockTransactionList));

    const addressWithTx = await nodeClient.addressHasTransactions("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(addressWithTx).toBe(true);

    const tx = await nodeClient.getTransactionsByAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", 5);
    expect(tx).toBeInstanceOf(Array<SignedTransaction>);
    expect(tx.length).toBe(5);

    post.mockImplementation(() => Promise.resolve([]));
    const addressWithoutTx = await nodeClient.addressHasTransactions("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(addressWithoutTx).toBe(false);

    const testOptions = {
        url: "https://test.com"
    }
    nodeClient.nodeOptions = testOptions;
    expect(nodeClient.nodeOptions).toEqual(testOptions);
})


test('node - 2', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    let get = jest.spyOn(rest, 'get');
    get.mockImplementation(() => Promise.resolve(mockGetBoxById));

    let box = await nodeClient.getBoxByBoxId("45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6");
    expect(box).toBeInstanceOf(ErgoBox);

    box = await nodeClient.getBoxByIndex(33263731);
    expect(box).toBeInstanceOf(ErgoBox);

    get.mockImplementation(() => Promise.resolve(mockTransactionList.items[0]));
    let tx = await nodeClient.getTransactionByTransactionId("fa467416eca865a46b686059ad7c293afd08b1d429a393137ea99600d475ae9a")
    expect(tx.id).toBeDefined();

    tx = await nodeClient.getTransactionByIndex(5631288)
    expect(tx.id).toBeDefined();

})

test('node - 3', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'post');
    post.mockImplementation(() => Promise.resolve(mockGetBalance));

    const bal = await nodeClient.getBalanceByAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(bal).toBeInstanceOf(BalanceInfo);
    const bal2 = await nodeClient.getBalanceByAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", false);
    expect(bal2).toBeInstanceOf(BalanceInfo);
})

test('node - 4', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const get = jest.spyOn(rest, 'get');
    get.mockImplementation(() => Promise.resolve(mockTokenInfo));

    const tokenInfo = await nodeClient.getTokenInfo("fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40");
    expect(tokenInfo.name).toBe("kushti");
})

test('node - 5', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const get = jest.spyOn(rest, 'get');
    get.mockImplementation(() => Promise.resolve(mockNodeInfo));

    const nodeInfo = await nodeClient.getNodeInfo();
    expect(nodeInfo.appVersion).toBeDefined();
})

test('node - 6', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'post');
    post.mockImplementation(() => Promise.resolve(mockCompileScript));
    const compiled = await nodeClient.compileErgoscript("HEIGHT > 100");
    if (compiled.address) {
        expect(compiled.address).toBe("5yE8zxMTsrGEPw5WM5ET");
    } else {
        expect(true).toBe(false);
    }

    post.mockImplementation(() => Promise.resolve(mockCompileError));
    const compileError = await nodeClient.compileErgoscript("HEIHT > 100");
    if (compileError.error) {
        expect(compileError.error).toBe(400);
    } else {
        expect(true).toBe(false);
    }
})

test('node - 7', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'post');
    post.mockImplementation(() => Promise.resolve(mockUTXOByAddress));
    let utxos = await nodeClient.getUnspentBoxesByAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
    utxos = await nodeClient.getUnspentBoxesByErgotree("0008cd03b4cf5eb18d1f45f73472bc96578a87f6d967015c59c636c7a0b139348ce826b0");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
    utxos = await nodeClient.getBoxesByAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
    utxos = await nodeClient.getBoxesByErgotree("0008cd03b4cf5eb18d1f45f73472bc96578a87f6d967015c59c636c7a0b139348ce826b0");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
})

test('node - 8', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'post');
    post.mockImplementation(() => Promise.resolve(mockPostTxSuccess));
    const txId = await nodeClient.postTx({});
    expect(txId).toEqual({ "transactionId": "18b11ee7adbb1e2b837052d7f28df3c50ffb257c31447b051eac21b74780d842" });

    post.mockImplementation(() => Promise.resolve(mockPostTxError));
    const txError = await nodeClient.postTx({});
    expect(txError.error).toBe(400);
})

test('node - 9', async () => {
    const nodeClient = getNodeClient(Network.Mainnet);
    const rest = require('../utils/rest');
    const post = jest.spyOn(rest, 'get');
    post.mockImplementation(() => Promise.resolve(mockUTXOByAddress));
    let utxos = await nodeClient.getUnspentBoxesByTokenId("fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
    utxos = await nodeClient.getBoxesByTokenId("fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40");
    expect(utxos).toBeInstanceOf(Array<ErgoBox>);
})
