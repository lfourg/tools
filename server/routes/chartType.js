var ChartType = require("../models/chartType");
var Common = require("../public/common");

module.exports = app => {

  app.post('/chartType/add', function (req, res, next) {

    var _chartType = req.body;
    ChartType.create(_chartType, function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),
    app.post('/chartType/edit', function (req, res, next) {

      var _chartType = req.body;
      ChartType.findByIdAndUpdate(_chartType.id, _chartType, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/chartType/del', function (req, res, next) {

      var _chartType = req.body;
      ChartType.remove(_chartType, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/chartType/find', function (req, res, next) {

      var _chartType = req.body;
      ChartType.find(_chartType, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    })
}

