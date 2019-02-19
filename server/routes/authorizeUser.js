/*
 *  github 第三方 登录
 */
var request = require('request');

var githubConfig = require("../public/config");
var Common = require("../public/common");

module.exports = app => {
  app.get('/github/user_info', function (req, res, next) {

    var code = req.query.code;
    if (code == '') {
      Common.callReturn(res, {
        msg: '请传入正确的参数',
        status: 103
      });
      return;
    }
    console.time("第一个请求：");
    request({
        url: githubConfig.access_token_url,
        form: {
          client_id: githubConfig.client_ID,
          client_secret: githubConfig.client_Secret,
          code: code,
          redirect_uri: githubConfig.redirect_uri
        }
      },
      function (error, response, body) {
        console.timeEnd("第一个请求：");
        if (!error && response.statusCode == 200) {
          var urlStr = githubConfig.user_info_url + body;
          console.time("第二个请求：");
          request({
              url: urlStr,
              headers: {
                'User-Agent': githubConfig.user_agent
              }
            },
            function (error, response, resbody) {
              console.timeEnd("第二个请求：");
              if (!error) {
                var _user = JSON.parse(resbody);
                Common.callReturn(res, null, _user);
              } else {
                Common.callReturn(res, {
                  msg: '获取用户信息失败',
                  status: 102,
                  error: error
                });
              }
            }
          )
        } else {
          Common.callReturn(res, {
            msg: '获取用户信息失败',
            status: 101,
            error: error
          });
        }
      }
    )
  })
}
