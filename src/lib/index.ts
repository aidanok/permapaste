

import LoadedWallet from './loaded-wallet'
import { PasteEditing } from './paste-editing'
import { arweave } from './permaweb'

export const globalStore = {
  LoadedWallet: new LoadedWallet(),
  PasteEditing: new PasteEditing(),
};

// Just for debugging.
(window as any).globalStore = globalStore;
(window as any).arweave = arweave;