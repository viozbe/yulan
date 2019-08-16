<template>
  <div>
    <el-card shadow="hover">
      <div slot="header">
        <span class="headSpan">任务查询</span>
      </div>
      <el-dialog
        title="订单详情"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="95%"
      >
        <dialogOrderDetail :ruleForm="ruleForm"></dialogOrderDetail>
      </el-dialog>
      <div class="block">
        <el-date-picker
          @change="searchByMonth"
          v-model="date"
          type="month"
          placeholder="请选择月份"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div>
        <p class="fstrong f16" style="margin-top:10px;">我的订单(已提交)信息汇总表:</p>
      </div>
      <el-table
        :data="tableData"
        border
        :summary-method="getSummaries"
        :row-class-name="tableRowClassName"
        show-summary
        style="width: 100%; margin-top:10px"
      >
        <el-table-column>
          <el-table-column prop="DATE_CRE" width="160" label="时间"></el-table-column>
        </el-table-column>
        <el-table-column :label="tableHead1">
          <el-table-column label="订单号">
            <template slot-scope="scope1">
              <!-- <el-button @click="toOrderDetail(scope1.row.ORDER_NO,scope1.row.STATUS_ID)" type="text">{{scope1.row.ORDER_NO}}</el-button> -->
              <el-button
                @click="openDialog(scope1.row.ORDER_NO,scope1.row.STATUS_ID)"
                type="text"
              >{{scope1.row.ORDER_NO}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
              <span>{{scope.row.STATUS_ID|transStatus}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="tableHead2">
          <el-table-column prop="sumMoney" label="订单金额"></el-table-column>
          <el-table-column prop="ALLBACK_Y" label="年返利使用金额"></el-table-column>
        </el-table-column>
        <el-table-column :label="tableHead3">
          <el-table-column prop="ALLBACK_M" label="月返利使用金额"></el-table-column>
          <el-table-column prop="ALL_SPEND" label="实付金额"></el-table-column>
        </el-table-column>
        <el-table-column>
          <el-table-column prop="REBATE_MONEY" label="返利金额"></el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope1">
              <span>{{scope1.row.REBATE_NOTES}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import Axios from "axios";
import Cookies from "js-cookie";
import dialogOrderDetail from "../components/order/dialogOrderDetail";
import { searchAssignments, orderDetail } from "@/api/orderList";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
export default {
  data() {
    return {
      cid: "",
      order_no: "",
      ruleForm: {},
      dialogVisible: false,
      date: "",
      tableData: [],
      assignments: "",
      assignmentsTarget: "",
      assignmentsReduce: "",
      tableHead: "",
      tableHead1: "",
      tableHead2: "",
      tableHead3: ""
    };
  },
  created: function() {
    this.initMonth();
  },
  components: {
    dialogOrderDetail
  },
  methods: {
    openDialog(val, status) {
      this.cid = Cookies.get("cid");
      this.order_no = val;
      console.log(this.cid, this.order_no);
      this.getDetail();
      this.dialogVisible = true;
    },
    //获取当前月份
    initMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      this.date = `${year}-${month}-01`;
      console.log(this.date);
      this.searchByMonth();
    },
    toOrderDetail(val, status) {
      console.log(val, status);
      Cookies.set("ORDER_NO", val);
      Cookies.set("status_ID", status);
      this.addTab("order/orderDetail");
    },
    //计算表格末行
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index >= 3 && index <= 7) {
            sums[index] = sums[index].toFixed(2);
            sums[index] += " 元";
          }
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getDetail() {
      let url = "/order/getOrderContent.do";
      let data = {
        cid: this.cid, //Cookies.get('cid'),'C01613',
        order_no: this.order_no //Cookies.get('ORDER_NO'),'W1906060010b'
      };
      orderDetail(url, data).then(res => {
        console.log(res);
        console.log(res.data.data[0]);
        this.ruleForm = res.data.data[0];
      });
    },
    //按月搜索
    searchByMonth() {
      console.log(this.date);
      this.tableData = [];
      let year = this.date.slice(0, 4);
      let month = this.date.slice(5, 7);
      console.log(year);
      console.log(month);
      let url = "/assignments/getAssignments.do";
      let data = {
        year: year,
        month: month,
        cid: Cookies.get("cid"),
        companyId: Cookies.get("companyId")
      };
      searchAssignments(url, data).then(res => {
        console.log(res);
        let zoom = res.data.orders;
        let reduce = 0;
        for (let i = 0; i < zoom.length; i++) {
          zoom[i].sumMoney =
            zoom[i].ALL_SPEND + zoom[i].ALLBACK_Y + zoom[i].ALLBACK_M;
          reduce += zoom[i].ALL_SPEND;
        }
        console.log(zoom);
        this.tableData = zoom;
        this.assignments = res.data.assignments.assignments;
        this.assignmentsTarget = res.data.assignments.assignmentsTarget;
        this.assignmentsReduce = this.assignmentsTarget - reduce;
        this.tHead();
      });
    },
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //表头
    tHead() {
      this.tableHead = `协议月任务：${this.assignments}\xa0\xa0\xa0\xa0\xa0\xa0\xa0本月促销目标任务：${this.assignmentsTarget}\xa0\xa0\xa0\xa0\xa0\xa0\xa0任务完成差额：${this.assignmentsReduce}`;
      this.tableHead1 = `协议月任务：${this.assignments}`;
      this.tableHead2 = `本月促销目标任务：${this.assignmentsTarget}`;
      this.tableHead3 = `任务完成差额：${this.assignmentsReduce}`;
    }
  },
  filters: {
    transStatus: function(value) {
      switch (value) {
        case "0":
          return "窗帘待审核";
          break;
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
    }
  }
};
</script>
<style scoped>
.headSpan {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
</style>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>