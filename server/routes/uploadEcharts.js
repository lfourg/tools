let Chart = require("../models/chart.js");
let Project = require("../models/project.js");
let ChartType = require("../models/chartType.js");
var Common = require("../public/common");
var request = require('request');

module.exports = app => {

  app.get("/echarts/upload", function (req, res, next) {

    var count = 0;
    var start = parseInt(req.query.start);
    var end = parseInt(req.query.end);
    console.log("start:", start, "end:", end);
    for (let i = start; i < end; i++) {
      request("http://img.9cfcf.com/api/chart/GetChart?id=" + i, function (req, res, next) {

        if (!res || res.body == null) {
          console.log("!res || res.body == null,id=", i);
          return;
        }
        let chart = JSON.parse(res.body);
        if (!chart || !chart.json) {
          console.log("!chart || !chart.json,id=", i);
          return;
        }
        let code = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ECharts</title>
  <style>
    body {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
    #main {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main"></div>

<script type='text/javascript' src='//echarts.baidu.com/examples/vendors/echarts/echarts.min.js'></script>
`;
        if (chart.type == "map") {
          code += `<script type='text/javascript' src='//echarts.baidu.com/examples/vendors/echarts/map/js/china.js'></script>
`;
        }
        code += `<script type="text/javascript">
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'));
  // 指定图表的配置项和数据
`
          + chart.json +
          `
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
</script>
</body>
</html>
`;
        var chartTypeId = "5a38c7aeb649992b1c551c13", projectId = "";
        var _chart = {
          "name": chart.name,
          "project": projectId,
          "category": 'Echarts',    //图表类别 echarts、d3、three.js
          "chartType": chartTypeId,        //图表类型
          "code": code,
          "base64": chart.base64,
          "createDate": chart.updateDate,
          "updateDate": chart.updateDate
        }
        Project.find({name: chart.project}, function (error, doc) {
          console.log("i:", i, "  count:", count++);
          if (doc.length > 0) {
            _chart.project = doc[0]._id;
            ChartType.find({flag: chart.type}, function (error, doc) {
              if (doc.length == 0) {
                console.log("chartType is null,type=", chart.type, ",id=", i);
                return;
              }
              _chart.chartType = doc[0]._id;
              Chart.create(_chart, function (error, doc) {
                if (error) {
                  console.log("create Chart,id=", i);
                }
              });
            });
          }
          else {
            Project.create({name: chart.project}, function (error, doc) {
              if (!doc) {
                console.log("create Project,project=", chart.project, ",id=", i);
                return;
              }
              _chart.project = doc._id;
              ChartType.find({flag: chart.type}, function (error, doc) {
                if (doc.length == 0) {
                  console.log("chartType is null,type=", chart.type, ",id=", i);
                  return;
                }
                _chart.chartType = doc[0]._id;
                Chart.create(_chart, function (error, doc) {
                  if (error) {
                    console.log("create Chart,id=", i);
                  }
                });
              });
            });
          }
        });
        return;
      })
    }
  })
}
