<template>
  <div class="appLogin">
    <img :src="head" alt class="headBg" />
    <div class="main">
      <h1 class="sysName">我该吃什么咯</h1>
      <div class="formBox">
        <h2 class="title">欢迎登录</h2>
        <div class="content">
          <div class="inputItem">
            <div class="labe">
              <span class="name">账号</span>
            </div>
            <el-input v-model="form.name" placeholder="请输入您的账号"></el-input>
          </div>
          <div class="inputItem">
            <div class="labe">
              <span class="name">密码</span>
            </div>
            <el-input v-model="form.psd" type="password" placeholder="请输入您的密码" @keyup.13.native="login"></el-input>
          </div>
          <el-button class="confirmBtn" @click="login">登录</el-button>
        </div>
      </div>
      <p class="copyright">李韦飞（Liweifei19950111）版权所有</p>
    </div>
  </div>
</template>
<script>
let self;
export default {
  name: "appLogin",
  data() {
    return {
      head: require("@/assets/img/appLogin/landing_bg.png"),
      form: {
        name: "",
        psd: ""
      }
    };
  },
  created() {
    self = this;
  },
  mounted(){
    let luckydrawName = localStorage.getItem("luckydrawName");
    let luckydrawPsd = localStorage.getItem("luckydrawPsd");
    if (luckydrawName) self.form.name = luckydrawName;
    if (luckydrawPsd) self.form.psd = luckydrawPsd;
    let node = document.getElementById("renderLoading");
    if (!!node) {
      node.parentNode.removeChild(node);
    }
  },
  methods: {
    login() {
      //登录
      if (!self.form.name || !self.form.psd) {
        self.$message({
          type: "warning",
          message: "请输入账号密码!"
        });
        return;
      }
      self.form.name=self.form.name.trim();
      console.log(self.form.name)
      self.$http
        .post("/user/login", {
          name: encodeURI(self.form.name.trim()),
          psd: self.form.psd.trim()
        })
        .then(response => {
          // 登录成功后要跳转到首页，并传值过去
          if (response.data.type) {
            localStorage.setItem("luckydrawName", self.form.name);
            localStorage.setItem("luckydrawPsd", self.form.psd);
            localStorage.setItem("luckydrawToken", response.data.data.token);
            self.$commonType.drawType=response.data.data.drawType;
            self.$commonType.loginCount=response.data.data.loginCount;

            self.$http.defaults.headers.common["Authorization"] =
              response.data.data.token;
              // self.$store.dispatch("setInfo",response.data.data.token)
            self
              .$alert("未录数据?是否前往录入饭店数据？", "提示", {
                closeOnClickModal:true,
                closeOnPressEscape:true,
                confirmButtonText: "去录饭店",
                type: "info",
              })
              .then(() => {
                self.$router.push({
                  path: "/appAdditem"
                });
              })
              .catch((action) => {
                self.$router.push({
                  path: "/appMain"
                });
              });
          } else {
            self.$message({
              type: "error",
              message: response.data.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss">
@import "./appLogin.scss";
</style>