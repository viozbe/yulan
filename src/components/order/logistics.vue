<template>
<el-card class="centerCard">
  <div slot="header">
    <span>查看物流</span>
    <el-button style="float:right;" @click="addTab('order/myOrder')" size="medium" type="success">返回订单</el-button>
  </div>
  <div>
      <el-steps :active="active" finish-status="success" simple >
        <el-step title="等待揽收" ></el-step>
        <el-step title="正在运输" ></el-step>
        <el-step title="商品派送" ></el-step>
        <el-step title="收货成功" ></el-step>
      </el-steps>     
  </div>
  <div style="height:400px;">
      <div class="floatLeft"></div>    
      <div class="floatRight">
          <p style="padding:50px 0; font-size:40px;">配送信息</p>      
          <p>快递公司：</p>
          <p>送货方式：普通物流(运费由甲方负责)</p>   
          <p>提货单号：2312356217352131285325</p>   
      </div>    
  </div>

  <el-card>
      <div class="leftCard">
          <p style="padding:20px 0; font-size:25px;">收货人信息</p>      
          <p>收货人：曹越</p>
          <p>联系方式：15521457884</p>   
          <p>收货地址：广东省汕头市潮阳区广东工业大学生活西区</p> 
      </div>
      <div class="leftCard">
          <p style="padding:20px 0; font-size:25px;">发货人信息</p>      
          <p>发货人：广东玉兰集团股份有限公司</p>
          <p>发货地址：广东省汕头市潮阳区广东工业大学生活西区</p>   
          <p>客服电话：12312312312</p>
      </div>
  </el-card>
</el-card>



</template>

<script>
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
          active:2,
      }
    },
    methods: {
        ...mapMutations('navTabs', [
        'addTab'
        ]),
        ...mapActions('navTabs',[
          'closeTab',
          'closeToTab'
        ]),
    },

  }
</script>

<style scoped>
.centerCard{
  margin: 0 auto;
  position: relative;
}
span{
    font-weight: bold;
    font-size: 20px;
}
.floatLeft{
    height: 400px;
    width: 60%;
    float: left;
    border-right:1px dashed black;
}
.floatRight{
    float: right;
    width: 30%;
    height: 400px;
    /* border: 1px solid black; */
    margin-right:5%; 
}
.floatRight p{
    font-size: 24px;
    margin-bottom:5%; 
}
.leftCard p{
    font-size:18px;
    margin-bottom: 3%;
}
.leftCard{
    float: left;
    height: 300px;
    width: 48%;
    /* border: 1px solid black */
}
</style>