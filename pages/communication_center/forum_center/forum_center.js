Page({
  data: {

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