<template>
  <el-submenu v-if="menuTreeItem.children && menuTreeItem.children.length >= 1" :index="menuTreeItem.MENU_INDEX">
    <template slot="title">
      <i v-if="menuTreeItem.ICON_CLASS!=''" class="iconfont icon-color" v-html="menuTreeItem.ICON_CLASS">{{menuTreeItem.ICON_CLASS}}</i>
      <span>{{menuTreeItem.MENU_NAME}}</span>
    </template>
    <el-menu-item-group>
      <menuTree v-for="item in menuTreeItem.children" :key="item.SYSTEMMENU_ID" :menuTreeItem="item"></menuTree>
    </el-menu-item-group>
  </el-submenu>
  <router-link :to="menuTreeItem.MenuLink" v-else tag="div">
    <el-menu-item :index="menuTreeItem.MENU_INDEX">
      <i v-if="menuTreeItem.ICON_CLASS!=''" class="iconfont icon-color" v-html="menuTreeItem.ICON_CLASS">{{menuTreeItem.ICON_CLASS}}</i>
      <span>{{menuTreeItem.MENU_NAME}}</span>
    </el-menu-item>
  </router-link>
</template>

<script>
export default {
  name: "menuTree",
  props: {
      menuTreeItem: {
        type: Object,
        required: true
      }
    },
};
</script>

<style scoped>
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
</style>