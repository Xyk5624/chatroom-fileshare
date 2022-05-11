<template>
  <div id="app">
    <router-link to="/files">
      <el-button type="primary">公共文件</el-button>
    </router-link>
    <router-link to="/group">
      <el-button type="primary">群组</el-button>
    </router-link>
    <router-link to="/chat">
      <el-button type="primary">聊天</el-button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    return {
    }
  },
  methods: {
  },
  created() {
  },
  mounted () {
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>