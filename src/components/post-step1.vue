<template>
   <div>
    <div class="width-switcher">
      <label for="previewWidthSelect" >Preview Width</label>
      <select id="previewWidthSelect" v-model="previewWidth">
        <option value="1200px">1200px (Desktop) </option>
        <option value="900px">900px (Desktop) </option>
        <option value="800px">800px (Tablet)</option>
        <option value="600px">600px</option>
        <option value="auto">auto</option>
        <option value="412px">412px (Google Pixel, iPhone Plus)</option>
        <option value="375px">375px (iPhone 6+)</option>
        <option value="360px">360px (Samesung S7-S9)</option>
        <option value="320px">320px (iPhone 5)</option>
      </select>
    </div>

    <h5 v-if="globalStore.PasteEditing.paste.pasteTitle">{{ globalStore.PasteEditing.paste.pasteTitle || 'Preview' }}</h5>
    
    <paste-render class="paste-preview" :paste="globalStore.PasteEditing.paste" v-bind:style="{ width: previewWidth }">

    </paste-render>
   
    <div class="step-footer">
      <button @click="$router.go(-1)" class="secondary-btn">Back to Editing</button>
      <button @click="$router.push('/paste/finalize/')">Finalize</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { globalStore } from '../lib'

@Component
export default class extends Vue {
  globalStore = globalStore
  previewWidth = 'auto'
} 
</script>

<style scoped>


.width-switcher {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem 0;
}
.width-switcher label {
  font-size: 0.77em;
  color: #555;
  margin-right: 1em;
}
.width-switcher select {
  font-size: 0.77em;
}
.paste-preview {
  min-height: 300px;
  border: 1px dashed rgb(0,0,0,0.3);
  scroll-behavior: auto x;
  overflow: scroll;
}

.step-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5em;
  margin-top: 3em;
}
.step-footer button {
  flex-basis: 50%;
}

</style>


  