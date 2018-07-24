//index.js
//获取应用实例 获取全局变量
import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
const app = getApp();
const path = app.globalData.path;

Page({
  data: {
    imgUrls: [
      {
        img: path + '/banner/indexBanner.png',
      // }, {
        // img: path + '/banner/indexBanner.jpg',
      },
    ],
    true: true,
    false: false,
    height: '',
    // 分类
    goodsType: [
      {
        img: path + '/goodsType/type1.png?v=123',
        gTypeId: 3638
      }, {
        img: path + '/goodsType/type2.png?v=123',
        gTypeId: 3640
      }, {
        img: path + '/goodsType/type3.png?v=123',
        gTypeId: 3637
      }, {
        img: path + '/goodsType/type4.png?v=123',
        gTypeId: 3639
      }
    ],
    discount: [],
    // 热销商品
    goodsList: [
      
    ],
    // 拼团
    page: 1,
    limit: 100,
    modal: false,
    // maxPage: 0,
    basePath: __config.basePath,
    path: app.globalData.path,
  },
  onLoad(){
    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.setData({
    //       height: res.windowHeight,
    //     })
    //   }
    // });
    setTimeout(() => { this.getGoodsList() }, 500);
  },
  onShow (e) {
    
  },
  getDiscount(e){
    wx.navigateTo({
      url: '/pages/redpage/redpage',
    })
    // wx.showToast({
    //   title: '已经帮您领取优惠卷',
    //   icon: 'none',
    //   duration: 1500
    // });
  },
  getGoodsList(){
    let that = this, res = undefined, goodsList = that.data.goodsList;
    wx.showLoading({ title: '加载中', mask: true });
    app.post('/client/index/index', 'GET', { 
      shopId: __config.shopId, 
      stateId: 1,
      page: that.data.page,
      limit: that.data.limit
    }).then(res => {
      // if (res.data.rPageIds != '' && app.globalData.isGetrPage){
      //   that.getRedPage(res.data.rPageIds);
      //   app.globalData.isGetrPage = false;
      // }
      wx.setStorageSync('rPageIds', res.data.rPageIds);
      if (res.data.birthday.length > 0 && !wx.getStorageSync('birthdayModal')){
        let name = '';
        for (let item in res.data.birthday){
          if (item == res.data.birthday.length - 1){
            name += res.data.birthday[item].name
          }else{
            name += res.data.birthday[item].name + ',';
          }
          wx.setStorageSync('birthdayModal', true);
        }
        wx.showModal({
          title: '您以下朋友明天就要生日啦',
          content: name,
          showCancel: true,
        });
      }

      that.checkPay();

      for (let item of res.data.goods1.list){
        item.logo = item.logo.split(',')[0];
        item.chineseName = item.name.split('-')[0];
        item.englishName = item.name.split('-')[1];
        // goodsList.push(item);
      }
      for (let item of res.data.goods2.list) {
        item.logo = item.logo.split(',')[0];
        item.chineseName = item.name.split('-')[0];
        item.englishName = item.name.split('-')[1];
        goodsList.push(item);
      }

      that.setData({
        goodsList: goodsList,
        page: ++that.data.page,
      });
      wx.hideLoading();
    });
  },
  checkPay(e){
    app.post('/client/index/checkPay', 'GET', { shopId: __config.shopId});
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /*
  getTypeList(e){
    let that = this, id = e.currentTarget.id;
    app.post('/client/goods/findListByType', 'GET', { 
      shopId: __config.shopId, 
      gTypeId: that.data.sliderSubclass[id].gTypeId 
    }).then(res => {
      that.setData({
        excellentAssembly: res.data.data
      })
    });
  },
  getRedPage(){
    let that = this;
    app.post('/client/redPage/findByRPageId', 'GET', { rPageIds: '' }).then(res => {
      wx.hideTabBar();
      that.setData({ 
        discount: res.data.data,
        isModal: true,
      })
    });
  },
  */
  /**
   * 滑动加载
   */
  lower() {
    // this.getGoodsList();
  }
})
