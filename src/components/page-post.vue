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
  margin: 0em 1em;
  display: flex;
  justify-content: start;
}

.container div:nth-child(1) {
  max-width: 600px;
  flex-grow: 1;
}

.header {
  background: rgba(240,240,210,1);
  display: flex;
  justify-content: start;
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
  font-size: 0.24em;
  font-weight: bolder;
  color: rgb(0, 0, 0);
  padding: 0em;
  margin: 0em;
}


</style>

<style>
/** This style is not scoped, so applies to child views too */

.step-footer-0 {
  display: flex;
  justify-content: right;
  padding-top: 0.5em;
}

.step-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5em;
}

.container hr {
  color: rgba(180,180,180, 0.5);
  margin-bottom: 0.73em;
  margin-left: 1.3em;
}

.paste-preview {
  padding: 1em;
  min-height: 200px;
  min-width: 200px;
  border: 1px dashed rgb(0,0,0,0.3);
}

/* Buttons styles start */
button {
    display: inline-block;
    border: none;
    padding: 1rem 2rem;
    margin: 0;
    text-decoration: none;
    background: rgb(80, 103, 110);
    color: #ffffff;
    font-family: sans-serif;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.secondary-btn {
  color:  rgb(80, 103, 110);
  background: #ffffff;
  border: 1px solid rgba(80, 103, 110, .4)
}


.secondary-btn:hover,
.secondary-btn:focus {
    background:rgb(224, 231, 239);
}

button:hover,
button:focus {
    background:rgba(80,110,140,1);
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}

.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .12s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

</style>
