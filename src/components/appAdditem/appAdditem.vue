<template>
  <div class="appAdditem">
    <div class="right">
      <el-table :data="tableData" border class="tableNoVerticalBorder tableThBg">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column label="饭店名称">
          <template slot-scope="scope">
            <b>{{scope.row.name}}</b>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="饭店位置"></el-table-column>
        <el-table-column label="是否已吃">
          <template slot-scope="scope">{{scope.row.isSelected?"是":"否"}}</template>
        </el-table-column>
        <el-table-column label="评分等级">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.score"
              disabled
              :colors="['#ff0000', '#ff0000', '#ff0000']"
              disabled-void-color="#cccccc"
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="吃主备注"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-link @click="showDialog(scope.row)">编辑</el-link>
            <span class="verticalSplitLine"></span>
            <el-link @click="deleteRestuarant(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBtnBox">
        <el-button class="confirmBtn" icon="el-icon-circle-plus" @click="showDialog('add')">添加</el-button>
        <el-button class="confirmBtn" icon="el-icon-remove">删除</el-button>
        <router-link to="/appMain">
          <el-button class="confirmBtn godraw">去选饭</el-button>
        </router-link>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      custom-class="dialog dialogCenter"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="饭店名称：" class="must">
          <el-input type="text" v-model="form.name" placeholder="请填写饭店名称"></el-input>
        </el-form-item>
        <el-form-item label="饭店位置：" class="must">
          <el-input type="text" v-model="form.location" placeholder="请填写饭店位置"></el-input>
        </el-form-item>
        <el-form-item label="是否已吃：">
          <el-select v-model="form.isSelected">
            <el-option
              v-for="(item,index) in isSelectArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="饭店评分：" class="grade">
          <el-rate
            v-model="form.score"
            :colors="['#ff0000', '#ff0000', '#ff0000']"
            disabled-void-color="#cccccc"
          ></el-rate>
        </el-form-item>
        <el-form-item label="备注： ">
          <el-input
            type="textarea"
            resize="none"
            v-model="form.desc"
            maxlength="50"
            :show-word-limit="true"
            placeholder="请填写饭店食用信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button class="reset" @click="dialogVisible=false">取消</el-button>
        <el-button class="confirm" @click="saveRestuarant">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let self;
import appAdditemModule from "./store.js";
export default {
  name: "appAdditem",
  asyncGetData(store, router) {
    //注册vuexmodule
    return store.dispatch("appAdditem/getList");
    // return store.dispatch('getList')
  },
  beforeCreate(){//重点，注册vuex时候一定要先于computed完成之前注册（beforeCreate之前），不然找不到这些方法
    this.$store.registerModule("appAdditem", appAdditemModule);
  },
  data() {
    return {
      // tableData: [
      //   // {
      //   //   id: "1",
      //   //   name: "客户金融资产总额",
      //   //   location: "已上线",
      //   //   score: 3,
      //   //   desc: "4,013,056"
      //   // }
      // ],
      dialogTitle: "",
      dialogVisible: false,
      form: {
        name: "",
        location: "",
        score: 0,
        isSelected: 0,
        desc: ""
      },
      isSelectArr: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      isEdit: false,
      editId: ""
    };
  },
  computed: {
    tableData:{
      get(){
        return this.$store.state.appAdditem.tableData;
      },
      set(val){
        this.$store.dispatch("appAdditem/setTableDate",val)
      }
    }
  },
  mounted() {
    self = this;
    // console.log(self.$store.state.appAdditem)
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule("appAdditem");
  },
  methods: {
    showDialog(param) {
      //打开dialog
      self.dialogTitle = param === "add" ? "新增饭店" : "编辑饭店信息";
      self.form.name = param === "add" ? "" : param.name;
      self.form.location = param === "add" ? "" : param.location;
      self.form.isSelected = param === "add" ? 0 : param.isSelected;
      self.form.score = param === "add" ? 0 : param.score;
      self.form.desc = param === "add" ? "" : param.desc;
      self.isEdit = param === "add" ? false : true;
      self.editId = param === "add" ? "" : param._id;
      self.dialogVisible = true;
    },
    saveRestuarant() {
      //新增饭店
      if (self.form.name.length > 8) {
        self.$message({
          type: "warning",
          message: "请填写长度小于8的名称！"
        });
        return;
      }
      if (!self.form.name) {
        self.$message({
          type: "warning",
          message: "请填写饭店名称！"
        });
        return;
      }
      if (!self.form.location) {
        self.$message({
          type: "warning",
          message: "请填写饭店位置！"
        });
        return;
      }
      let confirmTitle = self.isEdit ? "确认修改该信息么？" : "确认添加饭店么?";
      self
        .$confirm(confirmTitle, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let param = {
            name: self.form.name,
            location: self.form.location,
            isSelected: self.form.isSelected,
            score: self.form.score,
            desc: self.form.desc
          };
          if (self.isEdit) param._id = self.editId;
          let url = self.isEdit ? "/restaurant/update" : "/restaurant/save"; //新增编辑不同接口
          self.$http
            .post(url, param)
            .then(function(response) {
              if (response.data.type) {
                self.dialogVisible = false;
                if (self.isEdit) self.isEdit = false;
                self.getList();
                self.$message({
                  type: "success",
                  message: response.data.msg
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
        })
        .catch(() => {});
    },
    deleteRestuarant(row) {
      //新增饭店
      self
        .$confirm("确认添删除饭店么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let param = {
            _id: row._id
          };
          self.$http
            .post("/restaurant/delete", param)
            .then(function(response) {
              if (response.data.type) {
                self.dialogVisible = false;
                self.getList();
                self.$message({
                  type: "success",
                  message: response.data.msg
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
        })
        .catch(() => {});
    },
    getList() {
      //获取饭店列表
      self.$http
        .get("/restaurant/list")
        .then(function(response) {
          self.tableData = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss">
@import "./appAdditem.scss";
</style>