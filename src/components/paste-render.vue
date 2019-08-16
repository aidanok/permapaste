<template>
  <div>
    <article class="markdown-body" v-if="paste.pasteFormat === 'markdown'" v-html="getRenderedMarkdown()"></article>
    <pre v-if="paste.pasteFormat === 'plaintext'">{{ paste.pasteText }}</pre>
  </div>
</template>

<style>
.markdown-body {
  padding: 1rem;
}
</style>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Paste } from '../app-model/pastes'
import { marked } from '../app-model/markdown'
import { DOMPurify } from '../app-model/dom-purify'

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
