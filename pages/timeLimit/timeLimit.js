// pages/timeLimit/timeLimit.js
import __config from '../../vendor/url.js';
const app = getApp();
const path = app.globalData.path;

Page({
  data: {
    banner: [
      path + '/banner/discount.gif',
    ],
    path: path,
    basePath: __config.basePath,
    goodsList: [],
    countDownList: [],
    height: 0,
  },
  onLoad(){
    this.getGoodList();
  },
  onShow(){
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
  getGoodList(){
    let that = this;
    app.post('/client/goods/findListByCollage', 'GET', { shopId: __config.shopId }).then(res => {
      // console.log(res.data.data)
      for (let item of res.data.data) {
        item.logo = item.logo.split(',')[0];
        item.chineseName = item.name.split('-')[0];
        item.englishName = item.name.split('-')[1];
      }
      that.setData({ goodsList: res.data.data });
      let endTimeList = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      res.data.data.forEach(o => { endTimeList.push(o.endTime) });
      that.setData({ actEndTimeList: endTimeList });
      // 执行倒计时函数
      that.countDown();
    });
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      // 时间转译
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    setTimeout(this.countDown, 1000);
  },
})