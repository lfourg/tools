<template>
  <div id="chart" class="chart">
    <iframe id="ifPage" src="/static/temp.html" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
  </div>
</template>
<script>

  export default{
    name: 'd3',
    props: ["id", "code", "flag"],
    data(){
      return {
        chartInstance: null
      }
    },
    mounted(){
    },
    methods: {
      init(){
        this.loadChart();
      },
      loadChart(){

        var ifPage = document.getElementById("ifPage").contentWindow;
        ifPage.document.close();
        ifPage.document.write(this.code);
      },
    },
    watch: {
      flag: function (val, oldVal) {
        this.loadChart();
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
