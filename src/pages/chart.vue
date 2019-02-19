<template>
  <div>
    <HeaderBar chartPage="true" @handleAdd="addChart"></HeaderBar>
    <div v-if="nav.type == 'search'">
      <AdvanceSearch @advanceSearch='advanceSearch'/>
    </div>
    <div v-loading="loading" element-loading-text="拼命加载中....">
      <div id="container" :class="['navigation']" v-if="nav.isShow">
        <a v-if="nav.type=='type'" :class="['projectItem','-1'==curr.navId?'active':'']" title="全部"
           @click="getCharts(-1)">
          <i :class="['icon','iconfont','icon-quanbugaojing-xiugai']"></i>全部  ({{getChartCount(-1)}})
        </a>
        <a v-for="item in nav.items" :class="['projectItem',item._id==curr.navId?'active':'']" :title="item.name"
           @click="getCharts(item._id)">
          <i v-if="nav.type=='type'" :class="['icon','iconfont',item.icon]"></i>{{item.name}} ({{getChartCount(item._id)}})
        </a>
      </div>
      <div :class="['right-container clearfix',nav.isShow?'mar-left180':'']">
        <div v-if='search.noResult' class="noresult">
          <i :class="['icon','iconfont','icon-wushuju']" />
          <div>没检索到图表，请更换查询条件</div>
        </div>
        <ChartList :charts="curr.charts" :isChange="isChange" @editChart="editChart"
                   @delChart="reloadCharts"></ChartList>
      </div>
    </div>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="60%"
      :lock-scroll="false">
      <AddChart :chartTypes="nav.chartTypes" :chart="curr.chart" @addPro="addPro"
                @reloadCharts="reloadCharts"></AddChart>
    </el-dialog>

    <el-dialog
      :title="dialogPro.title"
      :visible.sync="dialogPro.visible"
      width="40%" :lock-scroll="false">
      <AddProject :proItem="proItem" @reloadProject="reloadPros"></AddProject>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import PerfectScrollbar from 'perfect-scrollbar'
  import HeaderBar from '../components/header2'
  import ChartList from './chart/list'
  import AdvanceSearch from '../components/advanceSearch'
  import AddProject from './project/addPro'
  import AddChart from './chart/addChart'
  import {Loading} from 'element-ui';
  import NProgress from 'nprogress'
  import Common from '../assets/js/common.js'
import { setTimeout } from 'timers';

  export default{
    name: 'index',
    data(){
      return {
        loading: false,
        isChange: true,
        search: {
          noResult: false,
          params:{}
        },
        proItem:{
          name: "",
          remark: ""
        },
        nav: {
          isShow: true,
          type: 'type',
          chartTypes: [],
          items: []
        },
        curr: {
          navId: '',
          typeId: '',
          proId: '',
          chart: {},
          charts: [],
        },
        chartCount: {
          type: [],
          project: []
        },
        dialog: {
          visible: false,
          title: ''
        },
        dialogPro: {
          visible: false,
          title: '添加项目'
        },
        pagination: {
          scrollDisable: false,
          size: 50,
          index: 0,
          total: 0
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        projects: 'getProjects'
      })
    },
    components: {
      ChartList, AddChart, HeaderBar, AddProject, AdvanceSearch
    },
    mounted(){
      NProgress.start();
      NProgress.configure({easing: 'linear', trickleSpeed: 100});

      this.nav.type = this.$route.params.type || 'type';
      this.$store.dispatch("setCurrMenu", {flag: "chart" + this.nav.type});
      let scrollbar = new PerfectScrollbar('#container', {wheelSpeed: 0.5});
      this.init();
      this.scrollEvent();
    },
    methods: {
      init(){

        if (this.nav.type == "search") {
          this.nav.isShow = false;
          this.getCharts();
        }
        this.getChartCountByType();
        this.getChartTypes();
        this.getProjects();
        this.getChartCountByProject();
      },
      scrollEvent(){
        let that = this;
        window.addEventListener('scroll', function () {
          if (document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) {
            // 触发加载数据
            if (!that.pagination.scrollDisable) {
              that.pagination.scrollDisable = true;
              that.pagination.index++;
              that.loadCharts();
            }
          }
        });
      },
      showAni(){
        setTimeout(()=>{
          this.nav.acitve =true;
          var tm = new TimelineMax();
          tm.staggerFrom('.projectItem',.2,{x:-300,opacity:0.3,ease:Back.easeOut},0.1);
        });
      },
      getProjects(){

        if (this.projects.length > 0) {
          this.curr.proId = this.projects[0]._id;
          if (this.nav.type == "pro") {
            this.nav.items = this.projects;
            this.getCharts();
          }
        }else{
           if (this.nav.type == "pro") {
            NProgress.done();
           }
        }
      },
      getChartTypes(){
        this.api.post("/chartType/find", {}).then((res) => {
          if (res.status) {
            this.nav.chartTypes = res.result;
            this.curr.typeId = -1;// this.nav.chartTypes[0]._id;
            if (this.nav.type == "type") {
              this.nav.items = this.nav.chartTypes;
              this.getCharts();
            }
          }
        });
      },
      getChartCountByProject(){
        this.api.get("/project/chartCount", {}).then((res) => {
          if (res.status) {
            this.chartCount.project = res.result;
          }
        });
      },
      getChartCountByType(){
        this.api.get("/chart/countByType", {}).then((res) => {
          if (res.status) {
            this.chartCount.type = res.result;
          }
        });
      },
      getChartCount(_id){
        let _item, temp = this.nav.type == "type" ? "type" : "project",total=0;
        this.chartCount[temp].some((item, index) => {
          if (item._id == _id) {
            _item = item;
            return true;
          }
          total += item.count;
        })
        
        return _id == -1? total : _item ? _item.count : '0';
      },
      getCharts(_id){

        if (_id) {
          this.curr.navId = _id;
          this.curr[this.nav.type == "pro" ? 'proId' : 'typeId'] = _id;
        } else {
          this.curr.navId = this.curr[this.nav.type == "pro" ? 'proId' : 'typeId'];
        }

        this.pagination.total = this.getChartCount(this.curr.navId);
        this.search.params= this.getSearchParam();
        this.curr.charts = [];
        this.pagination.index = 0;
        this.pagination.scrollDisable = false;
        this.isChange = !this.isChange;
        this.loadCharts();
      },
      getSearchParam(){

        let params={}, query = this.$route.query;
        if (this.nav.type == "pro") {
          params = {project: this.curr.proId};
        } else if (this.nav.type == "type") {
          if(this.curr.typeId != -1)
            params = {chartType: this.curr.typeId};
        } else if (query.u) {
          params = {user: query.u};
        } else {  //搜索
          params = {keyword: query.q || ''};
        }
        return params;
      },
      loadCharts(){
        NProgress.start();
        //this.loading = true;
        let _chart = this.search.params;
        let params = {
          pageIndex: this.pagination.index,
          pageSize: this.pagination.size,
          chart: _chart
        };
        this.api.post("/chart/find", params).then((res) => {
          if (res.status) {
            this.curr.charts.push(...res.result);
            
            if(_chart.keyword && res.result.length  == 0)
              this.search.noResult=true;
            else
              this.search.noResult = false;

            if (res.result.length < 50)
              this.pagination.scrollDisable = true;
            else
              this.pagination.scrollDisable = false;
          }
          
          /*if ((this.pagination.index + 1) * this.pagination.size < this.pagination.total)
            this.pagination.scrollDisable = false;
          else
            this.pagination.scrollDisable = true;*/
          NProgress.set(.99);
          setTimeout(() => {
            NProgress.done();
          }, 100)
          //this.loading = false;
        });
      },
      advanceSearch(_type,_key){

        this.search.params = {type:_type,keyword:_key};
        this.curr.charts = [];
        this.pagination.index = 0;
        this.pagination.scrollDisable = false;
        this.isChange = !this.isChange;
        this.loadCharts();
      },
      addChart(){
        this.reset();
        this.dialog.title = "添加图表";
        this.dialog.visible = true;
      },
      editChart(_chart){
        this.curr.chart = {
          _id: _chart._id,
          name: _chart.name,
          project: _chart.project._id,
          category: _chart.category,
          chartType: _chart.chartType,
          remark: _chart.remark
        };
        this.dialog.title = "编辑图表";
        this.dialog.visible = true;
      },
      addPro(){
        this.dialogPro.visible = true;
      },
      reloadPros(isReload){
          this.dialogPro.visible = false;
          if(isReload) {
            Common.setProjects(this,this.user);
            setTimeout(()=>{
              if(this.projects && this.projects.length>0)
                this.curr.chart.project = this.projects[0]._id;
            },1000);
          }
      },
      reloadCharts(isReload){
        this.dialog.visible = false;
        if (isReload) {
          this.getCharts();
          this.getChartCountByType();
          this.getChartCountByProject();
        }
      },
      reset(){
        this.curr.chart = {
          name: '',
          project: this.curr.proId,
          category: 'Echarts',
          chartType: this.curr.typeId,
          remark: ''
        };
      }
    },
    watch: {
      $route(){
        console.log('xxx');
        this.nav.type = this.$route.params.type || 'type';
        this.nav.items = this.nav.type == "pro" ? this.projects : this.nav.chartTypes;
        this.nav.isShow = this.nav.type == "search" ? false : true;
        this.$store.dispatch("setCurrMenu", {flag: "chart" + this.nav.type});
        this.getCharts();
      },
      projects(){
        this.getProjects();
      },
      "nav.items": function () {
        const container = document.querySelector('#container');
        if (container) container.scrollTop = 0;
      }
    }
  }
</script>

<style scoped lang="scss">

  @import '../assets/css/chart.scss';


</style>
