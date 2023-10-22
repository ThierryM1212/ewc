import { encrypt, decrypt, hashSHA256 } from "./crypto";


test('crypto - 0', async () => {
    const ref = 'coucou', pass = 'secret';
    const encrypted = encrypt(Buffer.from(ref), pass)
    expect(decrypt(encrypted, pass)).toBe(ref);

})

test('crypto - 1', async () => {
    const hash = hashSHA256('123abc')
    expect(hash).toBe("94bab7f22b92278ccab46e15da43a9fb8b079c05fa099d4134c6c39bbcee49f6");

})