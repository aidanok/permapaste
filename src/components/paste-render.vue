<template>
  <div>
    <article class="markdown-body markdown-sanity" v-if="paste.pasteFormat === 'markdown'" v-html="getRenderedMarkdown()"></article>
    <pre v-if="paste.pasteFormat === 'plaintext'">{{ paste.pasteText }}</pre>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Paste } from '../lib/pastes'
import { marked } from '../lib/markdown'
import { DOMPurify } from '../lib/dom-purify'

@Component
export default class PasteRender extends Vue {
  
  @Prop()
  paste!: Paste

  // Only called if paste.pasteFormat === 'markdown'
  getRenderedMarkdown() {
    return DOMPurify.sanitize(marked(this.paste.pasteText))
  }
}

</script> 

<style scoped>
.markdown-sanity {
  max-width: 800px; 
  margin-left: auto;
  margin-right: auto;
}
</style>
