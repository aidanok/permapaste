
import { arweave } from '../lib/permaweb'

export interface Wallet {
  jwk: object
  address: string
  balance: string 
}

export default class LoadedWallet {

  public wallet: null | Wallet = null

  async loadFromJwk(jwk: any) {
    const address = await arweave.wallets.jwkToAddress(jwk)
    const winstonBalance = await arweave.wallets.getBalance(address)
    const balance = arweave.ar.winstonToAr(winstonBalance)
    this.wallet =  { address, balance, jwk }
    console.info(`Wallet ${address} loaded succesfully, balance: ${balance}`)
  }
}