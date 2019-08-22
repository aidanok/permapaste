
import { arweave } from './permaweb'
import * as ArweaveUtils from 'arweave/web/lib/utils'
import { encryptData, decryptData } from './crypto'

export const TYPE_TAG = 'PermaPasteType'
export const TYPE_TAG_PUBLIC = 'P'
export const FORMAT_TAG = 'PermaPasteFormat' 
export const TITLE_TAG = 'Title'
export const DATE_DD_TAG = "DateDD"
export const DATE_MM_TAG = "DateMM"
export const DATE_YYYY_TAG = "DateYYYY" // 4 digit year

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
}

/**
 * Posts some content with Content-Type text/plain 
 * and additional metadata in tags.
 * 
 * @param paste
 * @param jwk
 */
export async function postPlaintextPaste(paste: Paste, jwk: any): Promise<PasteContainer> {
  console.info('Posting plaintext paste')
  
  const tx = await arweave.createTransaction({ data: paste.pasteText }, jwk)
  const time = new Date()

  tx.addTag(TYPE_TAG, TYPE_TAG_PUBLIC)
  tx.addTag(TITLE_TAG, paste.pasteTitle)
  tx.addTag(FORMAT_TAG, paste.pasteFormat)
  tx.addTag(DATE_DD_TAG, time.getDate().toString())
  tx.addTag(DATE_MM_TAG, time.getMonth().toString())
  tx.addTag(DATE_YYYY_TAG, time.getFullYear().toString())
  tx.addTag("Content-Type", "text/plain")
  
  await arweave.transactions.sign(tx, jwk)
  await arweave.transactions.post(tx)
  return {
    encrypted: false,
    paste,
    txId: tx.id 
  }
}

/**
 * Posts some content encrypted with the given password 
 * Passes the ciphertext as UInt8Array to the arweave api
 * 
 * @param paste 
 * @param pasteOptions 
 * @param jwk 
 */
export async function postEncryptedPaste(paste: Paste,  pasteOptions: { password: string }, jwk: any): Promise<EncryptedPasteContainer> {
  console.info('Encrypting paste and posting')
  const json = JSON.stringify(paste)
  const encrypted = await encryptData(json, pasteOptions.password)
  const data = new Uint8Array(encrypted.encrypted)
  
  const tx = await arweave.createTransaction({ 
    data: data
  }, jwk)
  
  await arweave.transactions.sign(tx, jwk)
  await arweave.transactions.post(tx)
 
  return {
    encrypted: true,
    paste: data,
    txId: tx.id
  }
}

export async function decryptPasteContainer(container: EncryptedPasteContainer, password: string): Promise<PasteContainer> {
  const dec = await decryptData(container.paste, password)
  return {
    encrypted: false,
    paste: JSON.parse(new TextDecoder().decode(dec)),
    txId: container.txId
  }
}

export async function getPaste(txId: string): Promise<PasteContainer | EncryptedPasteContainer> {
  
  const tx = await arweave.transactions.get(txId)

  const tags = tx.tags.map(tag => ({ name: ArweaveUtils.b64UrlToString(tag.name), value: ArweaveUtils.b64UrlToString(tag.value) }))
  
  const formatTag = tags.find(x => x.name === FORMAT_TAG) 
  const titleTag = tags.find(x => x.name === TITLE_TAG)

  if (formatTag) {
    return {
      encrypted: false,
      paste: {
        pasteText: ArweaveUtils.b64UrlToString(tx.data),
        pasteFormat: (formatTag && formatTag.value == 'markdown') ? 'markdown' : 'plaintext',
        pastePrivacy: 'public',
        pasteTitle: (titleTag && titleTag.value) || ''
      },
      txId: tx.id
    }
  }
  else {
    return {
      encrypted: true,
      paste: tx.get('data', { decode: true, string: false }),
      txId: tx.id
    }
  }
}

