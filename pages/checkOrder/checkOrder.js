// pages/checkOrder/checkOrder.js
import es6 from '../../vendor/es6-promise.js';
import __config from '../../vendor/url.js';
// import dateTimePicker from '../../utils/dateTimePicker.js';

const app = getApp();

Page({
  data: {
    product: [],
    gIds: '',

    address: [],
    selectAddress: {},
    isAddressSelect: false,
    addId: 0,

    // 配送方式
    distribution: { name: '预约配送', value: 1, checked: true },
    distributionMethod: [
      { name: '立即配送', value: 0, checked: false },
      { name: '预约配送', value: 1, checked: true }
    ],

    couponList: [],
    couponSelect: {
      reduceAmount: 0,
    },
    amount: 0,

    // 请选择时间
    startTime: '',
    date: '请选择时间',
    timeSlotSelect: '选择时间段',
    isTime: false,
    timeSlot: [
      [
        // 上午
        {
          time: '06:00-07:00',
          disabled: false
        }, {
          time: '07:00-08:00',
          disabled: false
        }, {
          time: '08:00-09:00',
          disabled: false
        }, {
          time: '09:00-10:00',
          disabled: false
        }, {
          time: '10:00-11:00',
          disabled: false
        }, {
          time: '11:00-12:00',
          disabled: false
        }
      ], [
        // 中午
        {
          time: '12:00-13:00',
          disabled: false
        }, {
          time: '13:00-14:00',
          disabled: false
        }, {
          time: '14:00-15:00',
          disabled: false
        }
      ], [
        // 下午
        {
          time: '15:00-16:00',
          disabled: false
        }, {
          time: '16:00-17:00',
          disabled: false
        }, {
          time: '17:00-18:00',
          disabled: false
        }
      ], [
        // 晚上
        {
          time: '18:00-19:00',
          disabled: false
        }, {
          time: '19:00-20:00',
          disabled: false
        }, {
          time: '20:00-21:00',
          disabled: false
        }, {
          time: '21:00-22:00',
          disabled: false
        }, {
          time: '22:00-23:00',
          disabled: false
        }, {
          time: '23:00-00:00',
          disabled: false
        }
      ], [
        // 凌晨
        {
          time: '00:00-01:00',
          disabled: false
        }, {
          time: '01:00-02:00',
          disabled: false
        }, {
          time: '02:00-03:00',
          disabled: false
        }, {
          time: '03:00-04:00',
          disabled: false
        }, {
          time: '04:00-05:00',
          disabled: false
        }, {
          time: '05:00-06:00',
          disabled: false
        }
      ],
    ],

    // 开具发票
    invoice: false,
    collageId: false,
    // 发票抬头
    invoiceTitle: '',
    invoiceContent: '',
    // 祝福语
    greetings: '',
    // 备注
    info: '',

    isInAddress: false,
    path: __config.basePath,
    loginModal: false,

    tablewareCount: 0,
  },

  // 餐具数量加减
  tableware(e) {
    switch (e.currentTarget.dataset.calculation) {
      case 1:
      case '1':
        if (this.data.tablewareCount > 0) {
          this.data.tablewareCount--
          this.data.amount = this.data.amount - 5;
        }
        break;
      case 2:
      case '2':
        this.data.tablewareCount++
        this.data.amount = this.data.amount + 5;
        break;
    }
    this.setData({
      tablewareCount: this.data.tablewareCount,
      amount: this.data.amount,
    });
  },
  invoice(e) {
    this.setData({ invoice: !this.data.invoice });
  },
  bindTextAreaBlur(e) {
    this.setData({ info: e.detail.value });
  },
  addressToggle(e) {
    this.setData({ isAddressSelect: !this.data.isAddressSelect });
  },
  addressChange(e) {
    let that = this.data, id = e.detail.value, select = {};
    for (let item of that.address) {
      item.checked = false;
      if (item.addId == id) {
        item.checked = true;
        select = item;
      }
    }
    this.setData({
      address: that.address,
      addId: e.detail.value,
      isAddressSelect: false,
      selectAddress: select
    });
    this.checkOrder();
  },
  timeSlotToggle(e) {
    // this.timeDisabled();
    this.setData({ isTime: !this.data.isTime })
  },
  timeDisabled(e) {
    let self = this.data.timeSlot, time = e;// new Date().getHours();
    switch (time) {
      case 24:
      case '24':
        self[3][6].disabled = true;
      case 23:
      case '23':
        self[3][5].disabled = true;
      case 22:
      case '22':
        self[3][4].disabled = true;
      case 21:
      case '21':
        self[3][3].disabled = true;
      case 20:
      case '20':
        self[3][2].disabled = true;
      case 19:
      case '19':
        self[3][1].disabled = true;
      case 18:
      case '18':
        self[3][0].disabled = true;
      case 17:
      case '17':
        self[2][2].disabled = true;
      case 16:
      case '16':
        self[2][1].disabled = true;
      case 15:
      case '15':
        self[2][0].disabled = true;
      case 14:
      case '14':
        self[1][2].disabled = true;
      case 13:
      case '13':
        self[1][1].disabled = true;
      case 12:
      case '12':
        self[1][0].disabled = true;
      case 11:
      case '11':
        self[0][5].disabled = true;
      case 10:
      case '10':
        self[0][4].disabled = true;
      case 9:
      case '09':
        self[0][3].disabled = true;
      case 8:
      case '08':
        self[0][2].disabled = true;
      case 7:
      case '07':
        self[0][1].disabled = true;
      case 6:
      case '06':
        self[0][0].disabled = true;
      case 5:
      case '05':
        self[4][5].disabled = true;
      case 4:
      case '04':
        self[4][4].disabled = true;
      case 3:
      case '03':
        self[4][3].disabled = true;
      case 2:
      case '02':
        self[4][2].disabled = true;
      case 1:
      case '01':
        self[4][1].disabled = true;
      case 0:
      case '00':
        self[4][0].disabled = true;
        break;
      case '-1':
      default:
        for (let item in self) {
          for (let i in self[item]) {
            self[item][i].disabled = false;
          }
        }
        break;
    }
    this.setData({ timeSlot: self });
  },
  choice(e) {
    let params = e.currentTarget.dataset;
    if (params.click)
      return false;

    this.setData({
      timeSlotSelect: this.data.timeSlot[params.key][params.index].time,
      isTime: false,
    });
  },
  bindDateChange(e) {
    if (this.data.startTime == e.detail.value) {
      this.timeDisabled(this.data.maxAppointmentTime);
    } else {
      this.timeDisabled(-1);
    }
    this.setData({ date: e.detail.value });
  },
  bindPickerChange(e) {
    this.setData({ couponSelect: this.data.couponList[e.detail.value] });
  },
  // 发票抬头
  invoiceTitleChange(e) {
    this.setData({ invoiceTitle: e.detail.value });
  },
  invoiceContentChange(e) {
    this.setData({ invoiceContent: e.detail.value });
  },
  greetingsChange(e){
    this.setData({ greetings: e.detail.value });
  },
  getUserInfo(e) {
    let that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userLoginStatus', true);
        app.post('/client/wxaUserApi/info', 'POST', {
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          signature: res.signature
        }).then(result => {
          if (result.data.result == 1) {
            wx.setStorageSync('userLoginStatus', true);
            wx.setStorageSync('userInfo', app.globalData.userInfo);
            wx.setStorageSync('mobile', result.data.data.mobile);
            that.setData({ loginModal: false });
            that.onShow();
          } else {
            wx.showToast({
              title: '登录失败，请重新操作',
              icon: 'none',
              duration: 1500
            });
          }
        })
      }
    });
  },
  pay() {
    let self = this.data, that = this, count = [];
    if (self.timeSlotSelect == '选择时间段') {
      wx.showToast({
        title: '请选择时间段',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }
    if (!self.isInAddress) {
      wx.showToast({
        title: '选中地点不在配送范围',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }

    wx.showLoading({ title: '生成订单中', mask: true });
    for (let item of self.product) {
      count.push(item.count);
    }

    if (self.tablewareCount) {
      self.gIds += ',95772';
      count.push(self.tablewareCount);
    }
    // 拼接时间
    let str = self.timeSlotSelect.split('-');
    let startTime = self.date + ' ' + str[0] + ':00', endTime = self.date + ' ' + str[1] + ':00';

    let params = {
      addId: self.addId,
      shopId: __config.shopId,
      startDeliveryTime: startTime,
      endDeliveryTime: endTime,
      // 发票抬头
      rise: self.invoiceTitle,
      // 纳税人识别号
      recognitionNumber: self.invoiceContent,
      // 祝福语
      greetings: self.greetings,
      info: self.info,
    }
    if (self.collageId) {
      params.collageId = self.product[0].collageId;
    } else {
      params.gIds = self.gIds;
      params.counts = count.join(',');
      params.rpItemId = self.couponSelect.rpItemId ? self.couponSelect.rpItemId : '';
    }
    app.post('/client/order/save', 'POST', params).then(res => {
      wx.hideLoading();
      if (res.data.result == 1) {
        // console.log(res)
        that.payment(res.data.data);
      } else {
        wx.showToast({
          title: '生成订单失败，请重新生成',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    });
  },
  /**
   *  e :订单No
   */
  payment(e) {
    let that = this;
    wx.showLoading({ title: '请求支付中，请稍后', mask: true });
    app.post('/client/order/getPayJson', 'GET', { no: e }).then(res => {
      if (res.data.result == 1) {
        let json = JSON.parse(res.data.data);
        wx.requestPayment({
          'timeStamp': json.timeStamp,
          'nonceStr': json.nonceStr,
          'package': json.package,
          'signType': 'MD5',
          'paySign': json.paySign,
          'success': res => {
            wx.showToast({
              title: '订单交易完成，跳转中',
              icon: 'none',
              duration: 3000,
              mask: true
            });
            setTimeout(e => {
              wx.redirectTo({ url: '/pages/order/order?oStateId=3&type=1' });
            }, 3000);
          }
        })
        wx.hideLoading();
      } else {
        wx.showToast({
          title: '订单生成失败，请重试',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    });
  },
  onShow(e) {
    if (!wx.getStorageSync('userLoginStatus')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500,
        mask: true
      });
      this.setData({ loginModal: true });
      return false;
    }

    let goodsList = JSON.parse(wx.getStorageSync('shoppingCar'));
    this.getOrder();
    this.getAddress();
    this.getCoupon();

    this.setData({
      amount: app.watch.amount(goodsList)
    });
  },
  getOrder(e) {
    let that = this, goodsList = JSON.parse(wx.getStorageSync('shoppingCar')), gIds = [], goods = [], arr = [];
    for (let item of goodsList) {
      if (item.checked) {
        goods.push(item);
        gIds.push(item.gId);
      }
    }
    if (goods.length == 1) {
      if (goods[0].collageId != undefined) {
        that.setData({ collageId: true });
      }
    }
    this.setData({
      product: goods,
      gIds: gIds.join(',')
    });
  },
  checkOrder() {
    let that = this.data, self = this, maxTime = '';
    let params = {
      gIds: that.gIds,
      addId: that.addId,
      shopId: __config.shopId
    }
    // console.log(params)
    wx.showLoading();
    app.post('/client/order/check', 'GET', params).then(res => {
      wx.hideLoading();
      let isInAddress = true
      if (res.data.result != 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500,
          mask: true
        });
        isInAddress = false;
      }

      let str = res.data.data ? res.data.data.split(' ') : ' : ';
      let strTime = str[1].split(':');
      this.timeDisabled(strTime[0]);

      // let goodsList = JSON.parse(wx.getStorageSync('shoppingCar')), arr = [];
      // for (let item of goodsList) {
      //   if (!item.checked){
      //     arr.push(item);
      //   }
      // }
      // wx.setStorageSync('shoppingCar', JSON.stringify(arr));

      self.setData({
        startTime: str[0],
        date: str[0],
        maxAppointmentTime: strTime[0],
        isInAddress: isInAddress,
      });

    });
  },
  getAddress(e) {
    let that = this;
    wx.showLoading({ title: '加载中', });
    app.post('/client/address/findAll', 'GET', { page: 1, limit: 10000 }).then(res => {
      wx.hideLoading();
      let addId = 0, selectAddress = {};
      for (let v of res.data.data.list) {
        v.checked = false;
        if (v.isDef) {
          addId = v.addId;
          selectAddress = v;
          v.checked = true;
        }
      }
      if (res.data.data.list.length == 0) {
        wx.showToast({
          title: '没有选中地址',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      } else {
        that.checkOrder();
      }
      that.setData({
        address: res.data.data.list,
        selectAddress: selectAddress,
        addId: addId
      })
      // 获取最低时间
    });
  },
  getCoupon(e) {
    let that = this;
    app.post('/client/redPage/findByRPageId', 'GET', { rPageIds: '' }).then(res => {
      let list = [];
      for (let item of res.data.data) {
        item.couponName = '满' + item.minAmount + '减' + item.reduceAmount;
        if (that.data.amount > item.minAmount) {
          list.push(item);
        }
      }
      that.setData({ couponList: list });
    });
  },
});