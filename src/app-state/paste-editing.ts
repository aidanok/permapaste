import { Paste, PasteContainer, postEncryptedPaste, postPlaintextPaste, EncryptedPasteContainer } from "../lib/pastes";
import LoadedWallet from "./loaded-wallet";
import { arweave } from "../lib/permaweb";
import { TransactionStatusResponse } from "arweave/web/transactions";


const defaultMarkdown = 
`Markdown Document
====================

This would be an intro paragraph with a H1 header

Another section
---------------

- GitHub Flavored Markdown 
- Simple and quick

**Replace** this __content__ with your *own!* 

1. One
2. Two
3. Three

> Go ! - *template text 2019*

\`console.log('done');\`
`

export class PasteEditing {
  
  paste: Paste = {
    pasteTitle: '',
    pasteText: defaultMarkdown,
    pasteFormat: 'markdown',
    pastePrivacy: 'secretpass'
  }

  pasteOptions = {
    password: '',
  }

  // Pastes that are pending for the next block, most recent first
  // UNUSED. 
  pendingPaste: PasteContainer | EncryptedPasteContainer | null = null;
 
  public reset(): void {
    this.paste = {
      pasteTitle: '',
      pasteText: defaultMarkdown,
      pasteFormat: 'plaintext',
      pastePrivacy: 'secretpass'
    }

    this.pasteOptions = {
      password: '',
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
