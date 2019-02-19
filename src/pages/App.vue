<template>
  <div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'pageApp',
    data(){
      return {}
    },
    computed: {},
    components: {},
    methods: {}
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .content{
    margin-top: 54px;
    width: 100%;
  }
</style>
