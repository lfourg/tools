var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileSchema = new Schema({
  "name": String,
  "type": String,
  "url": String,
  "chart": {type: Schema.Types.ObjectId, ref: "Chart"},
  "remark": String,
  "createDate": {type: Date, default: Date.now}
});

module.exports = mongoose.model("File", fileSchema);

