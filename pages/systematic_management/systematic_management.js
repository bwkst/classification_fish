Page({
  data: {
    selectStatus: "normal"
  },

  wholeButton: function(){
    this.setData({
      selectStatus: "normal"
    })
  },

  smallButton: function(){
    this.setData({
      selectStatus: "small"
    })
  },

  mediumButton: function(){
    this.setData({
      selectStatus: "medium"
    })
  },

  largeButton: function(){
    this.setData({
      selectStatus: "large"
    })
  },

  environment_data: function(){
    wx.redirectTo({
      url: '/pages/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.redirectTo({
      url: '/pages/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.redirectTo({
      url: '/pages/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.redirectTo({
      url: '/pages/urgent_management/urgent_management',
      })
  }
})