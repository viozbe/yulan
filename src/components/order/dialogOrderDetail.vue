<template>
<el-card class="centerCard">
    <el-card class="tableCard" shadow="hover">
        <div slot="header">
        <span class="zoomLeft">订单号：<span class="zoomRight">{{ruleForm.ORDER_NO}}</span></span> 
        <span class="zoomLeft">经办人：<span class="zoomRight">{{ruleForm.LINKPERSON}}</span></span> 
        <span class="zoomLeft">收货人：<span class="zoomRight">{{ruleForm.WL_CONTACTS}}({{ruleForm.WL_TEL}})</span></span> <br>
        <span class="zoomLeft">收货地址：<span class="zoomRight">{{ruleForm.RECIVER_AREA1}}{{ruleForm.RECIVER_AREA2}}{{ruleForm.RECIVER_AREA3}}{{ruleForm.POST_ADDRESS}}</span></span> <br>
        <span class="zoomLeft">备注：<span class="zoomRight">{{ruleForm.NOTES}}</span></span> 
          
        </div>
          <el-table
          :data="ruleForm.ORDERBODY"
          style="width: 100%"
          :row-class-name="tableRowClassName">
              <el-table-column
              align="center" 
              prop="ITEM_NO"
              label="型号">
              </el-table-column>
              <el-table-column
              prop="ITEM_NO_SAMPLE"
              align="center" 
              label="样本型号">
              </el-table-column>
              <el-table-column
              align="center" 
              prop="NOTE"
              label="类型">
              </el-table-column>
              <el-table-column
              align="center" 
              prop="QTY_REQUIRED"
              label="数量">
              </el-table-column>
              <el-table-column
              prop="PROMOTION"
              align="center" 
              label="活动类型">
              </el-table-column>
              <el-table-column
              prop="PART_SEND_ID"
              align="center" 
              :formatter="formatRole"
              label="发货说明">
              </el-table-column>
              <el-table-column
              align="center" 
              label="年返利">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.BACK_Y}}</span>
                </template>
              </el-table-column>
              <el-table-column
              prop="BACK_M"
              align="center" 
              label="月返利">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.BACK_M}}</span>
                </template>
              </el-table-column>
              <el-table-column
              align="center" 
              label="经销单价">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.UNIT_PRICE}}</span>
                </template>
              </el-table-column>
              <el-table-column
              align="center" 
              label="实际单价">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.PROMOTION_COST/scope1.row.QTY_REQUIRED}}</span>
                </template>
              </el-table-column>
              <el-table-column
              align="center" 
              label="实际总价">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.PROMOTION_COST}}</span>
                </template>
              </el-table-column>
              <el-table-column
              align="center" 
              prop="NOTES"
              label="备注">
              </el-table-column>
              </el-table>   

        <div style="float:right; margin-right:10%;height:100px;">
          <p v-if="isManager === '0'">商品总价格：<span style="color:tomato;font-weight:bold;">***</span></p>
          <p v-else>商品总价格：<span style="color:tomato;font-weight:bold;">{{ruleForm.ALL_SPEND}}</span></p>
        </div>   


    </el-card>


  
</el-card>
</template>

<script>
import Axios from 'axios'
import { getOrderlist,orderDetail } from '@/api/orderList'
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        isManager:Cookies.get('isManager'),
        Initial_balance:0,
      }
    },
    created:function(){
    },
    props: ['ruleForm'],
    /* watch:{
        status:val =>{
            console.log(val);
        }
    }, */
    methods: {
      formatRole:function(row,column){
        if(row.PART_SEND_ID==0){
          return '等生产'
        }
        else if(row.PART_SEND_ID==1){
          return '分批发货'
        }
        else return '--'
      },
      //[新]订单获取
      getDetail(){
        let url = '/order/getOrderContent.do';
        let data = {
          cid:this.cid,//Cookies.get('cid'),'C01613',
          order_no:this.order_no//Cookies.get('ORDER_NO'),'W1906060010b'
        }
        orderDetail(url,data).then(res =>{
          console.log(res);
          console.log(res.data.data[0]);
          this.ruleForm.ORDER_NO=Cookies.get('ORDER_NO');
          this.ruleForm=res.data.data[0];
        })

      },
      //隔行变色
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
  width: 90%;
  height: 200px;
  float: left;
}
.tableCard{
  float: left;
  width: 100%;
}
.headSpan{
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.zoomRight{
  font-weight: 400;
  font-size: 15px;
  line-height: 30px;
  display: inline-block;
  margin-right: 30px;
}
.zoomLeft{
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
}
/* p{
  font-size: 23px;
  font-weight: 500;
} */
/* span{
  color: gray;
  font-weight: 200;
  font-size: 22px;
} */

</style>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>