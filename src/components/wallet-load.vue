<template>
  <div>
    
    <div v-if="!walletMgr.wallet">
    
      <div class="input-container">
        You will need a wallet loaded to post 
        <input type="file" id="file" @change="onFilesSelected" />
        <label for="file" >Load Wallet</label>
      </div>
    
      <span v-if="status === 'error'">An error occured uploading the wallet</span>
    
    </div>

    <div v-else class="wallet-loaded">
      <h5 @click="unloadWallet"> Wallet Loaded </h5>
      Address: <span> {{ walletMgr.wallet.address }} </span> <br/> 
      Balance: <span> {{ walletMgr.wallet.balance }} </span> <br/>
    </div>

  </div>
</template>

<style scoped>

.input-container {
  display: flex;
  padding: 0em;
  margin-bottom: 1em;
  align-items: center;
  min-height: 6rem;
  justify-content: space-evenly;
}

.wallet-loaded {
  font-size: smaller;
  margin-bottom: 1em;
  min-height: 6rem;
}

.wallet-loaded span {
  font-size: smaller;
}

.wallet-loaded h5 {
  cursor: pointer;
  color: rgb(40,105,40, 1.0);
}

[type="file"] {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
}
 
[type="file"] + label {
  background-color: #4caf4c;
  border-radius: 4rem;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  padding: 1em;
  margin-left: 0.6em;
  white-space: nowrap;
}
  
[type="file"]:focus + label,
[type="file"] + label:hover {
    background-color: #f15d22;
}
  
[type="file"]:focus + label {
  outline: 1px dotted #000;
}

</style>


<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

import { globalStore } from '../lib'


@Component
export default class WalletLoad extends Vue {
  
  status = 'none'
  walletMgr = globalStore.LoadedWallet;
 
  unloadWallet() {
    this.walletMgr.wallet = null;
  }

 
  async onFilesSelected(event: any) {
    try {
      this.status = 'loading'
      const files = event.target.files
      const reader = new FileReader()
      
      // Use FileReaders event interface
      await new Promise((res, rej) => {
        reader.onload = res
        reader.onerror = rej
        reader.readAsText(files[0])
      })

      const jwk = JSON.parse(reader.result as string)
      
      // Clear fileinput dom node.
      event.target.value = ""
      
      await this.walletMgr.loadFromJwk(jwk)
      
      this.status = 'loaded'
      this.$emit('loadsuccess', this.walletMgr.wallet)

    } catch (e) {
      console.error('There was an error reading and parsing the key file')
      event.target.value = ""
      this.walletMgr.wallet = null
      this.status = 'error'
      this.$emit('loaderror')
      throw(e)
    }
    
  }
}

</script> 



