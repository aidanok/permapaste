<style scoped> 
/* Specify height and width to 100% of viewport */
.page-layout {
  display: grid; 
  grid-template-columns: 1fr minmax(auto, 800px) 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}
.grid-place-header {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}
.grid-place-header-center {
  grid-column: 2 / 3;
  grid-row: 1 / 2; 
}
.grid-place-content {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
</style> 
<template>
  <div class="page-layout">
    
    <div class="grid-place-header header header-coloring">
    </div>
    
    <div class="grid-place-header-center header-bar">

      <div class="logo-and-byline">
        <perma-paste-logo></perma-paste-logo>
        <pre>
       _ _                                           _   _                      _ _ 
  __ _| | |  _   _  ___  _   _   _ __   ___  ___  __| | (_)___    __ _ ___  ___(_|_)
 / _` | | | | | | |/ _ \| | | | | '_ \ / _ \/ _ \/ _` | | / __|  / _` / __|/ __| | |
| (_| | | | | |_| | (_) | |_| | | | | |  __/  __/ (_| | | \__ \ | (_| \__ \ (__| | |
 \__,_|_|_|  \__, |\___/ \__,_| |_| |_|\___|\___|\__,_| |_|___/  \__,_|___/\___|_|_|
             |___/       
        </pre>
      </div>

      <find-pastes-link></find-pastes-link>
    </div>

  
    
    <div class="grid-place-content">
      <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
      </transition>
     
    </div>

  </div>
  
</template>

<style scoped>

.header {
  display: flex;
  justify-content: center;
  
}

.header-bar {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
}

.logo-and-byline {
  flex-grow: 1;
  max-width: 800px;
  padding: 0.5em;
  /*padding-left: 0.5rem;
  padding-top: 0.5rem;*/
}
.logo-and-byline pre {
  display: none;
  font-size: 3px;
  line-height: 4px;
  font-weight: bold;
  font-family: monospace;
  color:black;
  padding: 0em;
  margin: 0em;
}

.slide-fade-enter-active {
  transition: all .07s ease;
}
.slide-fade-leave-active {
  transition: all .07s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

</style>

