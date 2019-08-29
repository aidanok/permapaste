<style scoped>
.paste-text-editor-content {
  border: 1px solid #aaa;
  display: flex;
  flex-direction: column; 
}
.full-screen-height {
  height: calc(100vh - 2px);
}
.paste-textarea {
  flex-grow: 1;
  flex-shrink: 1;
  
  white-space: pre;
  font-family: monospace;
  
  overflow: auto;
  resize: none;
  border: none;
  outline: none;
  padding: 0.5em;
  padding-top: 1em;
  border-top: 1px solid #ddd;
}
.paste-text-editor-button-bar {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  flex-shrink: 0;
  flex-grow: 0;
  border-bottom: 1px solid #aaa;
  background: linear-gradient(to right, rgba(245, 251, 255, 0.25) 0%, rgba(238, 238, 238, 0.25)100%);
  box-shadow: 
    inset 0 1px 3px -1px rgba(0,0,0,0.24);
  
}
.paste-text-editor-button-bar > button {
  padding: 0.4em 0.65em;
  display: inline-block;
  min-width: 4em;
  align-self: stretch;
  flex-shrink: 0;
  background: none;
  /*height: 1em;*/
  /*transform: translateY(calc(2em + 2px));*/
}


.right-button {
  justify-self: end;
  border: none;
  border-left: 1px solid #aaa;
}

.left-button {
  justify-self: start;
  border: none;
  border-right: 1px solid #aaa;
}

/* Put on the first button to push to the right */
.push-button {
  margin-left: auto;
}







.hide {
  display: none !important;
}
.hide-border {
  border: none !important; 
}
.preview-window {
  overflow: auto;
  flex-grow: 1;
}
.markdown-textarea {
  white-space: pre-wrap;
}

input [type="file"] {
  display: none;
}

</style>

<template>
  <div 
    @click="detectDoubleTaps"
    class="paste-text-editor-content">

    <!-- Outside button --> 
    <input ref="fileInput" type="file" hidden @change="onFilesSelected">
      
    <div 
      class="paste-text-editor-button-bar"
      v-bind:class="{ hide: previewing }">
      <button class="secondary-btn right-button" @click="clear">Clear</button>
      <button class="secondary-btn right-button" @click="load">Load Text File</button>
      <button class="secondary-btn right-button" @click="fullScreenToggle">&#11034;</button> 
      <button class="secondary-btn right-button" @click="previewToggle">{{ previewToggleText }}</button>
    </div>

    <textarea 
      ref="mainTextArea" 
      class="paste-textarea"
      @focus="$emit('text-area-focus')"
      @blur="$emit('text-area-blur')"
      @click="$emit('text-area-click')"
      v-model="editing.paste.pasteText"
      v-bind:class="{ 'hide': previewing, 'markdown-textarea': editing.paste.pasteFormat === 'markdown' } " 
      placeholder="">
      </textarea>
    <paste-render v-if="previewing" class="preview-window" :paste="editing.paste"></paste-render>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { globalStore } from '../app-state'
import { setTimeout } from 'timers';

@Component
export default class extends Vue {
  
 
  editing = globalStore.PasteEditing
  previewing = false;

  lastTap = Number.NEGATIVE_INFINITY


  async onFilesSelected(event: any) {
    const files: File[] = event.target.files
    const reader = new FileReader()
    if (files[0]) {
      const fileName = files[0].name
      const fileSize = files[0].size
      if (fileSize > 1024*1024*2) {
        alert('File over 2MB, not inserting!') 
      }
      const reader = new FileReader()
      
      // Use FileReaders event interface
      await new Promise((res, rej) => {
        reader.onload = res
        reader.onerror = rej
        reader.readAsText(files[0])
      })

      const text = reader.result as string;
      const match = fileName.match(/\.[0-9a-z]+$/ig)
      const ext = match && match[0].substr(1);
      this.editing.paste.pasteText = text;
      // Githubs markdown extenions
      const isMarkdown = 
        ext 
        && 
         ['markdown', 'mdown', 'mkdn', 'mkd', 'md'].filter(x => x.toUpperCase() === ext.toUpperCase()).length > 0

      this.editing.paste.pasteFormat = isMarkdown ? 'markdown' : 'plaintext'
      
    }
  }

 
  clear() {
    let clear = true; 
    if (!this.editing.isDefaultText() && this.editing.paste.pasteText) {
      clear = window.confirm('You have changes, delete all text?')
    }
    if (clear) {
      this.editing.paste.pasteText = '';
      this.editing.paste.pasteTitle = '';
    }
  }

  load() {
    (this.$refs.fileInput as any).click();
  }

  focusTextArea() {
    (this.$refs.mainTextArea as any).focus()
  }

  detectDoubleTaps() {
    if (!this.previewing) {
      return
    }
    const n = new Date().getTime() 
    if ((n - this.lastTap < 450)) {
      // This will always just pop the route
      this.previewToggle() 
    }
    this.lastTap = n;
  }

  fullScreenToggle() {
    this.$emit('full-screen-toggle');
  }

  previewToggle() {
    if (this.previewing) {
      this.$router.go(-1);
    }
    else {
      console.log(this.$route.query)
      const query = Object.assign({}, this.$route.query, { previewing: true }) 
      this.$router.push({ query })
    }
  }

  get previewToggleText(): string {
    return this.previewing ? 'Edit' : 'Preview'
  }

  created() {
    this.watchQuery();
  }

  @Watch('$route.query') 
  watchQuery() {
    this.previewing = this.$route.query.previewing !== undefined
    this.$emit(this.previewing ? 'preview-on' : 'preview-off')
  }

  
}

</script>