<template>
  <el-menu
    :default-active="current"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    mode="horizontal"
    router>
<!--     <el-menu-item index="standard" route="/standard">
      <i class="el-icon-menu"></i>
      <span slot="title">查看评估标准</span>
    </el-menu-item>
    <el-menu-item index="project" route="/project">
      <i class="el-icon-document"></i>
      <span slot="title">查看评估项目</span>
    </el-menu-item>
    <el-menu-item index="document" route="/document">
      <i class="el-icon-files"></i>
      <span slot="title">管理生成的文档</span>
    </el-menu-item> -->
    <el-menu-item index="register" route="/register">
      <i class="el-icon-user-solid"></i>
      <span slot="title">注册新用户</span>
    </el-menu-item>
<!--     <el-menu-item index="operation" route="/operation">
      <i class="el-icon-s-management"></i>
      <span slot="title">查看操作记录</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script>
export default {
  name: 'Manage',
  data () {
    return {
    }
  },

  computed: {
    current() {
      return this.$route.name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
