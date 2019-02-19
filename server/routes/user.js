var User = require("../models/user.js");
var Common = require("../public/common");

module.exports = app => {

  app.post('/user/find', function (req, res, next) {

    var _user = req.body;
    User.findOne(_user, "name tel email sex disName superAdmin remark createDate", function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),
    app.get('/user/find2', function (req, res, next) {

        const keyword = req.query.keyword //从URL中传来的 keyword参数
        const reg = new RegExp(keyword, 'i') //不区分大小写
        User.find(
          {
            $or: [ //多条件，数组
              {name: {$regex: reg}}
            ]
          }
          , "name disName").limit(10).exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        });
      }
    ),
    app.post('/user/add', function (req, res, next) {

      var _user = req.body;
      User.create(_user, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/user/github_login', function (req, res, next) {

      var _user = req.body;
      User.update({"name":_user.login}, {$setOnInsert:{"name":_user.login,"emial:":_user.email,"pwd":"123456","disName":_user.name}}, {upsert:true},function (err, row){
        User.findOne({"name":_user.login}, "name tel email sex disName remark superAdmin createDate", function (error, doc) {
          Common.callReturn(res, error, doc);
        });
      })
    }),
    app.post("/user/update", function (req, res, next) {

      var _user = req.body;
      User.findByIdAndUpdate(_user._id, _user, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    })
}
