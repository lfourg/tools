<template>
  <div :class="['add-member',isActive?'active':'']">
    <i class="icon iconfont icon-tianjiakehu" @click="showAddInput" title="添加成员"></i>
    <el-autocomplete
      size="mini"
      :fetch-suggestions="querySearchAsync"
      :trigger-on-focus="false"
      :select-when-unmatched="false"
      valueKey="name"
      placeholder="请输入用户名...."
      @select="handleSelect">
    </el-autocomplete>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default{
    name: 'autocomplete',
    props: ['project'],
    data(){
      return {
        isActive: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
    methods: {
      showAddInput(){
        this.isActive = true;
      },
      querySearchAsync(queryString, cb){

        if (!queryString) return;
        this.api.get("/user/find2", {keyword: queryString}).then((res) => {
          if (res.result.length == 0)
            cb([{name: '请更换关键字', _id: -1}]);
          else
            cb(res.result);
        });
      },
      handleSelect(item){
        if (!item || item._id == -1)return;
        let _project = this.project;
        if (!_project.members) _project.members = [];

        let isExist = _project.members.some(function (member) {
          return member._id == item._id;
        });
        if (isExist)return;
        _project.members.push(item);
        this.api.post("/project/edit", _project).then((res) => {
          if (!res.status) {
            this.$message({
              showClose: true,
              message: '添加失败，请刷新列表',
              type: "error"
            });
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .add-member {
    width: 30px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
    position: relative;
    -webkit-transition: width .3s;
    -moz-transition: width .3s;
    -ms-transition: width .3s;
    -o-transition: width .3s;
    transition: width .3s;
    > div {
      display: none;
    }
    i {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      &:hover {
        color: $red;
        font-weight: bold;
      }
    }
  }

  .active {
    width: 200px !important;
    > div {
      display: block !important;
    }
    i {
      position: absolute;
      right: 10px;
      top: 1px;
      z-index: 1000;
    }
  }
</style>
