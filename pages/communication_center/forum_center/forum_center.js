var newArray;
var newlikeNo;

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

  onLoad: function () {
    this.setData({
      datalist: [],
    })
    this.getData();
  },

  // 触底
  onReachBottom: function () {
    var page = this.data.datalist.length
    this.getData(5, page)//5为每次刷新的次数
  },

  clickLike: function (e) {
    var that = this;
    wx.cloud.database().collection('forum')
      .where({
        _id: e.currentTarget.id
      })
      .get()
      .then(res => {
        for (let i = 0; i < res.data[0].likeNo; i++) {
          if (res.data[0].likeOpenId[i] == getApp().globalData.openid) {
            wx.showModal({
              content: '已经点赞过了',
              showCancel: false
            })
            that.setData({
              likeStatus: "已点赞",
            })
          } else {
          }
        }
        if (that.data.likeStatus == "已点赞") {
          that.setData({
            likeStatus: "未点赞",
          })
        } else if (that.data.likeStatus == "未点赞") {
          newArray = res.data[0].likeOpenId;
          newlikeNo = res.data[0].likeNo + 1;
          for (let i = res.data[0].likeNo; i < res.data[0].likeNo + 1; i++) {
            newArray[i] = getApp().globalData.openid;
          }
          that.updateLike(e);
        }
      })
  },

  updateLike: function (e) {
    var that = this;
    wx.cloud.database().collection('forum')
      .where({
        _id: e.currentTarget.id
      })
      .update({
        data: {
          likeOpenId: newArray,
          likeNo: newlikeNo
        }
      });
    that.setData({
      likeStatus: "未点赞",
    })
    wx.showModal({
      content: '你的点赞即将送达~',
      showCancel: false
    })
  },

  NUcancelLike: function () {
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