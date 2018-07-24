// pages/receipt/receipt.js
import es6 from '../../vendor/es6-promise.js';
const app = getApp();

Page({
  data: {
    orderList: []
  },
  call(e){
    wx.makePhoneCall(e.currentTarget.dataset);
  },
  // 驳回
  reject(e){
    let that = this;
    app.post('/client/order/update', 'POST', e.target.dataset).then(res => {
      that.onShow();
    });
  },
  onShow (e) {
    let that = this;
    wx.showLoading({ title: '加载中', mask: true });
    app.post('/client/order/findAll', 'GET', { page: 1, limit: 10 ,type: 2 }).then(res => {
      for (let item of res.data.data.list){
        let end = item.endDeliveryTime.split(' ');
        item.timeSlot = item.startDeliveryTime + '~' + end[1];
      }
      that.setData({
        orderList: res.data.data.list
      })
      wx.hideLoading();
    });
  },
})