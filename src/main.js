
import 'babel-polyfill'


// Vue base.

// Register vue router hooks with vue-class-component
import Component from 'vue-class-component'
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])


import Vue from 'vue'
import VueRouter from 'vue-router'


// 3rd party components & css

import VueClipboard from 'vue-clipboard2'

// 3rd party css
import './css/loading/loading.css'
import './css/loading/loading-btn.css'

import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css'

// Local 
import './css/app.css'
import App from './app.vue'

// Local components.
import WalletLoad from './components/wallet-load.vue'
import PasteRender from './components/paste-render.vue'
import FileLoad from './components/file-load'
import FindPastesLink from './components/find-pastes-link'
import EditPasteLink from './components/edit-paste-link'
import PermaPasteLogo from './components/perma-paste-logo'

// Top level views/pages

import PagePost from './components/page-post.vue'
import PageView from './components/page-view.vue'
import PageFind from './components/page-find.vue'

import PostStep0 from './components/post-step0.vue'
import PostStep1 from './components/post-step1.vue'
import PostStep2 from './components/post-step2.vue'
import PostStep3 from './components/post-step3.vue'

const routes = [
  { path: '/', redirect: '/paste/edit' },
  { 
    path: '/paste', component: PagePost, 
    children: [ 
      { path: 'edit', component: PostStep0 },
      { path: 'preview', component: PostStep1 },
      { path: 'finalize', component: PostStep2 },
      { path: 'finished', component: PostStep3, 
        props: (route) => {
          console.log(route.query)
          const props = { 
            postedLink: route.query.postedLink, 
            wasGeneratedPw: route.query.wasGeneratedPw === 'true' || route.query.wasGeneratedPw === true,
            wasPublic: route.query.wasPublic === 'true' || route.query.wasPublic === true
          }
          console.log(props)
          return props;
        }
      }
    ]
  },
  { 
    path: '/view/:txId', 
    component: PageView, 
    props: true,
  },
  { 
    path: '/view/:txId/:urlPassword', 
    component: PageView, 
    props: true,
  },
  {
    path: '/find',
    component: PageFind, 
  }
]



Vue.component('paste-render', PasteRender)
Vue.component('wallet-load', WalletLoad)
Vue.component('file-load', FileLoad)
Vue.component('find-pastes-link', FindPastesLink)
Vue.component('edit-paste-link', EditPasteLink)
Vue.component('perma-paste-logo', PermaPasteLogo)
Vue.use(VueClipboard);
const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  document.title = 'PermaPaste'
  next()
})



Vue.use(VueRouter)

// Run Vue
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
