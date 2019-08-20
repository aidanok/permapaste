<template>
   <div class="posted"> 
      <p>
        Your paste is pending inclusion in the next block. It will be available at
      </p>
      <a :href="postedLink"> {{ postedLink }}</a> 
      <p v-if="!wasPublic && wasGeneratedPw">
        This paste has been given a <strong>secret link</strong> to access it (given above). 
        You will not be able to recover this paste if you lose this link. 
      </p>
      <p v-if="!wasPublic && !wasGeneratedPw"> 
        This paste will need the link & password to unlock it.
        You can search for the link by the wallet used to post it.
      </p>
      <p v-if="wasPublic">
        This paste is posted publicy, you can search for it by wallet and anyone can find and read it.
      </p>

      <button class="secondary-btn" @click="$copyText(postedLink)">Copy link to clipboard</button>
    </div>
</template>

<style scoped>
.posted {
  text-align: center;
  font-size: 0.9em;
  color: rgb(50,50,50);
  margin: 2rem;
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
}


</script>