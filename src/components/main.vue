<template>
  <div class="center">
    <el-container class="page">
      <el-aside :width="asideWidth" style="overflow:hidden;background:white;">
        <el-scrollbar style="height:100%;">
          <div id="aside-header">
            <div id="aside-logo"></div>
            <span>玉兰B2B</span>
          </div>
          <el-menu
            :default-openeds="['shops', 'design', 'shoppingCar']"
            :default-active="url"
            @select="addTab"
            :collapse="asideStatus"
          >
            <!-- <menuTree v-for="item in menuTreeList" :key="item.SystemMenuID" :menuTreeItem="item"></menuTree> -->
            <el-submenu index="shops">
              <template slot="title">
                <i class="iconfont icon-color">&#xe624;</i>
                <span>产品</span>
              </template>
              <el-menu-item-group>
                <router-link to="/shops/wallPaper" tag="div">
                  <el-menu-item index="shops/wallPaper">
                    <span>墙纸配套类</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/shops/curtain" tag="div">
                  <el-menu-item index="shops/curtain">
                    <span>窗帘</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/shops/softSuit" tag="div">
                  <el-menu-item index="shops/softSuit">
                    <span>软装</span>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="shoppingCar">
              <template slot="title">
                <i class="iconfont icon-color">&#xf0179;</i>
                <span>购物车</span>
              </template>
              <el-menu-item-group>
                <router-link to="/shoppingCar/shopping?wallPaper" tag="div">
                  <el-menu-item index="shoppingCar/shopping?wallPaper">
                    <span>墙纸配套类</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/shoppingCar/shopping?curtain" tag="div">
                  <el-menu-item index="shoppingCar/shopping?curtain">
                    <span>窗帘</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/shoppingCar/shopping?softSuit" tag="div">
                  <el-menu-item index="shoppingCar/shopping?softSuit">
                    <span>软装</span>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <router-link to="/order/myOrder" tag="div">
              <el-menu-item v-if="customerType !== '110'" index="order/myOrder">
                <i class="iconfont icon-color">&#xe62b;</i>
                <span slot="title">我的订单</span>
              </el-menu-item>
            </router-link>
            <router-link to="/order/examine" tag="div">
              <el-menu-item v-if="customerType === '110'" index="order/examine">
                <i class="iconfont icon-color">&#xe62b;</i>
                <span slot="title">审核订单</span>
              </el-menu-item>
            </router-link>
            <router-link to="/statement" tag="div">
              <el-menu-item v-if="isManager === '1'" index="statement">
                <i class="el-icon-goods"></i>
                <span slot="title">对账单</span>
              </el-menu-item>
            </router-link>
            <router-link to="/bankProof" tag="div">
              <el-menu-item index="bankProof">
                <i class="iconfont icon-color">&#xe612;</i>
                <span slot="title">银行汇款凭证</span>
              </el-menu-item>
            </router-link>
            <router-link to="/painting" tag="div">
              <el-menu-item v-if="customerType !== '110'" index="painting">
                <i class="iconfont icon-color">&#xe7fb;</i>
                <span slot="title">委托喷绘书</span>
                <el-badge v-if="getPainting > 0" class="mark r" :value="getPainting" />
              </el-menu-item>
            </router-link>
            <router-link to="/yulanPainting" tag="div">
              <el-menu-item v-if="customerType === '110'" index="yulanPainting">
                <i class="iconfont icon-color">&#xe7fb;</i>
                <span slot="title">委托喷绘书</span>
              </el-menu-item>
            </router-link>
            <router-link to="/deputeBrush" tag="div">
              <el-menu-item v-if="isManager === '1'" index="deputeBrush">
                <i class="iconfont icon-color">&#xe617;</i>
                <span slot="title">任务查询</span>
              </el-menu-item>
            </router-link>
            <router-link to="/refundCompensation" tag="div">
              <el-menu-item
                v-if="identity === 'ECWEB'||identity === 'USER'"
                index="refundCompensation"
              >
                <i class="iconfont icon-color">&#xe6ee;</i>
                <span slot="title">退货赔偿</span>
                <el-badge
                  v-if="getRefund > 0 && identity === 'ECWEB'"
                  class="mark r"
                  :value="getRefund"
                />
              </el-menu-item>
            </router-link>
            <el-submenu index="design">
              <template slot="title">
                <i class="iconfont icon-color">&#xe7fb;</i>
                <span>设计</span>
              </template>
              <el-menu-item-group>
                <router-link to="/design/imageShop" tag="div">
                  <el-menu-item index="design/imageShop">
                    <span>形象店设计</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/design/lanJu" tag="div">
                  <el-menu-item index="design/lanJu">
                    <span>兰居设计</span>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <router-link to="/marketInfo" tag="div">
              <el-menu-item index="marketInfo">
                <i class="iconfont icon-color">&#xe627;</i>
                <span slot="title">市场信息</span>
              </el-menu-item>
            </router-link>
            <router-link to="/downloadSpace" tag="div">
              <el-menu-item index="downloadSpace">
                <i class="iconfont icon-color">&#xe614;</i>
                <span slot="title">下载专区</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container style="width:85%; min-width:1050px;">
        <el-header height="50px">
          <ul class="l">
            <li :title="(asideStatus==true)?'菜单展开':'菜单收起'" @click="changeAside">
              <i id="asideControll" class="iconfont">&#xe61e;</i>
            </li>
            <li title="主页" @click="dialogFormVisible = true">
              <i class="iconfont">&#xe65e;</i>
            </li>
            <li title="公告">
              <i class="el-icon-bell"></i>
            </li>
          </ul>
          <ul class="r">
            <li style="height:50px;">
              <el-dropdown trigger="hover" style="margin:0;">
                <span class="el-dropdown-link mr10">
                  <i class="iconfont ml10" style="margin-right:3px;">&#xf0179;</i>
                  购物车
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="min-width: 120px;">
                  <router-link to="/shoppingCar/shopping?wallPaper" tag="li">
                    <el-dropdown-item @click.native="addTab('shoppingCar/shopping?wallPaper')">
                      <span>墙纸配套类</span>
                    </el-dropdown-item>
                  </router-link>
                  <router-link to="/shoppingCar/shopping?curtain" tag="li">
                    <el-dropdown-item @click.native="addTab('shoppingCar/shopping?curtain')">
                      <span>窗帘</span>
                    </el-dropdown-item>
                  </router-link>
                  <router-link to="/shoppingCar/shopping?softSuit" tag="li">
                    <el-dropdown-item @click.native="addTab('shoppingCar/shopping?softSuit')">
                      <span>软装</span>
                    </el-dropdown-item>
                  </router-link>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <router-link to="/order/myOrder" tag="li">
              <li @click="addTab('order/myOrder')">
                <span class="ml10 mr10">我的订单</span>
              </li>
            </router-link>
            <li>
              <el-dropdown trigger="hover">
                <span class="el-dropdown-link">
                  个人中心
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="min-width: 150px;">
                  <el-dropdown-item>历年经销设计书</el-dropdown-item>
                  <el-dropdown-item>修改登录密码</el-dropdown-item>
                  <el-dropdown-item>修改对账密码</el-dropdown-item>
                  <router-link to="/myZone/myCoupon" tag="li">
                    <el-dropdown-item @click.native="addTab('myZone/myCoupon')">我的优惠券</el-dropdown-item>
                  </router-link>
                  <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li @click="screenfull">
              <i class="iconfont ml10 mr10">&#xe663;</i>
            </li>
          </ul>
          <span
            v-if="isManager !== '1'"
            style="color:white;line-height:50px;font-size:12px;"
          >{{'账户：'+cid+' '+realName+' '+'操作员'}}</span>
          <span
            v-else
            style="color:white;line-height:50px;font-size:12px;"
          >{{'账户：'+cid+' '+realName+' '+'管理员'}}</span>
        </el-header>
        <el-main style="margin:0;padding:0;background:#ECF5EF;">
          <el-tabs
            class="tabs"
            v-model="activeTabName"
            @tab-click="getTab"
            @tab-remove="closeTab"
            type="border-card"
          >
            <div id="notice">
              <i
                class="el-icon-bell ml10 mr10 f16"
                style="line-height:30px;color:gold;font-weight:bold;"
              ></i>
              <span style="color:red;margin-right:5px;">最新公告：</span>
              <span>{{adminText}}</span>
              <span class="r f14 mr10" style="line-height:30px;color:red;">
                <strong>
                  <i>{{moneySituation}}</i>
                </strong>
                <i
                  title="刷新余额"
                  :class="refreshMoneyClass"
                  style="color:black;cursor:pointer;"
                  @click="refreshUserMoney"
                ></i>
              </span>
            </div>
            <el-tab-pane
              v-for="item in tabList"
              :key="item.name"
              :name="item.name"
              :label="item.label"
              :closable="item.closable"
            ></el-tab-pane>
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive === true" />
            </keep-alive>
            <router-view v-if="$route.meta.keepAlive !== true" />
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getUserMoney } from "@/api/user";
import { getAllRefund } from "@/api/refund";
import { getIconNumber } from "@/api/painting";
import screenfull from "screenfull";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Vue from "vue";
import Cookies from "js-cookie";
import menuTree from "./menuTree";

export default {
  name: "Main",
  data() {
    return {
      cid: Cookies.get("cid"),
      isManager: Cookies.get("isManager"),
      customerType: Cookies.get("customerType"),
      realName: Cookies.get("realName"),
      identity: Cookies.get("identity"),
      asideUrl: [
        "shops/curtain",
        "shops/softSuit",
        "shops/wallPaper",
        "statement",
        "bankProof",
        "deputeBrush",
        "refundCompensation",
        "design/imageShop",
        "design/lanJu",
        "marketInfo",
        "downloadSpace"
      ],
      asideStatus: false, //false:菜单栏处于展开状态； true：菜单栏处于收起状态
      asideWidth: "200px",
      defaultUrl: "",
      isFullscreen: false,
      adminText: "无新公告发布!",
      moneySituation: "",
      Initial_balance: 0,
      getTheTab: "",
      refreshMoneyClass: "el-icon-refresh-left"
      // dialogFormVisible: false,       //伪登录
      // formLabelWidth: '120px'
    };
  },
  methods: {
    ...mapMutations("navTabs", ["addTab"]),
    ...mapMutations("badge", ["changeBadge"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    /*
            // 切换账号
            // changeId(){
            //     if(this.inputId === ''){
            //         this.$alert('请输入用户id', '提示', {
            //             type: 'warning',
            //             confirmButtonText: '确定'
            //         });
            //         return;
            //     }
            //     if(this.inputCtype === ''){
            //         this.$alert('请输入用户类型', '提示', {
            //             type: 'warning',
            //             confirmButtonText: '确定'
            //         });
            //         return;
            //     }
            //     Cookies.set('cid',this.inputId);
            //     Cookies.set('customerType',this.inputCtype);
            //     console.log(Cookies.get('cid'));
            //     this.userMoney();
            //     this.dialogFormVisible = false;
            //     location.reload();
            // },
            // //取消切换
            // quitId(){
            //     this.inputId = '';
            //     this.inputCtype = '';
            //     this.dialogFormVisible = false;
            // },
        */
    //获取角标情况【退货】
    async addBadgeIcon() {
      if (Cookies.get("identity") === "ECWEB") {
        let _refund = await getAllRefund({
          CID: this.cid,
          page: 1,
          number: 1,
          state: "CUSTOMERAFFIRM"
        });
        this.changeBadge({
          name: "refund",
          index: _refund.count
        });
      }
    },
    //获取角标情况【委托】
    async PaintingIcon() {
      let _refund = await getIconNumber({
        cid: this.cid,
        page: 1,
        limit: 999,
        startDate: "",
        endDate: "",
        state: "CUSTOMERAFFIRM"
      });
      this.changeBadge({
        name: "painting",
        index: _refund.airbrushDesignerAssureList.length
      });
    },
    //获取用户余额情况
    async userMoney() {
      this.refreshMoneyClass = "el-icon-loading";
      this.moneySituation = "";
      getUserMoney(
        {
          cid: this.cid,
          companyId: Cookies.get("companyId")
        },
        { loading: false } //传入参数控制页面是否loading
      )
        .then(res => {
          if (this.isManager != "1") {
            if (res.data < 0) {
              this.moneySituation = "当前余额不足，请尽快打款";
            } else {
              this.moneySituation = "当前余额充足，请继续保持";
            }
          } else {
            this.moneySituation = "当前余额 " + res.data + "元";
          }
          this.refreshMoneyClass = "el-icon-refresh-left";
        })
        .catch(err => {
          //console.log(err);
        });
    },
    refreshUserMoney() {
      this.userMoney();
    },
    //按钮样式--菜单展开收起
    changeAside() {
      this.asideStatus = !this.asideStatus;
      if (this.asideStatus == false) {
        this.asideWidth = "200px";
        document.getElementById("aside-logo").style.display = "block";
        document.getElementById("asideControll").innerHTML = "&#xe61e;";
      } else {
        this.asideWidth = "65px";
        document.getElementById("aside-logo").style.display = "none";
        document.getElementById("asideControll").innerHTML = "&#xe65f;";
      }
    },
    //全屏事件
    screenfull() {
      if (!screenfull.enabled) {
        this.$message({
          message: "您的浏览器不支持全屏!!!",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },
    //是否全屏并按键ESC键的方法
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    //获取当前路径
    getPath() {
      this.defaultUrl = window.location.href.split("#/")[1];
    },
    //点击标签页触发的事件
    getTab(val) {
      console.log(val.name);
      this.$store.commit("navTabs/setActiveUrlName", val.name);
      this.getTheTab = this.$store.state.navTabs.activeUrlName;
      // if(val.name === 'shoppingCar/shopping'){
      //     this.getTheTab = val.name +'?'+ this.$store.state.navTabs.activeParam;
      // }
      // else    this.getTheTab = val.name;
      // console.log(val.name,val.paneName);
    },
    //退出登录
    logout() {
      //清除数据
      Cookies.remove("cid");
      Cookies.remove("customerType");
      //跳转链接
      this.$router.push({
        path: "/login"
      });
    }
  },
  computed: {
    ...mapState("navTabs", ["tabList", "menuTreeList"]),
    getRefund() {
      return this.$store.getters["badge/getRefund"];
    },
    getPainting() {
      return this.$store.getters["badge/getPainting"];
    },
    key() {
      return this.$route.name !== undefined ? this.$route.name : this.$route;
    },
    //切换标签页时导航菜单的变换,用来满足奇怪需求
    url() {
      let index = this.$store.state.navTabs.activeUrlName;
      if (index === "order/orderDetail") {
        return "order/myOrder";
      }
      if (index === "detail/detailWallPaper") {
        return "shoppingCar/shopping?wallPaper";
      }
      if (index === "detail/detailSoftSuit") {
        return "shoppingCar/shopping?softSuit";
      }
      if (index === "detail/detailCurtain") {
        return "shoppingCar/shopping?curtain";
      }
      if (index === "detail/detailRefund") {
        return "refundCompensation";
      }
      return index;
      if (this.getTheTab !== "") return this.getTheTab;
      return this.defaultUrl;
    },
    activeTabName: {
      get() {
        //console.log(this.$store.state.navTabs.activeTabName);
        return this.$store.state.navTabs.activeTabName;
      },
      set(value) {
        console.log(value);
        this.$store.commit("navTabs/setActiveUrlName", value);
        this.$router.push({
          path: "/" + this.$store.state.navTabs.activeUrlName
        });
        // if(value === 'shoppingCar/shopping'){
        //     if(this.$store.state.navTabs.activeParam !== undefined){
        //         this.$router.push({
        //             path: '/'+value+'?'+this.$store.state.navTabs.activeParam,
        //         });
        //     }
        // }
        // else{
        //     this.$router.push({
        //         path: '/'+value
        //     });
        // }
        this.defaultUrl = "";
        this.getPath;
      }
    }
  },
  mounted() {
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
  },
  beforeCreate() {
    if (Cookies.get("cid") === null || Cookies.get("cid") === undefined) {
      Cookies.set("cid", "C01613");
    }
    if (
      Cookies.get("customerType") === null ||
      Cookies.get("customerType") === undefined
    ) {
      Cookies.set("customerType", "02");
    }
  },
  created() {
    this.userMoney();
    this.getPath();
    this.addTab(this.defaultUrl);
    this.addBadgeIcon();
    this.PaintingIcon();
    document.onkeydown = function(event) {
      var key = window.event.keyCode;
      if (key == 27) {
        // alert(1);
        if (this.fullscreen == true) {
          this.handleFullScreen();
        }
      }
    };
    //可以从其他页面触发刷新余额
    this.$root.$on("refreshMoneyEvent", () => {
      this.userMoney();
    });
    // console.log(this.defaultUrl);
  },
  beforeDestroy() {
    clearInterval(this.moneyTimer);
  },
  components: {
    menuTree
  },
  watch: {}
};
</script>

<style scoped>
@media (min-width: 1920px) {
  .center {
    width: 1600px;
    margin: 0 auto;
  }
}
@media (max-width: 1920px) {
  .center {
    width: 1600px;
    margin: 0 auto;
  }
}
@media (max-width: 1680px) {
  .center {
    width: 1500px;
    margin: 0 auto;
  }
}
@media (max-width: 1440px) {
  .center {
    width: 1400px;
    margin: 0 auto;
  }
}
@media (max-width: 1366px) {
  .center {
    width: 1347px;
    margin: 0 auto;
  }
}
@media (max-width: 1280px) {
  .center {
    width: 1260px;
    margin: 0 auto;
  }
} /*>=1280的设备*/
@media (max-width: 1100px) {
  .center {
    width: 1080px;
    margin: 0 auto;
  }
} /*>=1100的设备*/
@media (max-width: 1024px) {
  .center {
    width: 1000px;
    margin: 0 auto;
  }
} /*>=1024的设备*/
/*侧边栏样式*/
#aside-header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: #464c5b;
  font-size: 20px;
  font-weight: bold;
}
#aside-logo {
  width: 42px;
  height: 42px;
  margin-right: 15px;
  line-height: 60px;
  display: inline-block;
  border-radius: 21px;
  background: url("../assets/img/headerLogo.jpg") no-repeat;
  background-size: 42px 42px;
}
.el-menu {
  text-align: left;
}
.el-menu i {
  font-size: 20px;
  margin: 0 20px;
}
.icon-color {
  color: #303133;
}
.el-menu-item-group span {
  margin-left: 45px;
}
.el-icon-goods {
  color: #303133;
}
.el-menu-item.is-active {
  background: #8bc34a;
  color: white;
}
/*顶部导航样式*/
.el-header {
  background: #8bc34a;
  padding: 0 20px 0 10px;
}
.el-header li {
  float: left;
}
.el-header li:hover {
  cursor: pointer;
  background: #86b450;
}
.el-header i {
  line-height: 50px;
  color: white;
}
.el-header ul:nth-child(1) i {
  font-size: 20px;
  margin: 0 10px;
}
.el-header ul:nth-child(2) li span {
  color: white;
  line-height: 50px;
  font-size: 14px;
}
.el-dropdown {
  margin: 0 15px;
}
.el-dropdown-menu__item:hover {
  color: #606266;
  background: #eee;
}
.tabs {
  margin: 0 -4px;
  padding: 0;
  width: 100%;
  height: 40px;
}
#notice {
  width: 100%;
  height: 30px;
  background: white;
  margin-bottom: 10px;
  text-align: left;
  vertical-align: middle;
  font-size: 12px;
}
.vertically {
  position: fixed;
  top: 50%;
  color: #300112;
}
</style>

<style>
.el-card__header {
  padding: 13px 20px !important;
}
.el-menu-item-group__title {
  padding: 4px 0 !important;
}
.el-menu-item,
.el-submenu__title {
  height: 45px !important;
  line-height: 45px !important;
}
.el-submenu .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
}
.el-table td,
.el-table th {
  padding: 8px 0 !important;
}
.el-badge__content {
  border: none !important;
}
.el-table th.gutter {
  display: table-cell !important;
}
.el-table colgroup.gutter {
  display: table-cell !important;
}
</style>

