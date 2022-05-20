// pages/communication_center/area_of_member/area_of_member.js
const app = getApp()
Page({
  //显示用户头像+名字
  
  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatar: '',
    openid: ''
  },

  //获取到用户的头像、昵称
  onLoad(options) {
    this.setData({
      nickName: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl
    })
    wx.setStorageSync('Haslogin', true)
  },

  //退出登录并记录状态
  logout() {
    app.globalData.userInfo = null
    this.setData({
      nickName: '',
      avatar: ''
    })
    wx.setStorageSync('Haslogin', false)
    wx.redirectTo({
      url: '../login/login',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})