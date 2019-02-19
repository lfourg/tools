<template>
  <div class="container">
    <div class="title clearfix">
      <h2><i class="icon iconfont icon-msnui-item-list"></i>项目列表</h2>
      <div class="operate">
        <el-button size="mini" icon="icon iconfont icon-tianjia" @click="addProject"> 添加</el-button>
        <el-button size="mini" icon="icon iconfont icon-shuaxin" @click="reload"> 刷新</el-button>
      </div>
    </div>
    <div class="list">
      <el-table
        :data="proList"
        style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="pro-member-con">
              <Autocomplete v-if="user.superAdmin || (props.row.manager && props.row.manager._id == user._id)"
                            :project="props.row"></Autocomplete>
              <div><label>项目成员：</label>
                <div v-if="props.row.manager" class="member manager" title="管理员">
                  <i class="icon iconfont icon-guanliyuan"></i>
                  <span>{{props.row.manager.name}}</span>
                </div>
                <div class="member" v-for="(item,index) in props.row.members" title="项目成员">
                  <i class="icon iconfont icon-yonghu"></i>
                  <span>{{item.name}}</span>
                  <i v-if="user.superAdmin || (props.row.manager && props.row.manager._id == user._id)" class="icon iconfont icon-shanchu1"
                     @click="removeMember(index,props.row)" title="踢出"></i>
                  <i v-else-if="user._id==item._id" class="icon iconfont icon-tuichu1"
                     @click="removeMember(index,props.row,true)" title="退出"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="项目名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="创建日期">
          <template slot-scope="scope">
            {{scope.row.createDate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="我发起的项目">
          <template slot-scope="scope">
            <i v-if="scope.row.manager && user._id==scope.row.manager._id" class="icon iconfont icon-duigou"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="图表数量">
          <template slot-scope="scope">
            {{getChartCount(scope.row._id)}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operate" @click="handleEdit(scope.row)"><i class="icon iconfont icon-bianji"></i>编辑</span>
            <span v-if="user.superAdmin || (scope.row.manager && user._id==scope.row.manager._id)" class="operate"
                  @click="handleDelete(scope.row._id)"><i class="icon iconfont icon-shanchu1"></i>删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.index"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
        :prev-text="changePage.prev"
        :next-text="changePage.next"
      >
      </el-pagination>

    </div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="60%" :lock-scroll="false">
      <AddProject :proItem="proItem"
                  @reloadProject="reload"></AddProject>
    </el-dialog>

  </div>
</template>

<script>
  import Common from '../../assets/js/common.js'
  import {mapGetters} from 'vuex'
  import AddProject from '../project/addPro'
  import Autocomplete from './autocomplete.vue'
  import {Loading} from 'element-ui';
  export default{
    name: 'index',
    data(){
      return {
        loading: false,
        pagination: {
          index: 1,
          size: 10,
          total: 0,
        },
        changePage: {
          prev: "上一页",
          next: "下一页"
        },
        proList: [],
        proRelChart: [],
        dialog: {
          visible: false,
          title: '添加项目'
        },
        proItem: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
    components: {
      AddProject, Autocomplete
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.getProRelChartCount();
      },
      getProRelChartCount(){
        this.loading = true;
        this.api.get("/project/chartCount").then((res) => {
          if (res.status) {
            this.proRelChart = res.result;
          }
          this.getProCount();
        });
      },
      getProCount(){
        let params = this.user.superAdmin ? {}:{userId: this.user._id};
        this.api.get("/project/count", params).then((res) => {
          if (res.status) {
            this.pagination.total = res.result;
          }
          this.getProjects();
        });
      },
      getProjects(){
        let params = {
          pageIndex: this.pagination.index - 1,
          pageSize: this.pagination.size,
        };
        if(!this.user.superAdmin) params.userId = this.user._id;
        this.api.post("/project/findByUser", params).then((res) => {
          if (res.status) {
            this.proList = res.result;
          }
          this.loading = false;
        });
      },
      getChartCount(_projectId){
        let _pro;
        this.proRelChart.some((item, index, arr) => {
          if (item._id == _projectId) {
            _pro = item;
            return true;
          }
        })
        return _pro ? _pro.count : '0';
      },
      addProject(){
        this.reset();
        this.dialog.title = "添加项目";
        this.dialog.visible = true;
      },
      handleEdit(_project) {
        this.proItem = {
          _id: _project._id,
          name: _project.name,
          createDate: _project.createDate,
          remark: _project.remark
        };
        this.dialog.title = "编辑项目";
        this.dialog.visible = true;
      },
      handleDelete(_id) {
        if(this.getChartCount(_id)>0) {
          this.$alert('项目下存在图表，请先移除图表', '提示', {
            confirmButtonText: '确定'
          });
          return;
        }
        this.api.post("/project/del", {_id: _id}).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '删除成功' : '删除失败',
            type: res.status ? "success" : "error"
          });
          this.reload();
        });
      },
      handleSizeChange: function (size) {
        this.pagination.size = size;
        this.getProjects();
      },
      handleCurrentChange: function (currentPage) {
        this.pagination.index = currentPage;
        this.getProjects();
      },
      removeMember(_index, _project, isReload){
        _project.members.splice(_index, 1);
        this.api.post("/project/edit", _project).then((res) => {
          if (!res.status) {
            this.$message({
              showClose: true,
              message: '操作失败，请刷新页面',
              type: "error"
            });
          } else if(isReload) {
            this.reload();
          }
        });
      },
      reload(){
        this.dialog.visible = false;
        this.pagination.index = 1;
        this.getProRelChartCount();
        Common.setProjects(this,this.user);
      },
      reset(){
        this.proItem = {
          name: "",
          remark: ""
        };
      }
    },
    watch: {},
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return Common.formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .container {
    margin: 0 30px;
    .title {
      margin: 15px 0;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid $gray2;
      box-shadow: 0 4px 6px -6px $darkGrey3;
      h2 {
        float: left;
        font-size: 18px;
        i {
          font-size: 20px;
          margin-right: 5px;
          color: $red;
        }
      }
      .operate {
        float: right;
      }
    }
    .list {
      border: 1px solid $border;
      position: relative;
      .icon-duigou {
        color: $red;
      }
      .operate {
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          color: $red;
        }
      }
      .pro-member-con {
        .manager{
          padding-right:15px !important;
        }
        .member {
          display: inline-block;
          height: 28px;
          line-height: 28px;
          padding: 0 40px 0 5px;
          margin-right: 8px;
          border-radius: 5px;
          cursor: pointer;
          position: relative;
          -webkit-transition: all .1s;
          -moz-transition: all .1s;
          -ms-transition: all .1s;
          -o-transition: all .1s;
          transition: all .1s;

          .icon-yonghu, .icon-guanliyuan {
            margin-right: 3px;
            font-weight: bold;
          }
          .icon-shanchu1, .icon-tuichu1 {
            position: absolute;
            top: 0;
            right: 0px;
            opacity: 0;
            -webkit-transition: right .3s;
            -moz-transition: right .3s;
            -ms-transition: right .3s;
            -o-transition: right .3s;
            transition: right .3s;
            &:hover {
              color: $error;
            }
          }
          &:hover {
            background-color: $red;
            color: $white;
            .icon-shanchu1, .icon-tuichu1 {
              right: 12px;
              opacity: 1;
            }
          }
        }
        .add-member {
          width: 30px;
          height: 36px;
          line-height: 36px;
          display: inline-block;
          -webkit-transition: width .3s;
          -moz-transition: width .3s;
          -ms-transition: width .3s;
          -o-transition: width .3s;
          transition: width .3s;
          position: relative;
          > div {
            display: none;
          }
          &:hover {
            > div {
              display: block;
            }
            width: 200px;
            i {
              position: absolute;
              right: 10px;
              z-index: 1000;
              color: $red;
              font-weight: bold;
            }
          }
        }
      }
    }
    .pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
