// 客户端入口文件
//生成vue-ssr-client-manifest.json
//构建打包信息
//处理store状态同步
//将返回字符串挂载到app上面
import Vue from 'vue'
import createApp from "./main"

const {app,router,store}=createApp();

//客户端数据预取
// 全局混入beforeRouteEnter方法去查看是否取药预取
Vue.mixin({
  beforeRouteEnter (to, from, next) {
	next((vm)=>{
		const { asyncGetData } = vm.$options
	    if (asyncGetData) {
			if(!vm.$store.state.userInfo.loginType)vm.$router.push("/");//全局判断loginType，如果无信息证明是点了刷新，则需要跳转到login中
			asyncGetData(vm.$store, vm.$route).then(next).catch(next)
	    } else {
			next()
	    }
	})
  },
  mounted(){
    let node = document.getElementById("renderLoading");
    if (!!node) {
      node.parentNode.removeChild(node);
    }
  }
})

// Vue.mixin({
//   beforeRouteUpdate (to, from, next) {
//     const { asyncGetData } = this.$options
//     if (asyncGetData) {
//       asyncGetData({
//         store: this.$store,
//         route: to
//       }).then(next).catch(next)
//     } else {
//       next()
//     }
//   }
// })

if(window.__INITIAL_STATE__)store.replaceState(window.__INITIAL_STATE__);//同步vuex状态
//为防止异步组件未加载完全，需要放在ready后执行
router.onReady(() => {
  app.$mount("#app")
})
