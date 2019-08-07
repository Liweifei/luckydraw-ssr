<template>
  <div class="appMain">
    <h1 class="loginCount">
      累计登录次数
      <br />
      {{loginCount}}
    </h1>
    <router-link to="/appAddItem">
      <span class="goAddItem">去加饭店</span>
    </router-link>
    <img :src="jumpGif" alt class="jumpGif" v-if="drawType" />
    <div class="containMain">
      <ul class="list">
        <li
          class="item"
          v-for="(item,index) in list"
          :key="index"
          :class="{'disabled':item.isSelected,'selected':index==thisNum,'isToady':item.isToday}"
        >
          <p class="label">{{item.name}}</p>
        </li>
        <li class="startBtn" @click="draw">走起</li>
      </ul>
      <ul class="cricle">
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
        <li class="cricleItem"></li>
      </ul>
    </div>
  </div>
</template>

<script>
let self;
import { mapState } from "vuex"; // 引入mapState
import appMainModule from "./store.js";
export default {
  name: "appMain",
  asyncGetData(store, router) {
    //注册vuexmodule
    return store.dispatch("appMain/getList");
    // return store.dispatch('getList')
  },
  computed: mapState({
    list: state => state.appMain.list // 组件内的每一个属性函数都会获得一个默认参数state, 然后通过state 直接获取它的属性更简洁
  }),
  beforeCreate(){//重点，注册vuex时候一定要先于computed完成之前注册（beforeCreate之前），不然找不到这些方法
    this.$store.registerModule("appMain", appMainModule);
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule("appMain");
  },
  data() {
    return {
      loginCount:null,
      jumpGif: require("@/assets/img/jump.gif"),
      longinCount: 0,
      drawType: false,
      // list: [
      //   // {
      //   //   id: "000254",
      //   //   name: "年龄",
      //   //   disabled:false,
      //   //   selected:false,
      //   // }
      // ],
      interval: null, //循环器
      intervalSpeed: 300,
      canSelectList: [],
      intervalNum: 0, //100 end
      allLength: 0,
      thisNum: null //当前选中的饭店
    };
  },
  mounted() {
    self = this;
    self.drawType = self.$commonType.drawType;
    self.loginCount = self.$commonType.loginCount;
    console.log(self.drawType,self.loginCount)
  },
  methods: {
    getList() {
      //获取饭店列表
      self.$http
        .get("/restaurant/list")
        .then(function(response) {
          if (response.data.type) {
            self.list = response.data.data.map(item => {
              item.selected = false;
              return item;
            });
          } else {
            self.$message({
              type: "error",
              message: response.data.msg
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    draw() {
      if (self.list.length < 1) {
        self
          .$confirm("未录数据?是否前往录入饭店数据？", "提示", {
            confirmButtonText: "去录饭店",
            cancelButtonText: "取消",
            type: "info"
          })
          .then(() => {
            self.$router.push({
              path: "/appAdditem"
            });
          })
          .catch(() => {});
        return;
      }
      if (self.drawType) {
        self.$message({
          type: "warning",
          message: "狗子！冷静！你要吃几顿？",
          duration: 5000
        });
        return;
      }
      //开始抽奖
      self.canSelectList = [];
      self.list.forEach((item, index) => {
        if (!!!item.isSelected) self.canSelectList.push(index);
      });
      self.allLength = self.canSelectList.length - 1;
      if (self.canSelectList.length < 1) {
        self.$message({
          type: "warning",
          message: "已无可选项了哦！",
          duration: 5000
        });
        return;
      } else if (self.canSelectList.length == 1) {
        //如果只剩一个，直接选中，直接提交，不用再动画
        self.thisNum = self.canSelectList[self.allLength];
        self.drawThisData();
        return;
      }
      self.interval = setInterval(self.intervalF, self.intervalSpeed);
    },
    intervalF() {
      clearInterval(self.interval);
      if (self.intervalNum == 100) {
        self.canSelectList = [];
        self.intervalNum = 0;
        self.drawThisData();
        return;
      }
      self.intervalNum++;
      if (self.intervalNum < 10) {
        self.intervalSpeed = self.intervalSpeed - 30;
      }
      if (self.intervalNum > 85) {
        self.intervalSpeed = self.intervalSpeed + 20;
      }
      self.thisNum =
        self.canSelectList[Math.round(Math.random() * self.allLength)];
      self.interval = setInterval(self.intervalF, self.intervalSpeed);
    },
    drawThisData() {
      //推送数据到远程
      console.log(self.list[self.thisNum].name);
      self.$http
        .post("/restaurant/draw", {
          _id: self.list[self.thisNum]._id
        })
        .then(response => {
          // 成功选中此餐厅
          if (response.data.type) {
            self.$commonType.drawType = true;
            self.drawType = true;
            if (response.data.data.type == "havedrawed") {
              self.$message({
                type: "warning",
                message: "发生了新的抽选！",
                duration: 5000
              });
              self.thisNum = null;
              self.getList();
            }
          } else {
            self.thisNum = null;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./appMain.scss";
</style>