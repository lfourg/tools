var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var proMember = new Schema({
  "project": {type: Schema.Types.ObjectId, ref: "Project"},
  "user": {type: Schema.Types.ObjectId, ref: "User"}
});
module.exports = mongoose.model("ProMember", proMember);

