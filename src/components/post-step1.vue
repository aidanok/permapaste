<template>
   <div>
    <h5>{{ globalStore.PasteEditing.paste.pasteTitle || 'Preview' }}</h5>
    <paste-render class="paste-preview" :paste="globalStore.PasteEditing.paste"></paste-render>
    <div class="step-footer">
      <button @click="$router.go(-1)" class="secondary-btn">Back to Editing</button>
      <button @click="$router.push('/paste/finalize/')">Finalize</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { globalStore } from '../app-model'

export default Vue.extend({
  data() {
    return { globalStore }
  }  
})
</script>

<style scoped>

.paste-preview {
  padding: 1em;
  min-height: 200px;
  min-width: 200px;
  border: 1px dashed rgb(0,0,0,0.3);
}

.step-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5em;
}

</style>


  