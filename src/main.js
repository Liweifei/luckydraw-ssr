// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import createRoute from './router'
import createStore from "./store"
import { sync } from 'vuex-router-sync' // 把当VueRouter状态同步到Vuex中

Vue.config.productionTip = false

/* eslint-disable no-new */

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//axios
import axios from "./tools/axiosTool"
Vue.prototype.$http = axios;

import commonType from './tools/commonType';//公共状态
Vue.prototype.$commonType = commonType;

//token
Vue.prototype.$token = null;

const createApp = function () {
  //每次请求都获取新实例route
  const router = createRoute();
  const store = createStore();

  // 将路由状态添加到vuex中
  sync(store, router)

  const app = new Vue({
    // el: '#app',//记住这里不需要绑,我们是拿到html字符串后手动挂载的
    router,
    store,
    components: { App },
    template: '<App/>'
  })
  return { app, router, store }
}
export default createApp;