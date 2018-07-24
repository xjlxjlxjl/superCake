// pages/promise/promise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastX: 0,
    lastY: 0,
    text: "没有滑动",
  },
  touchStart(e){
    console.log(wx)
  },
  handletouchmove: function (event) {
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    let text = ""
    if ((currentY - this.data.lastY) < 0)
      console.log('向上滑动');//text = "向左滑动";
    else if (((currentY - this.data.lastY) > 0))
      console.log('向下滑动')//text = "向右滑动";

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });
  },

  handletouchtart: function (event) {
    console.log(event)
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletap: function (event) {
    console.log(event)
  },
})