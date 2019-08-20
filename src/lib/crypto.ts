
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
export async function encryptData(str: string, password: string): Promise<{ encrypted: ArrayBuffer }> {
  
  const salt = crypto.getRandomValues(new Uint8Array(20))
  const iv = crypto.getRandomValues(new Uint8Array(20))
  
  const key = await deriveKey(salt, password);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    new TextEncoder().encode(str)
  );
  const encrypted = new Uint8Array(20+20+ciphertext.byteLength) 
  encrypted.set(salt, 0)
  encrypted.set(iv, salt.byteLength)
  encrypted.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength)

  return {
    encrypted: encrypted.buffer,
  }
}

/**
 * Decrypt a peice of data given the encypted data, the salt and the password used to encrypt. 
 * 
 * @param encrypted 
 * @param salt 
 * @param password 
 */
export async function decryptData(encrypted: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  
  const salt = new Uint8Array(encrypted.slice(0, 20))
  const iv = new Uint8Array(encrypted.slice(20, 40)) 
  const ciphertext = new Uint8Array(encrypted.slice(40))
    
  const key = await deriveKey(salt, password)

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    ciphertext
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
      "iterations": 250000,
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