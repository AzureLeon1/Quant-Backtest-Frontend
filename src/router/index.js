import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Code from '@/views/Code'
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  routes: [
/*     {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, */
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/code',
      name: 'Code',
      component: Code
    }
  ]
})
