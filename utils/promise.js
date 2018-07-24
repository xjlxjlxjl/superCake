import __config from '../vendor/url.js';
import es6 from '../vendor/es6-promise.js';

var sendRrquest = function (url, method, data) {
  var promise = new Promise(function (resolve, reject) {
    if (wx.getStorageSync('sessionKey')) {
      wx.request({
        url: __config.basePath + url,
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'wxa_sessionid': wx.getStorageSync('sessionKey'),
        },
        success: resolve,
        fail: reject
      })
    }else{
      wx.login({
        success: res => {
          console.log(res)
          wx.request({
            url: __config.basePath + '/client/wxaUserApi/login',
            method: 'POST',
            data: { code: res.code, shopId: __config.shopId },
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: res => {
              // console.log(res)
              if (res.data.result == 1) {
                wx.setStorageSync("sessionKey", res.data.data);
                wx.request({
                  url: __config.basePath + url,
                  data: data,
                  method: method,
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'wxa_sessionid': res.data.data,
                  },
                  success: resolve,
                  fail: reject
                })
              } else {
                wx.showToast({
                  title: '获取登陆状态失效',
                  icon: 'none',
                  duration: 1500
                });
              }
            }
          })
        }
      });
    }
  });
  return promise;
}

module.exports = {
  post: sendRrquest
}