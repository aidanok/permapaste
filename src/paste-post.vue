
<template>
  <div>
    <div class="header">
      <span>Perma</span><span>Paste</span>
        <pre>                                                              
 __    __ _                        _ _                                           _   _                      _ _ 
/ / /\ \ \ |__   ___ _ __     __ _| | |  _   _  ___  _   _   _ __   ___  ___  __| | (_)___    __ _ ___  ___(_|_)
\ \/  \/ / '_ \ / _ \ '_ \   / _` | | | | | | |/ _ \| | | | | '_ \ / _ \/ _ \/ _` | | / __|  / _` / __|/ __| | |
 \  /\  /| | | |  __/ | | | | (_| | | | | |_| | (_) | |_| | | | | |  __/  __/ (_| | | \__ \ | (_| \__ \ (__| | |
  \/  \/ |_| |_|\___|_| |_|  \__,_|_|_|  \__, |\___/ \__,_| |_| |_|\___|\___|\__,_| |_|___/  \__,_|___/\___|_|_|
                                         |___/                                                                  
        </pre>    
      </div>
     <router-view></router-view>
  </div>
</template>

<style scoped>
.header pre {
  font-size: 0.24em;
  font-weight: bolder;
  color: rgb(0, 0, 0);
  padding: 0em;
  margin: 0em;
}
.header {
  background: rgba(240,240,210,1);
  padding: 1em 1em 0.2em 1em;
}
.header span {
  font-size: 1.1em;
}
.header span:nth-child(1) {
  color: rgba(100,130,140,1)
}
.header span:nth-child(2) {
  color: rgba(250,170,70,1)
}
.header span:nth-child(3) {
  color: rgba(200,140,40,1)
}
</style>