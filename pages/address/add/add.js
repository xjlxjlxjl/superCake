import es6 from '../../../vendor/es6-promise.js';
const app = getApp();

Page({
  data: {
    name: '',
    phone: '',
    area: '',
    detail: '',
    isDef: false,
    lnglat: '',
    sex: ['先生','女士'],
    gender: ''
  },
  checkboxChange(e) {
    this.setData({
      isDef: !this.data.isDef
    })
  },
  bindPickerChange(e){
    this.setData({
      gender: e.detail.value == 0 ? 'male' : 'female'
    })
  },
  nameChange(e){
    this.setData({
      name: e.detail.value,
    })
  },
  numberChange(e){
    this.setData({
      phone: e.detail.value,
    })
  },
  detailChange(e) {
    this.setData({
      detail: e.detail.value,
    })
  },
  chooseLocation(e) {
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
    });
  },
  saveAddress(e){
    let that = this;
    if (that.data.area == ""){
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
    let params = {
      name: that.data.name,
      phone: that.data.phone,
      area: that.data.area,
      detail: that.data.detail,
      lnglat: that.data.lnglat,
      isDef: that.data.isDef,
      gender: that.data.gender
    };
    app.post('/client/address/save', 'POST', params).then(res => {
      if(res.data.result == 1){
        wx.navigateBack({ delta: 1 });
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    });
    // wx.redirectTo({
    //   url: '/pages/address/address'
    // });
  }
})