const app = getApp()
Page({
  //wx.getSetting
  //wx.login
  //授权登录
  //独有的钥匙 -> 登录信息
  //设计配合本身小程序设计，颜色在其他页面找到
  //登录、授权成功 -> 跳转页面 forum_center

  data: {
    userInfo: null,
    Haslogin: null
  },
  onLoad(options) {
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo,
      Haslogin: wx.getStorageSync('Haslogin')
    })
    if (that.data.Haslogin) {
      wx.navigateTo({
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
        //储存用户数据至云数据库
        //检查数据库是否存在用户数据
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
          wx.navigateTo({
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

  },
})