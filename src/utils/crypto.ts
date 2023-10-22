import * as crypto from "crypto";
const algorithm: string = 'aes-256-ctr';

export const encrypt = (buffer: Buffer, key: string) => {
    let hashedKey = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    // Create an initialization vector
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, hashedKey, iv);
    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]).toString('base64');
    return result;
};

export const decrypt = (encryptedB64: string, key: string) => {
    let encrypted = Buffer.from(encryptedB64, 'base64');
    let hashedKey = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
   // Get the iv: the first 16 bytes
   const iv = encrypted.slice(0, 16);
   // Get the rest
   encrypted = encrypted.slice(16);
   // Create a decipher
   const decipher = crypto.createDecipheriv(algorithm, hashedKey, iv);
   // Actually decrypt it
   const result = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
   return result;
};

export function hashSHA256(strHex: string) {
    return crypto.createHash('sha256').update(strHex, "hex").digest('hex');
}
