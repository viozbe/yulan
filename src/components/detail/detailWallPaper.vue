<template>
  <div>
    <el-card shadow="hover">
      <div slot="header">
        <span class="fstrong f16">修改商品信息：</span>
        <el-steps
          style="margin-top: -10px;"
          align-center
          class="r scale"
          :space="150"
          :active="1"
          process-status="wait"
          finish-status="success"
        >
          <el-step title="填写商品信息"></el-step>
          <el-step class="ml10 mr10" title="核对订单信息"></el-step>
          <el-step class="ml10" title="成功提交订单"></el-step>
        </el-steps>
      </div>
      <router-link to="/shoppingCar/shopping?wallPaper" tag="div">
        <el-button
          type="info"
          plain
          size="mini"
          class="r mr40"
          @click.native="closeToTab({oldUrl:'detail/detailWallPaper',newUrl: 'shoppingCar/shopping?wallPaper'})"
        >返回</el-button>
      </router-link>
      <div class="dib" style="border-bottom: 1px solid #ebeef5;">
        <p class="fstrong f16">商品信息：</p>
        <table id="messageRight">
          <tr>
            <td>型号：</td>
            <td>{{data.item.itemNo}}</td>
          </tr>
          <tr></tr>
          <tr>
            <td>样本型号：</td>
            <td>{{data.item.oldItemNo}}</td>
          </tr>
          <tr>
            <td>版本名称：</td>
            <td>{{data.item.itemVersion}}</td>
          </tr>
          <tr>
            <td>单位：</td>
            <td>{{data.unit}}</td>
          </tr>
          <tr>
            <td>单价：</td>
            <td>
              <span v-if="customerType === '10'">
                <currency-input
                  v-model="data.price"
                  :placeholder="'请输入单价'"
                  :customStyle="'width: 150px;'"
                  :customClass="customClass"
                ></currency-input>
              </span>
              <span v-else-if="isManager === '0'">***</span>
              <span v-else>{{data.price}}</span>
            </td>
          </tr>
          <tr v-if="customerType === '10'">
            <td>网上销售金额：</td>
            <td>
              <span>
                <currency-input
                  v-model="data.onlineSalesAmount"
                  :placeholder="'请输入网销金额'"
                  :customStyle="'width: 150px;'"
                  :customClass="customClass"
                ></currency-input>
              </span>
            </td>
          </tr>
          <tr>
            <td>
              数量
              <span v-if="data.unit === '平方米'">(宽*高)</span>：
            </td>
            <td>
              <div v-if="data.unit === '平方米'">
                <currency-input
                  :decimalNum="decimalNum"
                  v-model="data.width"
                  :placeholder="'请输入宽度'"
                  :customStyle="'width: 100px;'"
                  :customClass="customClass"
                ></currency-input>×
                <currency-input
                  :decimalNum="decimalNum"
                  v-model="data.height"
                  :placeholder="'请输入高度'"
                  :customStyle="'width: 100px;'"
                  :customClass="customClass"
                ></currency-input>
              </div>
              <div v-else>
                <currency-input
                  :decimalNum="decimalNum"
                  v-model="data.quantity"
                  :placeholder="'请输入数量'"
                  :customStyle="'width: 150px;'"
                  :customClass="customClass"
                ></currency-input>
              </div>
            </td>
          </tr>
          <tr>
            <td>活动：</td>
            <td>
              <el-select
                :disabled="disableFlag"
                v-model="data.activityId"
                :placeholder="(disableFlag === false)?'请选择一个活动':'此产品不参与活动'"
              >
                <el-option
                  v-for="item in activity"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span
                class="pl10 t-red"
                v-if="(data.activityId === data.activityName) && !data.activityEffective"
              >此活动已经过期，请重新选择</span>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td>
              <div class="rel dib" style="width:300px;position:relative;">
                <el-input
                  resize="none"
                  type="textarea"
                  maxlength="200"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  v-model="data.note"
                ></el-input>
                <i
                  class="el-icon-edit"
                  style="position:absolute;
                                        right:10px;bottom:5px;"
                ></i>
              </div>
              <span style="margin-left:10px;">{{data.note?data.note.length:0}}/200</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="mt20">
        <div style="text-align: left; margin-left: 125px;" class="mt20">
          <!-- <el-button type="success" class="mr20">一键购</el-button> -->
          <!-- <router-link to="/shoppingCar/shopping?wallPaper"> -->
          <el-button type="danger" class="ml20" @click.native="update">保存至购物车</el-button>
          <!-- </router-link> -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import { findItemActivity } from "@/api/findActivity";
import { updateShoppingCar, updateShopPrice } from "@/api/shop";
import { checkStore } from "@/api/searchStore";
import { getItemById } from "@/api/orderListASP";

export default {
  name: "DetailWallPaper",
  data() {
    return {
      cid: Cookies.get("cid"),
      customerType: Cookies.get("customerType"),
      isManager: Cookies.get("isManager"), //是否为管理员
      activity: [], //活动
      getParams: this.$route.params.message, //获取到的传参
      data: [], //传过来的数据
      remark: "",
      disableFlag: false, //判断是否禁用选择框
      activityEffective: true, //活动是否过期
      //按钮样式
      customClass: ["qty-btn"],
      decimalNum: 2 //小数位数
    };
  },
  created() {
    if (this.getParams !== undefined) Cookies.set("wallPaper", this.getParams);
    this.data = JSON.parse(Cookies.get("wallPaper"));
    console.log(Cookies.get("wallPaper"));
    console.log(this.data);
    //获得小数位数
    getItemById({ itemNo: this.data.item.itemNo }).then(res => {
      res.data.DECIMAL_PLACES == "1"
        ? (this.decimalNum = 1)
        : (this.decimalNum = 2);
    });
    //查找活动
    this.findShopsActivity();
  },
  computed: {
    //库存总数
    totalStore() {
      //     var total = 0;
      //     for(var i = 0; i < this.store.length; i++){
      //         total += parseInt(this.store[i].stock);
      //     }
      //     return total;
    }
  },
  methods: {
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //找到商品可选活动
    findShopsActivity() {
      //判断活动是否存在，不存在的话将activityId转为activityName，让选择器显示
      if (this.data.activityEffective === false) {
        this.data.activityId = this.data.activityName;
      }
      findItemActivity({
        CID: this.cid,
        customerType: this.customerType,
        itemNo: this.data.item.itemNo,
        itemVersion: this.data.item.itemVersion,
        productType: this.data.item.productType,
        productBrand: this.data.item.productBrand
      })
        .then(res => {
          console.log(res);
          if (res.length === 0 && this.data.activityEffective !== false) {
            this.disableFlag = true;
          } else {
            this.disableFlag = false;
          }
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].second.length; j++) {
              var obj = {
                label:
                  res[i].second[j].orderType + " " + res[i].second[j].orderName,
                value: res[i].second[j].pId
              };
              this.activity.push(obj);
            }
          }
          this.activity.push({
            label: "不参与活动",
            value: null
          });
          console.log(this.activity);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取库存信息
    getStore(row, res) {
      let storeMessage;
      switch (res.msg) {
        case "SUCCESS":
          storeMessage = null;
          this.addToCar(row, storeMessage);
          return;
          break;
        case "waitForProduction":
          this.$confirm("当前库存不足，请等待生产", "提示", {
            confirmButtonText: "等生产",
            cancelButtonText: "返回",
            type: "warning",
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
            .then(() => {
              storeMessage = "0";
              console.log(storeMessage);
              this.addToCar(row, storeMessage);
              return;
            })
            .catch(() => {
              return;
            });
          break;
        case "splitShipment":
          this.$confirm("此型号单个批次库存不满足需求量", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "分批出货",
            cancelButtonText: "等生产",
            type: "warning",
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
            .then(() => {
              storeMessage = "1";
              console.log(storeMessage);
              this.addToCar(row, storeMessage);
              return;
            })
            .catch(action => {
              if (action === "cancel") {
                storeMessage = "0";
                console.log(storeMessage);
                this.addToCar(row, storeMessage);
              }
              return;
            });
          break;
        case "null":
          this.$confirm("当前库存不足，请等待生产", "提示", {
            confirmButtonText: "等生产",
            cancelButtonText: "返回",
            type: "warning",
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
            .then(() => {
              storeMessage = "0";
              console.log(storeMessage);
              this.addToCar(row, storeMessage);
              return;
            })
            .catch(() => {
              return;
            });
          break;
        default:
          storeMessage = "0";
          break;
      }
      // alert(1)
      // this.addToCar(row,storeMessage);
      // return;
    },
    //库存无问题，添加入购物车
    addToCar(row, storeMessage) {
      if (storeMessage === undefined) return;
      if (
        this.data.width === null ||
        this.data.height === null ||
        this.data.width === undefined ||
        this.data.height === undefined
      ) {
        this.data.width = "";
        this.data.height = "";
      }
      if (this.data.quantity === null || this.data.quantity === undefined)
        this.data.quantity = "";
      let changeArr = [];
      let updateObj = {
        commodityID: this.data.id,
        activityID: this.data.activityId,
        quantity: this.data.quantity,
        width: this.data.width,
        height: this.data.height,
        note: this.data.note,
        splitShipment: storeMessage
      };
      if (this.customerType === "10") {
        updateObj.onlineSalesAmount = this.data.onlineSalesAmount;
      }
      changeArr.push(updateShoppingCar(updateObj));
      if (this.customerType === "10") {
        if (this.data.price === "" || !this.data) {
          this.$alert("请输入价格", "提示", {
            type: "warning",
            confirmButtonText: "确定"
          });
          return;
        }
        let obj = {
          commodityID: this.data.id,
          customerType: this.customerType,
          price: this.data.price.toString()
        };
        //将价格修改塞入数组，和修改详情一起处理
        changeArr.push(updateShopPrice(obj));
      }
      Promise.all(changeArr)
        .then(res => {
          console.log(res);
          let result = res[0];
          if (result.code === 0) {
            Cookies.set("wallPaper", this.data);
            this.$alert("此型号已修改成功", "添加成功", {
              confirmButtonText: "确定",
              type: "success",
              showClose: false
            }).then(() => {
              this.addTab("shoppingCar/shopping?wallPaper");
              this.closeTab("detail/detailWallPaper");
            });
          }
        })
        .catch(err => {
          this.$alert(`${err.msg}`, "添加失败", {
            confirmButtonText: "确定",
            type: "warning"
          });
          console.log(err);
        });
    },
    //保存至购物车
    update() {
      let newNum;
      if (this.data.unit === "平方米") {
        newNum = this.data.width * this.data.height;
      } else {
        newNum = this.data.quantity;
      }
      newNum = Number(newNum).toFixed(2);
      if (newNum === "0.00" || newNum === 0.0) {
        this.$alert("数量不能为空", "提示", {
          type: "warning",
          confirmButtonText: "确定"
        });
        return;
      }
      //判断数字合理性
      var re = /((^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$))/;
      if (re.test(newNum) === false) {
        this.$alert("数量栏请填写正确的数字", "提示", {
          type: "warning",
          confirmButtonText: "确定"
        });
        return;
      }
      newNum = newNum.toString();
      let actRe = this.activity.some(item => {
        if (item.value === this.data.activityId) {
          return true;
        }
      });
      if (!actRe) {
        this.$alert("请选择合适的活动", "提示", {
          type: "warning",
          confirmButtonText: "确定"
        });
        return;
      }
      if (this.customerType === "10") {
        if (!this.data.onlineSalesAmount) {
          this.$alert("请填写网上销售金额", "提示", {
            type: "warning",
            confirmButtonText: "确定"
          });
          return;
        }
      }
      checkStore({
        itemNo: this.data.item.itemNo,
        stockShowNum: newNum
      })
        .then(res => {
          this.getStore(this.data, res);
          return;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //判断修改后是否库存满足
    getNum(value) {
      // var total = 0;
      // for(var i = 0; i < this.store.length; i++){
      //     total += parseFloat(this.store[i].stock);
      // }
      // if(this.useStatus == 0 || this.useStatus == 2){
      //     if(total < parseFloat(value)){
      //         this.$alert('您输入的计量已超过当前库存'+total+',自动为您调整为最大值', '提示', {
      //             confirmButtonText: '确定',
      //         });
      //         this.buyNum = total;
      //     }
      // }
      // else{
      //     if(total < parseFloat(value * this.numParam)){
      //         this.$alert('您输入的计量已超过当前库存,请输入合适的值', '提示', {
      //                 confirmButtonText: '确定',
      //         });
      //         this.buyNum = '';
      //         this.numParam = '';
      //     }
      // }
    }
  },
  watch: {}
};
</script>

<style scoped>
.scale {
  transform: scale(0.75, 0.75);
  -ms-transform: scale(0.75, 0.75);
  -moz-transform: scale(0.75, 0.75);
  -webkit-transform: scale(0.75, 0.75);
  -o-transform: scale(0.75, 0.75);
}
#messageRight {
  margin: 20px 40px;
  display: inline-block;
  vertical-align: middle;
}
#messageRight tr td:nth-child(1) {
  font-weight: bold;
  text-align: right;
}
#messageRight tr td:nth-child(2) {
  padding-left: 20px;
}
#messageRight td {
  padding: 5px;
  font-size: 14px;
}
.t-red {
  color: red;
}
.pl10 {
  padding-left: 10px;
}
.qty-btn {
  font-size: 14px;
}
</style>