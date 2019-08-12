<template>
  <div>
    <div v-if="!posted">
      <div v-if="editing.paste.pastePrivacy === 'private'">
        
        <p>
          You have chosen to post a <b>private</b> paste. This will be saved 
          encrypted and unreadable on the permaweb unless the user is 
          given the password.
        </p>
        
        <p class="disclaimer">
          <ul>
            <li>This post cannot be taken down, if someone gains access it is permanent! </li>
            <li>This post is not anonymous! It can be tracked to the wallet you used to post it </li>
          </ul>
        </p>
        
        <div>
          <password
            v-model="editing.pasteOptions.password"
            :toggle="true"
            placeholder="Password"
            />
        </div>
      </div>

      <div v-else>
        <p>
        You have chosen to post a <b>public</b> paste. This will be saved
        on the permaweb and public on the blockchain      
        </p>
      </div>
      
      <div class="wallet">
        <wallet-load></wallet-load>
      </div>  
    </div>

    <div class="posted" v-if="posted"> 
      <p>
        Your paste is pending inclusion in the next block. It will be available at
      </p>
      <a :href="postedLink"> {{ postedLink }}</a>
      <p v-if="wasPublic">
      </p>
    </div>
    
    <div v-if="!posted" class="step-footer">
      <button @click="$router.go(-2)" class="secondary-btn">Back to Editing</button>
      <button @click="tryPost" class="ld-ext-right" v-bind:class="{ running: posting }">
        Post to Permaweb
        <div style="color: coral" class="ld ld-ball ld-bounce"></div>
      </button>
    </div>
    
  </div>

</template>

<style scoped>
.posted {
  text-align: center;
  font-size: 0.8em;
  color: rgb(50,50,50);
}
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
</style>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

import { globalStore } from '../app-model'

@Component
export default class PostStep2 extends Vue {

  editing = globalStore.PasteEditing
  posting = false
  posted = false
  error: string[] = []
  postedLink = ''
  wasPublic = false;

  async tryPost() {
    if (this.posted || this.posting) {
      return 
    }
    this.posting = true 
    this.error = []
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
  }

} 

</script>

