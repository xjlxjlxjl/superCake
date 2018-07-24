// pages/goodsType/goodsType.js
import __config from '../../vendor/url.js';
import es6 from '../../vendor/es6-promise.js';
const app = getApp();

Page({
  data: {
    path: __config.basePath,
    goodsList: [{}],
    gTypeId: 0,
    page: 1,
    limit: 999,
    maxPage: 0,
  },
  onLoad(e){
    this.getGoodsList(e);
  },
  getGoodsList(e){
    let that = this;
    wx.showLoading({ title: '加载中', mask: true });
    app.post('/client/goods/findListByType', 'GET', {
      shopId: __config.shopId,
      page: that.data.page,
      limit: that.data.limit,
      gTypeId: e.goodsTypeId,
    }).then(res => {
      let goods = res.data.data
      for (let item of goods.list){
        item.logo = item.logo.split(',')[0];
      }
      that.setData({
        goodsList: goods.list,
        gTypeId: e.goodsTypeId,
        maxPage: goods.totalPage,
      })
      wx.hideLoading();
    });
  },
  lower() {
    // this.getGoodsList();
  }
})