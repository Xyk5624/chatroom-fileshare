import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: index,
      meta: {
        title: "Index",
        requireAuth: true
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: login,
      meta: {
        title: "Login",
      }
    }
  ]
})
