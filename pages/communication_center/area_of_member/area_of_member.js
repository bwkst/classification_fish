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