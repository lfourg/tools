<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/"><i class="icon iconfont icon-icp-acitve-spline"></i></router-link>
    </div>
    <div class="base">
      <div class="title">
        <div v-if='!isEditTitle'>
          <label>{{options.title}}</label><i v-if='user && (user.superAdmin || options.isShowPublish)' class="icon iconfont icon-23" title="编辑" @click="edit(true)"></i>
        </div>
        <div v-else><input type='text' id='title' v-model='options.title' @blur="edit(false)"/></div>
      </div>
      <div class="create"><img :src="iconBase64"/>{{options.disName}}</div>
    </div>
    <div class="operate">
      <a v-if="user && (user.superAdmin || options.isShowPublish)" class="publish" @click="save"><i class="icon iconfont icon-fabu"/>发布</a>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Identicon from 'identicon.js'
  export default{
    name: 'HeaderBar',
    props: ['options'],
    data(){
      return {
        iconBase64:'',
        isEditTitle: false,
        iconOptions:{
          foreground: [255,255,255],               // rgba black
          background: [70,77,81],         // rgba white
          margin: 0.2,                              // 20% margin
          size: 20,                                // 420px square
          format: 'svg'                             // use SVG instead of PNG
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
    mounted(){
      this.setIcon();
    },
    methods: {
      save() {
        this.$emit("handleCli");
      },
      setIcon(){
        if(this.options && this.options.id){
          let data = new Identicon(this.options.id, this.iconOptions).toString();
          this.iconBase64='data:image/svg+xml;base64,' + data ;
        }
      },
      edit(flag){
        this.isEditTitle=flag;
        if(flag) 
          setTimeout(()=>{document.getElementById('title').focus();});
      }
    },
    watch:{
      'options.id'(){
        this.setIcon();
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">

  .navbar {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: none;
    border-bottom: 1px solid $darkGrey4;
    background-color: $darkGrey;
    color: $white;
    position: fixed;
    z-index: 1100;
    border-bottom:4px solid $fontActive;
    .logo {
      float: left;
      width: 55px;
      i{
        font-size: 26px;
        margin:0 5px 0 10px;
        color: #00c1de;
        font-weight: bold;
      }
      a{
        color:#fff;
        font-size: 16px;
        font-family: fantasy;
        span{
          vertical-align: 3px;
        }
      }
    }
    .base{
      margin-top:5px;
      display: inline-block;
      >div{
        line-height: 22px;
      }
      .title {
        font-size: 16px;
        input{
          background-color: transparent;
          border:0;
          outline: 0;
          color:$white;
          line-height: 22px;
          font-size: 16px;
          min-width: 500px;
        }
        i{
          cursor: pointer;
          margin-left: 5px;
          position:absolute;
          &:hover{
            color:$fontActive;
          }
        }
      }
      .create{
        color:#9396a4;
        label{
          margin-left: 3px;
          color:#fff;
        }
        img{
          margin-right: 5px;
          border-radius: 5px;
        }
      }
    }

    .operate {
      float: right;

      .publish {
        float: right;
        margin-left: 1px;
        width: 100px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        background-color: $red;
        cursor: pointer;
        color: $white;
        text-decoration: none;

        &:hover {
          background-color: $red2;
        }
        i {
          margin-right: 5px;
        }
      }
    }
  }

</style>
