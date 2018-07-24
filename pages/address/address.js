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
    addressList:[],
  },
  addAddress (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/address/add/add'
    });
  },
  delAddress (e){
    console.log(e)
    const id = e.currentTarget.id;
    let that = this;
    wx.request({
      url: __config.basePath + '/client/address/update',
      method: 'POST',
      data: { addId: id, stateId: 3 },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'wxa_sessionid': wx.getStorageSync('sessionKey')
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        that.getList();
      }
    });
  },
  onShow (e) {
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
  getList(e){
    let that = this;
    wx.showLoading({ title: '加载中', });
    wx.request({
      url: __config.basePath + '/client/address/findAll',
      method: 'GET',
      data: { page: that.data.page, limit: that.data.limit },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'wxa_sessionid': wx.getStorageSync('sessionKey')
      },
      success: res => {
        wx.hideLoading();
        // console.log(res);
        that.setData({
          addressList: res.data.data.list
        })
      }
    });
  }
});