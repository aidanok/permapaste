
import * as ArweaveUtils from 'arweave/web/lib/utils'

/**
 * Encrypt a piece of string data, with a given password.  
 * Password will be passed through a key-stretching function
 * Returns the encrypted data and the salt used. 
 * 
 * @param str the string to encrypt
 * @param password the password.
 * @param userSalt optional user supplied salt. should be something unique.
 */
export async function encryptData(str: string, password: string, userSalt?: Uint8Array): Promise<{ encrypted: ArrayBuffer, salt: Uint8Array }> {
  
  const salt = userSalt ? userSalt : crypto.getRandomValues(new Uint8Array(20));
  
  const key = await deriveKey(salt, password);
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: salt
    },
    key,
    new TextEncoder().encode(str)
  );
  
  return {
    encrypted,
    salt,
  }
}

/**
 * Decrypt a peice of data given the encypted data, the salt and the password used to encrypt. 
 * 
 * @param encrypted 
 * @param salt 
 * @param password 
 */
export async function decryptData(encrypted: ArrayBuffer, salt: Uint8Array, password: string): Promise<ArrayBuffer> {
  
  const key = await deriveKey(salt, password)
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: salt
    },
    key,
    encrypted
  );
  return decrypted
}

/**
 * Derives a 256bit key from salt and password.
 * TODO: use scrypt before PBKDF2 to increase brute-force resistance.
 * 
 * @param salt 
 * @param password 
 */
async function deriveKey(salt: Uint8Array, password: string) {
  
  const rawPasswordKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' } as any, // fails type check. 
    false,
    [ 'deriveBits', 'deriveKey' ]
  )

  return window.crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt: salt,
      "iterations": 100000,
      "hash": "SHA-256"
    },
    rawPasswordKey,
    { "name": "AES-GCM", "length": 256 },
    false,
    [ "encrypt", "decrypt" ]
  );

}


export function generateRandomStrongPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(27))
  return ArweaveUtils.bufferTob64Url(bytes)
}