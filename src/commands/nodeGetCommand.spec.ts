import JSONBigInt from 'json-bigint';
import { BlockHeader } from '@fleet-sdk/common';
import { ErgoBox } from '@fleet-sdk/core';
import { CommandOutput } from './EWCCommand';
import { nodeGetCommand } from './nodeGetCommand';


test('Test nodeGetCommand 0 - height', async () => {
    let output: CommandOutput = await nodeGetCommand({
        height: true,
        testNet: false,
    })
    expect(output.messages[0].height).toBeGreaterThan(1000000);
    output = await nodeGetCommand({
        indexedHeight: true,
        testNet: false,
    })
    expect(output.messages[0].indexedHeight).toBeGreaterThan(1000000);
    output = await nodeGetCommand({
        height: true,
        testNet: true,
    })
    expect(output.messages[0].height).toBeGreaterThan(1000);
});

test('Test nodeGetCommand 1 - nodeinfo', async () => {
    let output: CommandOutput = await nodeGetCommand({
        nodeInfo: true,
        testNet: false,
    })
    expect(output.messages[0].fullHeight).toBeGreaterThan(1000000);
    expect(output.messages[0].network).toBe('mainnet');
    output = await nodeGetCommand({
        nodeInfo: true,
        testNet: true,
    })
    expect(output.messages[0].fullHeight).toBeGreaterThan(1000);
    expect(output.messages[0].network).toBe('testnet');
});

test('Test nodeGetCommand 2 - lastheaders', async () => {
    let output: CommandOutput = await nodeGetCommand({
        lastHeaders: 10,
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(10);
    output = await nodeGetCommand({
        lastHeaders: 2,
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(2);
    output = await nodeGetCommand({
        lastHeaders: 10,
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(10);
});

test('Test nodeGetCommand 3 - box by id', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxById: "45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6",
        testNet: false,
    })
    //console.log("output.messages[0]", output.messages[0])
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");
    expect(output.messages[0].value).toBe(BigInt(735400000));
});

test('Test nodeGetCommand 3 - box by index', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxByIndex: 123456,
        testNet: false,
    })
    //console.log("output.messages[0]", output.messages[0])
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");
    expect(output.messages[0].value).toBe(BigInt("89452147500000000"));
});

test('Test nodeGetCommand 4 - tokeninfo', async () => {
    let output: CommandOutput = await nodeGetCommand({
        tokenInfo: "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        testNet: false,
    })
    expect(output.messages[0]).toEqual({
        "boxId": "00ef11830d923c432b5a85ee78a151c717d65ef8a280d1e2e8afb32a7ca32ac1",
        "decimals": 0,
        "description": "A token to support and memorialize nanoergs.",
        "emissionAmount": 1000000000,
        "id": "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        "name": "kushti",
    });

    output = await nodeGetCommand({
        tokenInfo: "nottokenid",
        testNet: false,
    })
    expect(output.messages[0].error).toBe(400);
});

test('Test nodeGetCommand 5 - utxos by address', async () => {
    let output: CommandOutput = await nodeGetCommand({
        utxosByAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand 6 - balance', async () => {
    let output: CommandOutput = await nodeGetCommand({
        balance: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        testNet: true,
    })
    expect(output.messages[0]).toHaveProperty("amountERG");
    expect(output.messages[0]).toHaveProperty("tokens");

});