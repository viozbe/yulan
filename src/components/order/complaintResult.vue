<template>
<el-card class="centerCard">
  <div slot="header">
    <span>提交成功</span>
  </div>
  <div>
    <p>感谢您的反馈，您的意见将成为我们提升服务的重要意见</p>
    <p><el-button @click="addTab('order/myOrder')" size="medium" type="success" plain>返回订单</el-button></p>     
  </div>

    </el-card>


</template>

<script>
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
      }
    },
    methods: {
        /* ...mapMutations('navTabs', [
            'addTab'
        ]),
        ...mapMutations('navTabs',[
            'closeTab'
        ]), */
        ...mapMutations('navTabs', [
        'addTab'
        ]),
        ...mapActions('navTabs',[
          'closeTab',
          'closeToTab'
        ]),
        closeIt(){
          this.closeTab('order/complaintResult');
          this.addTab('order/myOrder');
        }
    },

  }
</script>

<style scoped>
.centerCard{
  margin: 0 auto;
  position: relative;
}
p{
  font-size: 30px;
  text-align: center;
  line-height: 200px;
}

span{
    font-weight: bold;
    font-size: 20px;
}

</style>