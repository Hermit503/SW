// pages/event/event.js
"use strict";
const app = getApp()
const md5 = require('../../../vector/md5.js');
const time = require('../../../vector/time.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addContent: "",
    dataDo: time.getNowFormatDate(), //默认起始时间  
    dataEnd: time.getNowFormatDate(1), //默认结束时间 
    todoList: [],
    clickFlag: 1,
    tips: "",
    count: 0
  },
  addInput: function (e) {
    this.data.addContent = e.detail.value;
  },
  dateChange(e) {
    this.setData({
      dataDo: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.openid === "") {
      this.setData({
        tips: "未正常获取用户信息"
      })
    } else {
      app.ajax({
        load: 2,
        url: app.globalData.url + "funct/todo/getFinEvent",
        fun: res => {
          if (res.data.data) {
            if (res.data.data.length === 0) {
              this.setData({
                tips: "暂没有已完成事项"
              })
              return;
            }
            var curData = time.getNowFormatDate();
            res.data.data.map(function (value) {
              var diff_color = time.dateDiff(curData, value.todo_time, value.event_content);
              value.diff = diff_color[0];
              value.color = diff_color[1];
              return value;
            })
            console.log(res.data.data);
            that.setData({
              todoList: res.data.data,
              count: res.data.data.length
            })
          }
        }
      })
    }
  },
  setStatus(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定标记为未完成吗',
      success: function (choice) {
        if (choice.confirm) {
          var index = e.currentTarget.dataset.index;
          var id = e.currentTarget.dataset.id;
          app.ajax({
            url: app.globalData.url + "funct/todo/setNoFinStatus",
            method: "POST",
            data: {
              id: id
            },
            fun: res => {
              app.toast("标记成功");
              that.data.todoList.splice(index, 1);
              that.setData({
                todoList: that.data.todoList,
                tips: that.data.todoList.length === 0 ? "暂没有已完成事项" : "",
                count: that.data.count - 1
              })
            }
          })
        }
      }
    })
  },
  deleteUnit(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function (choice) {
        if (choice.confirm) {
          var index = e.currentTarget.dataset.index;
          var id = e.currentTarget.dataset.id;
          app.ajax({
            url: app.globalData.url + "funct/todo/deleteUnit",
            method: "POST",
            data: {
              id: id
            },
            fun: res => {
              app.toast("删除成功");
              that.data.todoList.splice(index, 1);
              that.setData({
                todoList: that.data.todoList,
                tips: that.data.todoList.length === 0 ? "暂没有已完成事项" : "",
                count: that.data.count - 1
              })
            }
          })
        }
      }
    })
  },
  jump() {
    wx.navigateTo({
      url: "/pages/finEvent/finEvent"
    })
  }
})