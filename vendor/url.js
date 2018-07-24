var baseUrl = 'https://mall.chaorenlaila.com';
// var baseUrl = 'http://127.0.0.1:8080';
// var baseUrl = 'http://192.168.1.112:8080';
// var baseUrl = 'http://192.168.0.100:8080';

var shopId = 95;

module.exports = {
  basePath: baseUrl,
  shopId: shopId,
  headerParams: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'wxa_sessionid': wx.getStorageSync('sessionKey'),
  }
}