<template>
  <div>
    <div class="header">
      <perma-paste-logo></perma-paste-logo>
    </div>

    <label for="walletAddrInput">Wallet Address</label>
    <input id="walletAddrInput" type=text v-model="walletAddr"/>

    <ul>
      <li v-for="(result, index) in possibleEncryptedPastes" :key="index"> 
        {{ result }}
      </li>
    </ul>

  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Paste, TYPE_TAG, TYPE_TAG_PUBLIC } from '../lib/pastes'
import { arweave, isValidWalletAddr } from '../lib/permaweb'

@Component
export default class extends Vue {

  walletAddr: string = ''
  
  allTxs: string[] = []
  publicPastes: string[] = []

  @Watch('walletAddr')
  async onWalletAddrChange(val: string) {
    val = val.trim()
    if (isValidWalletAddr(val)) {
      console.info(`Getting TXs for ${val}`)
      await Promise.all([
        arweave.arql({ op: "equals", expr1: "from", expr2: val })
        .then(results => {
          this.allTxs = results
        }),
        arweave.arql({ op: "equals", expr1: TYPE_TAG, expr2: TYPE_TAG_PUBLIC })
        .then(results => {
          this.publicPastes = results
        })
      ])
    }
  }

  get possibleEncryptedPastes(): string[] {
    return this.allTxs.filter(x => this.publicPastes.indexOf(x) === -1)
  }

}

</script>

<style scoped>
.header {
  background: rgba(240,240,210,1);
  display: flex;
  justify-content: start;
  padding: 0.5em;
}
</style>