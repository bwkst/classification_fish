Page({
  data: {
    iconURL: '',
    nickName: '',
  },

  //获取到用户的头像、昵称
  onLoad(options) {
    this.setData({
      nickName: getApp().globalData.userInfo.nickName,
      iconURL: getApp().globalData.userInfo.avatarUrl
    })
    wx.setStorageSync('Haslogin', true)
    console.log(getApp().globalData.userInfo )
  },

  updateInfo: function(){
    var that = this
    wx.getUserProfile({
      desc: '须进行授权方可继续使用',
      success: res => {
        console.log(res)
        wx.setStorageSync('Haslogin', true)
        wx.setStorageSync('userInfo', res.userInfo)
        var user = res.userInfo
        getApp().globalData.userInfo = user
        
        that.setData({
          userInfo: user
        })
    wx.cloud.database().collection('users').where({
      _openid:getApp().globalData.openid
    }).update({
      data:{
        avatarUrl: getApp().globalData.userInfo.avatarUrl,
        nickName: getApp().globalData.userInfo.nickName,
      },
      success: res => {
        setTimeout(function(){
          wx.showToast({
            title: '更新成功',
          })
          that.onLoad()
        },2000);
        clearTimeout();
      }
    })
    }
  })
  },

  //退出登录并记录状态
  logout() {
    getApp().globalData.userInfo = null
    wx.setStorageSync('Haslogin', false)
    wx.redirectTo({
      url: '../login/login',
    })
  },

  forumCenterPage: function () {
    wx.redirectTo({
      url: '../forum_center/forum_center',
    })
  },

  postForumPage: function () {
    wx.redirectTo({
      url: '../post_forum/post_forum',
    })
  }
})