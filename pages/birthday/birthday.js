// address.js
import es6 from '../../vendor/es6-promise.js';
import setRequest from '../../utils/setRequest.js';
import __config from '../../vendor/url.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 99,
    addressList: [],
  },
  addAddress(e) {
    wx.navigateTo({
      url: '/pages/birthday/add/add'
    });
  },
  delAddress(e) {
    const id = e.currentTarget.dataset.birthdayid;
    let that = this;
    wx.request({
      url: __config.basePath + '/client/sdfBirthday/delete',
      method: 'POST',
      data: { birthdayId: id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'wxa_sessionid': wx.getStorageSync('sessionKey')
      },
      success: res => {
        wx.hideLoading();
        that.getList();
      }
    });
  },
  onShow(e) {
    // if (!wx.getStorageSync('userLoginStatus')) {
    //   // wx.redirectTo({ url: "/pages/user/user" });
    //   wx.navigateBack({ delta: 1 });
    //   wx.showToast({
    //     title: '请先登录',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: true
    //   })
    //   return false;
    // }
    this.getList();
  },
  getList(e) {
    let that = this;
    wx.showLoading({ title: '加载中', });
    app.post('/client/sdfBirthday/findList','GET',{
      page: that.data.page,
      limit: that.data.limit
    }).then(res => {
      wx.hideLoading();
      that.setData({
        addressList: res.data.data
      })
    });
  }
});