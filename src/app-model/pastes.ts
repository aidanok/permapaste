
import { arweave } from './permaweb'
import * as ArweaveUtils from 'arweave/web/lib/utils'
import { encryptData, decryptData } from './crypto'

export const TYPE_TAG = 't_type'
export const FORMAT_TAG = 't_format' 
export const SALT_TAG = 't_salt'
export const TYPE_TAG_PUBLIC = 'P'
export const TYPE_TAG_ENCRYPTED = 'E'
export const TITLE_TAG = 'Title'

export interface Paste {
  pasteTitle: string
  pasteText: string
  pasteFormat: 'markdown' | 'plaintext'
  pastePrivacy: 'public' | 'private'
}

export interface PasteContainer {
  encrypted: false
  txId: string
  paste: Paste
}

export interface EncryptedPasteContainer {
  encrypted: true
  txId: string
  paste: Uint8Array
  salt: string
}

/**
 * Posts some content with Content-Type text/plain 
 * and additional metadata in tags.
 * 
 * @param paste 
 * @param jwk 
 */
export async function postPlaintextPaste(paste: Paste, jwk: any): Promise<PasteContainer> {
  const tx = await arweave.createTransaction({ data: paste.pasteText }, jwk)
  
  tx.addTag(TYPE_TAG, TYPE_TAG_PUBLIC)
  tx.addTag(TITLE_TAG, paste.pasteTitle)
  tx.addTag(FORMAT_TAG, paste.pasteFormat)
  tx.addTag("Content-Type", "text/plain")
  
  await arweave.transactions.sign(tx, jwk)
  const response = await arweave.transactions.post(tx)
  console.log('Tx Post Response:', response)
  return {
    encrypted: false,
    paste,
    txId: tx.id 
  }
}

/**
 * Posts some content encrypted with the given password 
 * Passes the ciphertext as UInt8Array to the arweave api, 
 * Encodes the salt (aslo a UInt8Arrray) as base64url as for tags api.
 * 
 * @param paste 
 * @param pasteOptions 
 * @param jwk 
 */
export async function postEncryptedPaste(paste: Paste,  pasteOptions: { password: string }, jwk: any): Promise<EncryptedPasteContainer> {
  console.info('Encrypting paste and posting')
  const json = JSON.stringify(paste)
  const encrypted = await encryptData(json, pasteOptions.password)
  const salt = ArweaveUtils.bufferTob64Url(encrypted.salt);
  
  console.log(encrypted.encrypted)
  console.log(encrypted.salt)
  
  const data = new Uint8Array(encrypted.encrypted)
  
  console.log(data)

  const tx = await arweave.createTransaction({ 
    data: data
  }, jwk)
  tx.addTag(TYPE_TAG, TYPE_TAG_ENCRYPTED)
  tx.addTag(SALT_TAG, salt)
  
  console.log('SIGNING')
  await arweave.transactions.sign(tx, jwk)
  console.log(tx)
  const response = await arweave.transactions.post(tx)
  console.debug('Tx Post Response:', response)

  return {
    encrypted: true,
    paste: data,
    salt,
    txId: tx.id
  }
}

export async function decryptPasteContainer(container: EncryptedPasteContainer, password: string): Promise<PasteContainer> {
  const dec = await decryptData(container.paste, ArweaveUtils.b64UrlToBuffer(container.salt), password)
  return {
    encrypted: false,
    paste: JSON.parse(new TextDecoder().decode(dec)),
    txId: container.txId
  }
}

export async function getPaste(txId: string): Promise<PasteContainer | EncryptedPasteContainer> {
  
  const tx = await arweave.transactions.get(txId)

  const tags = tx.tags.map(tag => ({ name: ArweaveUtils.b64UrlToString(tag.name), value: ArweaveUtils.b64UrlToString(tag.value) }))
  
  const saltTag = tags.find(x => x.name === SALT_TAG)
  const formatTag = tags.find(x => x.name === FORMAT_TAG) 
  const titleTag = tags.find(x => x.name === TITLE_TAG)

  if (!saltTag) {
    return {
      encrypted: false,
      paste: {
        pasteText: ArweaveUtils.b64UrlToString(tx.data),
        pasteFormat: (formatTag && formatTag.value == 'markdown') ? 'markdown' : 'plaintext',
        pastePrivacy: saltTag ? 'private' : 'public',
        pasteTitle: (titleTag && titleTag.value) || ''
      },
      txId: tx.id
    }
  }
  else {
    return {
      encrypted: true,
      paste: tx.get('data', { decode: true, string: false }),
      salt: saltTag.value,
      txId: tx.id
    }
  }
}

