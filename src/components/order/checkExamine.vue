<template>
  <el-card class="centerCard">
    <el-dialog title="窗帘详情" :show-close="false" :visible.sync="detailVisible" width="1300px">
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
        <el-table-column align="center" prop="QTY_REQUIRED" label="数量"></el-table-column>
        <el-table-column prop="PROMOTION" align="center" label="活动类型"></el-table-column>
        <el-table-column align="center" prop="NOTES" label="备注"></el-table-column>
        <el-table-column prop="LJ_SUGGESTION" align="center" label="兰居备注"></el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row,scope.$index)" type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="check_CURTAIN_STATUS_ID==1"
          align="center"
          prop="checkStatus"
          label="是否修改"
        ></el-table-column>
      </el-table>

      <div style="float:right;margin-top:20px;height:100px;">
        <!-- <p>商品总价格：<span style="color:tomato;font-weight:bold;">{{ruleForm.ALL_SPEND}}</span></p><br> -->
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
        >确认审核通过</el-button>
        <el-button
          :disabled="exButton"
          v-if="check_CURTAIN_STATUS_ID==1"
          @click="LjExamine()"
          size="medium"
          type="success"
        >修改并再次审核</el-button>
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
      curtainData: "",
      renderArray: [],
      tableIndex: "",
      check_CURTAIN_STATUS_ID: "",
      orderNum: "",
      detailVisible: false,
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
    this.orderNum = Cookies.get("ORDER_NO");
    console.log(Cookies.get("CURTAIN_STATUS_ID"));
    //let CURTAIN_STATUS_ID = Cookies.get('CURTAIN_STATUS_ID');
    this.check_CURTAIN_STATUS_ID = Cookies.get("CURTAIN_STATUS_ID");
  },
  methods: {
    closeTheDialog(msg) {
      this.detailVisible = msg;
    },
    getDeleteArr(msg) {
      console.log(msg);
      this.deleteIds = msg;
    },
    //获取修改后的表格数据
    getFinalData(msg) {
      //console.log(msg[0].lineNo);
      if (msg != null) {
        this.saveChange();
      }
      let innerLine = msg[0].lineNo;
      console.log(innerLine);
      this.allCurtains.push(msg);
      for (let a = 0; a < this.allCurtains.length - 1; a++) {
        if (this.allCurtains[a][0].lineNo == innerLine) {
          this.allCurtains.splice(a, 1);
        }
      }
      console.log(this.allCurtains);
    },
    //退回兰居审核
    LjExamine() {
      let url = "/order/updateCurtainOrder.do";
      let data = {
        orderNo: this.orderNum,
        curtainStatusId: 0,
        allCurtains: this.allCurtains
      };
      defeatChange(url, data).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$alert("操作成功,已将该订单退回给兰居进行确认", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.closeToTab({
            oldUrl: "order/checkExamine",
            newUrl: "order/myOrder"
          });
        } else {
          this.$alert("操作失败，请稍后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      });
    },
    //通过订单审核变为可提交状态
    _pass() {
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: this.orderNum,
        curtainStatusId: "4"
      };
      this.$confirm("确认同意兰居修改通过审核？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "info"
      }).then(() => {
        passExamine(url, data).then(res => {
          console.log(res);
          if (res.code == 0) {
            this.$alert("操作成功,该订单已经通过审核", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              //this.addTab('order/myOrder');
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
    _defeat() {
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: this.orderNum,
        curtainStatusId: "3"
      };
      this.$confirm("确定将订单退回兰居重新审核？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "info"
      }).then(() => {
        passExamine(url, data).then(res => {
          console.log(res);
          if (res.code == 0) {
            this.$alert("操作成功,该订单已退回兰居修改", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              //this.addTab('order/myOrder');
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
}
.zoomLeft {
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
}
</style>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>