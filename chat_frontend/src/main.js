// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Icon, Popup } from 'vant'
import VueCookies from 'vue-cookies'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios';

Vue.use(VueCookies)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Popup)
Vue.config.productionTip = false
Vue.use(ElementUI)

axios.defaults.withCredentials = true

Vue.use(new VueSocketIO({
  // 控制台调试 console.log
  debug: true,
  // 连接地址 后端提供
  connection: 'http://192.168.90.44:3000',
  // vuex，不需要则不加
  // vuex: {
  //   store,
  //   mutationPrefix: "SOCKET_",
  //   actionPrefix: "SOCKET_"
  // }
}))

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
