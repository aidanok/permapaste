
/**
 * Just exports a shared arweave instance and any helper methods 
 * related directly to arweave.
 */

import Arweave from 'arweave/web';
import * as ArweaveUtils from 'arweave/web/lib/utils'

import Transaction from 'arweave/web/lib/transaction';
import ArweaveError, { ArweaveErrorType } from 'arweave/web/lib/error'
import * as util from 'util'
import { TransactionStatusResponse } from 'arweave/web/transactions';

export const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

export function isValidWalletAddr(str: string): boolean {  
  return str.length === 43
}

export interface ArqlExtraResult { id: string, tags: { name: string, value: string }[], status: TransactionStatusResponse }

export async function txExtra(results: string[]) {
  
  const resultsExtra: ArqlExtraResult[] = []
  // do this sequentially so we dont fire off too many requests at a time. 
  // retries forever..
  for (var i = 0; i < results.length; i++) {
    let delay = 650;
    while(true) {
      try {
        const { tags, status } = await getTxMetadata(results[i])
        resultsExtra.push({ id: results[i], tags, status }) 
        break; // break loop.
      }
      catch (e) {
        console.error(e)
        console.error(`Got error retrieving tx metadata, will retry`)
        await new Promise(res => setTimeout(res, Math.max(40000, delay*=2)))
      }
    }
  }  
  return resultsExtra
}

export async function getTxMetadata(id: string) {
  const [ encodedTags, status ] = await Promise.all([
    arweave.api.get(`/tx/${id}/tags`).then(x => x.data),
    arweave.transactions.getStatus(id)
  ])
  const tags: { name: string, value: string }[] = encodedTags.map((x: any) => ({
    name: ArweaveUtils.b64UrlToString(x.name),
    value: ArweaveUtils.b64UrlToString(x.value)
  }))

  return { tags, status }
}



// mocks post() and get() to not actually write to 
// permaweb but to an in-memory list.
// Simulates TX_PENDING / 202 errors for 1 minute after a tx is posted.
function mockArweavePost() {
  console.info('Mocking Arweave post() and get()')
  const posted: Record<string, { tx: any, time: number }> = {}
  let id = 0
  
  arweave.transactions.post = async function (tx: Transaction): Promise<any> {
    tx.id = `mock_id_${id++}`
    posted[tx.id] = {
      time: new Date().getTime() + 1000 * 60,
      tx: tx
    }
    console.log('MOCK stored tx', tx.id)
    console.log(util.inspect(tx))
    await new Promise(res => setTimeout(res, 1200))
    return {};
  }

  arweave.transactions.get = async function get(id: string): Promise<Transaction> {
    // ArweaveErrorType is not available to us due to it being a const enum
    
    if (!posted[id]) {
      var e = new Error('Not Found');
      (e as any).type = "TX_NOT_FOUND"
      throw(e)
    }
    if (posted[id].time > new Date().getTime()) {
      var e = new Error('Pending');
      (e as any).type = "TX_PENDING";
      throw(e)
    }
    console.log('MOCK get tx', id)
    return posted[id].tx
  }

  arweave.transactions.getStatus = async function get(id: string): Promise<TransactionStatusResponse> {
    if (!posted[id]) {
      return { status: 404, confirmed: null }
    }
    if (posted[id].time > new Date().getTime()) {
      return { status: 202, confirmed: null }
    }
    return { status: 200, confirmed: null }
  }
}

// mockArweavePost()