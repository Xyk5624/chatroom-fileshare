// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Icon, Popup, Form, Field, Col, Row, 
  NavBar, Overlay, Uploader, Toast, Cell, SwipeCell, 
  CellGroup, Dialog, Pagination, Image as VanImage,
  Search, Tabbar, TabbarItem  } from 'vant'

import VueCookies from 'vue-cookies'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios';
import 'lib-flexible'
import './libs/rem.js';

Vue.use(VueCookies)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(Form)
Vue.use(Field)
Vue.use(Col)
Vue.use(Row)
Vue.use(NavBar)
Vue.use(Overlay)
Vue.use(Uploader)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(SwipeCell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Tabbar)
Vue.use(TabbarItem)
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
