<template>
<el-card class="centerCard">
  <div slot="header">
    <span class="headSpan">产品明细与提货信息</span>
    <el-button @click="addTab('order/myOrder')" style="float:right;" size="small"  type="success" plain>返回</el-button>
 </div>
    <el-card class="tableCard" shadow="hover">
        <div slot="header">
            <p class="zoomLeft">订单号：<span class="zoomRight">{{dingdanhao}}</span></p><br>
            <span class="zoomLeft">产品型号：<span class="zoomRight">{{saleNo}}</span></span><br>
            <span class="zoomLeft">下单数量：<span class="zoomRight">{{zongshuliang}}</span></span>
            <!-- <span class="zoomLeft">待发数量：<span class="zoomRight">{{daifashuliang}}</span></span> -->
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName">
            <el-table-column
            prop="saleNo"
            label="提货单号"
            align="center">
            </el-table-column>
            <!--             <el-table-column
            prop="yangben"
            label="型号"
            align="center">
            </el-table-column> --> <!--  我感觉还是不要去掉比较好 -->
            <el-table-column
            prop="qtyDeliver"
            label="数量"
            align="center">
            </el-table-column>
            <el-table-column
            prop="batchNo"
            label="批号"
            align="center">
            </el-table-column>
            <el-table-column
            align="center"           
            label="出货情况">
            <template slot-scope="scope">
              <span style="font-size:14px; color:black;" v-if="scope.row.dateOutStock==''">待发货</span>
              <span style="font-size:14px; color:black;" v-else>已发货</span>
            </template>
            </el-table-column>
            <el-table-column
            label="发货日期"
            align="center">
              <template slot-scope="scope1">
                <span>{{scope1.row.dateOutStock | datatrans}}</span> 
              </template>
            </el-table-column>
            <el-table-column
            prop="freight"
            label="加收物流费"
            align="center">
            </el-table-column>
            <el-table-column
            prop="transcompany"
            label="物流公司"
            align="center">
            </el-table-column>
            <el-table-column
            prop="transId"
            label="物流单号"
            align="center">
            </el-table-column>
            <el-table-column
            align="center"           
            label="物流查看">
            <template slot-scope="scope">
              <a :href="kuaidi100" target="_blank" @click="searchWL(scope.row.transId)"><el-button :disabled="scope.row.transId===''" type="danger" size="small">查看物流</el-button></a>
            </template>
            </el-table-column>
        </el-table>
        
    </el-card>


  
</el-card>
</template>

<script>
import Axios from 'axios'
import { getShipment } from '@/api/orderList'
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
        tableData: [{
          saleNo: 'A090225000',
          yangben: 'NPP006911',
          qtyDeliver: '10卷',
          batchNo:'2',
          dateOutStock:1560501380000,
          transcompany:'顺丰快递',
          transId:'',
           }, {
          saleNo: 'A090225000',
          yangben: 'NPP006911',
          qtyDeliver: '10卷',
          batchNo:'2',
          dateOutStock:'1560501380000',
          transcompany:'顺丰快递',
          transId:'804456417313575862',
            }, {
          saleNo: 'A090225000',
          yangben: 'NPP006911',
          qtyDeliver: '10卷',
          batchNo:'2',
          dateOutStock:'1560501380000',
          transcompany:'顺丰快递',
          transId:'1234567890123456',
           }, {
          saleNo: 'A090225000',
          yangben: 'NPP006911',
          qtyDeliver: '10卷',
          batchNo:'2',
          dateOutStock:'1560501380000',
          transcompany:'顺丰快递',
          transId:'1234567890123456',
           }],
        saleNo: '',
        dingdanhao:'',
        zongshuliang:'',
        daifashuliang:'',
        kuaidi100:'',
        kuaididanhao:''
      }
    },
    filters:{
      datatrans(value){  //时间戳转化大法
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? ('0' + MM) : MM;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            let m = date.getMinutes();
            m = m < 10 ? ('0' + m) : m;
            let s = date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return y + '-' + MM + '-' + d + ' ' /* + h + ':' + m + ':' + s; */
        }
    },
    methods: {
      //查看物流
      searchWL(tab){
        console.log(tab);
        this.kuaididanhao=tab;
        let kongchuan = ''
        this.kuaidi100='https://www.kuaidi100.com/chaxun?com='+kongchuan+'&nu='+this.kuaididanhao;
      },
      //跳转调用接口
      init_shipment(){
        this.dingdanhao=this.$route.params.orderId;
        this.saleNo=this.$route.params.itemNo;

            Axios.post('/packDetail/getPackDetailAppoint.do', {
              "itemNo":this.saleNo,
              "orderId":this.dingdanhao
            })
            .then((res) =>{
              console.log(res);
              this.tableData=res.data.packDetails;
              this.zongshuliang=res.data.allCount;

              //this.daifashuliang=res.allCount-res.packDetails[0].qtyDeliver
            })
            .catch((error) => {
              console.log(error);
            });
        
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
    created:function(){
      //this.tableData=[],
      //this.isTable();
      this.init_shipment();
    },

  }
</script>

<style scoped>
.centerCard{
  margin: 0 auto;
  position: relative;
}
.tableCard{
  float: left;
  width: 90%;
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
}
.zoomLeft{
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-right: 30px;
}
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