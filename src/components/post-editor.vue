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
  flex-basis: 100%;
  flex-shrink: 1;
  white-space: pre;
  overflow: auto;
  resize: none;
  width: 100%;
  border: none;
  outline: none;
  border-top: 1px solid #aaa;
}
.paste-text-editor-button-bar {
  display: flex;
  justify-content: flex-end;
}
.paste-text-editor-button-bar > button {
  padding: 0.3em;
  display: block;
  width: 7em;
  border-top: 0px;
  border-bottom: 0px;
  border-right: 0;
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
  border-top: 1px solid #aaa;
}
</style>

<template>
  <div class="paste-text-editor-content" v-bind:class="{ 'full-screen-height': fullScreenMode, 'hide-border': previewing && fullScreenMode }">
    <div v-bind:class="{ hide: previewing && fullScreenMode }" class="paste-text-editor-button-bar">
      <button v-bind:class="{ hide: fullScreenMode }" class="secondary-btn" @click="fullScreenToggle"> Full-screen </button> 
      <button class="secondary-btn" @click="previewToggle">{{ previewToggleText }}</button>
    </div>
    <textarea ref="mainTextArea" v-bind:class="{ 'hide': previewing } " class="paste-textarea" v-model="editing.paste.pasteText" placeholder="" ></textarea>
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
  
  @Prop({ default: false })
  fullScreenMode!: boolean; 

  editing = globalStore.PasteEditing
  previewing = false;

  fullScreenToggle() {
    if (this.fullScreenMode) {
      (this as any).$router.go(-1)
    } else {
      (this as any).$router.push({ path: '/paste/edit-fullscreen',  props: { fullScreenMode: true } })
    }
  }

  previewToggle() {
    if (this.previewing) {
      // This will trigger the watchQuery below.
      (this as any).$router.go(-1);
      // setTimeout()

      // (this as any).$refs.mainTextArea.focus();
    }
    else {
      (this as any).$router.push({ query: { previewing: 'true' } })
    }
  }

  get fullScreenToggleText(): string {
    return this.fullScreenMode ? 'Back' : 'Fullscreen'
  }

  get previewToggleText(): string {
    return this.previewing ? 'Edit' : 'Preview'
  }

  created() {
    this.watchQuery();
  }

  @Watch('$route.query') 
  watchQuery() {
    console.log((this as any).$route.query)
    this.previewing = (this as any).$route.query.previewing === 'true'
    console.log((this as any).$refs);
      
    // Always focus textarea. needs a setTimeout in case its still in hidden state.
    // Might want to NOT focus it if its really an initial page load and not in full-screen mode, 
    // though it seems to work fine. a minor nit is if we are not in full screen mode and we 
    // were actually focused on some other element (like the title input ) before hitting preview, 
    // in that case we still focus on the main text area when we come out of preview.
    if (!this.previewing) {
      setTimeout(() => {
        (this as any).$refs.mainTextArea.focus();
      }, 0);
      
    }
  }
  @Watch('previewing')
  watchPreviewing(val: boolean) {
    if (!val) {
      (this as any).$refs.mainTextArea.focus();
    }
  }
}

</script>