<template>
  <el-submenu v-if="menuTreeItem.children && menuTreeItem.children.length >= 1" :index="menuTreeItem.MenuIndex">
    <template slot="title">
      <i class="iconfont icon-color" v-html="menuTreeItem.IconClass">{{menuTreeItem.IconClass}}</i>
      <span>{{menuTreeItem.MenuName}}</span>
    </template>
    <el-menu-item-group>
      <menuTree v-for="item in menuTreeItem.children" :key="item.SystemMenuID" :menuTreeItem="item"></menuTree>
    </el-menu-item-group>
  </el-submenu>
  <router-link :to="menuTreeItem.MenuLink" v-else tag="div">
    <el-menu-item :index="menuTreeItem.MenuIndex">
      <i v-if="menuTreeItem.IconClass!=''" class="iconfont icon-color" v-html="menuTreeItem.IconClass">{{menuTreeItem.IconClass}}</i>
      <span>{{menuTreeItem.MenuName}}</span>
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