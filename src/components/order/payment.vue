<template>
<el-card class="centerCard">

    <el-card class="childCard"  shadow="hover">
        <div slot="header">
            <span>订单信息</span>
        </div>

       <div>
           <p>收货信息：{{buyer}}(联系电话：{{buyerTel}})</p>
           <p>收货地址：{{address}}</p>
           <p>配送方式：{{transWay}}</p>
           <p>买家备注：{{remark}}</p>
       </div>
    </el-card>
<!-- 
    <el-button @click="addTab('order/myOrder')" style="float:right;" size="small"  type="success" plain>返回</el-button>
 -->
    <el-card class="childCard"  shadow="hover">
        <div slot="header">
            <span>产品明细</span>
        </div>
        <el-table
        :data="tableData2"
        style="width: 100%"
        :row-class-name="tableRowClassName">
            <el-table-column
            prop="date"
            label="类型"
            width="120">
            </el-table-column>
            <el-table-column
            prop="name"
            label="型号"
            width="150">
            </el-table-column>
            <el-table-column
            prop="address"
            label="样本型号"
            width="120">
            </el-table-column>
            <el-table-column
            prop="banben"
            label="版本"
            width="150">
            </el-table-column>
            <el-table-column
            prop="banbenhao"
            label="版本号"
            width="120">
            </el-table-column>
            <el-table-column
            prop="state"
            label="状态"
            width="120">
            </el-table-column>
            <el-table-column
            prop="number"
            label="数量">
            </el-table-column>
  </el-table>        
   </el-card>

   <el-card class="childCard"  shadow="hover">

       <div class="rightDiv">
           <p>总商品金额：￥{{totalPrice}}</p>
           <p>运费：￥{{transPrice}}</p>
           <p>返现：￥{{backPrice}}</p><br>
           <p style="color:tomato; font-weight:bold;">应付金额：￥{{payPrice}}</p>
           <el-button @click="addTab('order/myOrder')" size="medium" type="success" plain>返回</el-button>
           <el-button size="medium" type="danger" plain>立即付款</el-button>
       </div>
   </el-card> 


  
</el-card>
</template>

<script>
import Axios from 'axios'
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
        buyer:'张三',
        buyerTel:'15515515515',
        remark:'无',
        transWay:'普通物流(运费由甲方负责)',
        address:'广东省汕头市潮阳区广东工业大学',
        totalPrice:2800,
        transPrice:10,
        backPrice:0,
        tableData2: [{
          date: '窗帘',
          name: 'NPP006911',
          address: '111',
          banben:'新墙标(大)',
          banbenhao:'V0191',
          state:'有货',
          number:'1.00*1.00=1卷',
        }, {
          date: '窗帘',
          name: 'NPP006911',
          address: '111',
          banben:'新墙标(大)',
          banbenhao:'V0191',
          state:'有货',
          number:'1.00*1.00=1卷',
        }, {
          date: '窗帘',
          name: 'NPP006911',
          address: '111',
          banben:'新墙标(大)',
          banbenhao:'V0191',
          state:'有货',
          number:'1.00*1.00=1卷',
        }, {
          date: '窗帘',
          name: 'NPP006911',
          address: '111',
          banben:'新墙标(大)',
          banbenhao:'V0191',
          state:'有货',
          number:'1.00*1.00=1卷',
        }],
        ruleForm: {
          studentName: '111',
        },
      }
    },
    computed:{
        payPrice:function(){
            return this.totalPrice+this.transPrice-this.backPrice;
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
        if (rowIndex%2==0) {
          return 'success-row';
        }
        return '';
      },
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
.childCard{
  margin:  0 2%
}
span{
    font-weight: bold;
    font-size: 16px;
}
.rightDiv{
    float: right;
    margin-right: 10%;
}

</style>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>