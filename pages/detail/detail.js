// pages/detail/detail.js
const app = getApp();
import __config from '../../vendor/url.js';

Page({
  data: {
    true: true,
    false: false,

    basePath: __config.basePath,
    gId: 0,
    
    goodsName: '',
    chineseName: '',
    englishName: '',

    sales: 0,
    path: app.globalData.path,
    displayPrice: '',
    // 所有数据，规格
    info: [],
    // 选中数据
    goodsInfo: {},
    // 是否收藏
    isCollection: false,
    count: 1,
    isCollage: false,
    collageId: 0,
    // 幕布
    curtain: false,
    // 详情图片加载中gif
    detailonload: false,
    // 模态框状态 1:加入购物车 2:立即购买 3:限时抢购
    modalStatus: 0,
  },
  goodsClick(e) {
    let that = this, index = e.currentTarget.id;
    for (let value of that.data.info) {
      value.active = false;
    }

    that.data.info[index].active = true;
    that.setData({
      info: that.data.info,
      gId: that.data.info[index].gId,
      goodsInfo: that.data.info[index],
      count: 1,
    });
  },
  imageLoad(e){
    this.setData({ detailonload:true });
  },
  modalDisplay(e) {
    this.setData({
      curtain: !this.data.curtain,
      modalStatus: e.currentTarget.dataset.modalstatus
    });
  },
  changeCount(e){
    let count = this.data.count;
    switch (e.currentTarget.dataset.type){
      case 1:
      case '1':
        ++count;
        break;
      case 2:
      case '2':
        count > 1 ? --count : count;
        break;
    }
    this.setData({ count: count });
  },
  addCollection(e) {
    let that = this, gId = this.data.gId;
    if (this.data.isCollection) {
      app.post('/client/collection/update', 'POST', { cId: that.data.cId, stateId: 3 }).then(res => {
        this.setData({ isCollection: false });
      })
    } else {
      app.post('/client/collection/save', 'POST', { gName: that.data.goodsName }).then(res => {
        this.setData({ isCollection: true });
      })
    }
  },
  goShoppingCar(e){
    wx.navigateTo({ url: '/pages/shoppingcar/shoppingcar' });
  },
  addShopcar(e) {
    let that = this.data, obj = [], car = wx.getStorageSync('shoppingCar'), status = true;
    let goods = {
      gId: that.goodsInfo.gId,
      goodsName: that.goodsName,
      info: that.goodsInfo,
      count: that.count,
      // 购物车选中
      checked: false,
    }
    if (car) {
      obj = JSON.parse(car);
      for (let item of obj) {
        if (item.gId == that.gId) {
          item.count += that.count;
          status = false
        }
      }
    }
    if (status)
      obj.push(goods);

    wx.showToast({
      title: '加入购物车成功',
      icon: 'none',
      duration: 1500,
      mask: true
    })
    wx.setStorageSync('shoppingCar', JSON.stringify(obj));
  },
  addCollage(e) {
    // 生成订单 并且跳转 订单支付页面
    let arr = wx.getStorageSync('shoppingCar') ? JSON.parse(wx.getStorageSync('shoppingCar')) : [], that = this.data;
    for (let item of arr) {
      item.checked = false;
    }
    arr.push({
      gId: that.goodsInfo.gId,
      goodsName: that.goodsName,
      info: that.goodsInfo,
      count: that.count,
      collageId: that.collageId,
      // 购物车选中
      checked: true,
    })
    wx.setStorageSync('shoppingCar', JSON.stringify(arr));
    wx.navigateTo({ url: '/pages/checkOrder/checkOrder' });
  },
  payment(e) {
    // 生成订单 并且跳转 订单支付页面
    let arr = wx.getStorageSync('shoppingCar') ? JSON.parse(wx.getStorageSync('shoppingCar')) : [], that = this.data;
    for (let item of arr) {
      item.checked = false;
    }
    arr.push({
      gId: that.goodsInfo.gId,
      goodsName: that.goodsName,
      info: that.goodsInfo,
      count: that.count,
      // 购物车选中
      checked: true,
    })
    wx.setStorageSync('shoppingCar', JSON.stringify(arr));
    wx.navigateTo({ url: '/pages/checkOrder/checkOrder' });
  },

  onLoad(options) {
    if (options.Collage) {
      this.setData({
        isCollage: true,
        collageId: options.collageId
      });
    }
    wx.showLoading({ title: '商品加载中，请稍等', mask: true });
    if (options.cId)
      this.setData({ isCollection: true });

    if (options.Collage) {
      this.getCollageGoods(options, options.collageId, options.gId)
    } else {
      this.getGoodsList(options);
    }
  },

  getCollageGoods(options, collageId, gId) {
    let that = this, info = [];
    let chineseName = options.goodsName.split('-')[0];
    let englishName = options.goodsName.split('-')[1];

    app.post('/client/collage/findBy', 'GET', { collageId: collageId, gId: gId }).then(res => {
      let goodsInfo = res.data.data;
      goodsInfo.logo = goodsInfo.logo.split(',');
      goodsInfo.detailedUrl = goodsInfo.detailedUrl.split(',');
      goodsInfo.active = true;
      goodsInfo.price = res.data.data.cPrice;
      info.push(goodsInfo);
      let data = {
        goodsName: options.goodsName,
        chineseName: chineseName,
        englishName: englishName,
        displayPrice: goodsInfo.price,
        gId: goodsInfo.gId,
        info: info,
        goodsInfo: goodsInfo,
        isCollection: res.data.cId == -1 ? false : true
      }
      that.setData(data);
      wx.hideLoading();
    });
  },
  getGoodsList(options) {
    let that = this;
    let chineseName = options.goodsName.split('-')[0];
    let englishName = options.goodsName.split('-')[1];

    app.post('/client/goods/findGoods', 'GET', { shopId: __config.shopId, goodsName: options.goodsName }).then(res => {
      let goodsInfo = [], displayPrice = '',sales = 0;
      for (let i = 0; i < res.data.goods.length; i++) {
        res.data.goods[i].logo = res.data.goods[i].logo.split(',');
        res.data.goods[i].detailedUrl = res.data.goods[i].detailedUrl.split(',');
        sales += res.data.goods[i].sales + res.data.goods[i].osales;
        if (i) {
          res.data.goods[i].active = false;
          displayPrice += res.data.goods[i].price;
        } else {
          res.data.goods[i].active = true;
          goodsInfo = res.data.goods[i];
          displayPrice += res.data.goods[i].price + ' - ';
        }
      }
      let data = {
        goodsName: options.goodsName,
        chineseName: chineseName,
        englishName: englishName,
        displayPrice: displayPrice,
        gId: goodsInfo.gId,
        info: res.data.goods,
        goodsInfo: goodsInfo,
        sales: sales,
        isCollection: res.data.cId == -1 ? false : true,
        cId: res.data.cId
      }
      that.setData(data);
      wx.hideLoading();
    });
  },
  // 回滚至顶部
  backTop(e){
    wx.pageScrollTo({ scrollTop: 0 });
  },
})