<template>
  <div>
    <el-form ref="chart" :model="chart" label-width="80px">
      <el-form-item label="名称">
        <el-popover
          ref="popover1"
          placement="top-start"
          trigger="manual"
          v-model="popover.v1">
          <p>请输入名称</p>
        </el-popover>
        <el-input v-model="chart.name" v-popover:popover1></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="chart.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled='isDisabled' @click="save">保存</el-button>
        <el-button @click="close">关闭</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default{
    name: 'add',
    props: [],
    data(){
      return {
        isDisabled: false,
        popover: {
          v1: false,
          v2: false,
        }
      }
    },
    mounted(){
    },
    methods: {
      save() {
        
        if(this.isDisabled) return;
        this.isDisabled=true;
        if (!this.chart.name)
          this.popover.v1 = true;
        else if (!this.chart.project)
          this.popover.v2 = true;
        this.initPopover();
        if (this.popover.v1 || this.popover.v2){
            this.isDisabled=false;
            return;
        }
        
        this.api.post((this.chart._id ? "/chart/update" : "/chart/add"), this.chart).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '操作成功' : '操作失败',
            type: res.status ? "success" : "error"
          });
          this.isDisabled=false;
          if (res.status) this.$emit("reloadCharts", true);
        });
      },
      close(){
        this.$emit("reloadCharts");
      },
      selChartType(_id){
        this.chart.chartType = _id;
      },
      initPopover(){
        let that = this;
        setTimeout(function () {
          that.popover.v1 = false;
          that.popover.v2 = false;
        }, 2000);
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .chartTypes {
    margin-bottom: 8px;
    .item {
      margin-right: 10px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      i {
        display: block;
        font-size: 20px;
        border: 1px solid transparent;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
      }
      label {
        display: block;
        height: 18px;
        line-height: 18px;
        padding: 0 12px;
        border: 1px solid transparent;
        transition: all .3s;
        cursor: pointer;
      }
      &:hover {
        i {
          border-color: $gray4;
        }
        label {
          background: $red2;
          color: $white;
          border-color: $red2;
        }
      }
    }
    .active {
      i {
        border-color: $gray4;
      }
      label {
        background: $red;
        color: $white;
        border-color: $red;
      }
    }
  }
</style>
