Page({
  data: {
    likeStatus: "未点赞",
    datalist: [],
  },

  getData(num = 5, page = 0) {
    wx.cloud.callFunction({
      name: "demogetlist",
      data: {
        num: num,
        page: page
      }
    }).then(res => {
      var oldData = this.data.datalist
      var newData = oldData.concat(res.result.data);
      console.log(res.result.data)
      this.setData({
        datalist: newData
      })
    })
  },

  onLoad: function (options) {
    this.getData();
  },

  // 触底
  onReachBottom: function () {
    var page = this.data.datalist.length
    this.getData(5, page)//5为每次刷新的次数
  },

  clickLike: function (e) {
    this.setData({
      likeStatus: "已点赞",
    })
  },

  cancelLike: function () {
    this.setData({
      likeStatus: "未点赞",
    })
  },

  postForumPage: function () {
    wx.redirectTo({
      url: '../post_forum/post_forum',
    })
  },

  areaOfMemberPage: function () {
    wx.redirectTo({
      url: '../area_of_member/area_of_member',
    })
  }
})