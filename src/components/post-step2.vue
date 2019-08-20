<template>
  <div>
    <div>
      <div v-if="editing.paste.pastePrivacy === 'private'">
        
        <p>
          You have chosen to post a <b>private</b> paste. This will be saved 
          encrypted and unreadable on the Arweave blockchain unless the user is 
          given the URL & password.
        </p>

        <p>
          This paste will have no metadata identifying it as an encrypted paste. It will be a data transaction from 
          the given wallet with a sequence of random bytes as the payload.
        </p>
        
        <p class="disclaimer">
          <ul>
            <li>This post cannot be taken down, if someone gains access it is permanent! </li>
            <li>This post is not anonymous! It can be tracked to the wallet and IP you used to post it </li>
          </ul>
        </p>
        
        <div class="password-box">
          
           <password
            v-model="editing.pasteOptions.password"
            :toggle="true"
            placeholder="Password (Optional)"
            />
            
        </div>
      </div>

      <div v-else>
        <p>
        You have chosen to post a <b>public</b> paste. This will be saved
        on the Arweave blockchain and accessible to anyone.      
        </p>
      </div>
      
      <div class="wallet">
        <wallet-load></wallet-load>
      </div>  
    </div>

    
    <div class="step-footer">
      <button @click="$router.go(-2)" class="secondary-btn">Back to Editing</button>
      <button @click="tryPost" class="ld-ext-right" v-bind:class="{ running: posting }">
        Post to Permaweb
        <div style="color: coral" class="ld ld-ball ld-bounce"></div>
      </button>
    </div>
    
  </div>

</template>

<style scoped>


.disclaimer {
  font-size: 0.76em;
  color: rgb(70, 5, 5, 1);
  background-color: rgb(240, 50, 50, 0.3);
  border-radius: 4px;
  padding: 0.7em;
  line-height: 1.6em;
}
.wallet {
  padding: 0em 0em;
}
.step-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5em;
}

</style>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

import { globalStore } from '../app-model'
import { generateRandomStrongPassword } from '../app-model/crypto'

@Component
export default class PostStep2 extends Vue {

  editing = globalStore.PasteEditing
  posting = false
  posted = false
  error: string[] = []
  postedLink = ''
  wasPublic = false;
  wasGeneratedPw = false;

  async tryPost() {
    if (this.posted || this.posting) {
      return
    }
    this.posting = true
    this.error = []
    
    // Generate a password if none given, it will be appended to the url.
    if (!this.editing.pasteOptions.password) {
      this.editing.pasteOptions.password = generateRandomStrongPassword()
      this.wasGeneratedPw = true;
    }
   
   if (!globalStore.PasteEditing.isNonEmptyPaste) {
      this.error.push('You cant post an empty paste!')
    }
    else if (!globalStore.PasteEditing.isPasswordOk) {
      this.error.push('You must specify a password of at least 7 characters.')
    }
    else if (!globalStore.LoadedWallet.wallet) {
      this.error.push('You must load a wallet.')
    } else {
      try {
        const posted = await globalStore.PasteEditing.postPaste(globalStore.LoadedWallet)
        // make link. 
        this.postedLink = `${window.location.protocol}//${window.location.host}/#/view/${posted.txId}`
        if (this.wasGeneratedPw) {
          this.postedLink += `/${globalStore.PasteEditing.pasteOptions.password}`
        }
        this.posted = true;
        this.wasPublic = globalStore.PasteEditing.paste.pastePrivacy === 'public'
        this.editing.reset();
      } catch (e) {
        this.error.push(e.message || e.type);
      }
    }
    if (this.error.length > 0) {
      window.alert(this.error.join('\n'))
    }
    this.posting = false;
    if (this.posted) {
      (this as any).$router.push({ path: '/paste/finished', query: { postedLink: this.postedLink, wasGeneratedPw: this.wasGeneratedPw, wasPublic: this.wasPublic }}) 
    }
  }

} 

</script>

