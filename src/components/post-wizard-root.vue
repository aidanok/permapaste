<template>
  <div>
    
    <div class="header">
      <div class="header-bar">
        <div class="logo">
        <span>Perma</span><span>Paste</span><br/>
        <pre>    
       _ _                                           _   _                      _ _ 
  __ _| | |  _   _  ___  _   _   _ __   ___  ___  __| | (_)___    __ _ ___  ___(_|_)
 / _` | | | | | | |/ _ \| | | | | '_ \ / _ \/ _ \/ _` | | / __|  / _` / __|/ __| | |
| (_| | | | | |_| | (_) | |_| | | | | |  __/  __/ (_| | | \__ \ | (_| \__ \ (__| | |
 \__,_|_|_|  \__, |\___/ \__,_| |_| |_|\___|\___|\__,_| |_|___/  \__,_|___/\___|_|_|
             |___/                                                                  
        </pre>
        </div>

        
        <div class="find-pastes">
          <router-link to="/find">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </router-link>
        </div>

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
svg {
  width: 1.3rem;
  color: rgba(150,150,150,1);
  transition: color 0.25s;
}
svg:hover {
  color: rgba(100,100,100,1)
}
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
.find-pastes {
  padding: 0.5em;
  padding-top: 1em;
  transform: rotateY(15deg);
  background: rgba(33,0,10,0.1);
  border-radius: 10px;
  transform: translateY(-10px);
}
.logo {
  flex-grow: 1;
  max-width: 600px;
  padding: 1em 1em 0.2em 1em;
}
.logo pre {
  font-size: 0.24em;
  font-weight: bolder;
  color: rgb(0, 0, 0);
  padding: 0em;
  margin: 0em;
}
.logo span {
  font-size: 1.1em;
}
.logo span:nth-child(1) {
  color: rgba(100,130,140,1)
}
.logo span:nth-child(2) {
  color: rgba(250,170,70,1)
}
.logo span:nth-child(3) {
  color: rgba(200,140,40,1)
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
