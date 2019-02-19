var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chartTypeSchema = new Schema({
  "name": String,
  "flag": String,
  "icon": String
});

module.exports = mongoose.model("ChartType", chartTypeSchema);
