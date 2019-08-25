<template>
   <paste-render :paste="editing.paste"/> 
</template>

<script lang="ts">
import Vue from 'vue'
import { globalStore } from '../app-state';

export default class extends Vue {
  editing = globalStore.PasteEditing
}
</script>