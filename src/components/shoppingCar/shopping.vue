<template>
  <div>
    <el-card shadow="hover" class="clearfix">
      <div slot="header">
        <span class="fstrong f16">购物车：</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <div id="shopSearchBox" class="mt10">
                    <el-input
                        v-model="searchKey" 
                        placeholder="输入商品型号查找商品"
                        style="width:25%; min-width:250px;">
                        <div id="searchBtn" slot="append">搜索</div>
                    </el-input>
        </div>-->
        <el-tab-pane label="墙纸" name="wallPaper">
          <ShoppingWallPaper :wallpaperData="wallpaperData"></ShoppingWallPaper>
        </el-tab-pane>
        <el-tab-pane label="窗帘" name="curtain">
          <ShoppingCurtain :curtainData="curtainData"></ShoppingCurtain>
        </el-tab-pane>
        <el-tab-pane label="软装" name="softSuit">
          <ShoppingSoftSuit></ShoppingSoftSuit>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ShoppingWallPaper from "./shoppingWallPaper";
import ShoppingCurtain from "./shoppingCurtain";
import ShoppingSoftSuit from "./shoppingSoftSuit";
import { getUserMarket } from "@/api/shop";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Cookies from "js-cookie";

export default {
  name: "Shopping",
  data() {
    return {
      searchKey: "",
      allData: [],
      wallpaperData: [],
      curtainData: [],
      softsuitData: []
    };
  },
  components: {
    ShoppingWallPaper,
    ShoppingCurtain,
    ShoppingSoftSuit
  },
  methods: {
    async init() {
      var tempData = await getUserMarket({
        CID: Cookies.get("cid")
      });
      this.allData = tempData.data.cartItems;
      this.wallpaperData = this.allData.wallpaper;
      this.curtainData = this.allData.curtain;
      this.softsuitData = this.allData.soft;
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    handleClick(tab, event) {
      console.log(tab.name);
      this.addTab("shoppingCar/shopping" + "?" + tab.name);
      this.$router.push({
        path: "/shoppingCar/shopping" + "?" + tab.name
      });
    }
  },
  computed: {
    activeName: {
      get() {
        return this.$store.state.navTabs.activeUrlName.split("?")[1];
        return this.$store.state.navTabs.activeParam;
      },
      set(value) {
        //console.log(value);
        //this.$store.commit('navTabs/setActiveTabName','shoppingCar/shopping');
        //this.$store.commit("navTabs/setActiveUrlName", 'shoppingCar/shopping');
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped>
#shopSearchBox div:hover {
  cursor: pointer;
}
#searchBtn {
  color: #101010;
}
</style>