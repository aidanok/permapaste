<template>
  <div class="container">

    <button class="secondary-btn">
      <div>
      Attach File
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 489.2 489.2" style="enable-background:new 0 0 489.2 489.2;" xml:space="preserve">
<path d="M302.258,37.32h-82.789c0-16.233-10.48-29.944-24.996-35.066C190.596,0.891,186.499,0,182.149,0
	c-20.582,0-37.32,16.745-37.32,37.32v127.091c0,20.575,16.738,37.321,37.32,37.321c4.35,0,8.447-0.892,12.324-2.253
	c14.516-5.123,24.996-18.834,24.996-35.068V112.97c0-8.156-6.131-14.617-13.996-15.705c-0.725-0.103-1.385-0.434-2.143-0.434
	c-8.92,0-16.139,7.227-16.139,16.139v51.441c0,2.782-2.27,5.044-5.043,5.044c-2.773,0-5.043-2.262-5.043-5.044V66.705l114.137-0.078
	v63.002c0,18.416,14.955,33.364,33.348,33.364l61.748-0.173l0.678,278.287c0,10.275-8.32,18.621-18.611,18.621H120.78
	c-10.279,0-18.631-8.346-18.631-18.621V85.413c0-10.205,8.275-18.495,18.473-18.582V37.336
	c-26.447,0.087-47.928,21.623-47.928,48.077v355.694c0,26.509,21.561,48.093,48.086,48.093h247.625
	c26.508,0,48.102-21.584,48.102-48.093V151.15L302.258,37.32z M177.106,37.32c0-2.782,2.27-5.043,5.043-5.043
	c2.773,0,5.043,2.261,5.043,5.043H177.106z"/>
<g>
  </svg>
  <div>
    </button>
  

    <!--
    <div v-if="!fileName">
      <div class="input-container">
        <input type="file" id="file" @change="onFilesSelected" />
        <label for="file" >Choose a file</label>
      </div>
    </div>

    <div v-else class="file-loaded">
      <h5> File Info </h5>
      Filename: {{ fileName }} <br/> 
      Filesize: {{ (fileSize / 1024 / 1024).toFixed(3) }}MB<br/>   
      <button @click="unloadFile">Load a different file</button>
    </div>

    <div class="error-text" v-if="status === 'error'">{{ errorText }}</div>
    -->
  </div>
</template>

<style scoped>
button {
  padding: 0.4em;
  padding-left: 0.8em;
  font-size: 1em;
}
.container div { 
  display: flex;
  align-items: center;
}
.container svg {
  width: 1.5em;
  margin-left: 0.25em;
  margin-bottom: 0.25em;
}

.input-container {
  font-size: 0.7em;
}

.file-loaded h5 {
  color: rgb(40,105,40, 1.0);
}
.wallet-loaded button {
  margin-top: 0.84em;
}

[type="file"] {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
}

[type="file"] + label {
  background-color: #a1dba1;
  border-radius: 4rem;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  padding-left: 2rem 4rem;
  padding: 1em;
}
  
[type="file"]:focus + label,
[type="file"] + label:hover {
    background-color: #f15d22;
}
  
[type="file"]:focus + label {
  outline: 1px dotted #000;
}

</style>
<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue';

@Component
export default class FileLoad extends Vue {
  
  status = ''
  errorText = ''

  fileName: string = ''
  fileSize: number = 0

  onFilesSelected(event: any) {
    const files: File[] = event.target.files
    const reader = new FileReader()
    if (files[0]) {
      this.fileName = files[0].name
      this.fileSize = files[0].size
      if (this.fileSize > 1024*1024*.075) {
        this.errorText = 'File above limit of 1.75MB'
        this.status = 'error'
        console.log('File too big')
      }
    } else {
      this.fileName = ''
      this.fileSize = 0
      this.status = ''
    }
  }

  unloadFile() {
    this.fileName = ''
    this.fileSize = 0
    this.status = ''
  }

}

</script> 
