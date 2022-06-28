// pages/square/square.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firco: "#000000",
    secco: "#979797",
    list: [{
        face_url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=447979932,3108003765&fm=26&gp=0.jpg",
        username: "小叮当",
        send_timestamp: "2022-6-3 8:42",
        centent: "最近养鱼场内温度总是高于25°，该怎么办呢？",
        total_likes: 2,
      },
      {
        face_url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562409664468&di=da6c500dd77003e15ccf360c979ce2cb&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201408%2F05%2F20140805182358_CckFB.thumb.700_0.png",
        username: "大东",
        send_timestamp: "2022-6-2 18:14",
        centent: "建议将东星斑和其他的石斑鱼进行混养，这样会使鱼更有活力。",
        total_likes: 6,
      },
      {
        face_url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562409732760&di=38f8a56fcbb4d2a6434f0e75df73db7b&imgtype=0&src=http%3A%2F%2Fimg5q.duitang.com%2Fuploads%2Fitem%2F201504%2F02%2F20150402H1413_nRNyd.jpeg",
        username: "小小大",
        send_timestamp: "2022-6-2 14:42",
        centent: "用周转箱养鱼靠谱吗？",
        total_likes: 1,
      },
    ]
  },

  first_select: function() {
    // wx.redirectTo({
    //   url: '../square/square'
    // })
  },

  second_select: function() {
    wx.navigateTo({
      url: '../commit/commit'
    })
  },

  third_select: function() {
    wx.redirectTo({
      url: '/pages/mine/mine'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})