<template>
  <div>
    <section>
     <div class="paste-options-super"> 
        <div class="paste-options">
          <div class="paste-format">
            Paste Format<br/>
            <input type="radio" name="pasteFormat" v-model="editing.paste.pasteFormat" value="plaintext" checked>Plaintext<br>
            <input type="radio" name="pasteFormat" v-model="editing.paste.pasteFormat" value="markdown">Markdown<br>
            
          </div>
          <div class="paste-privacy">
            Paste Privacy<br/>
            <input type="radio" name="pastePrivacy" v-model="editing.paste.pastePrivacy" value="public" checked>Public<br>
            <input type="radio" name="pastePrivacy" v-model="editing.paste.pastePrivacy" value="private">Encrypted<br>
          </div>
        </div> 
      </div>

      <div class="paste-content">
        <div class="paste-content-bar">
          <input type=text v-model="editing.paste.pasteTitle" placeholder="Title (Optional)" >
          <!-- <file-load></file-load> -->
        </div>
        <textarea v-model="editing.paste.pasteText" placeholder="Content..." ></textarea>
      </div>
    </section>
    <div class="step-footer-0">
      <button @click="$router.push('/paste/preview/')">Preview and Finalize</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

import { globalStore } from '../app-model'

@Component
export default class extends Vue {
    editing = globalStore.PasteEditing
    
}

</script>


<style scoped>

.step-footer-0 {
  display: flex;
  justify-content: right;
  padding-top: 0.5em;
}

hr {
  color: rgba(180,180,180, 0.5);
  margin-bottom: 0.73em;
  margin-left: 1.3em;
}
.paste-options-super {
  display: flex; 
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.8em;
}
.paste-options-super div {
  margin-right: 1em;
}

.paste-options {
  margin-top: 0.8em;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.8em;
}

.paste-content {
  font-size: 0.8em;
  text-align: left;
}
.paste-content-bar {
  display: flex;
  justify-content: space-between;
}
.paste-content textarea {
  margin-top: 0.7em;
  white-space: pre;
  width: 100%;
  height: 400px; 
}

</style>

