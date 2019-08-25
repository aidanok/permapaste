<style scoped>

/* Move to global ? */
.content-padding {
  padding: 0px 5px;
}
.content-layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}
.content-font {
  font-size: 1em;
 }

.select-format {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 0px solid #bbb;
  border-radius: 3px;
  padding: 2px;
  align-self: flex-end;
  width: 20em;
  margin-top: 0.3em;
  border: 0px solid red;
}

.select-format > label {
  /*display: block;*/
  font-size: 1em;
  margin-right: 1em;
  color: #555;
}
.select-format > select {
  font-size: 1rem;
  padding: 0.1em;
  background: none;
}

.title-input {
  align-self: flex-end;
  margin-top: 0.3em;
  width: 20em;
  border: 1px solid #aaa;
  padding: 3px;
}

.editor {
  margin-top: 0.5em;
  flex-grow: 1;
}

.step-footer-0 {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  justify-content: flex-end;
  padding: 2px 0px;
}



</style>
<template>

  <div class="content-padding content-layout content-font">
      
    <div class="select-format">
      <label for="selectFormat"> Format </label>
      <select id="selectFormat" name="format" v-model="editing.paste.pasteFormat">
        <option value="markdown">Markdown</option>
        <option value="plaintext">Plaintext</option>
      </select>
    </div>
    
    <input class="title-input" type=text v-model="editing.paste.pasteTitle" placeholder="Title (Optional)" >
      
    <paste-editor class="editor"></paste-editor>
    
    <div class="step-footer-0">
      <button @click="$router.push('/paste/privacy/')">Next</button>
    </div>

  </div>

  
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

import { globalStore } from '../app-state'

@Component
export default class extends Vue {
    editing = globalStore.PasteEditing
    preview = false;
}

</script>


