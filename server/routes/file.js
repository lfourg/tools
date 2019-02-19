var File = require("../models/file");
var path = require("path");
var fs = require('fs');
var Common = require("../public/common");
var multer = require('multer')
var upload = multer({dest: 'temp/'})

module.exports = app => {

  app.post('/file/upload', upload.array('files', 12), function (req, res) {

    let files = req.files, _chart = req.body;

    let dirPath = Common.getUpPath(), basePath = "./static" + dirPath;
    Common.mkdirsSync(basePath);   //创建目录

    files.forEach(function (item) {
      let tmp_path = item.path, fileName = item.originalname;
      fs.exists(basePath + fileName, function (exists) {
        if (exists) {
          //文件名称已经存在，文件名称添加随机数
          var tempArray = item.originalname.split('.');
          tempArray[0] = tempArray[0] + "_" + parseInt((Math.random() * 1000));
          fileName = tempArray.join('.');
        }
        // 移动文件
        fs.rename(tmp_path, basePath + fileName, function (err) {
          if (err)  return;
          // 删除临时文件夹文件,
          fs.unlink(tmp_path, function () {
          });
          var _addFile = {
            name: fileName,
            url: dirPath + fileName,
            chart: _chart._id
          };
          File.create(_addFile, function (error, doc) {
            Common.callReturn(res, error, doc);
          });
        });
      });
    });
    return;
  }),
    app.post('/file/del', function (req, res, next) {

      let _file = req.body;
      File.remove({_id: _file._id}, function (error, doc) {
        if (!error)
          fs.unlink('./static' + _file.url, function (result) {
          });
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/file/find', function (req, res, next) {

      var _file = req.body;
      File.find(_file, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    })
}

