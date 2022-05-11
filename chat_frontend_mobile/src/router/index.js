import Vue from 'vue'
import Router from 'vue-router'
import BasePage from '@/components/BasePage'
import HelloWorld from '@/components/HelloWorld'
import index from '@/components/index'
import allfiles from '@/components/allfiles'
import login from '@/components/login'
import groups from '@/components/groups'
import group from '@/components/group'
import chat from '@/components/chat'
// import groupChat from '@/components/groupChat'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'BasePage',
      component: BasePage,
      children: [
        {
          path: '/',
          name: 'index',
          component: index,
          meta: {
            title: "Index",
            requireAuth: true
          }
        },
        {
          path: '/files',
          name: 'allfiles',
          component: allfiles,
          meta: {
            title: "Allfiles",
            requireAuth: true
          }
        },
        {
          path: '/group',
          name: 'groups',
          component: groups,
          meta: {
            title: "Group",
            requireAuth: true
          }
        },
        {
          path: '/group/:groupid',
          name: 'group',
          component: group,
          meta: {
            title: "GroupFiles",
            requireAuth: true
          }
        },
        // {
        //   path: '/group/:groupid/chat',
        //   name: 'groupChat',
        //   component: groupChat,
        //   meta: {
        //     title: "GroupChat",
        //     requireAuth: true
        //   }
        // },
        {
          path: '/chat',
          name: 'chat',
          component: chat,
          meta: {
            title: "Chat",
            requireAuth: true
          }
        },        
      ]
      // path: '/',
      // name: 'index',
      // component: index,
      // meta: {
      //   title: "Index",
      //   requireAuth: true
      // }
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
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
