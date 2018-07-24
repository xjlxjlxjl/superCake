import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // pageStatus 1 全部 2详情
    pageStatus: 1,
    // 0:ALL, 5:已完成, 7:待付款, 3:待收货
    orderStatus: 0,
    path: __config.basePath,
    height: '',
    page: 1,
    limit: 10,
    orderList: [],
    totalPage:0,
    // 订单详情
    orderDetail: {},
  },
  payment(e){
    let that = this;
    app.post('/client/order/getPayJson', 'GET', e.currentTarget.dataset).then(res => {
      let json = JSON.parse(res.data.data);
      wx.requestPayment({
        'timeStamp': json.timeStamp,
        'nonceStr': json.nonceStr,
        'package': json.package,
        'signType': 'MD5',
        'paySign': json.paySign,
        'success': res => {
          that.getOrderList({
            oStateId: that.data.orderStatus,
            type: 1,
            shopId: __config.shopId,
            page: that.data.page,
            limit: that.data.limit,
          });
        }
      })
    });
  },
  changeOrderStatus(e){
    let params = {
      shopId: __config.shopId,
      page: 1,
      limit: 10,
      oStateId: e.currentTarget.id,
      type: 1,
    }
    this.getOrderList(params);
    this.setData({
      page: 1,
      limit: 10,
      orderStatus: e.currentTarget.id,
    })
  },
  onLoad (e) {
    e.shopId = __config.shopId;
    e.page = this.data.page;
    e.limit = this.data.limit;
    // console.log(e);
    this.getOrderList(e);
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight + 45,
          orderStatus: e.oStateId
        })
      }
    })
  },
  getOrderList(options){
    let that = this;
    wx.showLoading({ title: '加载中', });
    app.post('/client/order/findAll', 'GET', options).then( res => {
      // console.log(res)
      for(let item of res.data.data.list){
        for(let val of item.oitems){
          val.logo = val.logo.split(',')[0];
        }
      }
      that.setData({
        orderList: res.data.data.list,
        totalPage: res.data.data.totalPage
      })
      wx.hideLoading();
    });
  },
  comeBack(e){
    this.setData({ pageStatus: 1 });
  },
  showDetail(e){
    let key = e.currentTarget.dataset.index;
    // console.log(this.data.orderList[key]);
    this.setData({
      pageStatus: 2,
      orderDetail: this.data.orderList[key],
    });
  },
  lower() {
    let that = this.data,self = this;
    if (that.totalPage == that.page) {
      wx.showToast({ //如果全部加载完成了也弹一个框
        title: '没有更多的订单啦',
        icon: 'none',
        duration: 300
      });
      return false;
    } else {
      wx.showLoading({ title: '加载中', });
      app.post('/client/order/findAll', 'GET', {
        oStateId: that.orderStatus,
        type: 1,
        shopId: __config.shopId,
        page: ++that.page,
        limit: 10,
      }).then(res => {
        let list = that.orderList;
        for (let item of res.data.data.list) {
          list.push(item);
        }
        self.setData({
          orderList: list,
        })
        wx.hideLoading();
      });
    }
  },
})