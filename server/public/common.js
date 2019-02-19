var path = require("path");
var fs = require('fs');

var common = {
  callReturn(res, error, doc){

    if (error) {
      res.json({status: 0, result: error});
    } else {
      res.json({status: 1, result: doc});
    }
    return;
  },
  getUpPath(){
    let currDate = new Date();
    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;
    return '/uploads/' + year + '/' + month+"/";
  },
  mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
};

module.exports = common;
