<template>
  <div>
    <vue-simple-markdown v-if="paste.pasteFormat === 'markdown'" :source="paste.pasteText"></vue-simple-markdown>
    <pre v-if="paste.pasteFormat === 'plaintext'"> {{ paste.pasteText }} </pre>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Paste } from '../app-model/pastes';

@Component
export default class PasteRender extends Vue {
  
  @Prop()
  paste!: Paste
}

</script> 
