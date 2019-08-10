
import 'babel-polyfill'

// Vue base.
import Vue from 'vue'
import VueRouter from 'vue-router'

// 3rd party components & css
import VueSimpleMarkdown from 'vue-simple-markdown'
import './css/vue-simple-markdown.css'

import Password from 'vue-password-strength-meter'

// 3rd party css
import './css/loading/loading.css'
import './css/loading/loading-btn.css'

// Local 
import App from './app.vue'

// import PasteEditor from './components/paste-editor.vue'
// import PasteFinalize from './components/paste-finalize.vue'


// Local components.
import WalletLoad from './components/wallet-load.vue'
import PasteView from './components/paste-view.vue'
import FileLoad from './components/file-load'

// Top level views/pages
import PastePost from './paste-post'

import PostWizardRoot from './components/post-wizard-root.vue'
import PostStep0 from './components/post-step0.vue'
import PostStep1 from './components/post-step1.vue'
import PostStep2 from './components/post-step2.vue'
import PasteViewPage from './components/paste-view-page.vue'

const routes = [
  { path: '/', redirect: '/paste/edit' },
  { 
    path: '/paste', component: PostWizardRoot, 
    children: [ 
      { path: 'edit', component: PostStep0 },
      { path: 'preview', component: PostStep1 },
      { path: 'finalize', component: PostStep2 }
    ]
  },
  { 
    path: '/view/:txId', 
    component: PasteViewPage, 
    props: true,
  }
]



Vue.component('paste-view', PasteView)
Vue.component('wallet-load', WalletLoad)
Vue.component('password', Password)
Vue.component('file-load', FileLoad)

const router = new VueRouter({ routes })

/*router.beforeEach((to, from, next) => {
  if (from.path.substr(0, 6) === '/view/' && to.path.substr(6) !== '/paste') {
    console.log(from)
    console.log(to)
    console.log('redirecting...')
    //next('/')
  } else {
    next()
  }
})
*/


Vue.use(VueRouter)
Vue.use(VueSimpleMarkdown)

// Run Vue
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
