const app = getApp()
Page({
  data: {
    userInfo: null,
    Haslogin: null,
    comCenterStatus: ""
  },

  onLoad(options) {
    wx.cloud.database().collection('status')
    .get()
    .then(res => {
      console.log(res)
      this.setData({
        comCenterStatus: res.data[0].comCenterS
      })
    })
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo,
      Haslogin: wx.getStorageSync('Haslogin')
    })
    if (that.data.Haslogin) {
      wx.redirectTo({
        url: '../forum_center/forum_center',
      })
    }
  },

  //用户授权获取信息
  login() {
    var that = this
    wx.getUserProfile({
      desc: '须进行授权方可继续使用',
      success: res => {
        wx.setStorageSync('Haslogin', true)
        var user = res.userInfo
        app.globalData.userInfo = user
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
          _openid: app.globalData.openid
        }).get({
          success(res) {
            console.log(res)
            if (res.data.length == 0) {
              wx.cloud.database().collection('users').add({
                data: {
                  avatarUrl: user.avatarUrl,
                  nickName: user.nickName,
                },
                success: res => {
                  wx.showToast({
                    title: '登陆成功',
                  })
                }
              })
            } else {
              that.setData({
                userInfo: res.data[0],
              })
            }
          },
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../forum_center/forum_center',
          })
        }, 100)
      },
      fail: res => {
        console.log("授权失败", res)
      }
    })
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})