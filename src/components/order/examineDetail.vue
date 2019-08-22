<template>
  <el-card class="centerCard">
    <el-dialog
      title="窗帘详情"
      :show-close="false"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="1400px"
      top="5vh"
    >
      <keep-alive>
        <detailCurtainTable
          v-if="detailVisible"
          v-bind:tableStatus="1"
          v-bind:STATUS_ID="STATUS_ID"
          v-bind:isModified="isModified"
          v-bind:headerData="headerData"
          v-bind:curtainData="curtainData"
          v-bind:suggestion="ljsuggestion"
          v-on:visible="closeTheDialog"
          v-on:finalData="getFinalData"
          v-on:deleteArr="getDeleteArr"
          v-on:suggest="getSuggest"
        ></detailCurtainTable>
      </keep-alive>
    </el-dialog>

    <div slot="header">
      <span class="headSpan">审核详情</span>
      <el-button
        @click.native="closeToTab({oldUrl:'order/examineDetail',newUrl:'order/examine'})"
        style="float:right;"
        size="small"
        type="success"
        plain
      >返回</el-button>
    </div>
    <el-card class="tableCard" shadow="hover">
      <div slot="header">
        <span class="zoomLeft">
          订单号：
          <span class="zoomRight">{{ruleForm.ORDER_NO}}</span>
        </span>
        <span class="zoomLeft">
          经办人：
          <span class="zoomRight">{{ruleForm.LINKPERSON}}</span>
        </span>
        <span class="zoomLeft">
          联系方式：
          <span class="zoomRight">{{ruleForm.TELEPHONE}}</span>
        </span>
      </div>
      <el-table
        border
        :data="ruleForm.ORDERBODY"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column align="center" prop="ITEM_NO" label="型号"></el-table-column>
        <el-table-column align="center" prop="BRAND_NAME" label="品牌"></el-table-column>
        <el-table-column align="center" prop="NOTE" label="类型"></el-table-column>
        <el-table-column prop="PRODUCTION_VERSION" align="center" label="所属版本"></el-table-column>
        <el-table-column align="center" prop="QTY_REQUIRED" label="数量"></el-table-column>
        <el-table-column prop="PROMOTION" align="center" label="活动类型"></el-table-column>
        <el-table-column align="center" prop="NOTES" label="备注"></el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row,scope.$index)" type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="checkStatus" label="明细状态"></el-table-column>
      </el-table>
      <div style="float:right;margin-top:20px;height:80px;">
        <el-button :disabled="!passORback" @click="LanjuChange()" size="medium" type="danger">兰居修改</el-button>
        <el-button :disabled="!passORback" size="medium" type="warning" @click="_back()">退回修改</el-button>
        <el-button :disabled="passORnot" @click="_pass()" size="medium" type="success">通过审核</el-button>
      </div>
      <div style="padding:10px;">
        <span class="timeLeft">
          创建：
          <span class="timeRight">{{ruleForm.DATE_CRE}}</span>
        </span>
        <span v-if="ruleForm.WEB_TJ_TIME" class="timeLeft">
          提交：
          <span class="timeRight">{{ruleForm.WEB_TJ_TIME}}</span>
        </span>
        <span class="timeLeft">
          更新：
          <span class="timeRight">{{ruleForm.DATE_UPDATE}}</span>
        </span>
        <br />
        <span v-if="ruleForm.DATE_ACCEPT" class="timeLeft">
          接收：
          <span class="timeRight">{{ruleForm.DATE_ACCEPT}}</span>
        </span>
        <span v-if="ruleForm.DATE_DEAL" class="timeLeft">
          处理：
          <span class="timeRight">{{ruleForm.DATE_DEAL}}</span>
        </span>
        <span v-if="ruleForm.USER_NO" class="timeLeft">
          处理人：
          <span class="timeRight">{{ruleForm.USER_NO}}</span>
        </span>
      </div>
      <div style="margin-top:30px;">
        <el-divider></el-divider>
        <span
          style="margin-left:10px;color:red;"
        >订单修改说明：当修改数量不超过200卷时，双方可通过电话在原订单上进行修改，当修改数量超过200卷时，乙方应向甲方提供书面修改说明。</span>
        <br />
        <span style="margin-left:10px;color:red;">法律效力：本订单是双方合作协议不可分割的一部分，是乙方向甲方订货的凭证，具法力效力。</span>
        <el-divider></el-divider>
      </div>
      <div v-if="operationRecords.length > 0" style="width:800px;margin-bottom:20px;">
        <h1 style="margin-left:10px;">处理记录：</h1>
        <el-steps direction="vertical" :active="operationRecords.length" style="margin-top:10px;margin-left:20px;">
          <el-step v-for="item in operationRecords" :key="item.value" style="margin-top:1px;">
            <template slot="title">
              <div v-html="item.OPERATION_NOTE"></div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import Axios from "axios";
import {
  getOrderlist,
  passExamine,
  orderDetail,
  defeatChange
} from "@/api/orderList";
import {
  updateCurtainOrder,
  InsertOperationRecord,
  getOperationRecord
} from "@/api/orderListASP";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Cookies from "js-cookie";
import DetailCurtainTable from "../detail/detailCurtainTable";
export default {
  name: "examineDatail",
  data() {
    return {
      isModified: "",
      deleteIds: [],
      BENarray: "",
      ljsuggestion: "",
      allCurtains: [],
      headerData: {},
      curtainData: "",
      orderNumber: "",
      renderArray: [],
      operationRecords: [],
      tableIndex: "",
      cyLineNo: 0,
      passORback: false,
      passORnot: true,
      detailVisible: false,
      ctmOrderDetails: [],
      STATUS_ID: "",
      //advanceVisible:false,
      //advance:'',
      ruleForm: {
        ORDER_NO: "",
        LINKPERSON: "",
        WL_CONTACTS: "",
        WL_TEL: "",
        POST_ADDRESS: "",
        NOTES: "",
        ORDERBODY: []
      }
    };
  },
  components: {
    DetailCurtainTable
  },
  created: function() {
    this.getDetail();
    this.orderNumber = Cookies.get("ORDER_NO");
  },
  methods: {
    //关闭页面
    closeTheDialog(msg) {
      this.detailVisible = msg;
    },
    //获取修改后的表格数据
    getFinalData(msg) {
      if (msg != null && msg != 1) {
        this.saveChange(0);
      } else if (msg == 1) {
        this.saveChange(1);
        return;
      }
      let innerLine = msg[0].lineNo;
      console.log(innerLine);
      this.allCurtains.push(msg);
      //强制换掉这个傻逼数据
      for (let i = 0; i < msg.length; i++) {
        msg[i].itemId = msg[i].item.itemNo;
      }
      console.log(msg);
      for (let a = 0; a < this.allCurtains.length - 1; a++) {
        if (this.allCurtains[a][0].lineNo == innerLine) {
          this.allCurtains.splice(a, 1);
        }
      }
      console.log(this.allCurtains);
    },
    //获取要删除的配件id
    getDeleteArr(msg) {
      console.log(msg);
      for (var i = 0; i < msg.length; i++) {
        this.deleteIds.push(msg[i]);
      }
    },
    getSuggest(val) {
      console.log(val);
      let transData = {};
      transData.orderNo = this.orderNumber;
      transData.lineNo = this.cyLineNo;
      transData.ljSuggestion = val;
      if (this.ctmOrderDetails.length == 0) {
        this.ctmOrderDetails.push(transData);
      } else {
        for (let i = 0; i < this.ctmOrderDetails.length; i++) {
          if (this.ctmOrderDetails[i].lineNo == this.cyLineNo) {
            this.ctmOrderDetails[i] = transData;
            break;
          } else {
            this.ctmOrderDetails.push(transData);
          }
        }
      }

      console.log(this.ctmOrderDetails);
    },
    //渲染
    Render() {
      this.$set(this.ruleForm.ORDERBODY, this.tableIndex, this.renderArray);
      // this.passORback=true;
      //console.log(this.ruleForm);
    },
    //保存修改
    saveChange(opreate) {
      this.renderArray = this.ruleForm.ORDERBODY[this.tableIndex];
      if (opreate == 0) {
        this.renderArray.checkStatus = "已修改";
        this.passORback = true;
      } else if (opreate == 1) {
        this.renderArray.checkStatus = "已通过";
      }
      this.Render();
      this.listenStatus();
      this.detailVisible = false;
    },
    openDialog(tab, index) {
      this.detailVisible = true;
      if (tab.checkStatus == "已修改") {
        this.isModified = 1;
      } else {
        this.isModified = 0;
      }
      //this.ljsuggestion='';
      this.ljsuggestion = tab.LJ_SUGGESTION; // 应该可以了吧，不行就换回去
      console.log(tab);
      console.log(tab.curtains);
      this.tableIndex = index;
      this.cyLineNo = index + 1;
      this.STATUS_ID = tab.STATUS_ID;
      //拿到保存的建议
      for (let i = 0; i < this.ctmOrderDetails.length; i++) {
        if (this.ctmOrderDetails[i].lineNo == this.cyLineNo) {
          this.ljsuggestion = this.ctmOrderDetails[i].ljSuggestion;
        }
      }

      //强制塞数据
      for (let i = 0; i < tab.curtains.length; i++) {
        tab.curtains[i].choose = true;
        //tab.curtains[i].suggestion='';
        tab.curtains[i].productType = tab.curtains[i].item.productType;
        tab.curtains[i].itemType = tab.curtains[i].curtainPartName;
        if (tab.curtains[i].unit === "°ü") {
          tab.curtains[i].unit = "包";
        }
        tab.curtains[i].dosage = Math.round(tab.curtains[i].dosage * 100) / 100;
      }
      //拿到保存的数据
      this.curtainData = tab.curtains;
      for (let i = 0; i < this.allCurtains.length; i++) {
        if (this.cyLineNo == this.allCurtains[i][0].lineNo) {
          this.curtainData = this.allCurtains[i];
        }
      }
      console.log(this.curtainData);

      this.headerData.quantity = tab.QTY_REQUIRED;
      this.headerData.highJia = tab.CURTAIN_HEIGHT2;
      this.headerData.productGroupType = ""; //
      this.headerData.price = tab.all_cost;
      if (tab.CURTAIN_WBH_SIZE == -1) {
        this.headerData.outsourcingBoxExist = 0; //判断
      } else {
        this.headerData.outsourcingBoxExist = 1; //判断
      }
      this.headerData.outsourcingBoxWidth = tab.CURTAIN_WBH_SIZE;
      this.headerData.modelNumber = tab.ITEM_NO;
      this.headerData.location = tab.CURTAIN_ROOM_NAME
        ? tab.CURTAIN_ROOM_NAME
        : "无"; //'无';
      this.headerData.height = tab.CURTAIN_HEIGHT;
      this.headerData.width = tab.CURTAIN_WIDTH;
      this.headerData.drape = tab.CURTAIN_SIZE_TIMES;
      this.headerData.checked = "";
      this.headerData.cartItemId = "";
      this.headerData.activityGroupType = ""; //
      this.headerData.activity = tab.PROMOTION_TYPE;
      console.log(this.headerData);
    },
    //兰居修改
    LanjuChange() {
      let url = "/order/updateCurtainOrder.do";
      let data = {
        cid: Cookies.get("cid"),
        orderNo: this.orderNumber,
        curtainStatusId: 2,
        allCurtains: this.allCurtains,
        ctmOrderDetails: this.ctmOrderDetails,
        deleteIds: this.deleteIds
      };
      //defeatChange(url, data).then(res => {
      updateCurtainOrder(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$alert("操作成功,已将该订单退回给用户进行确认", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.closeToTab({
            oldUrl: "order/examineDetail",
            newUrl: "order/examine"
          });
        } else {
          this.$alert("操作失败，请稍后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      });
    },
    getDetail() {
      let url = "/order/getOrderContent.do";
      let data = {
        cid: Cookies.get("cid"),
        order_no: Cookies.get("ORDER_NO")
      };
      orderDetail(url, data).then(res => {
        //console.log(res);
        //console.log(res.data.data[0]);
        this.ruleForm.ORDER_NO = Cookies.get("ORDER_NO");
        this.ruleForm = res.data.data[0];
        for (let i = 0; i < this.ruleForm.ORDERBODY.length; i++) {
          this.ruleForm.ORDERBODY[i].checkStatus = "未修改";
        }
        console.log(this.ruleForm.ORDERBODY);
        var recordData = {
          orderNo: this.orderNumber
        };
        getOperationRecord(recordData).then(res => {
          this.operationRecords = res.data;
          console.log("456654");
          console.log(this.operationRecords);
        });
      });
    },
    //退回修改
    _back() {
      let url = "/order/updateCurtainOrder.do";
      let data = {
        cid: Cookies.get("cid"),
        orderNo: this.orderNumber,
        curtainStatusId: 1,
        allCurtains: [],
        ctmOrderDetails: this.ctmOrderDetails
      };
      console.log(this.allCurtains);
      console.log(this.ruleForm.ORDERBODY);
      for (let j = 0; j < this.allCurtains.length; j++) {
        let array = new Array();
        for (let i = 0; i < this.allCurtains[j].length; i++) {
          array[i] = new Object();
          array[i].suggestion = this.allCurtains[j][i].suggestion;
          array[i].lineNo = this.allCurtains[j][i].lineNo;
          array[i].orderItemNumber = this.allCurtains[j][i].orderItemNumber;
          array[i].orderNo = this.orderNumber;
        }
        data.allCurtains.push(array);
      }
      /* for(let j=0;j<this.ruleForm.ORDERBODY.length;j++){
        let array = new Array();
        for(let i=0;i<this.ruleForm.ORDERBODY[j].curtains.length;i++){
          array[i] = new Object;
          //array[i].suggestion=this.ruleForm.ORDERBODY[j].curtains[i].suggestion;
          //array[i].suggestion=this.allCurtains[j][i].suggestion;
          array[i].lineNo=this.ruleForm.ORDERBODY[j].curtains[i].lineNo;
          array[i].orderItemNumber=this.ruleForm.ORDERBODY[j].curtains[i].orderItemNumber;
          array[i].orderNo=this.orderNumber;
        }
        data.allCurtains.push(array);
      } */
      console.log(data.allCurtains);
      //defeatChange(url, data).then(res => {
      updateCurtainOrder(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$alert("操作成功,已将该订单退回给用户修改", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.closeToTab({
            oldUrl: "order/examineDetail",
            newUrl: "order/examine"
          });
        } else {
          this.$alert("操作失败，请稍后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      });
    },
    //审核通过
    _pass() {
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: Cookies.get("ORDER_NO"),
        curtainStatusId: "4"
      };
      passExamine(url, data).then(res => {
        console.log(res);
        if (res.code == 0) {
          var recordData = {
            ORDER_NO: this.orderNum,
            OPERATION_PERSON: Cookies.get("cid"),
            OPERATION_NAME: "审核通过"
          };
          InsertOperationRecord(recordData); //插入操作记录
          this.$alert("操作成功,已通过该订单的审核", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          //this.addTab('order/examine');
          this.closeToTab({
            oldUrl: "order/examineDetail",
            newUrl: "order/examine"
          });
          //跳转
        } else {
          this.$alert("操作失败，请稍后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      });
    },
    //监听状态
    listenStatus() {
      let count = 0;
      console.log(this.ruleForm.ORDERBODY);
      for (let i = 0; i < this.ruleForm.ORDERBODY.length; i++) {
        if (this.ruleForm.ORDERBODY[i].checkStatus == "已通过") {
          count++;
        }
      }
      if (count == this.ruleForm.ORDERBODY.length) {
        this.passORnot = false;
        this.passORback = false;
      }
    },
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"])
  }
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
.childCard {
  width: 90%;
  height: 200px;
  float: left;
}
.tableCard {
  float: left;
  width: 100%;
}
.headSpan {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.zoomRight {
  font-weight: 400;
  font-size: 15px;
  line-height: 30px;
  display: inline-block;
  margin-right: 30px;
  font-weight: bold;
}
.zoomLeft {
  font-size: 15px;
  display: inline-block;
  margin-right: 10px;
}
.timeLeft {
  font-size: 14px;
  line-height: 30px;
  display: inline-block;
}
.timeRight {
  font-size: 14px;
  line-height: 30px;
  display: inline-block;
  margin-right: 20px;
  font-weight: bold;
}
</style>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>