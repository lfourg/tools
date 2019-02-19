var ProMember = require("../models/proMember");
var Common = require("../public/common");

module.exports = app => {

  app.post('/proMember/add', function (req, res, next) {

    var _proMember = req.body;
    ProMember.create(_proMember, function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),
    app.get('/proMember/del', function (req, res, next) {

      var _proMember = req.body;
      ProMember.remove(_proMember, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/proMember/find', function (req, res, next) {

    })
}

