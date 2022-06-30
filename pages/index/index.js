var forumS;

Page({
  data: {
    forumStatus: ""
  },

  onLoad: function () {
    wx.cloud.database().collection('status')
      .get()
      .then(res => {
        console.log(res)
        forumS = res.data[0].forumS;
        if (forumS == "normal") {
          this.setData({
            forumStatus: "normal"
          })
        }
      })
  },
  
  environment_data: function(){
    wx.navigateTo({
      url: '/pages/management_system/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.navigateTo({
      url: '/pages/management_system/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.navigateTo({
      url: '/pages/management_system/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.navigateTo({
      url: '/pages/management_system/urgent_management/urgent_management',
      })
  },

  order_management: function(){
    wx.navigateTo({
      url: '/pages/order_management/order_management',
      })
  },

  communication_center: function(){
    wx.navigateTo({
      url: '/pages/communication_center/login/login',
    })
  }
})