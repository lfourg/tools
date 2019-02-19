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
        <el-input v-model="chart.name" v-popover:popover1 placeholder="名称-特性(eg:渐变、双轴..)"></el-input>
      </el-form-item>
      <el-form-item label="项目">
        <el-popover
          ref="popover2"
          placement="top-start"
          trigger="manual"
          v-model="popover.v2">
          <p>请选择项目</p>
        </el-popover>
        <el-select v-model="chart.project" filterable placeholder="请选择所属项目" v-popover:popover2>
          <el-option
            v-for="item in projects"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
        <span class="add-pro" title="添加项目" @click="addPro"><i class="icon iconfont icon-addfile"></i></span>
      </el-form-item>
      <el-form-item label="模板">
        <el-radio-group v-model="chart.category">
          <el-radio label="Echarts"></el-radio>
          <el-radio label="D3"></el-radio>
          <el-radio label="ThreeJS"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型">
        <div class="chartTypes">
        <span v-for="(item,index) in chartTypes" :class="['item',(item._id==chart.chartType || (chart.chartType == -1 && index == 0))?'active':'']"
              @click="selChartType(item._id)"><i :class="['icon','iconfont',item.icon]"></i><label>{{item.name}}</label></span>
        </div>
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
  import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';
  export default{
    name: 'add',
    props: ['chartTypes',  'chart'],
    data(){
      return {
        isDisabled: false,
        popover: {
          v1: false,
          v2: false,
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        isLogin: 'getIsLogin',
        projects: 'getProjects'
      })
    },
    mounted(){
      console.log('chart:', this.chart);
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
          setTimeout(()=>{
            this.isDisabled=false;
          },1000);
          return;
        }
        if(this.chart.chartType == -1)
          this.chart.chartType = this.chartTypes[0]._id;
        let isAdd = this.chart._id ? false : true;
        if (isAdd) this.chart.user = this.user._id;
        this.chart.updateDate = Date.now();
        this.api.post((isAdd ? "/chart/add" : "/chart/update"), this.chart).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '操作成功' : '操作失败',
            type: res.status ? "success" : "error"
          });
          setTimeout(()=>{
            this.isDisabled=false;
          },1000);
          
          if (res.status){ 
            this.$emit("reloadCharts", true);
          }
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
      },
      addPro(){
        this.$emit("addPro");
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
  .add-pro{
    i{
      font-size: 30px;
      position: absolute;
      margin-left: 20px;
      cursor: pointer;
    }
  }
</style>
