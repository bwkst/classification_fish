Page({

  data: {
    minSmall: "或以下",
    maxSmall: 0.8,
    minMedium: 0.8,
    maxMedium: 2,
    minLarge: 2,
    maxLarge: "或以上",
    waterInLitre: 0.35,
    waterWeight: 0.7
  },

  environment_data: function(){
    wx.redirectTo({
      url: '/pages/management_system/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/urgent_management/urgent_management',
      })
  }

})