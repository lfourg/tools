<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      action="/file/upload"
      name="files"
      accept=".js,.json"
      :file-list="files"
      :data="chart"
      :onError="uploadError"
      :onSuccess="uploadSuccess"
      :beforeUpload="beforeAvatarUpload"
      :onRemove="removeFile"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传js/json文件</div>
    </el-upload>
  </div>
</template>

<script>
  export default{
    name: 'uploadResource',
    props: ["chart", "fileList"],
    data(){
      return {files: []}
    },
    mounted(){
      [...this.files] = this.fileList;
    },
    methods: {
      // 上传成功后的回调
      uploadSuccess (response, file, fileList) {
        if (response.status)
          this.$emit("upFiles", response.result);
      },
      // 上传错误
      uploadError (response, file, fileList) {
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
        if (file && !(file.size / 1024 / 1024 < 10)) {
          console.log('上传模板大小不能超过 10MB!')
          return false;
        }
        return true;
      },
      removeFile(file, fileList){

        let param = file;
        if (file.response && file.response.status)
            param = file.response.result;
        this.api.post("/file/del", param).then((res) => {
          if (res.status){
          var _index = 0;
          this.fileList.some(function (item, index) {
            _index = index;
            return item._id == file._id;
          });
          if (_index < this.fileList.length)
            this.fileList.splice(_index, 1);
        }
      })
        ;
      }
    }
  }
</script>
<style scoped>

</style>
