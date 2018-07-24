import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';

Page({
  data: {
    discountList:[]
  },
  onShow( e ){
    if (!wx.getStorageSync('userLoginStatus')) {
      // wx.redirectTo({ url: "/pages/user/user" });
      wx.navigateBack({ delta: 1 });
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }
    
    let that = this, rPageIds = wx.getStorageSync('rPageIds');
    // console.log(rPageIds)
    wx.request({
      url: __config.basePath + '/client/redPage/findByRPageId',
      method: 'GET',
      data: { rPageIds: '' },
      header: __config.headerParams,
      success: res => {
        console.log(res.data.data)
        that.setData({ discountList: res.data.data })
      }
    })
  }
});