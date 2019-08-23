import { Paste, PasteContainer, postEncryptedPaste, postPlaintextPaste, EncryptedPasteContainer } from "../lib/pastes";
import LoadedWallet from "./loaded-wallet";
import { arweave } from "../lib/permaweb";
import { TransactionStatusResponse } from "arweave/web/transactions";

export class PasteEditing {
  
  paste: Paste = {
    pasteTitle: '',
    pasteText: '',
    pasteFormat: 'plaintext',
    pastePrivacy: 'public'
  }

  pasteOptions = {
    password: '',
    customUrl: '',
  }

  // Pastes that are pending for the next block, most recent first
  // UNUSED
  pendingPaste: PasteContainer | EncryptedPasteContainer | null = null;
 
  public reset(): void {
    this.paste = {
      pasteTitle: '',
      pasteText: '',
      pasteFormat: 'plaintext',
      pastePrivacy: 'public'
    }
    this.pasteOptions = {
      password: '',
      customUrl: ''
    }
  }

  get isNonEmptyPaste(): boolean {
    return this.paste.pasteText !== ''
  }
  
  get isPasswordOk() {
    return this.paste.pastePrivacy === 'public' || this.pasteOptions.password.length >= 7;
  }

  public async postPaste(loadedWallet: LoadedWallet) {
    if (!loadedWallet.wallet) {
      throw new Error('No wallet')
    }
    
    const result = this.paste.pastePrivacy === 'public' ?
      await postPlaintextPaste(this.paste, loadedWallet.wallet.jwk)
      : 
      await postEncryptedPaste(this.paste, this.pasteOptions, loadedWallet.wallet.jwk)
    this.pendingPaste = result;
    return result;
  }

  // UNUSED
  public async waitForPending(): Promise<TransactionStatusResponse> {
    
    if (!this.pendingPaste) {
      throw new Error('None pending.')
    }
    
    while(true) {
      await new Promise(res => setTimeout(res, 45))
      const status = await arweave.transactions.getStatus(this.pendingPaste.txId);
      // anything other than pending, return. user can check seperately on the final status.
      if (status.status !== 202) {
        this.pendingPaste = null
        return status
      }
    }
  }

}
