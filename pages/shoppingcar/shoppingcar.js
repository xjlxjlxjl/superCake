//shoppingcar.js
import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
var app = getApp();

Page({
  data: {
    productList:[],
    amount: 0,
    isEdit: false,
    path: __config.basePath,
    height: 0,
    basePath: __config.basePath,
  },
  checkboxChange(e){
    // console.log(e)
    let that = this.data, id = e.currentTarget.id;
    that.productList[id].checked = !that.productList[id].checked;
    this.setData({
      productList: that.productList,
      amount: app.watch.amount(that.productList)
    });
  },
  countAdd(e) {
    let that = this, id = e.currentTarget.id;
    that.data.productList[id].count++;
    let amount = app.watch.amount(that.data.productList);
    that.setData({
      productList: that.data.productList,
      amount: amount
    });
  },
  countDel(e){
    let that = this, id = e.currentTarget.id;
    that.data.productList[id].count > 1 ? that.data.productList[id].count-- : 1;
    let amount = app.watch.amount(that.data.productList);
    that.setData({
      productList: that.data.productList,
      amount: amount
    });
  },
  productDel(e){
    let that = this, id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if(res.confirm){
          that.data.productList.splice(id ,1);
            wx.setStorageSync('shoppingCar', JSON.stringify(that.data.productList))
          let amount = app.watch.amount(that.data.productList);
          that.setData({
            productList: that.data.productList,
            amount: amount
          });
        }
      }
    });
  },
  payMent(e){
    let that = this.data,status = false;
    for (let item of that.productList){
      if(item.checked){
        status = true;
      }
    }
    // 整改
    wx.setStorageSync('shoppingCar', JSON.stringify(that.productList));
    if(status){
      wx.navigateTo({
        url: '/pages/checkOrder/checkOrder'
      })
    }else{
      wx.showToast({
        title: '没有选中商品',
        icon: 'none',
        duration: 1500
      });
    }
  },
  editChange(e){
    this.setData({
      isEdit: !this.data.isEdit,
    })
  },
  onLoad(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight + 45,
        })
      }
    });
  },
  onShow () {
    // this.getProductDetail();
    let json = wx.getStorageSync('shoppingCar') ? wx.getStorageSync('shoppingCar') : '[]';
    let that = this, goodsList = JSON.parse(json), goods = [];
    for (let item of goodsList){
      let owned = false;
      for (let val of goods){
        if(val.gId == item.gId){
          val.count++;
          owned = true;
        }
      }
      if (!owned){
        goods.push(item);
      }
    }
    console.log(goods)
    wx.setStorageSync('shoppingCar',JSON.stringify(goods));
    that.setData({
      productList: goods,
      amount: app.watch.amount(goods),
      isEdit: false,
    });
  },
  // 下方推荐商品
  getProductDetail(options) {
    let that = this, goods = [];
    app.post('/client/index/index', 'GET', { shopId: __config.shopId, stateId: 1, limit: 5, page: 1 }).then(res => {
      for (let item of res.data.goods1.list) {
        item.logo = item.logo.split(',')[0];
      }
      that.setData({
        excellentAssembly: res.data.goods1.list
      })
    });
  },
})
