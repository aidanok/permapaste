<template>
  <div>
    <vue-simple-markdown v-if="paste.pasteFormat === 'markdown'" :source="paste.pasteText"></vue-simple-markdown>
    <pre v-if="paste.pasteFormat === 'plaintext'"> {{ paste.pasteText }} </pre>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    paste: {
      type: Object,
      required: true,
    },
  }
}

</script> 
