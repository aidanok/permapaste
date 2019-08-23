

import LoadedWallet from './loaded-wallet'
import { PasteEditing } from './paste-editing'
import { arweave } from '../lib/permaweb'

/**
 * A store for the apps global state. 
 * 
 * Just use plain typescript objects. 
 * 
 * Vue will pickup changes on these objects and descendents, however
 * computed properties don't work. (they need to be top level properties on a vue vm)
 * 
 * This does break on live-reload sometimes
 * 
 * TODO: see about fixing live-reload problem, probably just by attaching to the
 * root Vue instance/vm, or use mobx.
 */
export const globalStore = {
  LoadedWallet: new LoadedWallet(),
  PasteEditing: new PasteEditing(),
};

// Just for debugging.
(window as any).globalStore = globalStore;
(window as any).arweave = arweave;