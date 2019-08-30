import Vuex from "vuex"
import Vue from "vue"
// import axios from "../tools/axiosTool"
Vue.use(Vuex);

const createStore = function () {
    let userInfo = {
        state: {
            userName: "lwf",
            loginType:false
        },
        mutations: {
            setLoginType(state) {
                state.loginType=true;
            },
            // getList(state) {
            //     //获取饭店列表
            //     console.log("token是"+axios.defaults.headers.common["Authorization"]+"-----")
            //     axios
            //         .get("/restaurant/list")
            //         .then(function (response) {
            //             console.log(response.data.data)
            //             state.tableData = response.data.data;
            //         })
            //         .catch(function (error) {
            //             console.log(error);
            //         });
            // }
        },
        actions: {
            setLoginType({ commit }) {
                commit("setLoginType")
            },
            // getList({ commit }) {
            //     commit("getList")
            // }
        }
    }
    return new Vuex.Store({
        modules: {
            userInfo: userInfo
        }
    })
}

export default createStore;