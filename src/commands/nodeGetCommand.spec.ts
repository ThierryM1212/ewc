import JSONBigInt from 'json-bigint';
import { BlockHeader, SignedTransaction } from '@fleet-sdk/common';
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

test('Test nodeGetCommand - nodeinfo', async () => {
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

test('Test nodeGetCommand - lastheaders', async () => {
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

test('Test nodeGetCommand - box by id', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxById: "45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6",
        testNet: false,
    })
    //console.log("output.messages[0]", output.messages[0])
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");
    expect(output.messages[0].value).toBe(BigInt(735400000));
});

test('Test nodeGetCommand - box by index', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxByIndex: 123456,
        testNet: false,
    })
    //console.log("output.messages[0]", output.messages[0])
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");
    expect(output.messages[0].value).toBe(BigInt("89452147500000000"));
});

test('Test nodeGetCommand - tokeninfo', async () => {
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

test('Test nodeGetCommand - utxos by address', async () => {
    let output: CommandOutput = await nodeGetCommand({
        utxosByAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - utxos by ergotree', async () => {
    let output: CommandOutput = await nodeGetCommand({
        utxosByErgotree: "0008cd02301c047730158b6d78d6cde4e4e4621af03469229b0026c9ec331351f54936be",
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - utxos by tokenid', async () => {
    let output: CommandOutput = await nodeGetCommand({
        utxosByTokenid: "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - boxes by address', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxesByAddress: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - boxes by ergotree', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxesByErgotree: "0008cd02301c047730158b6d78d6cde4e4e4621af03469229b0026c9ec331351f54936be",
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - boxes by tokenid', async () => {
    let output: CommandOutput = await nodeGetCommand({
        boxesByTokenid: "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThanOrEqual(1);
});

test('Test nodeGetCommand - balance', async () => {
    let output: CommandOutput = await nodeGetCommand({
        balance: "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c",
        testNet: true,
    })
    expect(output.messages[0]).toHaveProperty("amountERG");
    expect(output.messages[0]).toHaveProperty("tokens");

});

test('Test nodeGetCommand - transaction by txId', async () => {
    let output: CommandOutput = await nodeGetCommand({
        txById: "cf41dcdb26937b28f12664df9680f0895153fb73d3fce3f7e89b7151987b9e76",
        testNet: false,
    })
    expect(output.messages[0].id).toBe("cf41dcdb26937b28f12664df9680f0895153fb73d3fce3f7e89b7151987b9e76");
    expect(output.messages[0]).toHaveProperty("inputs");
    expect(output.messages[0]).toHaveProperty("outputs");
});

test('Test nodeGetCommand - transaction by index', async () => {
    let output: CommandOutput = await nodeGetCommand({
        txByIndex: 6040415,
        testNet: false,
    })
    expect(output.messages[0].id).toBe("cf41dcdb26937b28f12664df9680f0895153fb73d3fce3f7e89b7151987b9e76");
    expect(output.messages[0]).toHaveProperty("inputs");
    expect(output.messages[0]).toHaveProperty("outputs");
});

test('Test nodeGetCommand - transactions by address', async () => {
    let output: CommandOutput = await nodeGetCommand({
        txByAddress: "7uQ7MoQgMkyP9RxB7cfAAtZFWUtuWGEWzskvUq4ZxEvh4nDruTmrRQejoBbVmZXirMTmG8Yxk3p7HPQwzziugxxXrQhgXP62k6jrz28xXVz1bNJfACUstvozRNBzcB5MuX2RYMoE",
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<SignedTransaction>);

});

test('Test nodeGetCommand - unconfirmed transactions', async () => {
    let output: CommandOutput = await nodeGetCommand({
        unconfirmedTx: true,
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<SignedTransaction>);
    if (output.messages[0].length > 0) {
        let txId = output.messages[0][0].id;
        let ergotree = output.messages[0][0].outputs[0].ergoTree;
        let tx = await nodeGetCommand({
            unconfirmedTxById: txId,
            testNet: false,
        })
        expect(tx.messages[0].id).toBeDefined();
        expect(tx.messages[0]).toHaveProperty("inputs");
        expect(tx.messages[0]).toHaveProperty("outputs");
        let tx2 = await nodeGetCommand({
            unconfirmedTxByErgotree: ergotree,
            testNet: false,
        })
        expect(tx2.messages[0]).toBeInstanceOf(Array<SignedTransaction>);
    }


});
