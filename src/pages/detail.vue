<template>
  <div>
    <HeaderBar :options="header" @handleCli="save"></HeaderBar>
    <Splitter :margin="20" @resize="spResize">
      <div slot="left-pane">
        <div class="control-panel">
          <div class="right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <span class="el-dropdown-link">
                <span class="item" title="资源库"><i class="icon iconfont icon-js"></i></span>
                <!--资源库<i class="el-icon-arrow-down el-icon--right"></i>-->
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in resource.staticLib" :key="item.name"><a @click="addResource(item.url)">{{item.url}}</a>
                </el-dropdown-item>
                <el-dropdown-item v-for="item in resource.dynamicLib" :key="item.name"><a
                  @click="addResource(resource.serverPath+item.url)">{{resource.serverPath}}{{item.url}}</a>
                </el-dropdown-item>
                <!--<el-dropdown-item divided><a class="upfile" @click="uploadResource">上传文件</a></el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
            <span @click="format" class="item" title="格式化"><i class="icon iconfont icon-geshishua"></i></span>
            <span @click="run" title="执行" class="item"><i class="icon iconfont icon-carry-out"></i></span>
          </div>
        </div>
        <codemirror ref="myCm"
                    :value="chart.code"
                    :options="cmOptions"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange"
                    >
        </codemirror>
      </div>
      <div slot="right-pane">
        <ShowChart  ref="chartRef" :chart="chart" :flag="flag"></ShowChart>
      </div>
    </Splitter>

    <el-dialog
      title="资源管理"
      :visible.sync="resource.dialogVisible"
      width="700px">
      <UploadPage :chart="chart" :fileList="resource.dynamicLib" @upFiles="upFiles"></UploadPage>
    </el-dialog>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {codemirror} from 'vue-codemirror'

  import 'codemirror/lib/codemirror.css'

  /**自动关闭<({**/
  import 'codemirror/addon/edit/closebrackets.js'
  /**折叠效果**/
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/foldgutter.css'

  import 'codemirror/addon/selection/active-line'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/htmlmixed/htmlmixed'

  /**滚动条**/
  import 'codemirror/addon/scroll/simplescrollbars.js'
  import 'codemirror/addon/scroll/simplescrollbars.css'

  /**错误检查 */

  import 'codemirror/addon/lint/lint.css'
  import 'codemirror/addon/lint/coffeescript-lint.js'
  import 'codemirror/addon/lint/css-lint.js'
  //import 'codemirror/addon/lint/html-lint.js'
  import 'codemirror/addon/lint/javascript-lint.js'
  import 'codemirror/addon/lint/json-lint.js'
  import 'codemirror/addon/lint/lint.js'


  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/javascript-hint.js'

  import 'codemirror/theme/darcula.css'

  import Splitter from '@rmp135/vue-splitter'

  import HeaderBar from '../components/header.vue'
  import UploadPage from './detail/upload.vue'
  import ShowChart from './detail/show.vue'
import { setTimeout, clearTimeout } from 'timers';

  var beautify = require('js-beautify');
  let exeTimeout;
  export  default{
    name: 'detail',
    data(){
      return {
        id: '',
        chart: {
          name: '',
          project: '',
          category: '',
          chartType: '',
          code: '',
          base64: ''
        },
        flag: false,
        isFirst: true,
        isMove:false,
        resource: {
          serverPath: 'http://localhost:8086',
          lib: {
            Echarts: [
              {name: 'jquery', url: "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"},
              {name: 'echarts-v3', url: '//echarts.baidu.com/examples/vendors/echarts/echarts.min.js'},
              {name: 'china', url: '//echarts.baidu.com/examples/vendors/echarts/map/js/china.js'},
              {name: 'world', url: '//echarts.baidu.com/examples/vendors/echarts/map/js/world.js'},
              {name: 'echarts-v2', url: '//cdn.bootcss.com/echarts/2.2.7/echarts-all.js'}],
            D3: [
              {name: 'jquery', url: "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"},
              {name:"d3-v5.7",url:'//cdn.bootcss.com/d3/5.7.0/d3.min.js'},
              {name: "d3-v4", url: "//d3js.org/d3.v4.min.js"},
              {name: "d3-v3", url: "//d3js.org/d3.v3.min.js"}],
            ThreeJS: [
              {name: 'jquery', url: "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"},
              {name:"threeJS-r83",url:'//cdn.bootcss.com/three.js/r83/three.min.js'},
              {name: "threeJS-module", url: "//cdn.bootcss.com/three.js/r83/three.module.js"}
            ]
          },
          staticLib: [],
          dynamicLib: [],
          dialogVisible: false
        },
        header: {
          title: '',
          id:'',
          disName:'',
          isShowPublish: false
        },
        cmOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: {
            name: "htmlmixed",
            tags: {
              style: [["type", /^text\/(x-)?scss$/, "text/x-scss"],
                [null, null, "css"]],
              custom: [[null, null, "customMode"]]
            },
            globalVars: true
          },
          lineWrapping: false,    //CodeMirror是否应滚动或换行较长。默认为false（滚动）,
          scrollbarStyle: 'simple',  //overlay,simple ,nlll
          theme: 'darcula',
          autoCloseBrackets: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
          extraKeys: {"Ctrl-Q": "autocomplete"}
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        isLogin: 'getIsLogin'
      })
    },
    components: {
      codemirror, Splitter, HeaderBar, UploadPage, ShowChart
    },
    mounted(){
      this.init();
      //this.getResource();
      window.onresize=()=>{
        this.changeFlag(1000);
      }
    },
    methods: {
      init(){

        this.id = this.$route.params.id;
        this.api.get("/chart/findById", {id: this.id}).then((res) => {
          this.chart = res.result;
          this.header.title = this.chart.name;
          this.header.id = this.chart.user._id;
          this.header.disName = this.chart.user.disName || this.chart.user.name;
          let category = this.chart.category || 'Echarts';
          this.resource.staticLib = this.resource.lib[category];

          if (!this.chart.code) {
            this.api.get("/static/template/"+ category+".html").then((res) => {
              this.chart.code = res;
            });
          }

          if (this.isLogin && (this.chart.user._id == this.user._id || (this.chart.project && this.user._id == this.chart.project.manager)))
            this.header.isShowPublish = true;
        });
      },
      save(){

        if (!this.user) {
          this.$message({
            showClose: true,
            message: '登录过期，请重新登录',
            type: "error"
          });
          return;
        }
        if (!this.id) {
          this.$message({
            showClose: true,
            message: '未能获取到图表标识',
            type: "error"
          });
          return;
        }
        if(this.$refs['chartRef']){
          this.$refs['chartRef'].getBase64(this.saveChart);
        }
      },
      saveChart(base64){
        let chart = {
          _id: this.id,
          base64: base64,
          code: this.chart.code,
          name: this.header.title,
          updateDate: Date.now()
        };
        this.api.post("/chart/update", chart).then((res) => {

          this.$message({
            showClose: true,
            message: res.status ? '图表发布成功' : '图表发布失败',
            type: res.status ? "success" : "error"
          });
        });
      },
      spResize(){
        this.changeFlag(500);
      },
      onCmReady(cm) {

      },
      onCmFocus(cm) {

      },
      onCmCodeChange(newCode) {
        this.chart.code = newCode;
        this.changeFlag();
      },
      changeFlag(time){
        if(exeTimeout)
          clearTimeout(exeTimeout);
        else if(this.isFirst)
          this.flag = !this.flag;

        if(!this.isFirst) {
          exeTimeout = setTimeout(()=>{
            this.flag = !this.flag;
          },time || 1000);
        }
        this.isFirst = false;
      },
      getResource(){
        this.api.post("/file/find", {chart: this.id}).then((res) => {
          this.resource.dynamicLib = res.result;
        });
      },
      upFiles(file){
        this.resource.dynamicLib.push(file);
      },
      uploadResource(){
        this.resource.dialogVisible = true;
      },
      run(){
        this.flag = !this.flag;
      },
      format(){
        let text = beautify.html(this.chart.code, {}).replace(/[\n]{2,}/ig,'\n');
        this.chart.code = text;
      },
      addResource(path){

        let template = "";
        if (/(\.json)/i.test(path)) {
          template = `<script>
  $.get('` + path + `', function(data) {
  });
<\/script>`;
        }
        else {
          template = `<script type='text/javascript' src='` + path + `'><\/script>`;
        }
        if (/(<script)/ig.test(this.chart.code))
          this.chart.code = this.chart.code.replace(/(<script)/i, template + '\n$1');
        else if (/(<\/body>)/ig.test(this.chart.code))
          this.chart.code = this.chart.code.replace(/(<\/body>)/i, '$1\n' + template);
        else
          this.chart.code += template;
      },
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .control-panel {
    height: 30px;
    line-height: 30px;
    width: 100%;
    position:absolute;
    top:0;
    background: rgb(72,72,72);
    .left {
      float: left;
    }
    .right {
      float: right;
      text-align: right;
      margin-top:3px;
      margin-right: 20px;
      .item {
        display: inline-block;
        background: #2b2b2b;
        border-radius: 10px 2px 0 0;
        width: 38px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        margin-right: 0px;
        color: #999;
        cursor: pointer;
        font-weight: bold;
        &:hover{
          //background: #0a0a0a;
          color:$white;
        }
        i{
          font-size: 14px;
        }
      }
      a {
        height: 100%;
        padding: 0px 12px;
        text-align: center;
        background-color: $red;
        display: inline-block;
        color: $white;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          background-color: $red2;
        }
      }
    }
  }

  .upfile {
    background: $red;
    text-align: center;
    color: $white;
    &:hover {
      background: $red2;
    }
  }

  .chart {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
