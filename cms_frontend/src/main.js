// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import VueCookies from 'vue-cookies'


Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(ElementUI)

axios.defaults.withCredentials=true

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  if (to.meta.requireAuth) {
    if (VueCookies.get('username')) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
}
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
