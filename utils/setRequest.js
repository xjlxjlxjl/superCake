import es6 from '../vendor/es6-promise.js';
import __config from '../vendor/url.js';

class setRequest {
  /**
   * 构造函数
   * 
   */
  constructor () {
    // wx.login({
    //   success: res => {
    //     wx.request({
    //       url: __config.basePath + '/client/wxaUserApi/login',
    //       method: 'POST',
    //       data: {
    //         code: res.code
    //       },
    //       header: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       success: res => {
    //         console.log(res)
    //         if (res.data.result == 1){
    //           wx.setStorageSync("sessionKey", res.data.data);
    //         }else{
    //           wx.showToast({
    //             title: '获取登陆状态失效',
    //             icon: 'none',
    //             duration: 1500
    //           });
    //         }
    //       }
    //     })
    //   }
    // });
  }

  setUrl(baseUrl, params) {
    let that = this;
    wx.showLoading({ title: '加载中',});
    wx.request({
      url: __config.basePath + baseUrl,
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'wxa_sessionid': wx.getStorageSync('sessionKey')
      },
      success: res =>{
        wx.hideLoading();
        return res;
      },
      fail: data => {
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络设置',
          icon: 'none',
          duration: 1500
        })
      }
    })
  }

  getData(baseUrl, params) {
    let that = this;
    // let promise = new Promise(function (resolve, reject){
      wx.showLoading({ title: '加载中', });
      wx.request({
        url: __config.basePath + baseUrl,
        method: 'GET',
        data: params,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'wxa_sessionid': wx.getStorageSync('sessionKey')
        },
        success: res => {
          wx.hideLoading();
          return res;
          // callBack.push(res.data.goods);
        },
        fail: data => {
          wx.hideLoading();
          wx.showToast({
            title: '请检查网络设置',
            icon: 'none',
            duration: 1500
          })
        }
      });
    // });
  }
}
export default setRequest;