<template>
  <div class="container">
    <div class="search">
        <input v-model="key" type="text" :placeholder="placeholder" @keyup.enter="search"/><i class="icon iconfont icon-search" @click="search"></i>
    </div>
    <ul class="items">
        <li v-for="item in items" @click='changeType(item)' :class="[type==item.type?'active':'']"><i :class="['icon', 'iconfont',item.icon]"></i>{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
  export default{
    name: 'search',
    data(){
      return {
        items:[
            {name:'名称',icon:'icon-jichu',type:'name',placeholder:'按图表名称查询'},
            {name:'类型',icon:'icon-zhuzhuangtu1',type:'type',placeholder:'按图表类型查询'},
            {name:'项目',icon:'icon-weibiaoti2010103-copy',type:'project',placeholder:'按项目名称查询'},
            {name:'用户',icon:'icon-yonghu',type:'user',placeholder:'按用户名称查询'}
        ],
        key: '',
        type:'name',
        placeholder:'按图表名称查询'
      }
    },
    mounted(){
        let query = this.$route.query;
        this.key = query.q || '';
    },
    methods: {
        changeType(_item){
            this.type = _item.type;   
            this.placeholder = _item.placeholder; 
            if (!this.key)return;
            this.$emit('advanceSearch',this.type,this.key);
        },
      search(){
        if (!this.key)return;
        this.$emit('advanceSearch',this.type,this.key);
      }
    },
    watch: {
      $route(){
        let query = this.$route.query;
        this.key = query.q || '';
        this.type  = 'name';
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .container {
    margin:80px 40px 0 40px;
    
    .items{
        color:#aaa;
        background:$darkGrey;
        height: 50px;
        line-height: 50px;
        border-radius: 0 0 5px 5px;
        li{
            display: inline-block;
            margin-left: 10px;
            height: 32px;
            line-height: 32px;
            background: $darkGrey3;
            padding: 0 16px;
            border-radius: 5px;
            position: relative;
            border-bottom: 1px solid transparent;
            cursor: pointer;
            box-shadow: 2px 2px 2px #1a1e21;
            i{
                margin-right: 6px;
            }
            &:hover,&.active{
                color:$white;
                i{
                    color:$red;
                }
            }
        }
        
    }
    .search{
        position: relative;
        background: $darkGrey;
        border: 1px solid transparent;
        border-bottom: 1px solid $red;
        border-radius: 5px 5px 0 0;
        -webkit-transition: all .3s ease-out;
        -moz-transition: all .3s ease-out;
        -ms-transition: all .3s ease-out;
        -o-transition: all .3s ease-out;
        transition: all .3s ease-out;
        i {
            position: absolute;
            left: 10px;
            font-size: 26px;
            top: 4px;
            color:$white;
            cursor: pointer;
            &:hover{
                color:$red;
            }
        }
        &:hover{
            //border: 1px solid $red;
            //background: transparent;
        }
        input {
            outline: 0;
            width: 100%;
            height: 48px;
            line-height: 48px;
            margin-left: 50px;
            color: $white;
            background: transparent;
            border: 0;
            }
    }
  }
</style>
