<template>
  <div>
    <div class="header">
      <perma-paste-logo></perma-paste-logo>
    </div>

    <div class="content">
   
      <section class="search-input-section">
        <form class="search-input-form">
          <input placeholder="Wallet Address" id="walletAddrInput" type=text v-model="walletAddr"/>
          <button class="secondary-btn" @click="searchByWallet">Search</button>
        </form>
        <form class="search-input-form">
          <input placeholder="Block Number" id="blockInput" type=text v-model="blockHeight"/>
          <button class="secondary-btn" @click="searchByBlock">Search</button>
        </form>
      </section>

      <section> 

        <div v-if="searching" class="ld ll results-text"> 
          Searching <br/>
          <div style="color: coral; font-size: 2rem; margin: 1em;" class="ld ld-ball ld-bounce">
          </div>
        </div>

        <div v-else> 

          <p class="results-text" v-if="searched === ''">
            Search by wallet or by block number to find previous pastes
          </p>

          <p class="results-text" v-if="searched !== '' && errors.length == 0 && totalResultCount > 0" >
            Results for {{ searched }} {{ searched === 'wallet' ? walletAddr : blockHeight }}
          </p>

          <p class="results-text" v-if="searched !== '' && errors.length == 0 && totalResultCount === 0">
            No Results
          </p>
          
          <div class="results-box" v-if="publicPastes.length > 0"> 
            <p>Found Public Pastes</p>
            <table>
              <tr>
                <th>Block</th><th>TX</th><th>Title</th>
              </tr>
              <tr v-for="(result, index) in publicPastes" :key="index">
                <td> {{ result.status.confirmed.block_height }} </td>
                <td> <router-link v-bind:to="'/view/' + result.id"> {{ result.id }} </router-link> </td>
                <td> {{ result.title }} </td>
              </tr>
            </table>
          </div>
      
          <div class="results-box" v-if="possibleEncryptedPastes.length > 0">
            <p>Found potential Encrypted Pastes</p>
            <table>
              <tr>
                <th>Block</th><th>TX</th>
              </tr>
              <tr v-for="(result, index) in possibleEncryptedPastes" :key="index">
                <td> {{ result.status.confirmed.block_height }} </td>
                <td> <router-link v-bind:to="'/view/' + result.id"> {{ result.id }} </router-link> </td>
              </tr>
            </table>
          </div>

          <p class="results-errors" v-if="errors.length > 0">
            {{ errors[0] }}
          </p>
        </div>

      </section>

    </div>

  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Paste, TYPE_TAG, TYPE_TAG_PUBLIC, TITLE_TAG } from '../lib/pastes'
import { arweave, isValidWalletAddr, ArqlExtraResult, txExtra } from '../lib/permaweb'

@Component
export default class extends Vue {

  walletAddr: string = ''
  blockHeight: string = ''
  
  searching = false;
  searched: 'block' | 'wallet' | ''  = ''

  allTxs: ArqlExtraResult[] = [] 
  publicPastes: (ArqlExtraResult & { title?: string })[] = []

  errors: string[] = [];

  async searchByWallet() {
    this.searching = true;
    this.searched = 'wallet'
    this.allTxs = []
    this.publicPastes = []
    this.errors = []
    const val = this.walletAddr.trim()
    try {
      this.allTxs = await txExtra(await arweave.arql({ op: "equals", expr1: "from", expr2: val }))
      this.publicPastes = this.allTxs.filter(tx => tx.tags.find(t => t.name === TYPE_TAG && t.value === TYPE_TAG_PUBLIC))
      this.fillTitles()
    }
    catch (e) {
      console.error(e)
      this.errors.push(e.message || e.text || e.statusText || e.status)
    }
    this.searching = false;
  }

  async searchByBlock() {
    
    this.searching = true
    this.searched = 'block'
    this.allTxs = []
    this.publicPastes = []
    this.errors = []

    const val = Number(this.blockHeight)

    if (Number.isNaN(val)) {
      this.errors.push('Invalid Block Number')
      this.searching = false;
      return
    }

    try {
      const block = await arweave.api.get(`/block/height/${val}`).then(x => x.data)
      if (typeof block === 'string') {
        this.errors.push(block) // error (block not found)
      }
      else if (!block.txs) {
        this.errors.push('Invalid block')
      }
      else {
        // Get extra metadata and extract out public pastes.
        this.allTxs = await txExtra(block.txs)
        this.publicPastes = this.allTxs.filter(tx => tx.tags.find(t => t.name === TYPE_TAG && t.value === TYPE_TAG_PUBLIC))
        this.fillTitles()
      }
    }
    catch (e) {
      console.error(e)
      this.errors.push(e.message || e.text || e.statusText || e.status)
    }
    this.searching = false;
  }

  fillTitles() {
    this.publicPastes.forEach(pp => { 
      console.log(pp.tags)
      pp.title = ( 
        pp.tags.filter(x => x.name === TITLE_TAG).map(x => x.value)[0] 
        || 
        'Untitled'
      )

    })
  }

  // Vue computed properties, will update whenever allTxs changes.
  get possibleEncryptedPastes(): ArqlExtraResult[] {
    return this.allTxs.filter(
      tx => tx.tags.length == 0
    ) 
  }

  get totalResultCount(): number {
    return this.possibleEncryptedPastes.length + this.publicPastes.length
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

.content {
  max-width: 600px;
  margin-top: 1em;
  margin-left: 5px;
  margin-right: 5px;
}
.search-input-section {
  margin-bottom: 3rem;
}
.search-input-form {
  display: flex;
  align-items: stretch;
  justify-items: stretch
}
.search-input-form input {
  flex-grow: 1
}
.search-input-form button {
  margin-left: 0.15em;
  padding: 0.5em;
}

.results-text {
  margin-top: 2em;
  text-align: center;
  font-size: 0.8em;
  color: rgb(70, 70, 70)
}
.results-errors {
  text-align: center;
  font-size: 0.85em;
  color: rgb(233, 1, 1);
  padding: 0.7em;
  line-height: 1.6em;
}
.results-box {
  font-size: 0.9em;
  margin-top: 1.5rem;
  text-align: left;
  padding: 0.3em;
}
.results-box p {
  margin: 0;
  margin-bottom: 1rem;
}
table {
  background: white;
  width: 100%;
  font-size: 0.9em;
  border-collapse: collapse;
}
th, td {
  border-bottom: 1px solid #ddd;
  text-align: left;
}
th {
  color: rgb(30, 30, 30);
}

</style>