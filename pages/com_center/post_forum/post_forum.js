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
    comCenterStatus: ""
  },

  onLoad: function () {
    wx.cloud.database().collection('status')
    .get()
    .then(res => {
      console.log(res)
      this.setData({
        comCenterStatus: res.data[0].comCenterS
      })
    })
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
    var fMonth = String(new Date().getMonth() + 1);
    var fDate = String(new Date().getDate());
    var fHour = String(new Date().getHours());
    var fMinute = String(new Date().getMinutes());
    var fSecond = String(new Date().getSeconds());

    if (fMonth < 10) {
      fMonth = "0" + String(new Date().getMonth() + 1); 
    };

    if (fDate < 10) {
      fDate = "0" + String(new Date().getDate()); 
    };

    if (fHour < 10) {
      fHour = "0" + String(new Date().getHours()); 
    };

    if (fMinute < 10) {
      fMinute = "0" + String(new Date().getMinutes()); 
    };

    if (fSecond < 10) {
      fSecond = "0" + String(new Date().getSeconds()); 
    }

    fTime = String(new Date().getFullYear()) + "/" + fMonth + "/" + fDate + " - " + fHour + ":" + fMinute + ":" + fSecond;
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