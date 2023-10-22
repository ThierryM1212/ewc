import JSONBigInt from 'json-bigint';
import { CommandOutput } from './EWCCommand';
import { compileCommand } from './compileCommand';

test('Test compileCommand 0 - node', async () => {
    let output: CommandOutput = await compileCommand("./tests/test_script.es", {
        compilerVersion: 0,
        segregateConstants: true,
        nodeCompile: true,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
})

test('Test compileCommand 1 - node fail', async () => {
    let output: CommandOutput = await compileCommand("./tests/bad_script.es", {
        compilerVersion: 0,
        segregateConstants: true,
        nodeCompile: true,
        testNet: false
    })
    expect(output.messages[0].error).toBe(400);
    expect(output.messages[0].detail.includes("Cannot assign type for variable")).toBe(true);
})

test('Test compileCommand 2 - fleet v0', async () => {
    let output: CommandOutput = await compileCommand("./tests/test_script.es", {
        compilerVersion: 0,
        segregateConstants: false,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "5seLxZkQx9zXcXFkrqdZ",
        "ergotree": "00d1917ea3050580890f",
        "version": 0,
        "segregatedConstants": false
    });
    output = await compileCommand("./tests/test_script.es", {
        compilerVersion: 0,
        segregateConstants: true,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
    output = await compileCommand("./tests/test_script.es", {
        compilerVersion: "0",
        segregateConstants: true,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
})

test('Test compileCommand 3 - fleet v1', async () => {
    let output: CommandOutput = await compileCommand("./tests/test_script.es", {
        compilerVersion: 1,
        segregateConstants: false,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "NjsRYGmJwPQefttxXvBCK",
        "ergotree": "0909d1917ea3050580890f",
        "version": 1,
        "segregatedConstants": false
    });
    output = await compileCommand("./tests/test_script.es", {
        compilerVersion: 1,
        segregateConstants: true,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "ZtooZJtgRFqbHCodQNa81n5K9",
        "ergotree": "190c010580890fd1917ea3057300",
        "version": 1,
        "segregatedConstants": true
    });
    output = await compileCommand("./tests/test_script.es", {
        compilerVersion: "1",
        segregateConstants: true,
        nodeCompile: false,
        testNet: false
    })
    expect(output.messages[0]).toEqual({
        "address": "ZtooZJtgRFqbHCodQNa81n5K9",
        "ergotree": "190c010580890fd1917ea3057300",
        "version": 1,
        "segregatedConstants": true
    });
})

test('Test compileCommand 4 - fleet testnet', async () => {
    let output: CommandOutput = await compileCommand("./tests/test_script.es", {
        compilerVersion: 1,
        segregateConstants: false,
        nodeCompile: false,
        testNet: true
    })
    expect(output.messages[0]).toEqual({
        "address": "3MLHcGrs4mbr1qqZugQDCQ",
        "ergotree": "0909d1917ea3050580890f",
        "version": 1,
        "segregatedConstants": false
    });
})

test('Test compileCommand 5 - fleet fails', async () => {
    let output: CommandOutput = await compileCommand("./tests/bad_script.es", {
        compilerVersion: 1,
        segregateConstants: false,
        nodeCompile: false,
        testNet: true
    })
    expect(output.messages[0].Pua.includes("Cannot assign type for variable")).toBe(true);
})