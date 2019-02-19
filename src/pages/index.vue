<template>
  <div class="con">
    <iframe src="https://zhu18.github.io/visualcontrols/#/map3d/debug" frameborder="0" width="100%" height="100%;">
    </iframe>
  </div>
</template>

<script>
  import Common from '../assets/js/common.js'

  export default{
    name: 'index',
    data(){
      return {}
    },
    components: {},
    created: function () {
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.$store.dispatch("setCurrMenu", {flag: "index"})
      }
    }
  }
</script>

<style scoped lang="scss">
  .con {
    position: fixed;
    top: 50px;
    left: 0px;
    right: 0;
    bottom: 0px;
  }
</style>
