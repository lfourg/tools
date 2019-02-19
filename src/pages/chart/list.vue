<template>
  <div ref="div" v-if="charts.length > 0">
    <div class="chartItem"  v-for="item in charts" v-if="item.user">
      <div class="img" @click="detail(item._id)" :id="'div'+item._id" >        
        <img class="lazy" :ref="item._id" :id="item._id" v-lazy="lazyImg"/>
      </div>
      <div class="ctx">
        <h3><a :title="item.name" @click="detail(item._id)">{{item.name}}</a></h3>
        <!--<span class="pro">{{item.project && item.project.name}}</span>-->
        <span class="item user" :title="item.user.disName || item.user.name" @click.stop="search(item.user)">
          <img width=25 height=25 :src='getIcon(item.user)'/>&nbsp;{{item.user.disName || item.user.name}}</span>
        <!--<span :class="['item te-icon',item.category]" :title="item.category+'图表'"></span>-->
        <span class="item date" :title="item.createDate">{{getDateDiff(item.updateDate)}}</span>
      </div>
      <div class='y-border'></div>
      <template v-if="isLogin && (user.superAdmin || item.user._id == user._id || (item.project && user._id == item.project.manager))">
        <div class="op edit active" @click.stop="edit(item)" title="编辑"><i class="icon iconfont icon-bi"></i></div>
        <div class="op cls active" @click.stop="del(item._id)" title="删除"><i class="icon iconfont icon-shanchu1"></i></div>
      </template>
      <template v-else>
        <div class="op edit" title="无操作权限"><i disabled class="icon iconfont icon-bi"></i></div>
        <div class="op cls" title="无操作权限"><i disabled class="icon iconfont icon-shanchu1"></i></div>
      </template>
      </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Identicon from 'identicon.js'
import { setTimeout } from 'timers';
  export  default{
    name: 'indexList',
    props: ["charts", "isChange"],
    data() {
      return {
        imgs: [],
        options:{
            foreground: [255,255,255],               // rgba black
            background: [70,77,81],         // rgba white
            margin: 0.2,                              // 20% margin
            size: 25,                                // 420px square
            format: 'svg'                             // use SVG instead of PNG
          }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        isLogin: 'getIsLogin',
      })
    },
    mounted() {

    },
    methods: {
      lazyImg(el){

        this.imgs.push(el);
        setTimeout(()=>{
          this.loadImgs();
        });
        window.onscroll = (() => this.loadImgs());
      },
      loadImgs(){

        let st = window.scrollY, ch = window.innerHeight, post;
        this.imgs.map((o, i) => {
          if (o) {
            let rect = o.getBoundingClientRect(), win = o.ownerDocument.defaultView;
            post = rect.top + win.pageYOffset - st;
            if (!!( o.offsetWidth || o.offsetHeight || o.getClientRects().length ) && (post >= 0 && post < ch)) {
              this.setBase64(o);
              this.imgs[i] = null;
            }
          }
        });
      },
      setBase64(ele){

        this.api.get("/chart/getBase64", {id: ele.getAttribute("id")}).then((res) => {
          ele.className += " loaded";
          if (res.status && res.result.base64) {
            ele.src = res.result.base64;
          } else {
            //ele.src = "/static/default.png";
            ele.style.display="none";
          }
        });
      },
      detail(_id){
        window.open("/detail/" + _id);
      },
      edit(_chart){
        this.$emit("editChart", _chart);
      },
      del(_id){

        this.$confirm('此操作将永久删除该图表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.post("/chart/del", {_id: _id}).then((res) => {
            this.$message({
              showClose: true,
              message: res.status ? '删除成功' : '删除失败',
              type: res.status ? "success" : "error"
            });
            if (res.status) this.$emit("delChart", true);
          });
        }).catch(() => {
                 
        });
      },
      search(_user){
        this.$router.push({path: '/chart/search', query: {u: _user._id}});
      },
      getIcon(_user){
          let data = new Identicon(_user._id, this.options).toString();
          return 'data:image/svg+xml;base64,' + data;
      },
      getDateDiff(dateTimeStamp) {
        if (typeof dateTimeStamp == "string")
          dateTimeStamp = this.getDate(dateTimeStamp);
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        let result;
        if (monthC >= 1) {
          result = parseInt(monthC) + "个月前";
        }
        else if (weekC >= 1) {
          result = parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
          result = parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
          result = parseInt(hourC) + "个小时前";
        }
        else if (minC >= 1) {
          result = parseInt(minC) + "分钟前";
        } else
          result = "刚刚";
        return result;
      },
      getDate(strDate) {
        var str = strDate.toString();
        str = str.replace("/-/g", "/");
        str = str.replace("T", " ");
        return new Date(str).getTime();
      }
    },
    watch: {
      isChange(){
        this.imgs = [];
      }
    },
    directives: {
      lazy: {
        bind(el, binng){
          binng.value(el)
        }
      }
    }

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @keyframes my-chart{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  .chartItem {
    position: relative;
    width: 300px;
    height: 300px;
    float: left;
    margin-top: 20px;
    margin-left: 30px;
    border-radius: 5px;
    transition: all .5s;
    overflow: hidden;
    animation: my-chart .5s;
    &:hover {
      //box-shadow: 0 0 10px rgba(0, 0, 0, .3);
      .y-border{
        width: 100%;  
      }
    }
    .img {
      height: 230px;
      width: 100%;
      overflow: hidden;
      background: url("../../assets/img/default.png") no-repeat;
      background-size: 100% 100%;
      img {
        width: 100%;
        height: 100%;
        max-height: 230px;
        object-fit:cover;
        transition: transform .8s, opacity .8s;
        opacity: 0;
        will-change: transform;
        transform: scale(1.2);
        cursor: pointer;
      }
      .loaded {
        background: #e0eaf3;
        opacity: 1;
        transform: scale(1);
      }
      &:hover {
        img {
          transform: scale(1.1);
        }
      }
    }
    .y-border{
      position: absolute;
      height: 2px;
      width: 0;
      top:230px;
      background: $fontActive;
      transition: width .5s;
    }
    .ctx {
      padding: 5px 10px;
      background: $darkGrey;
      border-top: 2px solid $red;
      h3 {
        margin: 3px 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a {
          font-size: 16px;
          color:$white;
          display: block;
          transition: color .3s;
          &:hover {
            color: $red;
          }
        }

      }
      .pro {
        font-size: 12px;
        color: #aaa;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
      }
      .item {
        font-size: 12px;
        color: #aaa;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        line-height: 25px;
      }
      .user {
        width: 80px;
        cursor: pointer;
        i {
          font-size: 20px;
          float: left;
        }
        &:hover {
          color: $red;
          //text-decoration:underline;
        }
        img{
          border-radius: 5px;
        }
      }
      .date {
        float: right;
      }
      .te-icon {
        height: 23px;
        background: url(../../assets/img/chart-icon.png) no-repeat;
      }
      .Echarts {
        width: 20px;
      }
      .D3 {
        width: 20px;
        background-position-x: -25px;
      }
      .ThreeJS {
        width: 50px;
        background-position-x: -55px;
      }
    }
    .op {
      position: absolute;
      top: 15px;
      right: 10px;
      padding: 3px 10px;
      border-radius: 2px;
      cursor: text;
      transform: translateX(100px);
      transition: all .3s;
      color: $white;
      border-radius: 5px;
      background: $gray;
    }
    .active{
      background: $red;
      cursor: pointer;
      &:hover{
        background: $red2;
      }
    }
    &:hover {
      .edit {
        transform: translateX(-50px);
      }
      .cls {
        transform: translateX(0px);
      }
    }
  }
</style>
