let exec = require('child_process').exec;
import JSONBigInt from 'json-bigint';
import { BlockHeader, Network } from '@fleet-sdk/common';
import { ErgoBox, ErgoAddress } from '@fleet-sdk/core';
import { Config } from './ewc/Config';
// Runs with built code, test are executed after a build
const BUILT_DIR = "./build/";

const config = new Config();

////////////////////////////////////////
////////////// NEW WALLET //////////////
////////////////////////////////////////
test('Test new wallet 0', async () => {
    // create a new wallet
    let result = await cli(['nw', "-n", 'testWallet0', "-p", "testWallet0", "-f"]);
    console.log(result)
    expect(result.stdout.trim().replaceAll("\\","/")).toBe('Wallet testWallet0 created in ' + config.getWalletDir() + '/testWallet0.wallet');
    let addresses = await cli(['wallet-get', 'testWallet0', "testWallet0", "-l"]);
    let addressesJSON = JSON.parse(addresses.stdout);
    expect(addressesJSON.length).toBe(3);
    const ergoAddresses = addressesJSON.map( (a: string) => ErgoAddress.fromBase58(a))
    expect(ergoAddresses).toBeInstanceOf(Array<ErgoAddress>)
})

test('Test new wallet 1', async () => {
    // create a new wallet
    let result = await cli(['nw', "-n", 'testWallet1', "-p", "testWallet1", "-f", "-m", '"kiss water essence horse scan useless floor panel vast apart fall chimney"', "-a", "test"]);
    expect(result.stdout.trim().replaceAll("\\","/")).toBe('Wallet testWallet1 created in ' + config.getWalletDir() + '/testWallet1.wallet');
    let addresses = await cli(['wallet-get', 'testWallet1', "testWallet1", "-l"]);
    let addressesJSON = JSON.parse(addresses.stdout);
    //console.log(addressesJSON)
    const ergoAddresses = addressesJSON.map( (a: string) => ErgoAddress.fromBase58(a))
    expect(ergoAddresses[0].toString(Network.Mainnet)).toBe("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa");
    expect(ergoAddresses[1].toString(Network.Mainnet)).toBe("9es2fpzi4vT1VPGdnTwALPQfeJL6m5pRrSSDGaMEtp58e5ZVhe5");
    expect(ergoAddresses[2].toString(Network.Mainnet)).toBe("9g6qqFkZC1Uyzn8EqrY5JgkQnNUWKk5GemPUuQJ8peQ5dN7zyPN");
})

test('Test new wallet 3', async () => {
    // create a new wallet
    let result = await cli(['nw', "-n", 'testWallet3', "-p", "testWallet3", "-f", "-s", "15"]);
    expect(result.stdout.trim().replaceAll("\\","/")).toBe('Wallet testWallet3 created in ' + config.getWalletDir() + '/testWallet3.wallet');
    let m = await cli(['wallet-get', 'testWallet3', "testWallet3", "-m"]);
    const mnemonicJSON = JSON.parse(m.stdout);
    expect(mnemonicJSON.mnemonic.split(" ").length).toBe(15);
})

test('Test new wallet 4', async () => {
    // create a new wallet
    let result = await cli(['nw', "-n", 'testWallet4', "-p", "testWallet4", "-f", "-m", '"kiss water essence horse scan useless floor panel vast apart fall chimney"', "-a", "test", "-t"]);
    expect(result.stdout.trim().replaceAll("\\","/")).toBe('Wallet testWallet4 created in ' + config.getWalletDir() + '/testWallet4.wallet');
    let addresses = await cli(['wallet-get', 'testWallet4', "testWallet4", "-l"]);
    let addressesJSON = JSON.parse(addresses.stdout);
    //console.log(addressesJSON)
    const ergoAddresses = addressesJSON.map( (a: string) => ErgoAddress.fromBase58(a))
    expect(ergoAddresses[0].toString(Network.Testnet)).toBe("3WycREnPpB4oEWjZ5GpDM2nBaCGqmpQ21YKASmwpFoHVN5o8DBZF");
    expect(ergoAddresses[1].toString(Network.Testnet)).toBe("3WvxBFbPWXaebmbZUznDu7uCebWmTTRT2vQXAY7s6YsTdwD2MeXa");
    expect(ergoAddresses[2].toString(Network.Testnet)).toBe("3WxBzR29MefgaGzR64App6CYPjaus25hsijUSAwozUhnavXaVowQ");
})

////////////////////////////////////////
////////////// WALLET GET //////////////
////////////////////////////////////////
test('Test wallet get 1', async () => {
    // create a new wallet
    let result = await cli(['nw', "-n", 'testWallet1', "-p", "testWallet1", "-f", "-m", '"kiss water essence horse scan useless floor panel vast apart fall chimney"', "-a", "test"]);
    expect(result.stdout.trim().replaceAll("\\","/")).toBe('Wallet testWallet1 created in ' + config.getWalletDir() + '/testWallet1.wallet');
    // UPDATE USED ADDRESSES
    let result2 = await cli(['wg', 'testWallet1', "testWallet1", "-u"]);
    let addresses = await cli(['wallet-get', 'testWallet1', "testWallet1", "-l"]);
    let addressesJSON = JSON.parse(addresses.stdout);
    const ergoAddresses = addressesJSON.map( (a: string) => ErgoAddress.fromBase58(a))
    expect(ergoAddresses[0].toString(Network.Mainnet)).toBe("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa");
    expect(ergoAddresses[1].toString(Network.Mainnet)).toBe("9es2fpzi4vT1VPGdnTwALPQfeJL6m5pRrSSDGaMEtp58e5ZVhe5");
    expect(ergoAddresses[2].toString(Network.Mainnet)).toBe("9g6qqFkZC1Uyzn8EqrY5JgkQnNUWKk5GemPUuQJ8peQ5dN7zyPN");

    // GET MNEMONIC
    let result3 = await cli(['wg', 'testWallet1', "testWallet1", "-m"]);
    let m = JSON.parse(result3.stdout);
    expect(m.mnemonic).toBe("kiss water essence horse scan useless floor panel vast apart fall chimney");
    expect(m.passphrase).toBe("test");

    // GET BALANCE
    let result4 = await cli(['wg', 'testWallet1', "testWallet1", "-b", "all"]);
    let b = JSON.parse(result4.stdout);
    expect(b._nanoERG).toBe(0);
    expect(b._tokens).toEqual([]);

    // GET UTXO
    let result5 = await cli(['wg', 'testWallet1', "testWallet1", "-x"]);
    let u = JSON.parse(result5.stdout);
    expect(u).toEqual([]);
})


////////////////////////////////////////
/////////////// NODE GET ///////////////
////////////////////////////////////////
test('Test node get invalid', async () => {
    // get mainnet node height
    let result = await cli(['ng', 'not_a_get_type']);
    expect(result.stderr.trim()).toBe("Type 'not_a_get_type' is not supported for node-get. Supported types: box, height, lastheaders, tokeninfo, nodeinfo, utxos");
})

test('Test node get nodeinfo', async () => {
    // get mainnet node info
    let result = await cli(['ng', 'nodeinfo']);
    let out = JSON.parse(result.stdout)
    //console.log(out)
    expect(out.fullHeight).toBeGreaterThan(1000000);
    expect(out.network).toBe("mainnet");

    // get testnet node info
    let result2 = await cli(['node-get', 'nodeinfo', '-t']);
    let out2 = JSON.parse(result2.stdout)
    //console.log(out2)
    expect(out2.network).toBe("testnet");

})

test('Test node get height', async () => {
    // get mainnet node height
    let result = await cli(['ng', 'height']);
    let out = JSON.parse(result.stdout)
    //console.log(out)
    expect(out.height).toBeGreaterThan(1000000);
})

test('Test node get lastheaders', async () => {
    // get mainnet node lastheaders
    let result = await cli(['ng', 'lastheaders']);
    let out = JSON.parse(result.stdout)
    expect(out).toBeInstanceOf(Array<BlockHeader>);
    expect(out.length).toBe(10);
    let result2 = await cli(['ng', 'lastheaders', '2']);
    let out2 = JSON.parse(result2.stdout)
    expect(out2).toBeInstanceOf(Array<BlockHeader>);
    expect(out2.length).toBe(2);
})

test('Test node get box', async () => {
    // get mainnet node height
    let result = await cli(['ng', 'box', "45ce2cd800136a44f2cbf8b48472c7585cd37530de842823684b38a0ffa317a6"]);
    //console.log(result)
    let box: ErgoBox = new ErgoBox(JSONBigInt.parse(result.stdout))
    //console.log(box)
    expect(box).toBeInstanceOf(ErgoBox);
    expect(box.value).toBe(BigInt(735400000));
})

test('Test node get tokeninfo', async () => {
    let result = await cli(['ng', 'tokeninfo', "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40"]);
    expect(JSON.parse(result.stdout)).toEqual({
        "boxId": "00ef11830d923c432b5a85ee78a151c717d65ef8a280d1e2e8afb32a7ca32ac1",
        "decimals": 0,
        "description": "A token to support and memorialize nanoergs.",
        "emissionAmount": 1000000000,
        "id": "fbbaac7337d051c10fc3da0ccb864f4d32d40027551e1c3ea3ce361f39b91e40",
        "name": "kushti",
    });
    let result2 = await cli(['ng', 'tokeninfo', "nottokenid"]);
    //console.log(result2)
    expect(JSON.parse(result2.stdout).error).toBe(400);
})

test('Test node get utxos', async () => {
    let result = await cli(['ng', 'utxos', "3WvyPzH38cTUtzEvNrbEGQBoxSAHtbBQSHdAmjaRYtARhVogLg5c", "-t"]);
    expect(JSON.parse(result.stdout)).toBeInstanceOf(Array<ErgoBox>);
    expect(JSON.parse(result.stdout).length).toBeGreaterThan(1);
})

////////////////////////////////////////
//////////////// COMPILE ///////////////
////////////////////////////////////////
test('Test node compile', async () => {
    // get mainnet node height
    let result = await cli(['c', '../tests/test_script.es', "-n"]);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
})
test('Test fleet compile v0', async () => {
    // get mainnet node height
    let result = await cli(['c', '../tests/test_script.es']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "5seLxZkQx9zXcXFkrqdZ",
        "ergotree": "00d1917ea3050580890f",
        "version": 0,
        "segregatedConstants": false
    });
    result = await cli(['c', '../tests/test_script.es', , '-v', '0']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "5seLxZkQx9zXcXFkrqdZ",
        "ergotree": "00d1917ea3050580890f",
        "version": 0,
        "segregatedConstants": false
    });
    result = await cli(['c', '../tests/test_script.es', '-s']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
    result = await cli(['c', '../tests/test_script.es', '-v', '0', '-s']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "8NJusyenj3YS7KvXTPBgwDZJ",
        "ergotree": "10010580890fd1917ea3057300",
        "version": 0,
        "segregatedConstants": true
    });
})
test('Test fleet compile v1', async () => {
    // get mainnet node height
    let result = await cli(['c', '../tests/test_script.es', '-v', '1']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "NjsRYGmJwPQefttxXvBCK",
        "ergotree": "0909d1917ea3050580890f",
        "version": 1,
        "segregatedConstants": false
    });
    result = await cli(['c', '../tests/test_script.es', '-v', '1', '-s']);
    expect(JSON.parse(result.stdout)).toEqual({
        "address": "ZtooZJtgRFqbHCodQNa81n5K9",
        "ergotree": "190c010580890fd1917ea3057300",
        "version": 1,
        "segregatedConstants": true
    });
})

////////////////////////////////////////
//////////// DECODE REGISTER ///////////
////////////////////////////////////////
test('Test decode register', async () => {
    // get mainnet node height
    let result = await cli(['dr', '0580c0fc82aa02']);
    expect(JSON.parse(result.stdout)).toEqual({
        "registerValue": "0580c0fc82aa02",
        "type": "Long",
        "value": 40000000000,
    });
})


function cli(args: any): Promise<any> {
    return new Promise(resolve => {
        exec(`node index.js ${args.join(' ')}`,
            { cwd: BUILT_DIR },
            (error: number, stdout: string, stderr: string) => {
                resolve({
                    error,
                    stdout,
                    stderr
                })
            })
    })
}

