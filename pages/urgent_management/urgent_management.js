// pages/urgent_management/urgent_management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        limitTemperature:'27',//建议温度
        maxCapacity:'300',//最大容量
        currentTemperature:'28',//当前温度
        currentCapacity:'400',//当前容量
        condition:"",//当前状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.getCondition();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        this.setData({
           limitTemperature,
           maxCapacity,
           currentTemperature,
           currentCapacity,
           condition,
        })
      },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*打电话通知管理员*/
  callManager: function(){  
    var week = new Date().getDay();  
    var phoneNumber;
    switch (week) {  
            case 0 :  
                    phoneNumber="1234567" ;
                    break;  
            case 1 :  
                    phoneNumber="1234567" ;
                    break;  
            case 2 :  
                    phoneNumber="1234567" ;
                    break;  
            case 3 :  
                    phoneNumber="1234567" ; 
                    break;  
            case 4 :  
                    phoneNumber="1234567" ;  
                    break;  
            case 5 : 
                    phoneNumber="1234567" ;
                    break;  
            case 6 :  
                    phoneNumber="1234567" ;
                    break;  
    }  
   if(week>=0){
     wx.makePhoneCall({
       phoneNumber: phoneNumber,
     });
   }
  },

  /*获取当前温度和容量并进行判定(只完成了判定的部分)*/
  getCondition: function(){
        if(this.data.currentTemperature>=this.data.limitTemperature || this.data.currentCapacity>=this.data.maxCapacity){
                 this.setData({
                         condition:"异常状态"
                 })
                wx.vibrateLong();
                wx.showToast({
                        title: '状态异常，建议电话通知管理员',
                        icon: 'none',
                        duration: 2500//持续的时间
                      })
        }
        else{
                this.setData({
                        condition:"正常"
                })
        }
  },

})
