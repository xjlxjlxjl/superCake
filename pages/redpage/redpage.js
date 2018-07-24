// pages/redpage/redpage.js
import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
const app = getApp();

Page({
  data: {
    discount: [],
  },
  onLoad: function (e) {
    this.getrPageDetail( e );
  },
  getrPageDetail( params ){
    let that = this;
    app.post('/client/redPage/findByRPageId', 'GET', params).then(res => {
      that.setData({ discount: res.data.data });
    });
  }
})