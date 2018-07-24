//app.js
import es6 from 'vendor/es6-promise.js';
import baseUrl from 'vendor/url.js';
import promise from 'utils/promise.js';

App({
  onLaunch: function () {
    // 展示本地存储能力
    let that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    if (wx.getStorageSync('sessionKey')) {
      // 获取用户信息
      // 如果用户确认过授权会直接进入这里
      wx.getSetting({
        success: res => {
          // console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // console.log(res)
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo;
                wx.setStorageSync('userLoginStatus', true);
                wx.setStorageSync('userInfo', this.globalData.userInfo);
                /*this.post('/client/wxaUserApi/info', 'POST', {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  rawData: res.rawData,
                  signature: res.signature
                }).then(res => {
                  console.log(res);
                })*/
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          } else {
            wx.setStorageSync('userLoginStatus', false);
          }
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    sessionKey: '',
    Rider: false,
    isGetrPage: true,
    mobile: '',
    path: 'http://cake.chaorenlaila.com/MiniAppImg',
  },
  watch : require('utils/watch.js'),
  post: promise.post,
})