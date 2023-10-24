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

    output = await decodeRegister('1a0221025332f61478bf1f561e162a36e25fb6406c67a0a0433bc0b5fbea9fddc3516cb4240008cd039ed9a6df20fca487da2d3b58e822cdcc5bcfad4cca794eadf132afa3113f31a6', {
        text: false,
    })
    expect(output.messages[0].value).toEqual([[2,83,50,-10,20,120,-65,31,86,30,22,42,54,-30,95,-74,64,108,103,-96,-96,67,59,-64,-75,-5,-22,-97,-35,-61,81,108,-76],[0,8,-51,3,-98,-39,-90,-33,32,-4,-92,-121,-38,45,59,88,-24,34,-51,-52,91,-49,-83,76,-54,121,78,-83,-15,50,-81,-93,17,63,49,-90]]);
    expect(output.messages[0].type).toBe("Coll[Coll[Byte]]");
    expect(output.messages[0].hexValue).toEqual(["025332f61478bf1f561e162a36e25fb6406c67a0a0433bc0b5fbea9fddc3516cb4","0008cd039ed9a6df20fca487da2d3b58e822cdcc5bcfad4cca794eadf132afa3113f31a6"]);
});
