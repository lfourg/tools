<template>
  <div class="toolbar">
    <div class="operate">
      操作：
      <div v-if="options.isAdd" class="add"><i @click="add" class="icon iconfont icon-tianjia"></i></div>
    </div>
    <div v-if="options.isShowRecordTotal" class="chart-count">
      总共<span>{{options.recordTotal}}</span>个图表
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default{
    name: 'operate',
    props: ["options"],
    data(){
      return {}
    },
    computed: {
      ...mapGetters({
        isLogin: 'getIsLogin',
      })
    },
    methods: {
      add(){
        if (this.isLogin)
          this.$emit("handleAdd");
        else
          this.$store.dispatch("setLoginDialogState", true);
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .toolbar {
    position: fixed;
    right: 20px;
    top: 60px;
    z-index: 1000;
    padding: 4px 10px;
    background: #fff;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0 0 15px $gray3;
    box-shadow: 0 0 15px $gray3;
    border: 1px solid $gray;
    .operate {
      > div {
        display: inline-block;
        height: 32px;
        width: 32px;
        line-height: 32px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
        background-color: $op1;
        text-align: center;
        color: $white;
        opacity: .8;
        &:hover {
          box-shadow: 0 0 5px $op1;
          opacity: 1;
        }
      }
    }
    .chart-count {
      margin-top: 8px;
      span {
        color: $red;
        width: 26px;
        display: inline-block;
        text-align: center;
      }
    }
  }
</style>
