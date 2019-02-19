var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chartSchema = new Schema({
  "name": {type: String},
  "project": {type: Schema.Types.ObjectId, ref: "Project"},
  "category": {type: String},    //图表类别 echarts、d3、three.js
  "chartType": {type: Schema.Types.ObjectId, ref: "ChartType"},        //图表类型
  "user": {type: Schema.Types.ObjectId, ref: "User"},
  "code": {type: String, default: ''},
  "base64": {type: String, default: ''},
  "createDate": {type: Date, default: Date.now},
  "updateDate": {type: Date, default: Date.now},
  "remark": String
});

module.exports = mongoose.model("Chart", chartSchema);
