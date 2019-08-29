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
  border-top: 1px solid #aaa;
}
.paste-text-editor-button-bar {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  flex-shrink: 0;
  flex-grow: 0;
}
.paste-text-editor-button-bar > button {
  padding: 0.3em;
  display: inline-block;
  width: 7em;
  border-top: 0px;
  border-bottom: 0px;
  border-right: 0;
  align-self: stretch;
  flex-shrink: 0;
  /*height: 1em;*/
  /*transform: translateY(calc(2em + 2px));*/
}
.paste-text-editor-button-bar button:not(:last-child) {
  border-right: none;
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
</style>

<template>
  <div 
    @click="detectDoubleTaps"
    class="paste-text-editor-content">

    <div 
      class="paste-text-editor-button-bar"
      v-bind:class="{ hide: previewing }">

      <button class="secondary-btn" @click="fullScreenToggle">&#11034;</button> 
      <button class="secondary-btn" @click="previewToggle">{{ previewToggleText }}</button>
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