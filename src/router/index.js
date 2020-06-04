import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import Code from '@/views/Code'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
    // {
    //   path: '/code',
    //   name: 'Code',
    //   component: Code
    // }
  ]
})
