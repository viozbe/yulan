<template>
  <el-card class="centerCard">
    <el-dialog title="窗帘详情" :show-close="true" :visible.sync="detailVisible" width="92%" top="5vh">
      <keep-alive>
        <detailCurtainTable
          v-if="detailVisible"
          v-bind:tableStatus="check_CURTAIN_STATUS_ID!=1?3:2"
          v-bind:headerData="headerData"
          v-bind:curtainData="curtainData"
          v-bind:suggestion="ljsuggestion"
          v-on:visible="closeTheDialog"
          v-on:deleteArr="getDeleteArr"
          v-on:finalData="getFinalData"
        ></detailCurtainTable>
      </keep-alive>
    </el-dialog>

    <div slot="header">
      <span class="headSpan">订单详情</span>
      <el-button @click="backTowhere()" style="float:right;" size="small" type="success" plain>返回</el-button>
    </div>
    <el-card class="tableCard" shadow="hover" body-style="padding:1px">
      <div slot="header">
        <span class="zoomLeft">
          订单号：
          <span class="zoomRight">{{ruleForm.ORDER_NO}}</span>
        </span>
        <span class="zoomLeft">
          经办人：
          <span class="zoomRight">{{ruleForm.LINKPERSON}}({{ruleForm.TELEPHONE}})</span>
        </span>
        <span class="zoomLeft">
          收货人：
          <span class="zoomRight">{{ruleForm.WL_CONTACTS}}({{ruleForm.WL_TEL}})</span>
        </span>
        <br />
        <span class="zoomLeft">
          收货地址：
          <span
            class="zoomRight"
          >{{ruleForm.RECIVER_AREA1}}{{ruleForm.RECIVER_AREA2}}{{ruleForm.RECIVER_AREA3}}{{ruleForm.POST_ADDRESS}}</span>
        </span>
        <span class="zoomLeft">
          订单备注：
          <span class="zoomRight">{{ruleForm.NOTES}}</span>
        </span>
        <br />
        <span class="zoomLeft">
          玉兰处理说明：
          <span class="zoomRight">{{ruleForm.YULAN_NOTES}}</span>
        </span>
      </div>
      <el-table
        border
        :show-summary="ruleForm.ORDERBODY.length > 1"
        :summary-method="getSummaries"
        :data="ruleForm.ORDERBODY"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column align="center" prop="ITEM_NO" label="型号" width="140"></el-table-column>
        <el-table-column align="center" label="经销单价" width="100">
          <template slot-scope="scope1">
            <span v-if="isManager === '0' && check_CURTAIN_STATUS_ID !=-1">***</span>
            <span v-else>{{scope1.row.UNIT_PRICE |priceFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="QTY_REQUIRED" label="数量" width="60"></el-table-column>
        <el-table-column prop="PROMOTION" align="center" label="活动类型" width="90"></el-table-column>
        <el-table-column
          prop="PART_SEND_ID"
          align="center"
          :formatter="formatRole"
          label="发货说明"
          width="90"
        ></el-table-column>
        <el-table-column prop="PROMOTION_COST" align="center" label="折后金额" width="100">
          <template slot-scope="scope1">
            <span v-if="isManager === '0' && check_CURTAIN_STATUS_ID !=-1">***</span>
            <span v-else>{{scope1.row.PROMOTION_COST}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="BACK_Y" align="center" label="年返利使用金额" width="100">
          <template slot-scope="scope1">
            <span v-if="isManager === '0' && check_CURTAIN_STATUS_ID !=-1">***</span>
            <span v-else>{{scope1.row.BACK_Y}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="BACK_M" align="center" label="月返利使用金额" width="100">
          <template slot-scope="scope1">
            <span v-if="isManager === '0' && check_CURTAIN_STATUS_ID !=-1">***</span>
            <span v-else>{{scope1.row.BACK_M}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="FINAL_COST" align="center" label="应付金额" width="100">
          <template slot-scope="scope1">
            <span v-if="isManager === '0' && check_CURTAIN_STATUS_ID !=-1">***</span>
            <span v-else>{{scope1.row.FINAL_COST}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="NOTES" label="备注"></el-table-column>
        <el-table-column v-if="isX" prop="LJ_SUGGESTION" align="center" label="兰居备注"></el-table-column>
        <el-table-column v-if="isX" align="center" label="窗帘详情" width="100">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row,scope.$index)" type="primary" size="mini">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="check_CURTAIN_STATUS_ID==1 && isX"
          align="center"
          prop="checkStatus"
          label="是否修改"
          width="80"
        ></el-table-column>
      </el-table>

      <div style="float:right;margin-top:20px;margin-right:10px;height:80px;">
        <!-- <p>商品总价格：<span style="color:tomato;font-weight:bold;">{{ruleForm.ALL_SPEND}}</span></p><span> -->
        <el-button
          v-if="check_CURTAIN_STATUS_ID==2"
          @click="_defeat()"
          size="medium"
          type="warning"
        >退回兰居修改</el-button>
        <el-button
          v-if="check_CURTAIN_STATUS_ID==2"
          @click="_pass()"
          size="medium"
          type="success"
        >确认兰居修改</el-button>
        <el-button
          :disabled="exButton"
          v-if="check_CURTAIN_STATUS_ID==1"
          @click="LjExamine()"
          size="medium"
          type="success"
        >确认修改</el-button>
        <el-button
          v-if="((check_CURTAIN_STATUS_ID==0||check_CURTAIN_STATUS_ID==4)&&check_STATUS_ID==0)"
          @click="summitCurtain"
          size="medium"
          type="primary"
        >提交订单</el-button>
        <el-button
          v-if="check_STATUS_ID==5||check_STATUS_ID==6"
          @click="refreshPay()"
          size="medium"
          type="danger"
          plain
        >提交订单</el-button>
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
        <el-steps
          direction="vertical"
          :active="operationRecords.length"
          style="margin-top:10px;margin-left:20px;"
        >
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
  defeatChange,
  queryCash,
  payAgain
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
      deleteIds: [],
      defeatButton: false,
      exButton: true,
      ljsuggestion: "", //兰居审核意见
      cyLineNo: 0,
      allCurtains: [],
      headerData: {},
      isX: false,
      curtainData: "",
      Initial_balance: 0,
      renderArray: [],
      tableIndex: "",
      isManager: Cookies.get("isManager"),
      check_CURTAIN_STATUS_ID: "",
      check_STATUS_ID: "",
      orderNum: "",
      detailVisible: false,
      operationRecords: [],
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
  filters: {
    priceFilter(value) {
      //四舍五入过滤大法
      let realVal = parseFloat(value).toFixed(2);
      //防止出现-0.00；
      if (realVal <= 0) {
        realVal = 0.0;
      }

      return realVal;
    }
  },
  created: function() {
    this.orderNum = Cookies.get("ORDER_NO");
    this.isX = this.orderNum.slice(0, 1) == "X";
    console.log(Cookies.get("CURTAIN_STATUS_ID"));
    this.check_CURTAIN_STATUS_ID = Cookies.get("CURTAIN_STATUS_ID");
    this.check_STATUS_ID = Cookies.get("status_ID");
    this.getDetail();
  },
  methods: {
    formatRole: function(row, column) {
      if (row.PART_SEND_ID == 0) {
        return "等生产";
      } else if (row.PART_SEND_ID == 1) {
        return "分批发货";
      } else return "--";
    },
    closeTheDialog(msg) {
      this.detailVisible = msg;
    },
    getDeleteArr(msg) {
      console.log(msg);
      for (var i = 0; i < msg.length; i++) {
        this.deleteIds.push(msg[i]);
      }
    },
    //获取修改后的表格数据
    getFinalData(msg) {
      if (msg != null) {
        this.saveChange();
      }
      let innerLine = msg[0].lineNo;
      console.log(innerLine);
      this.allCurtains.push(msg);
      //换掉的item赋值
      for (let i = 0; i < msg.length; i++) {
        msg[i].itemId = msg[i].item.itemNo;
      }
      for (let a = 0; a < this.allCurtains.length - 1; a++) {
        if (this.allCurtains[a][0].lineNo == innerLine) {
          this.allCurtains.splice(a, 1);
        }
      }
      console.log(this.allCurtains);
    },
    summitCurtain() {
      var item = this.ruleForm;
      let orderBody = item.ORDERBODY;
      let transCookies = [];
      for (let i = 0; i < item.ORDERBODY.length; i++) {
        transCookies[i] = new Object();
        //预留
        transCookies[i].width = item.ORDERBODY[i].CURTAIN_WIDTH;
        transCookies[i].height = item.ORDERBODY[i].CURTAIN_HEIGHT;
        transCookies[i].orderNumber = item.ORDER_NO;
        transCookies[i].lineNo = item.ORDERBODY[i].LINE_NO;
        transCookies[i].activityId = item.ORDERBODY[i].PROMOTION_TYPE;
        transCookies[i].quantity = item.ORDERBODY[i].QTY_REQUIRED;
        transCookies[i].price = item.ORDERBODY[i].UNIT_PRICE;
        transCookies[i].splitShipment = item.ORDERBODY[i].PART_SEND_ID;
        transCookies[i].activityName = item.ORDERBODY[i].PROMOTION;
        transCookies[i].unit = "米";
        transCookies[i].item = new Object();
        transCookies[i].item.itemNo = item.ORDERBODY[i].ITEM_NO;
        transCookies[i].item.note = item.ORDERBODY[i].NOTES;
        transCookies[i].item.itemVersion = item.ORDERBODY[i].PRODUCTION_VERSION;
        //orderType
        transCookies[i].salPromotion = new Object();
        transCookies[i].salPromotion.orderType =
          item.ORDERBODY[i].PROMOTION_TYPE;
        transCookies[i].salPromotion.arrearsFlag = item.ARREARSFLAG;
      }
      transCookies[0].item.groupType = "E";
      sessionStorage.setItem("shopping", JSON.stringify(transCookies));
      sessionStorage.setItem("shoppingHead", JSON.stringify(item));
      Cookies.set("cur_status", 3);
      this.addTab("order/checkOrder");
      console.log(transCookies);
    },
    //客户修改
    LjExamine() {
      let url = "/order/updateCurtainOrder.do";
      let data = {
        cid: Cookies.get("cid"),
        orderNo: this.orderNum,
        curtainStatusId: "0",
        allCurtains: this.allCurtains,
        deleteIds: this.deleteIds
      };
      //defeatChange(url,data).then(res =>{
      updateCurtainOrder(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$alert("操作成功,请提交结算再次审核", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.check_CURTAIN_STATUS_ID = "0";
          this.getDetail();
        } else {
          this.$alert("操作失败，请稍后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      });
    },
    //确认兰居修改，通过订单审核变为可提交状态
    _pass() {
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: this.orderNum,
        curtainStatusId: "4"
      };
      this.$confirm("确认同意兰居修改？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "info"
      }).then(() => {
        passExamine(url, data).then(res => {
          console.log(res);
          if (res.code == 0) {
            var recordData = {
              ORDER_NO: this.orderNum,
              OPERATION_PERSON: Cookies.get("cid"),
              OPERATION_NAME: "确认兰居修改"
            };
            InsertOperationRecord(recordData); //插入操作记录
            this.$alert("操作成功,该订单已经确认可再次提交", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              this.check_CURTAIN_STATUS_ID = "4";
            });
          } else {
            this.$alert("操作失败，请稍后重试", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
          }
        });
      });
    },
    //退回兰居修改
    _defeat() {
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: this.orderNum,
        curtainStatusId: "3"
      };
      this.$confirm("确定将订单退回兰居重新修改？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "info"
      }).then(() => {
        passExamine(url, data).then(res => {
          console.log(res);
          if (res.code == 0) {
            var recordData = {
              ORDER_NO: this.orderNum,
              OPERATION_PERSON: Cookies.get("cid"),
              OPERATION_NAME: "退回兰居修改"
            };
            InsertOperationRecord(recordData); //插入操作记录
            this.$alert("操作成功,该订单已退回兰居修改", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              this.closeToTab({
                oldUrl: "order/checkExamine",
                newUrl: "order/myOrder"
              });
            });
          } else {
            this.$alert("操作失败，请稍后重试", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
          }
        });
      });
    },
    openDialog(tab, index) {
      this.ljsuggestion = tab.LJ_SUGGESTION;
      console.log(tab);
      console.log(index);
      this.tableIndex = index;
      this.cyLineNo = index + 1;
      this.detailVisible = true;
      for (let i = 0; i < tab.curtains.length; i++) {
        tab.curtains[i].choose = true;
        tab.curtains[i].productType = tab.curtains[i].item.productType;
        tab.curtains[i].itemType = tab.curtains[i].curtainPartName;
        //tab.curtains[i].suggestion='';
        if (tab.curtains[i].unit === "°ü") {
          tab.curtains[i].unit = "包";
        }
      }
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
    //保存修改
    saveChange() {
      this.renderArray = this.ruleForm.ORDERBODY[this.tableIndex];
      this.renderArray.checkStatus = "已修改";
      console.log(this.ruleForm.ORDERBODY);
      console.log(this.renderArray);
      this.Render();
      this.detailVisible = false;
      this.exButton = false;
      this.defeatButton = true;
    },
    //渲染
    Render() {
      this.$set(this.ruleForm.ORDERBODY, this.tableIndex, this.renderArray);
      this.passORback = true;
      console.log(this.ruleForm);
    },
    getDetail() {
      let url = "/order/getOrderContent.do";
      let data = {
        cid: Cookies.get("cid"),
        order_no: Cookies.get("ORDER_NO")
      };
      orderDetail(url, data).then(res => {
        console.log(res);
        console.log(res.data.data[0]);
        this.ruleForm.ORDER_NO = Cookies.get("ORDER_NO");
        this.ruleForm = res.data.data[0];

        for (let i = 0; i < this.ruleForm.ORDERBODY.length; i++) {
          this.ruleForm.ORDERBODY[i].checkStatus = "未修改";
        }
        console.log(this.ruleForm.ORDERBODY);
        var recordData = {
          orderNo: this.orderNum
        };
        getOperationRecord(recordData).then(res => {
          this.operationRecords = res.data;
        });
      });
    },
    //返回指定
    backTowhere() {
      console.log(Cookies.get("customerType"));
      let customerType = Cookies.get("customerType");
      if (customerType == 110) {
        this.addTab("order/examine");
      } else {
        this.addTab("order/myOrder");
      }
    },
    refreshPay() {
      var url = "/order/getResidemoney.do";
      var data = {
        cid: Cookies.get("cid"),
        companyId: Cookies.get("companyId")
      };
      //每次重新提交的时候判断一下余额
      queryCash(url, data).then(res => {
        this.Initial_balance = res.data;
        var url2 = "/order/putAgainOrder.do";
        var data2 = {
          cid: Cookies.get("cid"),
          orderNo: this.orderNum
        };
        if (
          this.ruleForm.ALL_SPEND > this.Initial_balance &&
          this.check_STATUS_ID == 5
        ) {
          //欠款可提交的话可以跳过判断
          this.$alert(
            "余额不足，当前订单还需充值" +
              (this.ruleForm.ALL_SPEND - this.Initial_balance) +
              "元才能提交",
            "提示",
            {
              confirmButtonText: "确定",
              type: "warning"
            }
          );
        } else {
          payAgain(url2, data2).then(res => {
            var recordData = {
              ORDER_NO: this.orderNum,
              OPERATION_PERSON: Cookies.get("cid"),
              OPERATION_NAME: "重新提交"
            };
            InsertOperationRecord(recordData); //插入操作记录
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
            this.$root.$emit("refreshMoneyEvent"); //触发主页面刷新余额
            this.addTab("order/myOrder");
            this.closeTab("order/orderDetail");
          });
        }
      });
    },
    //合计行显示
    getSummaries({ columns, data }) {
      var sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = "总计";
          return;
        } else if (index == 5 || index == 6 || index == 7 || index == 8) {
          var values = data.map(item => Number(item[column.property]));
          var cancelIndex = data.map(item => Number(item["STATUS_ID"])); //取得状态判断是否是作废的
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr, index) => {
              const value = Number(curr);
              if (!isNaN(value) && cancelIndex[index] != "3") {
                //作废的不统计
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2);
            if (this.isManager == "0" && this.check_CURTAIN_STATUS_ID != -1)
              sums[index] = "***";
          } else {
            sums[index] = "";
          }
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.STATUS_ID == "3") {
        return "fuck-row";
      }
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
  font-size: 15px;
  line-height: 30px;
  display: inline-block;
  margin-right: 30px;
  font-weight: bold;
}
.zoomLeft {
  font-size: 15px;
  line-height: 30px;
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
.el-table .fuck-row {
  background: #f0f9eb;
  color: tomato;
  text-decoration: line-through;
}
.centerCard .el-dialog__body {
  padding: 10px;
}
</style>