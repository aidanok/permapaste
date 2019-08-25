<style scope>
.preview-render {
  overflow-x: auto;
  overflow-y: auto;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
<template>
  <paste-render class="preview-render" :paste="editing.paste"/> 
</template>

<script lang="ts">

import Vue from 'vue'
import { globalStore } from '../app-state';

export default class extends Vue {
  editing = globalStore.PasteEditing
}

</script>