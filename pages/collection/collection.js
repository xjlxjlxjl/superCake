import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
const app = getApp();

Page({
  data: {
    myCollection: [],
    path: __config.basePath
  },
  delCollection(e){
    let that = this;
    let params = {
      cId: e.currentTarget.dataset.cId,
      stateId: 3
    }
    app.post('/client/collection/update', 'POST', params).then(res => {
      that.getList();
    })
  },
  onShow(){
    // if (!wx.getStorageSync('userLoginStatus')) {
    //   // wx.redirectTo({ url: "/pages/user/user" });
    //   wx.navigateBack({ delta: 1 });
    //   wx.showToast({
    //     title: '请先登录',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: true
    //   })
    //   return false;
    // }
    this.getList();
  },
  getList(){
    let that = this;
    app.post('/client/collection/findCollection', 'GET', { shopId: __config.shopId }).then(res => {
      // console.log(res.data.collections);
      for (let item of res.data.collections){
        item.logo = item.logo.split(',')[0];
      }
      that.setData({ myCollection: res.data.collections });
    })
  }
})