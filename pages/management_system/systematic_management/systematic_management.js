var myCharts = require("../../../utils/wxcharts.js") //引入一个绘图的插件
const devicesId1 = "899161544" // devicesId
const api_key1 = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 
const devicesId2 = "996195513" // devicesId
const api_key2 = "W8PWDxCoGQWaVF46zn4gQYS820Y=" // Api-key 
const devicesId3 = "996218346" // devicesId
const api_key3 = "UUTNLzsdIw7e=RZI8rZyAyV9WFQ=" // Api-key 


Page({
  data: {
    selectStatus: "normal",
    videoStatus: "",
    normalURL: "",
    smallURL: "",
    mediumURL: "",
    largeURL: ""
  },

  onLoad: function () {
    // wx.cloud.database().collection('status')
    //   .get()
    //   .then(res => {
    //     console.log(res);
    //     this.setData({
    //       videoStatus: res.data[0].videoS,
    //       normalURL: res.data[0].normalURL,
    //       smallURL: res.data[0].smallURL,
    //       mediumURL: res.data[0].mediumURL,
    //       largeURL: res.data[0].largeURL
    //     })
    //   })
  },

  wholeButton: function () {
    this.setData({
      selectStatus: "normal"
    })
  },

  smallButton: function () {
    this.setData({
      selectStatus: "small"
    })
  },

  mediumButton: function () {
    this.setData({
      selectStatus: "medium"
    })
  },

  largeButton: function () {
    this.setData({
      selectStatus: "large"
    })
  },

  environment_data: function () {
    wx.redirectTo({
      url: '/pages/management_system/environment_data/environment_data',
    })
  },

  classification_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/classification_management/classification_management',
    })
  },

  systematic_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/systematic_management/systematic_management',
    })
  },

  urgent_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/urgent_management/urgent_management',
    })
  }
})