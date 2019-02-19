let Chart = require("../models/chart.js");
let Project = require("../models/project.js");
let ChartType = require("../models/chartType.js");
let User = require("../models/user.js");
var Common = require("../public/common");

module.exports = app => {

  app.post("/chart/add", function (req, res, next) {

    var _chart = req.body;
    Chart.create(_chart, function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),

    app.get('/chart/detailPage', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id, function (error, doc) {
        res.render('index', {code: doc.code.js});
      })
    }),

    app.get('/chart/getBase64', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id,"base64", function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),

    app.post("/chart/update", function (req, res, next) {

      var _chart = req.body;
      Chart.findByIdAndUpdate(_chart._id, _chart, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),

    app.post("/chart/del", function (req, res, next) {

      var _chart = req.body;
      Chart.remove(_chart, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),

    app.get("/chart/list", function (req, res, next) {
      res.json({status: "0", result: ""});
      return;
    }),

    app.get('/chart/findById', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id)
        .populate({path: 'chartType'})
        .populate({path: 'project'})
        .populate({path: 'user'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        });
    }),
    app.post('/chart/count', function (req, res, next) {

      var _params = req.body;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"category": {$regex: reg}}
          ]
        };
      }
      Chart.count(_params, function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),
    app.get('/chart/countByType', function (req, res, next) {

      Chart.aggregate([
        {
          $group: {
            "_id": "$chartType",
            "count": {$sum: 1}
          }
        }
      ]).exec(function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),
    app.post('/chart/find', function (req, res, next) {

      var _params = req.body.chart;
      const reg = new RegExp(_params.keyword, 'i') //不区分大小写

      if(_params.type =='type')
        ChartType.find({name: {$regex: reg}},"_id").exec(function (error, doc) {
          _getSearchCharts(req,res,doc,'chartType');
        });
      else if(_params.type == 'project')
        Project.find({name: {$regex: reg}},"_id").exec(function (error, doc) {
          _getSearchCharts(req,res,doc,'project');
        });
      else if(_params.type == 'user')
        User.find({
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {disName: {$regex: reg}}
          ]
        },"_id").exec(function (error, doc) {
          _getSearchCharts(req,res,doc,'user');
        });
      else{
        if (_params.keyword != undefined) {
            _params = {
              $or: [ //多条件，数组
                {name: {$regex: reg}}
              ]
            };
        }
        _getCharts(req,res,_params);
      }
    }),
    app.post('/chart/find2', function (req, res, next) {

      var _params = req.body.chart;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"category": {$regex: reg}}
          ]
        };
      }
      _getCharts(req,res,_params);
    }),
    app.post('/chart/findBack', function (req, res, next) {  //备份

      var _params = req.body.chart;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"project.name": {$regex: reg}},
            {"category": {$regex: reg}},
            {"chartType.name": {$regex: reg}},
            {"user.name": {$regex: reg}},
            {"user.disName": {$regex: reg}}
          ]
        };
      }
      var _pageIndex = req.body.pageIndex || 0, _pageSize = req.body.pageSize || 10;
      Chart.find(_params, "name project category chartType user base64 createDate updateDate remark")
        .skip(_pageIndex * _pageSize)
        .limit(_pageSize)
        .sort({'createDate': -1})
        .populate({path: 'chartType'})
        .populate({path: 'project'})
        .populate({path: 'user'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        })
    })
}


function _getSearchCharts(req,res,ids,field){

  if(!ids || ids.length == 0)
  {
    Common.callReturn(res, null, []);
    return;
  }
  let temp =[];
  ids.forEach(element => {
    temp.push(element._id);
  });

  let p = {};
  p[field] ={ $in : temp };
  _getCharts(req,res,p);
}

function _getCharts(req,res,params){

  var _pageIndex = req.body.pageIndex || 0, _pageSize = req.body.pageSize || 10;
  Chart.find( params, "name project category chartType user createDate updateDate remark")
    .skip(_pageIndex * _pageSize)
    .limit(_pageSize)
    .sort({'updateDate':-1,'createDate': -1})
    .populate({path: 'project'})
    .populate({path: 'user'})
    .exec(function (error, doc) {
      Common.callReturn(res, error, doc);
    })
}
