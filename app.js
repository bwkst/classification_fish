App({
  globalData:{
    userInfo:null,
    openid:null
  },

  onLaunch(){
    wx.cloud.init({
      evn:"cloud1-4gt56a6sac508a36",
      traceUser:true
    })
    this.getOpenid();
  },
  
  //获取用户openid
  getOpenid(){
    let that = this;
    wx.cloud.callFunction({
     name:'quickstartFunctions',
     data: {
     type: 'getOpenId'
    },
      complete: res=>{
        console.log(res)
        that.globalData.openid = res.result.openid
        //用户信息储存到全局变量中
        wx.cloud.database().collection('users').where({
          _openid:that.globalData.openid
        }).get({
          success:result=>{
            console.log(result)
            that.globalData.userInfo = (result.data[0] ? result.data[0] : '')
          }
        })
      }
    })
  }

})
