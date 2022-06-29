var fTime;

Page({
  data: {
    submitStatus: "不可发布",
    content: "",
    likeNo: "",
    fOpenId: "",
    fIconURL: "",
    fUserName: "",
    likeOpenId: "",
  },

  inputContent: function (e) {
    this.setData({
      content: e.detail.value,
    })
    this.haveChange();
  },

  haveChange: function () {
    if (this.data.content == "") {
      this.setData({
        submitStatus: "不可发布",
      })
    } else {
      this.setData({
        submitStatus: "可发布",
      })
    }
  },

  getTime: function () {
    fTime = String(new Date().getFullYear()) + "/" + String(new Date().getMonth() + 1) + "/" + String(new Date().getDate()) + " - " + String(new Date().getHours()) + ":" + String(new Date().getMinutes()) + ":" + String(new Date().getSeconds())
  },

  addForum: function () {
    var that = this;
    wx.cloud.database().collection('forum')
      .add({
        data: {
          content: this.data.content,
          likeNo: 0,
          fTime: fTime,
          fOpenId: getApp().globalData.openid,
          fIconURL: getApp().globalData.userInfo.avatarUrl,
          fUserName: getApp().globalData.userInfo.nickName,
          likeOpenId: []
        }
      })
      .then(res => {
        console.log('添加成功')
        wx.hideLoading({
          success: () => {
            that.forumCenterPage();
          },
        })
      })
      .catch(err => {
        console.log('添加失败', err)
      })
  },

  postForum: function () {
    var that = this;
    that.getTime();
    wx.showLoading({
      title: '发布中',
    });
    setTimeout(function () {
      that.addForum();
    }, 2000);
    clearTimeout();
  },

  forumCenterPage: function () {
    wx.redirectTo({
      url: '../forum_center/forum_center',
    })
  },

  areaOfMemberPage: function () {
    wx.redirectTo({
      url: '../area_of_member/area_of_member',
    })
  }
})