import es6 from '../../../vendor/es6-promise.js';
import __config from '../../../vendor/url.js';
const app = getApp();

Page({
  data: {
    addId: '',
    name: '',
    phone: '',
    area: '',
    detail: '',
    isDef: false,
    lnglat: '',
    sex: ['先生', '女士'],
    gender: ''
  },
  checkboxChange(e) {
    this.setData({
      isDef: !this.data.isDef
    })
  },
  bindPickerChange(e) {
    this.setData({
      gender: e.detail.value == 0 ? 'male' : 'female'
    })
  },
  nameChange(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  numberChange(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  detailChange(e) {
    this.setData({
      detail: e.detail.value,
    })
  },
  chooseLocation (e) {
    let that = this;
    console.log(that)
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          area: res.address,
          lnglat: res.longitude + ',' + res.latitude,
        });
      }
    })
  },
  saveAddress (e) {
    let that = this;
    if (that.data.area == "") {
      wx.showToast({
        title: '地址不能为空',
      })
      return false;
    }
    if (that.data.lnglat == "") {
      wx.showToast({
        title: '请用微信自带定位',
      })
      return false;
    }
    wx.request({
      url: __config.basePath + '/client/address/update',
      method: 'POST',
      data: that.data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'wxa_sessionid': wx.getStorageSync('sessionKey')
      },
      success: res => {
        wx.hideLoading();
        // console.log(res)
        // return false
        wx.redirectTo({
          url: '/pages/address/address'
        });
      }
    });
  },
  onLoad (e)  {
    console.log(e)
    this.setData(e)
  }
})