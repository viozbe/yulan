<template>
  <div>
    <el-table
      empty-text="暂无返利记录"
      :data="rebateRecordData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="优惠券类型">
        <template slot-scope="scope1">
          <span>{{scope1.row.rebateType |nameTrans}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期">
        <template slot-scope="scope1">
          <span>{{scope1.row.dateCre |datatrans}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效期">
        <template slot-scope="scope1">
          <span>{{scope1.row.dateStart |datatrans}}至{{scope1.row.dateEnd |datatrans}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="返利金额">
        <template slot-scope="scope1">
          <span v-if="isManager === '0'">***</span>
          <span v-else>{{scope1.row.returnMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notes" align="center" label="备注说明"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { CouponbackRecord } from "@/api/orderList";

export default {
  name: "couponRecordDetail",
  props: ["backTable"],
  data() {
    return {
      isManager: Cookies.get("isManager"),
      rebateRecordData: [],
      couponId: '',
    };
  },
  methods: {
    getRebateRecord() {
      this.rebateRecordData = [];
      var url = "/order/getReturnRecord.do";
      var data = {
        id: this.couponId
      };
      CouponbackRecord(url, data).then(res => {
        this.rebateRecordData = res.data;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    }
  },
  filters: {
    datatrans(value) {
      //时间戳转化大法
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
    nameTrans(value) {
      if (value == "year") {
        return "年返券";
      } else if (value == "month") {
        return "月返券";
      } else return "其它券类";
    }
  },
  activated(){
    this.rebateRecordData = this.backTable;
    this.couponId = this.backTable.couponId;
  }
};
</script>