<template>
    <div class="appComingSoon">
        <!-- 头部 -->
        <app-header not-index="true"></app-header>
        <!-- 内容区 -->
        <div class="main">
            <el-image :src="comingSoonImg"></el-image>
            <p class="msg">该页面正在建设中，敬请期待！</p>
        </div>
    </div>
    
</template>

<script type="text/javascript">
    let self;
    export default{
        name: 'appComingSoon',
        data(){
            return{
                comingSoonImg:require("@/assets/img/appDefaultPage/nothing_figure.png")
            }
        },
        methods: {
            reload(){
                // this.$router.go(-1);
            }
        },
        mounted(){
            self=this;
        }
    }

</script>
<style lang="scss">
    @import './appComingSoon.scss';
</style>