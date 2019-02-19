<template>
  <div class="container">
    <input v-model="key" type="text" placeholder="请输入查询条件" @keyup.enter="search"/><i
    class="icon iconfont icon-search" @click="search"></i>
  </div>
</template>

<script>
  export default{
    name: 'search',
    data(){
      return {
        key: ''
      }
    },
    methods: {
      search(){

        if (!this.key)return;
        this.$router.push({path: '/chart/search', query: {q: this.key}});
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .container {
    background:$darkGrey3;
    line-height: 0;
    i {
      line-height: 50px;
      position: absolute;
      right: 10px;
      &:hover{
        color:$red;
      }
    }
    > input {
      outline: 0;
      border: 1px solid $darkGrey3;
      background: 0 0;
      padding-left: 10px;
      width: 150px;
      height: 48px;
      line-height: 48px;
      color: $white;
      background-color: transparent;
      -webkit-transition: width .3s ease-out;
      -moz-transition: width .3s ease-out;
      -ms-transition: width .3s ease-out;
      -o-transition: width .3s ease-out;
      transition: width .3s ease-out;
    }
    &:hover  {
      background: $darkGrey;
      input {
        border: 1px solid $red;
        width: 200px;
      }
    }
  }
</style>
