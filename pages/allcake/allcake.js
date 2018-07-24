// pages/allcake/allcake.js
import __config from '../../vendor/url.js';
const app = getApp();
const path = app.globalData.path;

Page({
  data: {
    banner: [
      path + '/banner/allCakeBanner.gif',
    ],
    path: path,
    basePath: __config.basePath,
    goodsList: [],
    goodsType: [
      {
        img: path + '/goodsType/type1.png',
        gTypeId: 3638
      }, {
        img: path + '/goodsType/type2.png',
        gTypeId: 3640
      }, {
        img: path + '/goodsType/type3.png',
        gTypeId: 3637
      }, {
        img: path + '/goodsType/type4.png',
        gTypeId: 3639
      }
    ],
    height: 0,
  },
  onLoad(){
    this.getGoodList();    
  },
  onShow() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
        })
      }
    });
  },
  lower() {
    // this.getGoodsList();
  },
  getGoodList() {
    wx.showLoading({ title: '加载中', mask: true });
    let that = this, goodsList = that.data.goodsList;
    app.post('/client/index/index', 'GET', {
      shopId: __config.shopId,
      stateId: 1,
      page: 1,
      limit: 10000
    }).then(res => {
      for (let item of res.data.goods1.list) {
        item.logo = item.logo.split(',')[0];
        item.chineseName = item.name.split('-')[0];
        item.englishName = item.name.split('-')[1];
        goodsList.push(item);
      }
      for (let item of res.data.goods2.list) {
        item.logo = item.logo.split(',')[0];
        item.chineseName = item.name.split('-')[0];
        item.englishName = item.name.split('-')[1];
        goodsList.push(item);
      }

      that.setData({
        goodsList: goodsList,
      });
      wx.hideLoading();
    });
  }
})