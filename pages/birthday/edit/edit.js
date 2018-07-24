import es6 from '../../../vendor/es6-promise.js';
import __config from '../../../vendor/url.js';
const app = getApp();

Page({
  data: {
    birthdayId: 0,
    name: '',
    date: ''
  },
  nameChange(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  saveBirthday(){
    let that = this;
    app.post('/client/sdfBirthday/update', 'POST' ,that.data).then(res => {
      if (res.data.result) {
        wx.showToast({
          title: '生日修改成功',
          icon: 'none',
          duration: 1500
        });
        setTimeout(res => {
          wx.redirectTo({
            url: '/pages/birthday/birthday'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: '添加生日失败，请重新操作',
          icon: 'none',
          duration: 1500
        });
      }
    })
  },
  onLoad (e)  {
    console.log(e)
    this.setData(e)
  }
})