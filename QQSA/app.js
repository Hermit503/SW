//app.js
"use strict";
App({
  globalData: {
    userFlag: 0,
    url: 'https://www.michalingshi.cn/sdust/index.php/',
    header: {
      'Cookie': '', //PHPSESSID
      'content-type': 'application/x-www-form-urlencoded'
    },
    openid: "",
    version: "1.0.1"
  },
  extend: function() {
    var aLength = arguments.length;
    var options = arguments[0];
    var target = {};
    var copy;
    var i = 1;
    if (typeof options === "boolean" && options === true) {
      //深拷贝 (仅递归处理对象)
      for (; i < aLength; i++) {
        if ((options = arguments[i]) != null) {
          if (typeof options !== 'object') {
            return options;
          }
          for (var name in options) {
            copy = options[name];
            if (target === copy) {
              continue;
            }
            target[name] = this.extend(true, options[name]);
          }
        }
      }
    } else {
      //浅拷贝
      target = options;
      if (aLength === i) {
        target = this;
        i--;
      } //如果是只有一个参数，拓展功能 如果两个以上参数，将后续对象加入到第一个对象
      for (; i < aLength; i++) {
        options = arguments[i];
        for (var name in options) {
          target[name] = options[name];
        }
      }
    }
    return target;
  },
  onPageNotFound(res) { //处理404
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})

const app = getApp();
const time = require('/vector/time.js');
const dispose = require('/vector/dispose.js');
time.extDate(); //拓展Date原型
dispose.checkUpdate(); //获取更新

//拓展app功能
app.extend({

  /**
   * 弹窗
   */
  toast: function(e, time = 2000, icon = 'none') {
    wx.showToast({
      title: e,
      icon: icon,
      duration: time
    })
  },

  /**
   * 封装请求
   */
  ajax: function(requestInfo) {
    var option = {
      load: 1,
      autoCookie: true ,
      url: "",
      method: "GET",
      data: {},
      fun: () => {},
      success: () => {},
      fail: function () { this.completeLoad = () => { app.toast("服务器错误"); };},
      complete: () => {},
      completeLoad: () => {}
    };
    app.extend(option, requestInfo);
    dispose.startLoading(option);
    wx.request({
      url: option.url,
      data: option.data,
      method: option.method,
      header: app.globalData.header,
      success: (res) => {
        try {
          option.fun(res);
          option.success(res);
        } catch (e) {
          option.completeLoad = () => { app.toast("PARSE ERROR"); }          
          console.log(e);
        }
      },
      fail: (res) => {
        option.fail(res);
      },
      complete: function(res) {
        dispose.endLoading(option);
        option.complete(res);
        option.completeLoad(res);
      }
    })
  }

});


