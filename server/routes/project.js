var Project = require("../models/project");
let Chart = require("../models/chart.js");
var Common = require("../public/common");

module.exports = app => {

  app.post('/project/add', function (req, res, next) {

    var _project = req.body;
    Project.create(_project, function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),
    app.post('/project/edit', function (req, res, next) {

      var _project = req.body;
      Project.findByIdAndUpdate(_project._id, _project, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),

    app.post('/project/del', function (req, res, next) {

      var _project = req.body;
      Project.remove(_project, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),
    app.post('/project/find', function (req, res, next) {

      var _params = req.body;
      var _pageIndex = _params.pageIndex || 0, _pageSize = _params.pageSize || 10;
      var _project = _params.project;

      Project.find(_project)
        .skip(_pageIndex * _pageSize)
        .limit(_pageSize)
        .sort({'createDate': -1})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        })
    }),
    app.get('/project/count', function (req, res, next) {
      var _userId = req.query.userId;
      let q = {};
      if(_userId)
          q = { $or: [ //多条件，数组
            {manager: _userId},
            {members: _userId}
          ]};
      Project.count(q).exec(function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),
    app.post('/project/findByUser', function (req, res, next) {

      var _params = req.body;
      var _pageIndex = _params.pageIndex || 0, _pageSize = _params.pageSize || 10;
      var _userId = _params.userId;
      let query = {};
      if(_userId)
        query ={
          $or: [ //多条件，数组
            {manager: _userId},
            {members: _userId}
          ]
        };
      Project.find(query).skip(_pageIndex * _pageSize)
        .limit(_pageSize)
        .sort({'createDate': -1})
        .populate({path: 'manager', select: 'name disName _id'})
        .populate({path: 'members', select: 'name disName _id'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        })
    }),
    app.get('/project/chartCount', function (req, res, next) {

      Chart.aggregate([
        {
          $group: {
            "_id": "$project",
            "count": {$sum: 1}
          }
        }
      ]).exec(function (error, doc) {
        Common.callReturn(res, error, doc);
        return;
        Project.populate(doc, {path: '_id'}, function (error, doc) {
          Common.callReturn(res, error, doc);
        });
      })
    })
}

