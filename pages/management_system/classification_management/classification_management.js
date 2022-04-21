const devicesId = "899161544" // devicesId
const api_key = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 
Page({

  data: {
    fish_classify:"暂无数据",
    weight: "暂无数据",
    maxSmall: 0.75,
    maxMedium: 1.35,
    small: 0,
    medium: 0,
    large: 0
  },

  weight_standard: function(){
    wx.navigateTo({
      url: '/pages/management_system/weight_standard/weight_standard',
    })
  },

  getSize: function(){
    if (this.data.weight <= this.data.maxSmall){
      this.setData({
        fish_classify:"小鱼"
      })
    } else if (this.data.weight >= this.data.maxMedium){
      this.setData({
        fish_classify:"大鱼"
      })
    } else if (this.data.weight >= this.data.maxSmall && this.data.weight <= this.data.maxMedium){
      this.setData({
        fish_classify:"中鱼"
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
  },

  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)
    //每隔1分钟自动获取一次数据进行更新：60000
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
    })
  },

  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Small,Medium,Large,Weight&limit=20`,
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
            weight: response.data.datastreams[3].datapoints,
            large: response.data.datastreams[2].datapoints,
            medium: response.data.datastreams[1].datapoints,
            small: response.data.datastreams[0].datapoints,
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  update: function (datapoints) {
    const environmentData = this.convert(datapoints);

    this.setData({
      weight: environmentData.weightData[0],
      small: parseInt(environmentData.smallData[0]),
      medium: parseInt(environmentData.mediumData[0]),
      large: parseInt(environmentData.largeData[0])
    }),

    this.getSize()
  },

  convert: function (datapoints) {
    var weightData = [];
    var smallData = [];
    var mediumData = [];
    var largeData = [];

    var length = datapoints.weight.length
    for (var i = 0; i < length; i++) {
      weightData.push(datapoints.weight[i].value);
      smallData.push(datapoints.small[i].value);
      mediumData.push(datapoints.medium[i].value);
      largeData.push(datapoints.large[i].value);
    }
    return {
      weightData: weightData,
      smallData: smallData,
      mediumData: mediumData,
      largeData: largeData
    }
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