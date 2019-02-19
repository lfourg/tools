<template>
  <div>
    <el-form ref="proItem" :model="proItem" label-width="80px">
      <el-form-item label="名称">
        <el-popover
          ref="popover1"
          placement="top-start"
          trigger="manual"
          v-model="popover.v1">
          <p>请输入名称</p>
        </el-popover>
        <el-input v-model="proItem.name" v-popover:popover1></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="proItem.remark"></el-input>
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
  export default{
    name: 'add',
    props: ["proItem"],
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
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
        if (!this.proItem.name)
          this.popover.v1 = true;
        else if (!this.proItem)
          this.popover.v2 = true;
        this.initPopover();
        if (this.popover.v1 || this.popover.v2){
          setTimeout(()=>{
            this.isDisabled=false;
          },1000);
          return;
        }
        let isAdd = this.proItem._id ? false : true;
        if (isAdd)
          this.proItem.manager = this.user;
        this.api.post((isAdd ? "/project/add" : "/project/edit"), this.proItem).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '操作成功' : '操作失败',
            type: res.status ? "success" : "error"
          });
          setTimeout(()=>{
            this.isDisabled=false;
          },1000);
          if (res.status) this.$emit("reloadProject", true);
        });
      },
      close(){
        this.$emit("reloadProject");
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

</style>
