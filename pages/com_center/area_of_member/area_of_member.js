const db = wx.cloud.database()

Page({
  data: {
    iconURL: '',
    nickName: '',
    datalist: "",
    comCenterStatus: ""
  },

  //获取到用户的头像、昵称
  onLoad(options) {
    wx.cloud.database().collection('status')
    .get()
    .then(res => {
      console.log(res)
      this.setData({
        comCenterStatus: res.data[0].comCenterS
      })
    })
    this.setData({
      nickName: getApp().globalData.userInfo.nickName,
      iconURL: getApp().globalData.userInfo.avatarUrl
    })
    wx.setStorageSync('Haslogin', true)
    console.log(getApp().globalData.userInfo)

    var that = this;
    db.collection('forum').where({
      fOpenId: getApp().globalData.openid
    })
      .get({
        success: function (res) {
          that.setData({
            datalist: res.data.reverse(),
          })
        }
      })
  },

  updateInfo: function () {
    var that = this;
    wx.getUserProfile({
      desc: '须进行授权方可继续使用',
      success: res => {
        console.log(res)
        wx.setStorageSync('Haslogin', true)
        wx.setStorageSync('userInfo', res.userInfo)
        var user = res.userInfo
        getApp().globalData.userInfo = user;
        that.setData({
          userInfo: user
        })
        wx.cloud.database().collection('forum').where({
          fOpenId: getApp().globalData.openid
        }).update({
          data: {
            fIconURL: getApp().globalData.userInfo.avatarUrl,
            fUserName: getApp().globalData.userInfo.nickName,
          },
        })
        wx.cloud.database().collection('users').where({
          _openid: getApp().globalData.openid
        }).update({
          data: {
            avatarUrl: getApp().globalData.userInfo.avatarUrl,
            nickName: getApp().globalData.userInfo.nickName,
          },
          success: res => {
            setTimeout(function () {
              that.onLoad()
              wx.showToast({
                title: '更新成功',
              })
            }, 1000);
            clearTimeout();
          },
          fail: (res) => {
            console.log(res);
          }
        })
      }
    })
  },

  deleteForum: function(e){
    console.log('删除函数运行')
    console.log(e.currentTarget.dataset.index)
    var that=this; 
    //删除云端记录
    db.collection('forum').doc(e.currentTarget.dataset.index).remove({
      success: function(res) {
        that.onLoad();
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