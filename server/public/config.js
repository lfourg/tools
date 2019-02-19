module.exports={
  // 客户ID
  client_ID: '263f45ba8ea1fb856276',
  // 客户密匙
  client_Secret: 'e0678a7c99690ddcc9664218e0b712b5d73da90e',
  /*client_ID: 'fe75ac771594abc44791',
  client_Secret:'79b530f35ee56666de47fdccd41e7ea6777aae14',*/
  // 获取 access_token
  // eg: https://github.com/login/oauth/access_token?client_id=7***************6&client_secret=4***************f&code=9dbc60118572de060db4&redirect_uri=http://manage.hgdqdev.cn/#/login
  access_token_url: 'https://github.com/login/oauth/access_token',
  // 获取用户信息
  // eg: https://api.github.com/user?access_token=86664b010dbb841a86d4ecc38dfeb8ac673b9430&scope=&token_type=bearer
  user_info_url: 'https://api.github.com/user?',
  // 回调地址
  redirect_uri: 'http://www.mincharts.com/',
  //headers
  user_agent:'menggege'
}
