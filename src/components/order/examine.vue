<template>
  <el-card class="centerCard">
    <div>
      <el-date-picker
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="日期区间"
        v-model="date1"
        style="width:14%;"
      ></el-date-picker>--
      <el-date-picker
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="日期区间"
        v-model="date2"
        style="width:14%;"
      ></el-date-picker>
      <el-select v-model="orderType" placeholder="请选择订单状态">
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
          >{{item.CURTAIN_STATUS_ID | curtainStatus}}</span>
          <span class="zoomLeft">客户名称：</span>
          <span style="color:gray" class="zoomRight">{{item.realName}}</span>
        </div>

        <div class="outDiv" style="float:left;width:90%">
          <el-table
            border
            :data="data[index].ORDERBODY"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="ITEM_NO" label="型号" align="center"></el-table-column>
            <el-table-column prop="BRAND_NAME" label="品牌" align="center"></el-table-column>
            <el-table-column prop="NOTE" label="类型" align="center"></el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope1">
                <span>{{scope1.row.QTY_REQUIRED}}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品单价" align="center">
              <template slot-scope="scope1">
                <span>{{scope1.row.UNIT_PRICE}}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品总价" align="center">
              <template slot-scope="scope1">
                <span>{{scope1.row.UNIT_PRICE*scope1.row.QTY_REQUIRED | priceFilter}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="buttonDiv">
          <p style="width:100px; font-size:18px; color:tomato; text-align:center;">{{item.status}}</p>
          <p>
            <el-button
              v-if="item.CURTAIN_STATUS_ID=='0'||item.CURTAIN_STATUS_ID=='3'"
              @click="toExamineDetail(item.ORDER_NO)"
              size="medium"
              type="success"
              plain
            >审核订单</el-button>
          </p>
          <p>
            <el-button
              @click="toCheckExamine(item.ORDER_NO)"
              size="medium"
              type="primary"
              plain
            >订单详情</el-button>
          </p>
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
import { getOrderlist, getExamineOrder } from "@/api/orderList";
import { cancelOrder } from "@/api/orderList";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Cookies from "js-cookie";
export default {
  name: "MyOrder",
  data() {
    return {
      data: [],
      date1: "",
      date2: "",
      find: "",
      orderType: "",
      state_id: "",
      activeName: "",
      limit: 5,
      count: 2,
      currentPage: 1,
      buttonShow: true,
      options: [
        {
          label: "待审核",
          value: "0"
        },
        {
          label: "待修改",
          value: "1"
        },
        {
          label: "待确认",
          value: "2"
        },
        {
          label: "兰居待修改",
          value: "3"
        },
        {
          label: "可提交",
          value: "4"
        }
      ]
    };
  },
  filters: {
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
    //订单详情
    toExamineDetail(val) {
      Cookies.set("ORDER_NO", val);
      console.log(Cookies.get("ORDER_NO"));
      this.addTab("order/examineDetail");
      /* 
        this.$router.push({
          name:`examineDatail`
        }) */
    },
    toCheckExamine(val) {
      Cookies.set("ORDER_NO", val);
      Cookies.set("CURTAIN_STATUS_ID", 0);
      this.addTab("order/checkExamine");
    },
    //[新]获取审核订单
    getorderList() {
      let url = "/order/gatAllCurOrders.do";
      let data = {
        limit: 5,
        page: this.currentPage,
        find: this.find,
        beginTime: this.date1,
        finishTime: this.date2,
        curtainStatusId: this.orderType
      };
      if (this.date1 != "" || this.date2 != "") {
        data.beginTime = this.date1 + " 00:00:00";
        data.finishTime = this.date2 + " 23:59:59";
      }
      getExamineOrder(url, data).then(res => {
        console.log(res);
        console.log(res.count);
        this.count = res.count;
        this.data = [];
        this.data = res.data;
      });
    },
    //搜索
    search() {
      this.currentPage = 1;
      this.getorderList();
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
      this.getorderList();
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    }
  },
  //生命周期
  created() {
    this.getorderList();
    console.log(Cookies.get("cid"));
  },
  activated: function() {
    this.getorderList();
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