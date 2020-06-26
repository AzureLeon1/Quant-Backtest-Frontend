// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import store from './store/store.js';

import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import 'iview/dist/styles/iview.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';
Vue.prototype.$axios = axios;
// dev
axios.defaults.baseURL = 'http://localhost:44370';
// delployt
//axios.defaults.baseURL = 'http://localhost:44470';

Vue.config.productionTip = false

Vue.use(iView, {locale})
Vue.use(ElementUI);

var VueCodeMirror = require('vue-codemirror-lite')

Vue.use(VueCodeMirror)

Vue.config.productionTip = false;

//路由守卫
/* router.beforeEach((to, from, next) => {
  //路由中设置的needLogin字段就在to当中 
  if (window.sessionStorage.accessToken) {
    // console.log(to.path) //每次跳转的路径
    if (to.path === '/') {
      //登录状态下 访问login.vue页面 会跳到index.vue
      next({ path: '/standard' });
    }
    else {
      next();
    }
  }
  else {
    // 如果没有session ,访问任何页面。都会进入到 登录页
    if (to.path === '/') { // 如果是登录页面的话，直接next() -->解决注销后的循环执行bug
      next();
    }
    else { // 否则 跳转到登录页面
      next({ path: '/' });
    }
  }
}) */

axios.interceptors.request.use(
  config => {
    if (window.sessionStorage.accessToken) {
      config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('accessToken');
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('accessToken');
          router.replace({
            path: '/'
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
