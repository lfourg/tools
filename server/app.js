const fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({"limit": "10000kb"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(history());

require("./public/db.js");
require("./routes/chart.js")(app);
require("./routes/chartType.js")(app);
require("./routes/project.js")(app);
require("./routes/file.js")(app);
require("./routes/user.js")(app);
require("./routes/uploadEcharts.js")(app);
require("./routes/proMember.js")(app);
require("./routes/authorizeUser")(app);

app.use(express.static(path.resolve(__dirname, './docs')))

/*app.get('/', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, './docs/index.html'), 'utf-8')
  res.send(html)
})*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
