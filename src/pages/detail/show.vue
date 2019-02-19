<template>
<div>
  <div class='box'></div>
  <div id="output"></div>
</div>
</template>
<script>

  //import html2canvas from 'html2canvas';

  export default{
    name: 'showChart',
    props: ["chart", "flag"],
    data(){
      return {}
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.loadChart();
      },
      getBase64(_cb){
        
        let ifr = document.getElementById('ifr');
        var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
        if(!ifrw) return "";
      
        let offsetTop;
        if(!(/absolute/ig).test(this.chart.code)){
          let childNodes = ifrw.document.body.children;
          for(let i=0;i<childNodes.length;i++) {
            if(childNodes[i].nodeName != 'SCRIPT'){ 
              if(offsetTop == undefined){ 
                offsetTop = childNodes[i].offsetTop;
              }
            }
          }
        }
        let that =this;
       
        /*console.log('c length:',ifrw.document.getElementsByTagName("canvas").length);
        var canvasDom = ifrw.document.getElementsByTagName("canvas")[1];
        if (!canvasDom)return;
        let b64 = canvasDom.toDataURL('image/png'); //转换图片为dataURL
        console.log('b64:',b64);
        _cb(b64);
        return;*/
        html2canvas(ifrw.document.body).then(canvas => {
          
          if((/absolute/ig).test(that.chart.code)){
            _cb(canvas.toDataURL('image/png'));
          }else {
            let body =ifrw.document.body;
            try{
              var context=canvas.getContext("2d");
              var canvasCopy = document.createElement("canvas");
              canvasCopy.width = body.clientWidth;
              canvasCopy.height = body.clientHeight;
              var ctx=canvasCopy.getContext("2d");
              var clipImg = context.getImageData(0, (offsetTop || 0), body.clientWidth, body.clientHeight);
              ctx.putImageData(clipImg,0,0);
              let base64 = canvasCopy.toDataURL();
              _cb(base64);
            }catch(e){
              _cb(canvas.toDataURL('image/png'));
            }
          }
        });
      },
      loadChart(){

        if (!this.chart.code) return;
        var ifr = document.createElement("iframe");
        ifr.setAttribute("frameborder", "0");
        ifr.setAttribute("id", 'ifr');
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(ifr);
        try{
          var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
          ifrw.document.open();
          ifrw.document.write(this.chart.code);
          ifrw.document.close();
        }catch(e){
          console.log('error222:',3);
        }
        return;
        var that = this;
        ifrw.onload = function () {
          if (!that.chart) return;
          
          setTimeout(function () {
              return;
            html2canvas(ifrw.document.body).then(canvas => {
                let base64 =  canvas.toDataURL('image/png');
                console.log('64:', base64);
                that.chart.base64 = base64;
                return base64;
              });

            return;
            var svgDom = ifrw.document.getElementsByTagName("svg")[0];
            if(svgDom){
              var s = new XMLSerializer().serializeToString(svgDom);
              that.chart.base64 = 'data:image/svg+xml;base64,' + window.btoa(s);
            } else {
              html2canvas(ifrw.document.body).then(canvas => {
                that.chart.base64 = canvas.toDataURL('image/png');
              });
            }
            return;

            if (that.chart.category == "Echarts") {
                var canvasDom = ifrw.document.getElementsByTagName("canvas")[0];
                if (!canvasDom)return;
                that.chart.base64 = canvasDom.toDataURL('image/png'); //转换图片为dataURL
              }
              else {
                var svgDom = ifrw.document.getElementsByTagName("svg")[0];
                if (!svgDom) return;
                var s = new XMLSerializer().serializeToString(svgDom);
                that.chart.base64 = 'data:image/svg+xml;base64,' + window.btoa(s);
              }
          }, 1500);
        }
      },
    },
    watch: {
      flag: function (val, oldVal) {
        this.loadChart();
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .box{
    z-index: 1000;
    width: 20px;
    height: 100%;
    position:absolute;
    overflow: hidden;
  }
  #output {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
