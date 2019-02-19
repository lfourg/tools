<template>
  <div id="chart" class="chart">
  </div>
</template>
<script>
  import echarts from 'echarts'

  export default{
    name: 'echarts',
    props: ["code", "flag"],
    data(){
      return {
        chartInstance: null
      }
    },
    mounted(){
      window.echarts = echarts;
    },
    methods: {
      init(){

        this.loadChart();
      },
      loadChart(){

        var option = eval(this.code);
        if (!this.chartInstance) {
          this.chartInstance = echarts.init(document.getElementById('chart'));
          let that = this;
          window.onresize = function () {
            that.resize();
          }
        }
        this.chartInstance.setOption(option, true);
      },
      resize(){
        this.chartInstance.resize();
      }
    },
    watch: {
      flag: function (val, oldVal) {
        this.loadChart();
        this.resize();
      }
    }
  }
</script>

<style scoped>
  .node {
    font: 10px sans-serif;
  }

  .link {
    stroke: steelblue;
    stroke-opacity: 0.5;
    fill: none;
    pointer-events: none;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
