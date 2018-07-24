//user.js
//获取应用实例
const app = getApp()
import es6 from '../../vendor/es6-promise.js';
import url from '../../vendor/url.js';

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    false: false,
    // 是否是骑手
    Rider: false,
    mobile: wx.getStorageSync('mobile')
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo (e) {
    let that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userLoginStatus', true);
        app.post('/client/wxaUserApi/info', 'POST', {
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          signature: res.signature
        }).then(result => {
          if(result.data.result == 1){
            wx.setStorageSync('userLoginStatus', true);
            wx.setStorageSync('userInfo', app.globalData.userInfo);
            wx.setStorageSync('mobile', result.data.data.mobile);
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
              mobile: result.data.data.mobile
            });
          }else{
            wx.showToast({
              title: '登录失败，请重新操作',
              icon: 'none',
              duration: 1500
            });
          }
        })
      }
    });
  },
  getPhoneNumber (e) {
    let that = this;
    app.post('/client/wxaUserApi/savePhonenumber','POST',e.detail).then(res => {
      wx.setStorageSync('mobile', res.data.data);
      that.setData({ mobile: res.data.data });
    });
  },
  callServer (e) {
    wx.makePhoneCall({
      phoneNumber: '0752-6666666'
    })
  },
  showModel( e ){
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  onLoad () {
    let that = this, httpRequest = app.setRequest, user = {};
    
    this.setData({
      Rider: app.globalData.Rider,
    });
  },
  onShow(e){
    if (wx.getStorageSync('userLoginStatus')){
      this.setData({
        hasUserInfo: true,
        userInfo: wx.getStorageSync('userInfo'),
        mobile: wx.getStorageSync('mobile')
      })
    }
  },
})