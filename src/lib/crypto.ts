
import scrpyt from 'scrypt-async'
import * as ArweaveUtils from 'arweave/web/lib/utils' // for base64url utils


/**
 * Encrypt a piece of string data, with a given password.  
 * Password will be passed through a key-stretching function
 * 
 * The returned ArrayBuffer is laid out with a 
 * 20 byte salt value and 20 byte random IV followed 
 * by the ciphertext
 * 
 * _______________________________
 * 0         20     40
 * [ SALT ] [ IV ] [ CIPHERTEXT ]
 * 
 * @param str the string to encrypt
 * @param password the password
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
 * Decrypt a peice of data given the encypted data & password
 * 
 * @param encrypted 
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
 * 
 * Uses scrypt with N = 2^15  R = 8, P = 3 and follows that 
 * with the browsers PBKDF2 set at 250,000 iterations.
 *  
 * @param salt 
 * @param password 
 */
async function deriveKey(salt: Uint8Array, password: string) {

  // we use the first 12 bytes of the salt for the scrypt phase, 
  // and then we do a standard PBKDF2 phase using the remaining 8 bytes from the 
  // salt and the key produced from scrypt. 
  
  const key1 = await scryptPromise(password.normalize('NFKC'), salt.slice(0, 12))
  
  const rawPasswordKey = await window.crypto.subtle.importKey(
    'raw',
    key1,
    { name: 'PBKDF2' } as any, // fails type check. 
    false,
    [ 'deriveBits', 'deriveKey' ]
  )

  return window.crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt: salt.slice(12, 20),
      "iterations": 250000,
      "hash": "SHA-256"
    },
    rawPasswordKey,
    { "name": "AES-GCM", "length": 256 },
    false,
    [ "encrypt", "decrypt" ]
  );

}

// Wraps scrypt-async as promise and sets parameters
// N increased to 2^16 (from default of 2^14) and P increased from 1 to 2 
// Ideally we would increase N more, but this causes clients with low memory to 
// fail (mobiles). Increasing P from 1 to 2 doubles the CPU time needed.  

// Memory requirements for N: 
// 2^14 : 16MB 
// 2^15 : 32MB
// 2^16 : 64MB
// 2^17 : 128MB 
// 2^18 : 256MB - what keybase warp wallet uses
// 2^19 : 512MB - chrome mobile throws errors trying to use this amount

function scryptPromise(password: string, salt: Uint8Array, { NPOW = 16, P = 2, R = 8 } = {}): Promise<Uint8Array> {
  
  // scrypt-async typings are incorrect so we need a few 'as any' 
  return new Promise((res, rej) => {
    scrpyt(password as any, salt as any, {  N: Math.pow(2, NPOW),
      r: R,
      p: P,
      dkLen: 256,
      interruptStep: 200,
      encoding: 'binary'}, (result: any) => {
        if (result && result instanceof Uint8Array) {
          res(result)
        }
        rej('scrypt failed')
      })
  })
}

export function generateRandomStrongPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(27))
  return ArweaveUtils.bufferTob64Url(bytes)
}