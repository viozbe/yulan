<template>
 <el-card class="centerCard">
  <div slot="header">
    <span class="headSpan">我的优惠券</span>
    <!-- <el-button @click="addTab('order/myOrder')" style="float:right;" size="small"  type="success" plain>返回</el-button> -->
  </div>
    <div>
              
              <div v-for="(item,index) of couponData" :key="index" :class="item.dateId!=1||item.rebateMoneyOver==0?switchClass.cctvF:switchClass.cctvT"><!--v-if="item.dateId!='0'" @click="useCoupon(item.id,item.rebateType)"-->
                <div  class="couponHead">
                  <div :class="item.dateId!=1||item.rebateMoneyOver==0?switchClass.logoF:switchClass.logoT"></div>
                  <div class="logoTxt">
                    <p style="color:white; font-size:15px; padding-top:5px; font-weight:bold; letter-spacing:2px;">{{item.notes}}</p>
                    <span>总返利&nbsp;{{item.rebateMoney}}元</span>
                    <span class="rightCoupon">券号：{{item.id}}</span>
                  </div>
                </div>

                <div class="couponBody">
                  <p :class="item.dateId!=1||item.rebateMoneyOver==0?switchClass.transTxtF:switchClass.transTxtT" style="text-align:center">
                    <span style="font-size:18px;">余额￥</span>
                    <span v-if="isManager === '0'">***</span>
                    <span v-else>{{item.rebateMoneyOver}}</span>
                  </p>
                  <div style="margin:0 auto; width:245px;">
                    <div :class="item.dateId!=1||item.rebateMoneyOver==0?switchClass.roundedRectangleF:switchClass.roundedRectangleT">
                      <p>&nbsp;&nbsp;&nbsp;有效期：{{item.dateStart |datatrans}}至&nbsp;&nbsp;{{item.dateEnd |datatrans}}</p>
                    </div>
                  </div>
                   <br>
                    <p style="text-align:center;">适用：{{item.application}}</p>
                    <div class="Record" style="text-align:center">
                      <span @click="RecordUse(item.id)" style="cursor: pointer;">查看使用记录>>&nbsp;&nbsp;&nbsp;</span>
                      <span @click="RecordBack(item.id)" style="cursor: pointer;">查看返利记录>></span>
                    </div>
                    
                  </div>
                </div>
    </div>
    <!-- 查看使用记录 -->
    <el-dialog
      title="优惠券使用记录"
      :visible.sync="dialogUse"
      width="70%"
      ><!-- :before-close="handleClose" -->
      <el-table
        empty-text="暂无使用记录"
        :data="useTable"
        style="width: 100%"
        :row-class-name="tableRowClassName">
            <el-table-column
            align="center" 
            prop="id"
            label="券号">
            </el-table-column>
            <el-table-column
            align="center" 
            prop="orderNo"
            label="订单号">
            </el-table-column>
            <el-table-column
            align="center" 
            prop="itemNo"
            label="商品型号">
            </el-table-column>
            <el-table-column
            align="center" 
            label="使用时间">
                 <template slot-scope="scope1">
                    <span>{{scope1.row.dateUse |datatrans}}</span>
                 </template>
            </el-table-column>
            <el-table-column
            align="center" 
            label="使用金额">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.rebateMoney}}</span>
                </template>
            </el-table-column>
            </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUse = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看返利记录 -->
    <el-dialog
      title="优惠券返利记录"
      :visible.sync="dialogBack"
      width="70%"
      ><!-- :before-close="handleClose" -->
      <el-table
        empty-text="暂无返利记录"
        :data="backTable"
        style="width: 100%"
        :row-class-name="tableRowClassName">
            <el-table-column
            align="center"
            label="优惠券类型">
                 <template slot-scope="scope1">
                    <span>{{scope1.row.rebateType |nameTrans}}</span>
                 </template>
            </el-table-column>
            <el-table-column
            align="center" 
            label="创建日期">
                 <template slot-scope="scope1">
                    <span>{{scope1.row.dateCre |datatrans}}</span>
                 </template>
            </el-table-column>
            <el-table-column
            align="center" 
            label="有效期">
                 <template slot-scope="scope1">
                    <span>{{scope1.row.dateStart |datatrans}}至{{scope1.row.dateEnd |datatrans}}</span>
                 </template>
            </el-table-column>
            <el-table-column
            align="center" 
            label="返利金额">
                <template slot-scope="scope1">
                  <span v-if="isManager === '0'">***</span>
                  <span v-else>{{scope1.row.returnMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="notes"
            align="center" 
            label="备注说明">
            </el-table-column>
            </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBack = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { searchTickets } from '@/api/orderList'
import { manageCoupon } from '@/api/orderList'
import { CouponUseRecord } from '@/api/orderList'
import { CouponbackRecord } from '@/api/orderList'
import Cookies from 'js-cookie'
export default {
    name: 'MyCoupon',
    data(){
        return{
            isManager:Cookies.get('isManager'),
            couponData:[],
            switchClass:{
              cctvT:'cctvT',
              cctvF:'cctvF',
              logoT:'logoT',
              logoF:'logoF',
              transTxtT:'transTxtT',
              transTxtF:'transTxtF',
              roundedRectangleT:'roundedRectangleT',
              roundedRectangleF:'roundedRectangleF',
            },
            dialogUse:false, 
            dialogBack:false,
          useTable: [],
          backTable:[]
        }
    },
    methods:{
      //获取优惠券
      /* _getTickets(){
        var url ='/order/getRebate.do';
        var data ={
          "cid":Cookies.get('cid'),
          "typeId":"A",
        }
        searchTickets(url,data).then(res => {
            console.log(res.data);
            this.couponData=res.data;
        })
      }, */
      allTickets(){
        var url = '/order/findRebate.do';
        var data = {
          "cid":Cookies.get('cid'),
          'companyId':Cookies.get('companyId'),
        };
        manageCoupon(url,data).then(res => {
            console.log(res.data);
            this.couponData=res.data;
        })
      },
      RecordUse(itemID){
        this.useTable=[];
        var url= '/order/findRecrods.do';
        var data = {
          "id":itemID
        };
        CouponUseRecord(url,data).then(res => {
            console.log(res);
            console.log(res.data);
            this.useTable=res.data;
            this.dialogUse=true;
        })
      },
      RecordBack(itemId){
        var url = '/order/getReturnRecord.do';
        var data = {
          "id":itemId
        };
        CouponbackRecord(url,data).then(res => {
            console.log(res);
            console.log(res.data);
            this.backTable=res.data;
            this.dialogBack=true;
        })
      },
      //隔行变色
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2==0) {
          return 'success-row';
        }
        return '';
      },
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
      },
      nameTrans(value){
        if(value=='year'){
          return '年返券';
        }
        else if(value=='month'){
          return '月返券';
        }
        else return '其它券类';
      }
    },
    created:function(){
       // this._getTickets()
        this.allTickets();
    }
}
</script>

<style scoped>
.headSpan{
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.centerCard{
  margin: 0 auto;
  position: relative;
}
.roundedRectangleF{
  display: inline-block;
  height: 30px; 
  line-height: 30px;
  margin: 0 auto;
  color: white;
	width: 238px;
  background: gray;
	/* background: rgb(253, 85, 56);这个是能用的 */
	border-width: 10px;	/*边缘的宽度*/
	border-radius: 15px;	/*圆角的大小 */
}
.roundedRectangleT{
  display: inline-block;
  height: 30px; 
  line-height: 30px;
  margin: 0 auto;
  color: white;
	width: 238px;
	background: rgb(253, 85, 56);
	border-width: 10px;	/*边缘的宽度*/
	border-radius: 15px;	/*圆角的大小 */
}
.cctvF{
  /* border: 1px solid black; */
  background: url('blackCoupon.png');
  width: 350px;
  height: 230px;
  margin-right: 5%;
  background-size: 100% ;
  background-repeat: no-repeat;
  display: inline-block;
  font-size: 13px;
}
.cctvT{
  /* border: 1px solid black; */
  background: url('coupon.png');
  width: 350px;
  height: 230px;
  margin-right: 5%;
  background-size: 100% ;
  background-repeat: no-repeat;
  display: inline-block;
  font-size: 13px;
}
.couponHead{/* 
  border: 1px solid black; */
  height: 50px;
}
.couponBody{
  height: 170px;/* 
  border: 1px solid black; */
  margin-top: 15px;
}
.logoF{
  background: url('blackLogo.jpg');
  width: 40px; height: 40px;
  background-size: 100% ;
  background-repeat: no-repeat;
  border-radius: 50%;
  float: left;
  margin-top: 8px;
  margin-left: 5%;
  margin-right: 3%;
}
.logoT{
  background: url('logopng.png');
  width: 40px; height: 40px;
  background-size: 100% ;
  background-repeat: no-repeat;
  border-radius: 50%;
  float: left;
  margin-top: 8px;
  margin-left: 5%;
  margin-right: 3%;
}
.logoTxt span{
  display: inline-block;
  color: white;
  margin-top: 3px;
}
.transTxtF{
  font-size: 40px;
  font-weight: bold;
  color:rgb(180, 180, 180)/* 
  background: -webkit-linear-gradient(left,  rgb(253,59,49) 22%, rgb(253,128,67) 50%,  rgb(253,168,77) 100% );   
  -webkit-background-clip: text;        
  -webkit-text-fill-color: transparent;  */
}
.transTxtT{
  font-size: 40px;
  font-weight: bold;
  background: -webkit-linear-gradient(left,  rgb(253,59,49) 22%, rgb(253,128,67) 50%,  rgb(253,168,77) 100% );   
  -webkit-background-clip: text;        
  -webkit-text-fill-color: transparent;
}
.Record span:hover{
  color:orange;
}
.rightCoupon{
  float: right;
  margin-right: 10px;
}
</style>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>