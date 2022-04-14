Page({
  
  environment_data: function(){
    wx.navigateTo({
      url: '/pages/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.navigateTo({
      url: '/pages/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.navigateTo({
      url: '/pages/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.navigateTo({
      url: '/pages/urgent_management/urgent_management',
      })
  },

  order_management: function(){
    wx.navigateTo({
      url: '/pages/order_management/order_management',
      })
  },

  communication_center: function(){
    wx.navigateTo({
      url: '/pages/communication_center/communication_center',
    })
  }
  
})