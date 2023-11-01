import JSONBigInt from 'json-bigint';
import { BlockHeader } from '@fleet-sdk/common';
import { ErgoBox } from '@fleet-sdk/core';
import { CommandOutput } from './EWCCommand';
import { NODE_GET_TYPES, nodeGetCommand } from './nodeGetCommand';


test('Test nodeGetCommand 0 - height', async () => {
    let output: CommandOutput = await nodeGetCommand('height', "", {
        testNet: false,
    })
    expect(output.messages[0].height).toBeGreaterThan(1000000);
    output = await nodeGetCommand('iheight', "", {
        testNet: false,
    })
    expect(output.messages[0].indexedHeight).toBeGreaterThan(1000000);
    output = await nodeGetCommand('height', "", {
        testNet: true,
    })
    expect(output.messages[0].height).toBeGreaterThan(1000);
});

test('Test nodeGetCommand 1 - nodeinfo', async () => {
    let output: CommandOutput = await nodeGetCommand('nodeinfo', "", {
        testNet: false,
    })
    expect(output.messages[0].fullHeight).toBeGreaterThan(1000000);
    expect(output.messages[0].network).toBe('mainnet');
    output = await nodeGetCommand('nodeinfo', "", {
        testNet: true,
    })
    expect(output.messages[0].fullHeight).toBeGreaterThan(1000);
    expect(output.messages[0].network).toBe('testnet');
});

test('Test nodeGetCommand 2 - lastheaders', async () => {
    let output: CommandOutput = await nodeGetCommand('lastheaders', "", {
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(10);
    output = await nodeGetCommand('lastheaders', "2", {
        testNet: false,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(2);
    output = await nodeGetCommand('lastheaders', "", {
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<BlockHeader>);
    expect(output.messages[0].length).toBe(10);
});

test('Test nodeGetCommand 3 - box', async () => {
    let output: CommandOutput = await nodeGetCommand('box', "45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6", {
        testNet: false,
    })
    console.log("output.messages[0]", output.messages[0])
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");

    expect(output.messages[0].value).toBe(BigInt(735400000));

    let inquirer = require('@inquirer/prompts');
    inquirer.input = (question) => Promise.resolve("45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6");
    output = await nodeGetCommand('box', "", {
        testNet: false,
    })
    //expect(output.messages[0]).toBeInstanceOf(ErgoBox); // Fails with local fleet
    expect(output.messages[0].constructor.name).toBe("_ErgoBox");
    expect(output.messages[0].value).toBe(BigInt(735400000));
});

test('Test nodeGetCommand 4 - tokeninfo', async () => {
    let output: CommandOutput = await nodeGetCommand('tokeninfo', "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40", {
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

    let inquirer = require('@inquirer/prompts');
    inquirer.input = (question) => Promise.resolve("fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40");
    output = await nodeGetCommand('tokeninfo', "", {
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

    output = await nodeGetCommand('tokeninfo', "nottokenid", {
        testNet: false,
    })
    expect(output.messages[0].error).toBe(400);
});

test('Test nodeGetCommand 5 - utxos', async () => {
    let output: CommandOutput = await nodeGetCommand('utxos', "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c", {
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThan(1);

    let inquirer = require('@inquirer/prompts');
    inquirer.input = (question) => Promise.resolve("3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c");
    output = await nodeGetCommand('utxos', "", {
        testNet: true,
    })
    expect(output.messages[0]).toBeInstanceOf(Array<ErgoBox>);
    expect(output.messages[0].length).toBeGreaterThan(1);
});

test('Test nodeGetCommand 6 - errors', async () => {
    let output: CommandOutput = await nodeGetCommand('bad_type', "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c", {
        testNet: true,
    })
    expect(output.error).toBe(true);
    expect(output.messages[0]).toContain("Type 'bad_type' is not supported for node-get. Supported types: ");
});

test('Test nodeGetCommand 7 - balance', async () => {
    let output: CommandOutput = await nodeGetCommand('balance', "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c", {
        testNet: true,
    })
    expect(output.messages[0]).toHaveProperty("amountERG");
    expect(output.messages[0]).toHaveProperty("tokens");

});