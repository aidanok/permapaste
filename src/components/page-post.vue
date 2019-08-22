<template>
  <div>
    
    <div class="header">
      
      <div class="header-bar">
  
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

    </div>
    
    <div class="container">
      <div>
        <transition name="slide-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>

  </div>
  
</template>

<style scoped>

.container {
  display: flex;
  justify-content: start;
}

.container div:nth-child(1) {
  max-width: 600px;
  flex-grow: 1;
}

.header {
  background:  rgba(240,240,210,1);
  display: flex;
  justify-content: start;
  width: 100vw;
}

.header-bar {
  flex-grow: 1;
  max-width: 600px;
  display: flex;
  align-items: flex-start;
}

.logo-and-byline {
  flex-grow: 1;
  max-width: 600px;
  padding-left: 0.6rem;
  padding-top: 0.6rem;
}

.logo-and-byline pre {
  font-size: 5px;
  font-weight: bold;
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

