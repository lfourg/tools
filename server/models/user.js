var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "name": String,
  "pwd": String,
  "tel": String,
  "email": String,
  "sex": Number,
  "disName": String,
  "remark": String,
  "superAdmin": {type: Number, default: 0},
  "createDate": {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);

