
/**
 * Just exports a shared arweave instance and any helper methods 
 * related directly to arweave.
 */

import Arweave from 'arweave/web';

import Transaction from 'arweave/web/lib/transaction';
import ArweaveError, { ArweaveErrorType } from 'arweave/web/lib/error'
import * as util from 'util'
import { TransactionStatusResponse } from 'arweave/web/transactions';

export const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

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

mockArweavePost()