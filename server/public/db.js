var mongoose = require('mongoose'),
  //DB_URL = 'mongodb://charts:charts1120@localhost:27017/chart';
  //DB_URL = 'mongodb://charts:charts1120@114.113.69.193:27018/chart';
  DB_URL = 'mongodb://127.0.0.1:27017/chart';

/**
 * 连接
 */
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
