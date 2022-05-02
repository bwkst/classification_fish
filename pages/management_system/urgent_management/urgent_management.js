const devicesId = "899161544" // devicesId
const api_key = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 
Page({

  data: {
    temperature: "暂无数据",
    small: "暂无数据",
    medium: "暂无数据",
    large: "暂无数据",
    suggestTemperature: 30,
    smallMaxCapacity: 20,
    mediumMaxCapacity: 20,
    largeMaxCapacity: 20,
    statusNow: "暂无数据",
    member: "暂无数据",
    openId: "",
    envId: "",
    listenerOpenId: "",
    listenerNickname: "",
  },

  videoCall: function(){
    var that = this;
    console.log("当前1", that.data.openId)
    console.log("专家1", that.data.listenerOpenId);
    this.getOpenId();
    this.getMember();
    wx.setEnable1v1Chat({
      enable: true,
      success: function (res) {
        console.log(res);
        console.log("当前2", that.data.openId)
        console.log("专家2", that.data.listenerOpenId);
        wx.join1v1Chat({
          caller: {
            nickname: '小白',
            openid: that.data.openId,
          },
          listener: {
            nickname: that.data.listenerNickname,
            openid: that.data.listenerOpenId,
          },
        })
      },
      fail: function (err) {
        console.log(err)
      },
    })
  },

  getMember: function(){
    var week = new Date().getDay();  
    switch (week) {
      case 0:  
        this.setData({
          member: "符雪媛",
          listenerOpenId: "odVu95Kvur6FP5SD_MqqLcGfTtRo",
          listenerNickname: "权威专家-符老师"
        })
        break;  
      case 1:  
        this.setData({
          member: "罗婷尹",
          listenerOpenId: "odVu95KT9E-1xiCNAM74hWHb5qPc",
          listenerNickname: "权威专家-罗老师"
        })
        break;  
      case 2:  
        this.setData({
          member: "柯家宝",
          listenerOpenId: "odVu95M1-c2jnTqy2Gjk1nl5Zurw",
          listenerNickname: "资深研究员-北老师"
        })
        break;  
      case 3:  
        this.setData({
          member: "赵太宁",
          listenerOpenId: "odVu95CTen0t5_2tQBv TSTkRS_A",
          listenerNickname: "资深研究员-赵老师"
        })
        break;  
      case 4: 
        this.setData({
          member: "符雪媛",
          listenerOpenId: "odVu95Kvur6FP5SD_MqqLcGfTtRo",
          listenerNickname: "权威专家-符博士"
        })
        break;  
      case 5:  
        this.setData({
          member: "罗婷尹",
          listenerOpenId: "odVu95KT9E-1xiCNAM74hWHb5qPc",
          listenerNickname: "权威专家-罗博士"
        })
        break;
      case 6:
        this.setData({
          member: "柯家宝",
          listenerOpenId: "odVu95M1-c2jnTqy2Gjk1nl5Zurw",
          listenerNickname: "资深研究员-北老师"
        })
        break;
    }
  },

  /*打电话通知管理员*/
  phoneCall: function(){  
    var week = new Date().getDay();  
    var phoneNumber;
    switch (week) {
      case 0:  
        phoneNumber="15203013593";
        break;  
      case 1:  
        phoneNumber="18389432506";
        break;  
      case 2:  
        phoneNumber="13141011254"; 
        break;  
      case 3:  
        phoneNumber="18889666813";  
        break;  
      case 4: 
        phoneNumber="15203013593";
        break;  
      case 5:  
        phoneNumber="18389432506";
        break;
      case 6:
        phoneNumber="13141011254";
        break;
    }
    if (week >= 0){
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
      });
    }
    },
  
  /*获取当前温度和容量并进行判定(只完成了判定的部分)*/
  getStatus: function(){
    if (this.data.temperature >= this.data.suggestTemperature || this.data.small >= this.data.smallMaxCapacity || this.data.medium >= this.data.mediumMaxCapacity ||  this.data.large >= this.data.largeMaxCapacity ){
      this.setData({
        statusNow:"异常状态"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '状态异常',
        image: '../../img/urgent.png',
        duration: 2500  //持续的时间
      })
    } else{
      this.setData({
        statusNow:"正常"
      })
    }
  },
  
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)})
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getOpenId();
  },

  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)
    //每隔6s自动获取一次数据进行更新
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.update(datapoints)
      })
    }, 5000)
    wx.showLoading({
      title: '加载中'
    })
    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
      this.update(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    }),

    this.getMember();
  },

  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Small,Medium,Large,Temperature&limit=20`,
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
            reject(res.data)
            return ;
          }
          if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
            reject(response.error)
            return ;
          }
          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }
          //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
          resolve({
            large: response.data.datastreams[3].datapoints,
            medium: response.data.datastreams[2].datapoints,
            small: response.data.datastreams[1].datapoints,
            temperature: response.data.datastreams[0].datapoints
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  update: function (datapoints) {
    const urgentManagementData = this.convert(datapoints);

    this.setData({
      temperature: urgentManagementData.temperatureData[0],
      small: parseInt(urgentManagementData.smallData[0]),
      medium: parseInt(urgentManagementData.mediumData[0]),
      large: parseInt(urgentManagementData.largeData[0])
    }),
    this.getStatus();
    this.getMember();
    this.getOpenId();
  },

  convert: function (datapoints) {
    var temperatureData = [];
    var smallData = [];
    var mediumData = [];
    var largeData = [];

    var length = datapoints.temperature.length
    for (var i = 0; i < length; i++) {
      temperatureData.push(datapoints.temperature[i].value);
      smallData.push(datapoints.small[i].value);
      mediumData.push(datapoints.medium[i].value);
      largeData.push(datapoints.large[i].value);
    }
    return {
      temperatureData: temperatureData,
      smallData: smallData,
      mediumData: mediumData,
      largeData: largeData
    }
  },

  getOpenId() {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.setData({
        openId: resp.result.openid
      });
    })
  },

  environment_data: function(){
    wx.redirectTo({
      url: '/pages/management_system/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.redirectTo({
      url: '/pages/management_system/urgent_management/urgent_management',
      })
  }

})