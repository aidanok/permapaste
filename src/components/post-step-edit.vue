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
  justify-content: space-between;
  align-items: center;
  border: 0px solid #bbb;
  border-radius: 3px;
  align-self: flex-end;
  flex-grow: 0;
  flex-shrink: 0;
  width: 20em;
  margin-top: 0.3em;
  border: 0px dashed rgb(0,0,0,0.2);
}
.select-format > label {
  /*display: block;*/
  font-size: 1em;
  margin: 0;
  margin-right: 1em;

  color: #555;
}
.select-format > select {
  font-size: 1em;
  padding: 0.1em;
  background: white;
}
.title-input {
  align-self: flex-end;
  margin-top: 0.3em;
  margin-bottom: 0.5em;
  /* No idea where the 8px is coming from, it should line up with the above box at 20em */
  width: calc(20em - 8px);
  border: 1px solid #aaa;
  padding: 3px;
}
.editor {
  flex-grow: 1;
}
.step-footer-0 {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  justify-content: flex-end;
  padding: 2px 0px;
}
.step-footer-0 button {
  width: 17rem;
}

.content-pane {
  z-index: 100;
  background: white;

  /* 
   * This overflow: auto was added *only* to get scrollbars when: 
   * in full screen preview mode of plaintext on firefox
   * Really seems like overflow: auto on the preview window should work (and it does in chrome)
   */
  overflow: auto; 
}

/* This requires knowing we are a direct child of a grid in thee parent component 
*/
.content-pane-full-screen {
  grid-row: 1 / 3;
  grid-column: 1 / 4;
  padding: 0px 1px;
}

</style>
<template>

  <div v-bind:class="{ 'content-pane-full-screen': editorFullScreen }" class="content-padding content-layout content-font content-pane">
      
    <div v-if="!editorFullScreen && !preview" class="select-format">
      <label for="selectFormat"> Format </label>
      <select id="selectFormat" name="format" v-model="editing.paste.pasteFormat">
        <option value="markdown">Markdown</option>
        <option value="plaintext">Plaintext</option>
      </select>
    </div>
    
    <input v-if="!editorFullScreen && !preview" class="title-input" type=text v-model="editing.paste.pasteTitle" placeholder="Title (Optional)" >
      
    <paste-editor 
      ref="editor" 
      class="editor" 
      @text-area-focus="textAreaWasFocused" 
      @full-screen-toggle="toggleEditorFullScreen"
      @preview-on="preview = true"
      @preview-off="preview = false">
    </paste-editor>
    
    <div v-if="!editorFullScreen" class="step-footer-0">
      <button @click="$router.push('/paste/privacy/')">Next</button>
    </div>

  </div>

  
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

import { globalStore } from '../app-state'
import { Watch } from 'vue-property-decorator';

@Component
export default class extends Vue {
    editing = globalStore.PasteEditing
    preview = false;

    editorFullScreen = false;

    textAreaWasFocused() {
      // On smaller screens, auto full screen
      if (!this.editorFullScreen && (window.innerHeight < 800 || window.innerWidth < 800)) {
        this.toggleEditorFullScreen()
      }
    }

    toggleEditorFullScreen() {
      if (this.editorFullScreen) {
        this.$router.go(-1)
      } else {
        this.$router.push({ query: { fullscreen: true } } as any)
      }
    }
    
    created() {
      this.watchQuery()
    }

    @Watch('$route.query')
    watchQuery() {
      this.editorFullScreen = this.$route.query.fullscreen !== undefined
    }

    @Watch('editorFullScreen') 
    watchFullScreen() {
       if (this.editorFullScreen) {
        const editor = this.$refs.editor as any;
        setTimeout(() => editor.focusTextArea(), 0)
      }
    }

}

</script>


