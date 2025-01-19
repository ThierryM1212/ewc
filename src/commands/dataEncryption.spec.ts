import JSONBigInt from 'json-bigint';
import { CommandOutput } from './EWCCommand';
import { encryptData, decryptData } from './dataEncryption';
import { newWalletCommand } from './newWalletCommand';



test('Test encrypt data utf8', async () => {
    const output0: CommandOutput = await newWalletCommand({
            name: 'test124',
            password: "test124",
            force: true,
            passphrase: "",
            strength: '24',
            mnemonic: "debate emerge upgrade crouch kiwi deliver misery chalk aspect goose ordinary guide truth speed inform tomato pistol beyond carbon list aisle casual picture junk",
            testNet: false
        })

    let outputEncrypt: CommandOutput = await encryptData('test', '9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV', {
        utf8Text: true,
    })
    expect(outputEncrypt.messages[0].clearTextValue).toEqual('test');
    //expect(output.messages[0].hexEncryptedValue).toEqual('047d78e84703c5e77558b0c94bbe2332e3ee4d03b135b06365de359071c0556979831b9286ddff018cefe3126dc4458e01f63d93103367ad775319cf10ec6b3212c8c481212f876dbda585f349464b4368adf43e5319b27142bed59daf1c5661c9b9c397ea');
    expect(outputEncrypt.messages[0].address).toEqual('9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV');
    expect(outputEncrypt.messages[0].isUTF8string).toEqual(true);

    let ouputDecrypt: CommandOutput = await decryptData(outputEncrypt.messages[0].hexEncryptedValue, 'test124', '9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV', 'test124', {
        utf8Text: true,
    })
    expect(ouputDecrypt.messages[0].decryptedHex).toEqual("74657374");
    expect(ouputDecrypt.messages[0].decryptedUtf8).toEqual("test");
    expect(ouputDecrypt.messages[0].address).toEqual('9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV');
    expect(ouputDecrypt.messages[0].isUTF8string).toEqual(true);

});

test('Test encrypt data hex', async () => {
    const output0: CommandOutput = await newWalletCommand({
            name: 'test124',
            password: "test124",
            force: true,
            passphrase: "",
            strength: '24',
            mnemonic: "debate emerge upgrade crouch kiwi deliver misery chalk aspect goose ordinary guide truth speed inform tomato pistol beyond carbon list aisle casual picture junk",
            testNet: false
        })

    let outputEncrypt: CommandOutput = await encryptData('74657374', '9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV', {
        utf8Text: false,
    })
    expect(outputEncrypt.messages[0].clearTextValue).toEqual('74657374');
    //expect(output.messages[0].hexEncryptedValue).toEqual('047d78e84703c5e77558b0c94bbe2332e3ee4d03b135b06365de359071c0556979831b9286ddff018cefe3126dc4458e01f63d93103367ad775319cf10ec6b3212c8c481212f876dbda585f349464b4368adf43e5319b27142bed59daf1c5661c9b9c397ea');
    expect(outputEncrypt.messages[0].address).toEqual('9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV');
    expect(outputEncrypt.messages[0].isUTF8string).toEqual(false);

    let ouputDecrypt: CommandOutput = await decryptData(outputEncrypt.messages[0].hexEncryptedValue, 'test124', '9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV', 'test124', {
        utf8Text: false,
    })
    expect(ouputDecrypt.messages[0].decryptedHex).toEqual("74657374");
    expect(ouputDecrypt.messages[0].decryptedUtf8).toEqual("");
    expect(ouputDecrypt.messages[0].address).toEqual('9hKDC4hjJTaVR22ZMwRqBhWrw9dz8ZiKZPzdR7vGHRPp2R1JCrV');
    expect(ouputDecrypt.messages[0].isUTF8string).toEqual(false);
    expect(ouputDecrypt.messages[0].registerValue).toEqual("0e0474657374");

});