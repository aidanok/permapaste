<template>
  <div>
    <div class="header">
      
      <perma-paste-logo style="padding-top: 0.4rem; padding-right: 0.3em;"></perma-paste-logo>
      <find-pastes-link></find-pastes-link>
      
    </div>
    
    <div v-if="loaded && paste">
    
      <vue-simple-markdown v-if="paste.pasteFormat === 'markdown'" class="markdown-content" :source="paste.pasteText">
      </vue-simple-markdown>
      
      <pre v-else> {{ paste.pasteText }} </pre>
    
    </div>
    
    <div class="unlock-screen" v-if="loaded && encrypted && !paste"> 
      <p> This paste is locked </p>
      <input v-on:keyup.enter="unlock" type=password placeholder="Enter password" v-model="password">
    </div>
    
    <div v-if="!loaded && !errors.length" class="ld ll">
      <div class="ld ld-ball ld-bounce">
      </div>
      <p>
        {{ isPending ? 'TX is pending inclusion in the next block, please wait.' : 'Loading...' }}
      </p>
    </div>

    <div v-if="!loaded && errors.length">
      <p> Unable to load ( {{ errors[0] }} )</p>
    </div>

  </div>
</template>


<style scoped>

.header {
  display: flex;
  justify-content: flex-end;
  padding: 0em 1em;
}

p {
  margin-top: 2rem;
  font-size: 0.7rem;
  color: #666;
  text-align: center;
}

.ld {
  margin: auto;
  margin-top: 2rem;
  font-size: 2rem;
  text-align: center;
  color: coral;
}

.unlock-screen {
  margin-top: 2em;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

</style>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { getPaste, decryptPasteContainer, Paste, PasteContainer, EncryptedPasteContainer } from '../app-model/pastes'

// qGpB9P6jRYL96Ycy-Irzu3Pi8P-29O8aM7_yZzHIEqM

@Component
export default class extends Vue {

  encrypted: EncryptedPasteContainer | null = null 
  paste: Paste | null = null
  loaded = false
  password = '' 
  unlocking = false 
  errors: string[] = []
  isPending = false

  @Prop()
  txId!: string

  created() {
    this.loadPaste(this.txId)
  }

  @Watch('paste')
  onPasteChanged(val: Paste | null) {
    if (val && val.pasteTitle) {
      document.title = val.pasteTitle
    }
  }  

  async loadPaste(txId: string) {
    // must always set 'loaded' true or put something in errors.
    this.loaded = false
    this.isPending = false
    console.log('Getting paste with txId:' + txId)
    
    let container: EncryptedPasteContainer | PasteContainer | undefined

    // Loop on pending, otherwise break.
    while(true) {
      try {
        container = await getPaste(txId)
        break;
      } catch(e) {
        if (e.type !== 'TX_PENDING') {
          this.errors.push(e.message || e.type)
          break;
        } else {
          console.info('TX_PENDING, Will Retry')
          this.isPending = true;
          await new Promise(res => setTimeout(res, 57000))
        }
      }
    }

    if (container) {
      if (container.encrypted) {
        this.encrypted = container
      }
      else {
        this.paste = container.paste
      }
      this.loaded = true
    }

  }

  async unlock() {
    this.unlocking = true
    this.errors = []
    if (!this.password) {
      this.errors.push('Password is required')
    } else {
      try {
        const unlocked = await decryptPasteContainer(this.encrypted!, this.password)
        this.paste = unlocked.paste
      } 
      catch (e) {
        this.errors.push('Unable to unlock. Incorrect password')
      }
    }

    if (this.errors.length) {
      window.alert(this.errors.join('\n'))
    }
    this.unlocking = false
  }

}

</script>
