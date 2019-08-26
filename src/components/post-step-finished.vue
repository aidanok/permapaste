<template>
   <div class="posted"> 
      <p>
        Your paste is pending inclusion in the next block.
      </p>
      <a :href="postedLink"> {{ postedLink }}</a> 
      
      <!-- Secret URL text --> 
      <p v-if="!wasPublic && wasGeneratedPw">
        This paste has been given a <strong>secret link</strong> to access it (given above). 
        <br/>
        <br/>
        You will not be able to recover this paste if you lose this link. 
      </p>

      <!-- Password protected text -->
      <p v-if="!wasPublic && !wasGeneratedPw"> 
        This paste will need the link & password to unlock it.
      </p>
      <p v-if="!wasPublic && !wasGeneratedPw">
        If don't save the link, you can search for it later by wallet address or block number.
      </p>

      <p v-if="wasPublic">
        This paste is posted publicy.
      </p>

      <button class="secondary-btn" @click="$copyText(postedLink)">Copy link</button>

      <p v-if="wasPublic" style="margin-top: 3rem">
        Since this a public paste, you can also view the TX directly from any node.
        <br/>
        <br/>
        <a :href="`https://arweave.net/${txId}`"> {{ `https://arweave.net/${txId}` }} </a> 
      </p>

    </div>
</template>

<style scoped>
.posted {
  text-align: center;
  font-size: 0.86em;
  color: rgb(50,50,50);
  padding-left: 5px;
  padding-right: 5px;
}
.posted button {
  padding: 0.5em;
}
</style>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class PostFinished extends Vue {

  @Prop()
  wasGeneratedPw!: boolean

  @Prop()
  wasPublic!: boolean

  @Prop()
  postedLink!: string

  // only called when wasPublic, will not give txId when its a secret link.
  get txId(): string {
    return this.postedLink.substr(this.postedLink.lastIndexOf('/') + 1)
    
  }
}


</script>