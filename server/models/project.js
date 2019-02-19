var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
  "name": String,
  "manager": {type: Schema.Types.ObjectId, ref: "User"},
  "members": [{type: Schema.Types.ObjectId, ref: "User"}],
  "remark": String,
  "createDate": {type: Date, default: Date.now}
});

module.exports = mongoose.model("Project", projectSchema);

