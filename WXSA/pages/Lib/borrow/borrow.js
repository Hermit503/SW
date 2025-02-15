// pages/borrow/borrow.js
"use strict";
const app = getApp();
const compareTimeInSameDay = (t1, t2) => {
  let d = new Date()
  let ft1 = d.setHours(t1.split(":")[0], t1.split(":")[1])
  let ft2 = d.setHours(t2.split(":")[0], t2.split(":")[1])
  return ft1 > ft2
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curData = new Date();
    var startTime = "7:00";
    var endTime = "22:30";
    var curTime = curData.getHours() + ":" + curData.getMinutes();
    if (compareTimeInSameDay(startTime,curTime) || compareTimeInSameDay(curTime,endTime)) {
      app.toast("当前时间图书馆服务已关闭");
      return ;
    }
    var that = this;
    app.ajax({
      load: 2,
      url: app.globalData.url + "funct/lib/signalLibquery",
      fun: res => {
        if (res.data.Message === "Yes"){
          var infoArr = [];
          res.data.info.match(/<li>[\s\S]*?<\/li>/g).forEach(value => {
            var infoArrInner = [];
            infoArrInner.push(value.match(/<h3>.*?<\/h3>/)[0].replace(/[<h3>]|[<\/h3>]/g,""));
            value.match(/<p.*?>[\s\S]*?<\/p>/g).forEach(value2 => {
              infoArrInner.push(value2.replace(/[<.*?p.*?>]|[<\/p.*?>]/g,""));
            })
            infoArr.push(infoArrInner);
          })
          console.log(infoArr);
          that.setData({
            data: infoArr
          })
        }else{
          app.toast("响应超时");
        }
        
      }
    })
  }
})