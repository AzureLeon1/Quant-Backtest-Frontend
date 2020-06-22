<template>
  <div id="app">
    <Manage />
    <router-view/>
  </div>
</template>

<script>
import Manage from '@/components/Manage'
export default {
  name: 'App',
  components: {
    Manage
  }
}
</script>

<style>
body {
  margin-top: 0
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
