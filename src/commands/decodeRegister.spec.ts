import JSONBigInt from 'json-bigint';
import { CommandOutput } from './EWCCommand';
import { decodeRegister } from './decodeRegister';


test('Test register decode 0', async () => {
    let output: CommandOutput = await decodeRegister('0580c0fc82aa02', {
        text: false,
    })
    expect(output.messages[0].value).toEqual(BigInt(40000000000));
    expect(output.messages[0].type).toBe("Long");
    expect(output.messages[0].registerValue).toBe("0580c0fc82aa02");
    expect(output.error).toBe(false);

    output = await decodeRegister('0e0954657374546f6b656e', {
        text: false,
    })
    expect(output.messages[0].value).toEqual([84, 101, 115, 116, 84, 111, 107, 101, 110]);
    expect(output.messages[0].utf8Value).toBe("TestToken");
    expect(output.messages[0].type).toBe("Coll[Byte]");
    expect(output.error).toBe(false);

    output = await decodeRegister('1a0203010203020a14', {
        text: false,
    })
    expect(output.messages[0].value).toEqual([[1, 2, 3], [10, 20]]);
    expect(output.messages[0].type).toBe("Coll[Coll[Byte]]");

    output = await decodeRegister('error', {
        text: false,
    })
    expect(output.error).toBe(true);
    expect(output.messages[0].includes("invalid length 5 of Hex data")).toBe(true);
});
