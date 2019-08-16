<template>
  <el-card class="centerCard">
    <div slot="header">
      <span class="headSpan">填写并核对订单信息</span>
      <p @click="dialogOpen" class="charge" style="float:right;">管理收货地址</p>
      <!-- 地址管理信息 -->
      <el-dialog width="70%" @close="dialogClose" title="管理收货信息" :visible.sync="dialogFormVisible">
        <el-button @click="clickNew()" type="success">添加地址</el-button>
        <el-table border :data="data" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column prop="wlContacts" label="收货人" align="center"></el-table-column>
          <el-table-column prop="wlTel" label="联系方式" align="center"></el-table-column>
          <el-table-column label="收货地址">
            <template slot-scope="scope">
              <span>{{ scope.row.province }}</span>
              <span>{{ scope.row.city }}</span>
              <span>{{ scope.row.country }}</span>
              <span>{{ scope.row.postAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.addressId!=0"
                @click="editIt(scope.row)"
                type="warning"
                size="small"
              >编辑</el-button>
              <el-button
                v-show="scope.row.addressId!=0"
                @click="deleteIt(scope.row)"
                type="danger"
                size="small"
              >删除</el-button>
              <span v-show="scope.row.addressId===0">默认地址不可操作</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          width="60%"
          title="地址管理"
          @close="clearRule('form')"
          :visible.sync="innerVisible"
          append-to-body
        >
          <el-select @change="getCity()" style="width:30%;" v-model="value" placeholder="请选择省份">
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item.regionName"
              :value="index"
            ></el-option>
          </el-select>
          <el-select @change="getCountry()" style="width:30%;" v-model="value2" placeholder="请选择城市">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item.regionName"
              :value="index"
            ></el-option>
          </el-select>
          <el-select
            @change="printfCountry()"
            style="width:30%;"
            v-model="value3"
            placeholder="请选择县区"
          >
            <el-option
              v-for="(item,index) in country"
              :key="index"
              :label="item.regionName"
              :value="index"
            ></el-option>
          </el-select>
          <div>
            <el-form :model="form" ref="form" class="demo-ruleForm" :rules="formRules">
              <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
                <el-input
                  style="width:90%;"
                  v-model="form.address"
                  autocomplete="off"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="收货人" :label-width="formLabelWidth" prop="name">
                <el-input
                  style="width:90%;"
                  v-model="form.name"
                  autocomplete="off"
                  placeholder="请输入收货人姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系方式" :label-width="formLabelWidth" prop="telephone">
                <el-input
                  style="width:90%;"
                  v-model="form.telephone"
                  autocomplete="off"
                  placeholder="请输入联系电话"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-button v-if="chageOrAdd" type="danger" @click="changeAddress('form')">确认修改</el-button>
            <el-button v-else type="success" @click="NewAddress('form')">确认添加</el-button>
          </div>
        </el-dialog>
        <!-- 
              <div slot="footer" class="dialog-footer">      123    
                
        </div>-->
      </el-dialog>
      <!-- 查看使用记录 -->
      <el-dialog title="优惠券使用记录" :visible.sync="dialogUse" width="70%">
        <!-- :before-close="handleClose" -->
        <el-table
          empty-text="暂无使用记录"
          :data="useTable"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column align="center" prop="id" label="券号"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="订单号"></el-table-column>
          <el-table-column align="center" prop="itemNo" label="商品型号"></el-table-column>
          <el-table-column align="center" label="使用时间">
            <template slot-scope="scope1">
              <span>{{scope1.row.dateUse |datatrans}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用金额">
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
      <el-dialog title="优惠券返利记录" :visible.sync="dialogBack" width="70%">
        <!-- :before-close="handleClose" -->
        <el-table
          empty-text="暂无返利记录"
          :data="backTable"
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogBack = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>

    <el-card class="childCard" shadow="hover">
      <div slot="header">
        <span class="zoomLeft">甲方：</span>
        <span class="zoomRight">广东玉兰集团股份有限公司</span>
        <span class="zoomLeft">乙方：</span>
        <span class="zoomRight">{{realName}}</span>
        <span class="zoomLeft">经办人：</span>
        <span class="zoomRight">{{chargeData.CUSTOMER_AGENT}}({{chargeData.OFFICE_TEL}})</span>
      </div>
      <div :class="overflow">
        <!-- style="height:160px; overflow:auto;"用三元运算改变高度 -->
        <p v-for="(item,index) of data" :key="index">
          <el-radio
            @change="showAddress"
            v-model="radio"
            :label="index"
            border
          >{{item.wlContacts}} ({{item.wlTel}}) {{item.province}}{{item.city}}{{item.country}}{{item.postAddress}}</el-radio>
          <span v-if="item.addressId===0" style="color:tomato; font-weight:bold;">默认地址</span>
        </p>
      </div>
      <p class="charge" style="font-weight:bold;" @click="showAddress">{{addressAppear}}</p>

      <div class="grayDiv">
        <!-- 配送信息 -->
        <span>选择配送方式：</span>
        <el-select
          @change="changePeiSong"
          style="width:30%; display:inline-block;margin-right:30px;"
          v-model="ctm_order.deliveryType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.deliveryType"
            :label="item.label"
            :value="item.deliveryType"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
        <span>物流公司：</span>
        <el-input
          style="width:30%;"
          :disabled="this.ctm_order.deliveryType==3? false:true"
          v-model="ctm_order.deliveryNotes"
          placeholder="物流备注"
        ></el-input>
        <br />
        <br />
        <span>购买人：</span>
        <el-input style="width:35%;" v-model="ctm_order.buyUser" placeholder="请输入购买者姓名"></el-input>
        <span style=" display:inline-block;margin-left:32px;">联系方式：</span>
        <el-input style="width:30%;" v-model="ctm_order.buyUserPhone" placeholder="请输入联系方式"></el-input>
        <br />
        <span>备注：</span>
        <el-input
          type="textarea"
          maxlength="200"
          :autosize="{ minRows:3, maxRow:4}"
          resize="none"
          v-model="ctm_order.notes"
          placeholder="请输入订单备注(200字以内，任何发货信息写在备注无效！)"
        ></el-input>
        <span style="color:#ccc">{{ctm_order.notes.length}}/200</span>
        <br />
        <span>工程报备单号：</span>
        <el-input style="width:40%;" v-model="ctm_order.projectNo" placeholder="请输入工程报备单号"></el-input>
      </div>

      <el-table :data="ORDERBODY" border style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="itemNo" align="center" label="型号"></el-table-column>
        <!-- :formatter="FixIt"  -->
        <el-table-column align="center" label="数量">
          <template slot-scope="scope1">
            <span>{{scope1.row.qtyRequired}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" align="center" label="单位"></el-table-column>
        <el-table-column prop="promotion" align="center" label="活动类型"></el-table-column>
        <el-table-column prop="partSendId" align="center" :formatter="formatRole" label="发货说明"></el-table-column>
        <el-table-column align="center" label="折后金额">
          <template slot-scope="scope1">
            <span v-if="isManager === '0'">***</span>
            <span v-else>{{scope1.row.finalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="月返利">
          <template slot-scope="scope1">
            <span v-if="isManager === '0'">***</span>
            <span v-else>{{scope1.row.yuefanli}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="年返利">
          <template slot-scope="scope1">
            <span v-if="isManager === '0'">***</span>
            <span v-else>{{scope1.row.nianfanli}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="应付金额">
          <template slot-scope="scope1">
            <span v-if="isManager === '0'">***</span>
            <!-- <span v-else>{{(scope1.row.qtyRequired*scope1.row.finalPrice)-scope1.row.yuefanli-scope1.row.nianfanli | priceFilter}}</span> -->
            <span
              v-else
            >{{scope1.row.finalPrice-scope1.row.yuefanli-scope1.row.nianfanli | priceFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 使用优惠券 -->
    <el-card class="childCard" shadow="never">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="使用优惠券/礼品卡" name="1">
          <div v-for="(item,index) of couponData" :key="index" class="cctv">
            <div class="couponHead">
              <div class="logo"></div>
              <div class="logoTxt">
                <p
                  style="color:white; font-size:15px; padding-top:5px; font-weight:bold; letter-spacing:2px;"
                >{{item.notes}}</p>
                <span>总返利&nbsp;{{item.rebateMoney}}元</span>
                <span class="rightCoupon">券号：{{item.id}}</span>
              </div>
            </div>

            <div class="couponBody">
              <p style="text-align:center">
                <span style="color:rgb(253,59,49); font-size:18px;">余额￥</span>
                <span v-if="isManager === '0'" class="transTxt">***</span>
                <span v-else class="transTxt">{{item.rebateMoneyOver}}</span>
              </p>
              <div style="margin:0 auto; width:245px;">
                <div class="roundedRectangle">
                  <p>&nbsp;&nbsp;&nbsp;有效期：{{item.dateStart | datatrans}}至{{item.dateEnd | datatrans}}</p>
                </div>
                <el-checkbox
                  v-model="couponStatus[index]"
                  @change="changeCoupon(couponStatus[index],item.id,item.rebateType)"
                ></el-checkbox>
              </div>
              <p style="text-align:center;">适用：{{item.application}}</p>
              <div class="Record" style="text-align:center">
                <span
                  @click="RecordUse(item.id)"
                  style="cursor: pointer;"
                >查看使用记录>>&nbsp;&nbsp;&nbsp;</span>
                <span @click="RecordBack(item.id)" style="cursor: pointer;">查看返利记录>></span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="rightDiv">
        <p v-if="isManager === '0'">
          折后总金额：
          <span>***</span>
        </p>
        <p v-else>
          折后总金额：
          <span>{{totalPrice| priceFilter}}</span>
        </p>
        <p v-if="isManager === '0'">
          总返利：
          <span>***</span>
        </p>
        <p v-else>
          总返利：
          <span>{{backPrice| priceFilter}}</span>
        </p>
        <p v-if="isManager === '0'">
          应付总金额：
          <span>***</span>
        </p>
        <p v-else>
          应付总金额：
          <span>{{allSpend| priceFilter}}</span>
        </p>
        <el-button @click="backToOrder" size="medium" type="success" plain>返回订单</el-button>
        <el-button v-if="curtainOrOther" @click="payIt" size="medium" type="danger" plain>立即提交</el-button>
        <el-button
          v-if="!curtainOrOther"
          @click="payCurtain()"
          size="medium"
          type="danger"
          plain
        >确认提交</el-button>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import Cookies from "js-cookie";
import { addAddress } from "@/api/orderList";
import { DeleteShopRecord } from "@/api/orderList";
import { usetheCoupon } from "@/api/orderList";
import { querycharge } from "@/api/orderList";
import { queryCash } from "@/api/orderList";
import { searchTickets } from "@/api/orderList";
import { deleteAddress } from "@/api/orderList";
import { activityPrice } from "@/api/orderList";
import { editAddress } from "@/api/orderList";
import { submitOrder } from "@/api/orderList";
import { CouponUseRecord } from "@/api/orderList";
import { CouponbackRecord } from "@/api/orderList";
import { curtainPay } from "@/api/orderList";
import Axios from "axios";
/* import { mapMutations } from 'vuex' 
import { mapState } from 'vuex' */
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
export default {
  name: "checkOrder",
  data() {
    return {
      arrearsFlag: "",
      isManager: Cookies.get("isManager"),
      cid: "",
      realName: "",
      curtainOrOther: true,
      //返利弹窗
      dialogUse: false,
      dialogBack: false,
      useTable: [],
      backTable: [],
      couponStatus: [false, false],
      Initial_balance: "",
      product_group_tpye: "", //类型
      //获取地址
      transferData: [],
      data: [
        {
          wlContacts: "张三",
          wlTel: "15515515515",
          postAddress: "广东省汕头市潮阳区广东工业大学生活西区",
          addressId: 1
        }
      ],

      formLabelWidth: "80px",
      addressAppear: "更多地址⇣",
      overflow: "",
      addressIt: false,
      radio: 0,
      totalPrice: 2800.0,
      backPrice: 0.0,
      ORDERBODY: [],
      ctm_order: {
        buyUser: "",
        buyUserPhone: "",
        notes: "",
        deliveryNotes: "",
        deliveryType: "1",
        projectNo: "",
        postAddressModified: "0", //新增
        allSpend: "1000",
        deliveryFlag: "0",
        invoiceFlag: "0",
        wlContacts: "test4",
        wlTel: "23432432",
        postAddress: "具体地址",
        reciverArea1: "省",
        reciverArea2: "市",
        reciverArea3: "县"
      },
      options: [
        {
          deliveryType: "1",
          label: "普通物流(运费由甲方负责)"
        },
        {
          deliveryType: "3",
          label: "其它物流公司(运费由乙方负责)"
        }
      ],
      province: [
        {
          regionName: "省份加载中"
        }
      ],
      city: [
        {
          regionName: "城市加载中"
        }
      ],
      country: [
        {
          regionName: "区域加载中"
        }
      ],
      value: "",
      value2: "",
      value3: "",
      chageOrAdd: true,
      notes: "",
      //地址
      dialogFormVisible: false,
      innerVisible: false,
      form: {
        name: "",
        telephone: "",
        address: "",
        theSheng: "",
        shengID: "",
        theshi: "",
        shiID: "",
        thequ: "",
        quID: "",
        addressId: ""
      },
      array2: [],
      array: [],
      activeNames: ["1"],
      couponData: [],
      rebateY: "",
      rebateM: "",
      chargeData: {
        CUSTOMER_AGENT: "",
        OFFICE_TEL: ""
      },
      formRules: {
        telephone: [
          { min: 11, max: 11, message: "请填写正确的手机号码", trigger: "blur" }
        ]
      }
    };
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
    },
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
  computed: {
    //计算总价
    allSpend: function() {
      return this.totalPrice - this.backPrice;
    }
  },
  methods: {
    test(a) {
      console.log(a);
    },
    //清除表单验证规则
    clearRule(formName) {
      this.$refs[formName].resetFields();
    },
    //清空下拉框
    changePeiSong() {
      if (this.ctm_order.deliveryType == 1) {
        this.ctm_order.deliveryNotes = "";
      }
    },
    //将地址按照顺序渲染
    sortAddress() {
      var compare = function(a, b) {
        if (a.addressId < b.addressId) {
          return -1;
        } else if (a.addressId > b.addressId) {
          return 1;
        } else {
          return 0;
        }
      };
      console.log(this.transferData.sort(compare));
      console.log(this.transferData.reverse());
      //console.log(this.transferData.pop());
      var morendizhi = this.transferData.pop();
      this.transferData.unshift(morendizhi);
    },
    //渲染
    Rendering() {
      /* for(var k=0;k<this.array2.length;k++){
              this.array2[k].promotionCost=this.array2[k].promotionCost-this.array2[k].nianfanli-this.array2[k].yuefanli
            } */
      this.$set(this.ORDERBODY, 0, this.array2[0]);
    },
    //表格过滤  --是否允许分批
    formatRole: function(row, column) {
      //return row.PART_SEND_ID ===0? "是":"否";  //预留
      if (row.partSendId == 0) {
        return "等生产";
      } else if (row.partSendId == 1) {
        return "分批发货";
      } else return "--";
    },
    /* FixIt:function(row,column){
        let realVal=parseFloat(row.qtyRequired).toFixed(2);
        return realVal;
      }, */
    //单选框使用优惠券
    changeCoupon(index, id, type) {
      /* console.log(id);
        console.log(typeof id); */
      if (type == "year" && index == true) {
        this.rebateY = id;
      } else if (type == "year" && index == false) {
        this.rebateY = "";
      } else if (type == "month" && index == true) {
        this.rebateM = id;
      } else if (type == "month" && index == false) {
        this.rebateM = "";
      }
      var url = "/order/showRebate.do"; //接口
      var data = {
        product_group_tpye: this.product_group_tpye,
        promotion_cost: this.totalPrice,
        rebateY: this.rebateY,
        rebateM: this.rebateM,
        cid: Cookies.get("cid"),
        ctm_orders: this.array2,
        ctm_order: this.ctm_order
      };
      usetheCoupon(url, data).then(res => {
        console.log(res);
        for (var i = 0; i < res.data.rebate.length; i++) {
          this.array2[i].nianfanli = res.data.rebate[i].rebateYear;
          this.array2[i].yuefanli = res.data.rebate[i].rebateMonth;
          /* this.array2[i].promotionCost=this.array2[i].promotionCost-this.array2[i].nianfanli-this.array2[i].yuefanli */
        }
        this.ORDERBODY = this.array2;
        this.backPrice = res.data.allRebateMonth + res.data.allRebateYear;
        this.Rendering();
      });
    },
    //获取优惠券
    _getTickets() {
      var url = "/order/getRebate.do";
      var data = {
        cid: Cookies.get("cid"),
        companyId: Cookies.get("companyId"),
        typeId: this.product_group_tpye //"A",
      };
      searchTickets(url, data).then(res => {
        console.log(res.data);
        this.couponData = res.data;
        for(let i=0;i<this.couponData.length;i++){
          if(this.couponData[i].dateId === 0){
            this.couponData.splice(i,1)
          }
        }
      });
    },
    RecordUse(itemID) {
      this.useTable = [];
      var url = "/order/findRecrods.do";
      var data = {
        id: itemID
      };
      CouponUseRecord(url, data).then(res => {
        console.log(res);
        this.useTable = res.data;
        this.dialogUse = true;
      });
    },
    RecordBack(itemId) {
      var url = "/order/getReturnRecord.do";
      var data = {
        id: itemId
      };
      CouponbackRecord(url, data).then(res => {
        console.log(res);
        this.backTable = res.data;
        this.dialogBack = true;
      });
    },
    //确定修改地址
    changeAddress(formName) {
      var url = "/postAddress/updatePostAddress.do";
      var data = {
        cid: Cookies.get("cid"),
        addressId: this.form.addressId /* 33, */,
        postAddress: this.form.address /* "其实我不是渣渣曹" */,
        wlContacts: this.form.name /* "渣渣陈" */,
        wlTel: this.form.telephone /* "11011011010", */,
        province: this.form.theSheng /* "广东省" */,
        city: this.form.theshi /* "汕头市" */,
        country: this.form.thequ /* "升平区", */,
        provinceID: this.form.shengID /* "P19" */,
        cityID: this.form.shiID /* "S200" */,
        countryID: this.form.quID /* "D1994" */
      };
      if (data.country == "" || data.country == undefined) {
        data.countryID = "";
      }
      this.$refs[formName].validate(valid => {
        if (
          valid &&
          data.province != undefined &&
          data.city != undefined &&
          this.form.address != undefined &&
          this.form.name != undefined &&
          data.province != "" &&
          data.city != "" &&
          this.form.address != "" &&
          this.form.name != "" &&
          this.form.telephone != "" &&
          this.form.telephone != undefined
        ) {
          editAddress(url, data).then(res => {
            console.log(res);
            console.log("修改地址成功");
            this.dialogFormVisible = false;
            this.innerVisible = false;
            this.allAddress();
            this.$alert("修改地址成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          });
        } else {
          this.$alert("请填写正确信息", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return false;
        }
      });
    },
    //编辑地址弹窗初始化
    editIt(row) {
      //输入框初始化
      console.log(row);
      this.chageOrAdd = true;
      this.innerVisible = true;
      this.value = row.province;
      this.value2 = row.city;
      this.value3 = row.country;
      //表单初始化
      this.form.theSheng = row.province;
      this.form.shengID = row.provinceID;
      this.form.theshi = row.city;
      this.form.shiID = row.cityID;
      this.form.quID = row.countryID;
      this.form.thequ = row.country;
      this.form.address = row.postAddress;
      this.form.name = row.wlContacts;
      this.form.telephone = row.wlTel;
      this.form.addressId = row.addressId;
      //接口
      console.log(row.provinceID);
      console.log(row.province);
      console.log(row.cityID);
      console.log(row.city);
      Axios.post("/areaRegion/getCity.do", {
        regionId: row.provinceID,
        regionName: row.provinceID
      })
        .then(res => {
          console.log(res);
          this.city = res.data.city;
        })
        .catch(error => {
          console.log(error);
        });
      Axios.post("/areaRegion/getCountry.do", {
        regionId: row.cityID,
        regionName: row.city
      })
        .then(res => {
          console.log(res);
          this.country = res.data.country;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //删除地址
    deleteIt(row) {
      console.log(row.addressId);
      this.$confirm("确定删除该地址吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var url = "/postAddress/deletePostAddress.do";
          var data = {
            cid: Cookies.get("cid"),
            addressId: row.addressId
          };
          deleteAddress(url, data).then(res => {
            console.log(res);
            console.log("删除成功!");
            this.dialogFormVisible = false;
            this.innerVisible = false;
            this.allAddress();
            this.$alert("删除成功！", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
            //预留一下
            //this.allAddress();
            //this.data=this.transferData;
          });
        })
        .catch(() => {
          console.log("地址没有删除！！！");
        });
    },
    //输出区县
    printfCountry() {
      var country = this.value3;
      this.form.thequ = this.country[country].regionName;
      this.form.quID = this.country[country].regionId;
    },
    //获取区县
    getCountry() {
      this.value3 = "";
      this.form.thequ = "";
      this.country = [];
      console.log(this.value2);
      var city = this.value2;
      this.form.theshi = this.city[city].regionName;
      this.form.shiID = this.city[city].regionId;
      Axios.post("/areaRegion/getCountry.do", {
        regionId: this.city[city].regionId,
        regionName: this.city[city].regionName
      })
        .then(res => {
          console.log(res);
          this.country = res.data.country;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取城市
    getCity() {
      //新增
      this.form.theshi = "";
      this.form.thequ = "";

      this.value2 = "";
      this.value3 = "";
      //console.log(this.value)
      var shengfen = this.value;
      this.form.theSheng = this.province[shengfen].regionName;
      this.form.shengID = this.province[shengfen].regionId;
      Axios.post("/areaRegion/getCity.do", {
        regionId: this.province[shengfen].regionId,
        regionName: this.province[shengfen].regionName
      })
        .then(res => {
          console.log(res);
          this.city = res.data.city;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取省份
    getProvince() {
      Axios.post("/areaRegion/getProvince.do", {})
        .then(res => {
          console.log(res);
          //console.log(res.data.province[0]);
          this.province = res.data.province;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //弹窗打开事件
    dialogOpen() {
      this.dialogFormVisible = true;
      this.data = this.transferData;
      this.overflow = "overflow";
    },
    //弹窗关闭事件
    dialogClose() {
      this.data = [];
      this.data[0] = this.transferData[0];
      this.overflow = "";
    },
    //新增地址按钮
    clickNew() {
      this.chageOrAdd = false;
      this.innerVisible = true;
      this.form = {};
      this.value = "";
      this.value2 = "";
      this.value3 = "";
    },
    //新增地址
    NewAddress(formName) {
      var url = "/postAddress/addPostAddress.do";
      var data = {
        cid: Cookies.get("cid"),
        postAddress: this.form.address,
        wlContacts: this.form.name,
        wlTel: this.form.telephone,
        province: this.form.theSheng,
        city: this.form.theshi,
        country: this.form.thequ,
        provinceID: this.form.shengID,
        cityID: this.form.shiID,
        countryID: this.form.quID
      };
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (
          valid &&
          data.province != undefined &&
          data.city != undefined &&
          this.form.address != undefined &&
          this.form.name != undefined &&
          data.province != "" &&
          data.city != "" &&
          this.form.address != "" &&
          this.form.name != "" &&
          this.form.telephone != "" &&
          this.form.telephone != undefined
        ) {
          console.log(this.form.telephone);
          addAddress(url, data).then(res => {
            console.log(res);
            console.log("新增成功!!!");
            this.dialogFormVisible = false;
            this.innerVisible = false;
            this.allAddress();
            this.$alert("地址添加成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          });
        } else {
          this.$alert("请完善并填写正确信息", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return false;
        }
      });
    },
    //获取收货地址
    allAddress() {
      Axios.post("/postAddress/getPostAddress.do", {
        cid: Cookies.get("cid")
      })
        .then(res => {
          console.log(res);
          this.transferData = res.data.data;
          this.sortAddress();
          this.data = [];
          this.data[0] = this.transferData[0];

          this.ctm_order.wlTel = this.data[0].wlTel;
          this.ctm_order.wlContacts = this.data[0].wlContacts;
          this.ctm_order.postAddress = this.data[0].postAddress;
          this.ctm_order.reciverArea1 = this.data[0].province;
          this.ctm_order.reciverArea2 = this.data[0].city;
          this.ctm_order.reciverArea3 = this.data[0].country;
          this.ctm_order.allAddress = this.data[0].postAddress;
          console.log(this.ctm_order.allAddress);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    //获取更多地址    测试一下
    showAddress() {
      //this.addressIt=!this.addressIt;
      if (this.addressIt == false) {
        this.overflow = "overflow";
        this.addressAppear = "确定";
        this.data = this.transferData;
        this.addressIt = true;
      } else {
        this.addressIt = false;
        this.overflow = "";
        this.addressAppear = "其它地址⇣";
        var cutPoint = this.radio;
        var abc = this.transferData.splice(cutPoint, 1);
        this.transferData.unshift(abc[0]);
        //this.data=this.transferData;
        this.data = [];
        this.data[0] = this.transferData[0];
        this.radio = 0;

        this.ctm_order.wlTel = this.data[0].wlTel;
        this.ctm_order.wlContacts = this.data[0].wlContacts;
        this.ctm_order.postAddress = this.data[0].postAddress;
        this.ctm_order.reciverArea1 = this.data[0].province;
        this.ctm_order.reciverArea2 = this.data[0].city;
        this.ctm_order.reciverArea3 = this.data[0].country;
        this.ctm_order.allAddress = `${this.ctm_order.reciverArea1}${this.ctm_order.reciverArea2}${this.ctm_order.reciverArea3}${this.ctm_order.postAddress}`;
        console.log(this.ctm_order.allAddress);
        //var abcd=this.data[0].addressId;
        if (this.data[0].addressId == 0) {
          this.ctm_order.postAddressModified = "0";
          console.log("默认地址");
          this.ctm_order.allAddress = this.data[0].postAddress;
        } else {
          this.ctm_order.postAddressModified = "1";
          console.log("这不是默认地址");
        }
      }
    },

    //预留算法 获取活动价
    huodongjia() {
      let getPush = JSON.parse(sessionStorage.getItem("shopping"));
      //var getPush=JSON.parse(Cookies.get('shopping'));  //Cookies.get('shopping') 替换上去 Cookies.get('shopping')
      console.log(getPush);
      this.product_group_tpye = getPush[0].item.groupType; //产品类别
      if (getPush[0].salPromotion != null) {
        this.arrearsFlag = getPush[0].salPromotion.arrearsFlag; //用于活动N/Y
      } else {
        this.arrearsFlag = null;
      }
      console.log(this.arrearsFlag);
      //console.log(this.product_group_tpye);
      for (var i = 0; i < getPush.length; i++) {
        this.array[i] = new Object();
        //判断有没有活动时候传参的不同
        if (getPush[i].activityId == null) {
          this.array[i].pId = "";
        } else {
          this.array[i].pId = getPush[i].activityId;
        }
        this.array[i].item_no = getPush[i].item.itemNo;
        //根据是选择数量还是长*宽
        if (getPush[i].quantity == null) {
          this.array[i].num = (getPush[i].height * getPush[i].width).toFixed(2);
          //this.array[i].prime_cost=(getPush[i].height*getPush[i].width).toFixed(2)*getPush[i].price;
          this.array[i].prime_cost = this.subtotal(
            getPush[i].width,
            getPush[i].height,
            getPush[i].price
          );
        } else {
          this.array[i].num = getPush[i].quantity;
          this.array[i].prime_cost = getPush[i].quantity * getPush[i].price;
        }
      }
      //console.log(this.array);
      var url = "/order/getPromotion.do";
      var data = this.array;
      var allcost = 0;
      console.log(data);
      activityPrice(url, data).then(res => {
        console.log(res);
        for (var j = 0; j < res.data.length; j++) {
          this.array[j].questPrice = res.data[j].promotion_cost;
          allcost += parseFloat(res.data[j].promotion_cost);
        }
        /* allcost=allcost.toString(); */
        //将allspend赋值活动后总价
        this.ctm_order.allSpend = allcost;
        console.log(this.ctm_order.allSpend);
        this.totalPrice = allcost;
        console.log(this.array);
        //console.log(typeof this.totalPrice);
        this.orderList();
      });
    },
    //预留算法 获取订单列表
    orderList() {
      //var array2 =[];
      //var getPush2=JSON.parse(Cookies.get('shopping'));
      var getPush2 = JSON.parse(sessionStorage.getItem("shopping"));
      console.log(getPush2);

      for (var i = 0; i < getPush2.length; i++) {
        this.array2[i] = new Object();
        this.array2[i].curtainWidth = getPush2[i].width;
        this.array2[i].curtainHeight = getPush2[i].height;
        if (getPush2[0].salPromotion != null) {
          this.array2[i].promotionType = getPush2[0].salPromotion.orderType;
          this.array2[i].flagFlType = getPush2[0].salPromotion.falgFl;
        }
        console.log(this.array2[0].promotionType);
        //初始化
        this.array2[i].orderNo = getPush2[i].orderNumber;
        this.array2[i].yuefanli = 0;
        this.array2[i].nianfanli = 0;
        this.array2[i].itemNoSample = getPush2[i].item.itemNo;
        this.array2[i].itemNo = getPush2[i].item.itemNo;
        this.array2[i].partSendId = getPush2[i].splitShipment; //splicement？？？
        this.array2[i].productionVersion = getPush2[i].item.itemVersion;
        //this.array2[i].qtyRequired=getPush2[i].quantity;
        this.array2[i].notes = getPush2[i].note;
        this.array2[i].unitPrice = getPush2[i].price;
        this.array2[i].promotionCost = this.array[i].questPrice.toFixed(2);
        this.array2[i].promotion = getPush2[i].activityName;
        if (this.array2[i].promotion == undefined) {
          this.array2[i].promotion = "无";
        }
        this.array2[i].unit = getPush2[i].unit;
        if (getPush2[i].unit == "平方米") {
          this.array2[i].qtyRequired =
            Math.round(getPush2[i].height * getPush2[i].width * 100) / 100;
        } else {
          this.array2[i].qtyRequired = getPush2[i].quantity;
        }
        //this.array2[i].qtyRequired = this.array2[i].qtyRequired.toFixed(2);
        //this.array2[i].finalPrice = (this.array[i].questPrice/this.array2[i].qtyRequired).toFixed(2);
        this.array2[i].finalPrice = this.array[i].questPrice;
      }
      console.log(this.array2);
      console.log(this.array2[0].promotion);
      this.ORDERBODY = this.array2;
    },
    //窗帘提交结算
    payCurtain() {
      var url = "/order/curOrderCount.do";
      this.ctm_order.orderNo = this.array2[0].orderNo; //真的是傻逼接口
      this.ctm_order.curtainStatusId = "1";
      console.log(this.ctm_order);
      var data = {
        product_group_tpye: this.product_group_tpye, //产品类别，从购物车出获取
        promotion_cost: this.totalPrice, //活动价格【】
        cid: Cookies.get("cid"), //登录用户账号
        companyId: Cookies.get("companyId"),
        rebateY: this.rebateY, //年优惠券编号，有则传，无则传空串
        rebateM: this.rebateM, //月优惠券编号
        arrearsFlag: this.arrearsFlag,
        ctm_order: this.ctm_order,
        ctm_orders: this.array2
      };
      console.log(data);

      if (
        this.ctm_order.deliveryNotes == "" &&
        this.ctm_order.deliveryType == 3
      ) {
        this.$alert("请填写指定的物流公司", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }
      curtainPay(url, data)
        .then(res => {
          console.log(res);
          console.log("成功!!!");
          if (
            /* this.totalPrice */ this.allSpend > this.Initial_balance &&
            this.arrearsFlag != "N"
          ) {
            this.$alert("余额不足，未提交成功，请充值后再提交", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          } else {
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          }
        })
        .then(() => {
          this.closeToTab({
            oldUrl: "order/checkOrder",
            newUrl: "order/myOrder"
          });
        });
    },
    //提交结算
    payIt() {
      var url = "/order/orderCount.do";
      var data = {
        product_group_tpye: this.product_group_tpye, //产品类别，从购物车出获取
        promotion_cost: this.totalPrice, //活动价格【】
        cid: Cookies.get("cid"), //登录用户账号
        companyId: Cookies.get("companyId"),
        rebateY: this.rebateY, //年优惠券编号，有则传，无则传空串
        rebateM: this.rebateM, //月优惠券编号
        arrearsFlag: this.arrearsFlag,
        ctm_order: this.ctm_order,
        ctm_orders: this.array2
      };
      //删除购物车数据
      var deleteArray = [];
      //var getPush3=JSON.parse(Cookies.get('shopping'));
      var getPush3 = JSON.parse(sessionStorage.getItem("shopping"));
      for (var i = 0; i < getPush3.length; i++) {
        deleteArray[i] = getPush3[i].id;
      }
      console.log(deleteArray);
      //console.log(this.ctm_order.deliveryNotes);
      if (
        this.ctm_order.deliveryNotes == "" &&
        this.ctm_order.deliveryType == 3
      ) {
        this.$alert("请填写指定的物流公司", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }
      submitOrder(url, data)
        .then(res => {
          console.log(res);
          console.log("成功!!!");
          if (
            /* this.totalPrice */ this.allSpend > this.Initial_balance &&
            this.arrearsFlag != "N"
          ) {
            this.$alert("余额不足，未提交成功，请充值后再提交", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
          } else {
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            });
          }
        })
        .then(() => {
          DeleteShopRecord(deleteArray); //删除订单信息
          this.closeToTab({
            oldUrl: "order/checkOrder",
            newUrl: "order/myOrder"
          });
        });
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //查询余额
    queryMoney() {
      var url = "/order/getResidemoney.do";
      var data = {
        cid: Cookies.get("cid"),
        companyId: Cookies.get("companyId")
      };
      queryCash(url, data).then(res => {
        console.log(res);
        this.Initial_balance = res.data;
      });
    },
    //查询经办人
    chargeQuery() {
      var url = "/order/getlink.do";
      var data = {
        cid: Cookies.get("cid"),
        companyId: Cookies.get("companyId")
      };
      querycharge(url, data).then(res => {
        console.log(res);
        this.chargeData = res.data;
      });
    },
    //返回订单
    backToOrder() {
      this.closeToTab({
        oldUrl: "order/checkOrder",
        newUrl: "order/myOrder"
      });
    },
    subtotal(width, height, price) {
      let _width = parseFloat(width);
      let _height = parseFloat(height);
      let _price = parseFloat(price);
      let square = Math.round(_width * _height * 100) / 100;
      return Math.round(price * square * 100) / 100;
    }
  },

  created: function() {
    console.log(Cookies.get("isManager"));
    this.getProvince(); //三级联动
    this.allAddress(); //获取地址
    this.huodongjia(); //获取活动价
    this._getTickets(); //获取优惠券
    this.queryMoney(); //余额
    this.chargeQuery(); //经办人
    this.cid = Cookies.get("cid");
    this.realName = Cookies.get("realName");
    console.log(Cookies.get("cur_status"));
    if (Cookies.get("cur_status") == 1) {
      this.curtainOrOther = false;
    } else {
      this.curtainOrOther = true;
    }
  }
};
</script>

<style scoped>
.overflow {
  height: 160px;
  overflow: auto;
}
.charge {
  color: #8bc34a;
  cursor: pointer;
}
.centerCard {
  margin: 0 auto;
  position: relative;
}
.childCard {
  margin: 0 2%;
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
}
.headSpan {
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.grayDiv {
  background: rgb(244, 245, 245);
  padding: 20px;
  line-height: 25px;
  width: 80%;
}
.rightDiv {
  float: right;
  margin-right: 10%;
}
.rightDiv span {
  font-weight: bold;
  color: tomato;
  font-size: 18px;
}

.roundedRectangle {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  color: white;
  width: 225px;
  background: rgb(253, 85, 56);
  border-width: 10px; /*边缘的宽度*/
  border-radius: 15px; /*圆角的大小 */
}
.cctv {
  background: url("./../../../static/coupon.png");
  width: 350px;
  height: 230px;
  margin-right: 10%;
  background-size: 100%;
  background-repeat: no-repeat;
  display: inline-block;
}
.couponHead {
  /* 
  border: 1px solid black; */
  height: 50px;
}
.couponBody {
  height: 170px; /* 
  border: 1px solid black; */
  margin-top: 5px;
}
.logo {
  background: url('./../../../static/logopng.png');
  width: 40px;
  height: 40px;
  background-size: 100%;
  background-repeat: no-repeat;
  border-radius: 50%;
  float: left;
  margin-top: 10px;
  margin-left: 5%;
  margin-right: 3%;
}
.logoTxt span {
  display: inline-block;
  color: white;
}
.transTxt {
  font-size: 40px;
  font-weight: bold;
  background: -webkit-linear-gradient(
    left,
    rgb(253, 59, 49) 22%,
    rgb(253, 128, 67) 50%,
    rgb(253, 168, 77) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.rightCoupon {
  float: right;
  margin-right: 10px;
  /* cursor: pointer; */
}
.Record span:hover {
  color: orange;
}
</style>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
.couponBody .el-checkbox__inner {
  /* background-color:rgb(240,249,235); */
  background: greenyellow;
}
</style>