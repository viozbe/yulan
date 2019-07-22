<template>
  <el-card class="centerCard">
    <div>
      <el-tabs style="display:inline-block;width:580px;" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name></el-tab-pane>
        <el-tab-pane label="已提交" name="1"></el-tab-pane>
        <el-tab-pane label="已接收" name="12"></el-tab-pane>
        <el-tab-pane label="已受理" name="2"></el-tab-pane>
        <el-tab-pane label="已作废" name="3"></el-tab-pane>
        <el-tab-pane label="窗帘待审核" name="90"></el-tab-pane>
      </el-tabs>
      <a target="_blank" style="float:right;" href="http://www.luxlano.com/ddkc/">玉兰·兰居商品-订单及库存查询</a>
    </div>

    <div>
      <el-date-picker
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="日期区间"
        v-model="date1"
        style="width:14%;"
      ></el-date-picker> 至 
      <el-date-picker
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="日期区间"
        v-model="date2"
        style="width:14%;"
      ></el-date-picker>
      <el-select v-model="CommodityType" placeholder="请选择商品类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        @keyup.enter.native="search()"
        placeholder="请输入相关信息搜索订单"
        v-model="find"
        style="width:300px;"
      >
        <el-button @click="search()" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
    </div>
    <div id="outDiv">
      <el-card v-for="(item,index) of data" :key="index">
        <div slot="header">
          <span class="zoomLeft">时间：</span>
          <span class="zoomRight">{{item.DATE_CRE}}</span>
          <span class="zoomLeft">订单号：</span>
          <span class="zoomRight">{{item.ORDER_NO}}</span>
          <span class="zoomLeft">状态：</span>
          <span
            style="color:#8BC34A;font-weight:bold;"
            class="zoomRight"
          >{{item.STATUS_ID | transStatus}}{{item.CURTAIN_STATUS_ID | curtainStatus}}</span>
          <el-tooltip
            v-if="item.STATUS_ID==5||item.STATUS_ID==6||item.STATUS_ID==0"
            class="item"
            effect="dark"
            content="作废订单"
            placement="top"
          >
            <i
              style="float:right;cursor: pointer;"
              class="el-icon-delete"
              @click="deleteOrder(item.ORDER_NO)"
            ></i>
          </el-tooltip>
          <!-- 投诉 -->
          <!-- <el-tooltip class="item" effect="dark" content="我要投诉" placement="left">
        <i @click="addTab('order/mycomplaint')" v-show="item.complaint" style="float:right;cursor: pointer;" class="el-icon-tickets"></i>  
          </el-tooltip><br>-->
        </div>

        <div class="outDiv" style="float:left;width:90%">
          <el-table
            :data="data[index].ORDERBODY"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="ITEM_NO" label="型号" align="center"></el-table-column>
            <el-table-column prop="BRAND_NAME" label="品牌" align="center"></el-table-column>
            <el-table-column prop="NOTE" label="类型" align="center"></el-table-column>
            <el-table-column label="数量" align="center" width="150">
              <template slot-scope="scope1">
                <span v-if="scope1.row.UNIT=='平方米'">{{scope1.row.CURTAIN_HEIGHT}}×{{scope1.row.CURTAIN_WIDTH}}={{scope1.row.QTY_REQUIRED}}</span>
                <span v-else>{{scope1.row.QTY_REQUIRED}}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope1">
                <span v-if="scope1.row.UNIT=='°ü'">包</span>
                <span v-else>{{scope1.row.UNIT}}</span>
              </template>
            </el-table-column>
            <el-table-column label="实际单价" align="center">
              <template slot-scope="scope1">
                <span v-if="isManager === '0'">***</span>
                <!-- <span v-else>{{scope1.row.UNIT_PRICE}}</span> -->
                <span v-else>{{scope1.row.FINAL_COST/scope1.row.QTY_REQUIRED | priceFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="应付金额" align="center">
              <template slot-scope="scope1">
                <span v-if="isManager === '0'">***</span>
                <span v-else>{{scope1.row.FINAL_COST}}</span>
                <!-- <span v-else>{{scope1.row.UNIT_PRICE*scope1.row.QTY_REQUIRED | priceFilter}}</span> -->
              </template>
            </el-table-column>
            <el-table-column align="center" label="出货详情">
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.packDetailId==0?true:false"
                  @click="shipmentDetail(scope.row)"
                  type="primary"
                  size="small"
                >查看详情</el-button>
                <!-- :disabled="scope.row.packDetailId==0?true:false" -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="buttonDiv">
          <p style="width:100px; font-size:18px; color:tomato; text-align:center;">{{item.status}}</p>
          <router-link to="/order/orderDetail">
            <p>
              <el-button
                v-show="detailShow"
                @click="toOrderDetail(item.ORDER_NO,item.STATUS_ID)"
                size="medium"
                type="success"
                plain
              >订单详情</el-button>
            </p>
          </router-link>
          <!--   <p v-if="buttonShow"><el-button  @click="payment(item.logistics)" size="medium" type="danger">马上付款</el-button></p> -->
          <!--   <p v-else><el-button  size="medium" type="primary" plain>再次购买</el-button></p>  -->
          <router-link to="/order/checkOrder">
            <p>
              <el-button
                @click="summitCurtain(item)"
                v-if="item.CURTAIN_STATUS_ID=='4'"
                size="medium"
                type="primary"
                plain
              >提交订单</el-button>
            </p>
          </router-link>
          <router-link to="/order/checkExamine">
            <p>
              <el-button
                @click="toCheckExamine(item.ORDER_NO,item.CURTAIN_STATUS_ID)"
                v-if="item.CURTAIN_STATUS_ID=='0'||item.CURTAIN_STATUS_ID=='1'||item.CURTAIN_STATUS_ID=='2'||item.CURTAIN_STATUS_ID=='3'||item.CURTAIN_STATUS_ID=='4'"
                size="medium"
                type="danger"
              >审核详情</el-button>
            </p>
          </router-link>
          <!-- <p><el-button v-if="item.CURTAIN_STATUS_ID=='2'" @click="_pass(item.ORDER_NO)" size="medium" type="success">确认订单</el-button></p> -->
        </div>
      </el-card>
      <div style="margin:0 25%;" class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getOrderlist, passExamine } from "@/api/orderList";
import { cancelOrder } from "@/api/orderList";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Cookies from "js-cookie";
export default {
  name: "MyOrder",
  data() {
    return {
      isManager: Cookies.get("isManager"),
      data: [
        /* {
            WEB_TJ_TIME:' 2019-1-29 13:00:00 ',
            ORDER_NO:'W1610030066',
            WL_CONTACTS:'测试乙',
            POST_ADDRESS:'广东省广州市番禺区大学城小谷围广东工业大学',
            WL_TEL:'15551551551',
            status:'待收货',
            complaint:true,
            ORDERBODY: [
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:88,
              all_cost:0,
            },
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:88,
              all_cost:0,
            },
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:88,
              all_cost:0,
            },]
            },
            {
            WEB_TJ_TIME:' 2019-1-29 13:00:11 ',
            ORDER_NO:'W1610030066',
            WL_CONTACTS:'测试乙',
            POST_ADDRESS:'广东省广州市番禺区大学城小谷围广东工业大学',
            WL_TEL:'15551551551',
            status:'已收货',
            complaint:false,
            ORDERBODY: [
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:11,
              all_cost:0,
            },
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:11,
              all_cost:0,
            },
            {
              BRAND_NAME: '玉兰',
              NOTE: '窄幅墙纸',
              ITEM_NO: 'NPP002305',
              QTY_REQUIRED:6,
              UNIT_PRICE:11,
              all_cost:0,
            },],} */
      ],
      date1: "",
      date2: "",
      find: "",
      CommodityType: "",
      state_id: "",
      activeName: "",
      limit: 4,
      count: 2,
      currentPage: 1,
      buttonShow: true,
      options: [
        {
          label: "墙纸配套类",
          value: "W"
        },
        {
          label: "窗帘",
          value: "X"
        },
        {
          label: "软装",
          value: "Y"
        }
      ],
      detailShow: true
    };
  },
  filters: {
    transStatus(value) {
      switch (value) {
        case "1":
          return "已提交";
          break;
        case "12":
          return "已接收";
          break;
        case "2":
          return "已受理";
          break;
        case "3":
          return "已作废";
          break;
        case "4":
          return "部分发货";
          break;
        case "5":
          return "余额不足待提交";
          break;
        case "6":
          return "余额不足可提交";
          break;
        case "7":
          return "已完成";
          break;
      }
    },
    curtainStatus(value) {
      switch (value) {
        case "0":
          return "待审核";
          break;
        case "1":
          return "待修改";
          break;
        case "2":
          return "待确认";
          break;
        case "3":
          return "兰居待修改";
          break;
        case "4":
          return "可提交";
          break;
      }
    },
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
  methods: {
    //窗帘提交订单
    summitCurtain(item) {
      console.log(item);
      console.log(item.ORDER_NO);
      let orderBody = item.ORDERBODY;
      let transCookies = [];
      for (let i = 0; i < item.ORDERBODY.length; i++) {
        transCookies[i] = new Object();
        //预留
        transCookies[i].width = item.ORDERBODY[i].CURTAIN_WIDTH;
        transCookies[i].height = item.ORDERBODY[i].CURTAIN_HEIGHT;
        transCookies[i].orderNumber = item.ORDER_NO;
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
        transCookies[i].salPromotion.orderType = item.ORDERBODY[i].PROMOTION_TYPE;
        transCookies[i].salPromotion.arrearsFlag = item.ARREARSFLAG;
      }
      transCookies[0].item.groupType = "E";
      sessionStorage.setItem("shopping", JSON.stringify(transCookies));
      Cookies.set("cur_status", 1);
      this.addTab("order/checkOrder");
      console.log(transCookies);
    },
    //查看审核
    toCheckExamine(value, ID) {
      Cookies.set("ORDER_NO", value);
      Cookies.set("CURTAIN_STATUS_ID", ID);
      this.addTab("order/checkExamine");
    },
    //订单详情
    toOrderDetail(val, status) {
      console.log(val);
      console.log(status);
      //this.find=val;
      Cookies.set("ORDER_NO", val);
      Cookies.set("status_ID", status);
      console.log(Cookies.get("ORDER_NO"));
      console.log(Cookies.get("status_ID"));
      this.addTab("order/orderDetail");

      //console.log(Cookies.get('ORDER_NO'));
      //this.refresh();
    },
    _pass(orderNo) {
      console.log(orderNo);
      var url = "/order/updateCurOrderStatus.do";
      var data = {
        orderNo: orderNo,
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
            this.$alert("操作成功,改订单已经通过审核", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              //this.handleClick('90');
              this.refresh();
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
    //订单获取
    refresh() {
      var url = "/order/getOrders.do";
      var data = {
        companyId: Cookies.get("companyId"),
        limit: "4",
        page: this.currentPage /* .toString(), */,
        cid: Cookies.get("cid"),
        state_id: this.state_id,
        find: this.find /* "W1610030066", */,
        beginTime: this.date1,
        finishTime: this.date2,
        orderType: this.CommodityType,
        curtainStatusId: ""
      };
      if (this.date1 != "" || this.date2 != "") {
        data.beginTime = this.date1 + " 00:00:00";
        data.finishTime = this.date2 + " 23:59:59";
      }
      getOrderlist(url, data).then(res => {
        console.log(res);
        this.count = res.count;
        console.log(res.count);
        this.data = [];
        this.data = res.data;
        console.log(this.data);
      });
    },
    //补充付款  [不用先]
    payment(val) {
      console.log(val);
      this.addTab("order/payment");
    },
    //出货详情
    shipmentDetail(tab) {
      console.log(tab.ORDER_NO);
      console.log(tab.ITEM_NO);
      //console.log(orderNum);
      this.$router.push({
        name: `shipment`,
        params: {
          itemNo: tab.ITEM_NO,
          orderId: tab.ORDER_NO
        }
      });
      this.addTab("order/shipment");
    },
    //标签页切换
    handleClick(tab) {
      console.log(tab);
      var tabName = tab.name;
      if (tabName == "90") {
        this.state_id = 0;
        this.detailShow = false;
      } else {
        this.state_id = tabName;
        this.detailShow = true;
      }
      console.log(this.state_id);
      this.currentPage = 1;
      this.refresh();
    },
    //搜索
    search() {
      this.currentPage = 1;
      //console.log(this.CommodityType);
      this.refresh();
      //console.log(this.find)
    },
    //页面条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //翻页获取订单
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      this.refresh();
    },
    //删除订单
    deleteOrder(pushOrderNum) {
      var url = "/order/cancelOrder.do";
      var data = {
        orderNo: pushOrderNum
      };
      this.$confirm("确定取消订单？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          cancelOrder(url, data).then(res => {
            console.log(res);
            this.refresh();
            this.$alert("删除成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          });
          //预留接口-删除订单
        })
        .catch(() => {
          console.log("还没删");
        });
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.STATUS_ID  == '3') {
        return "fuck-row";
      }
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    }
  },
  //生命周期
  created() {
    this.refresh();
    //this.closeTab('order/checkOrder');
    console.log(Cookies.get("cid"));
    // this.$router.push({
    //   name:`myOrder`
    // });
  }
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
/* .childCard{
    width: 40%;
    float: left;
} */
.zoomLeft {
  font-size: 15px;
  font-weight: bold;
}
p {
  font-size: 13px;
  margin: 2px;
}
.buttonDiv {
  float: right;
  width: 8%;
}
.zoomRight {
  font-weight: 400;
  font-size: 15px;
}
</style>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
.el-table .fuck-row {
  background: #bac5b3;
}
#outDiv .el-card__header {
  padding: 12px 20px;
}
#outDiv .el-card__body {
  padding: 5px 10px;
}
#outDiv .el-card {
  margin-bottom: 15px;
}
</style>