import axios from "../../tools/axiosTool"
export default {
  namespaced: true,//使用方法需要带上路径，如appAddItem/getList
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: {
    tableData: [],
  },
  getters:{
  },
  mutations: {
    getList(state) {
      //获取饭店列表
      axios
        .get("/restaurant/list")
        .then(function (response) {
          state.tableData = response.data.data;
          console.log("数据预取成功"+JSON.stringify(state.tableData))
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    setTableDate(state,val){
      state.tableData=val;
    }
  },
  actions: {
    getList({ commit }) {
      commit("getList")
    },
    setTableDate({ commit },val) {
      commit("setTableDate",val)
    }
  }
}