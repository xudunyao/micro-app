<template>
  <nav class="nav">
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-link to="/dashboard">仪表盘</router-link>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #f2f2f2;
  border-radius: 8px;
}
</style>

