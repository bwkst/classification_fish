var myCharts = require("../../utils/wxcharts.js")//引入一个绘图的插件
const devicesId = "899161544" // devicesId
const api_key = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 

Page({
  data: {
    temperature: "暂无数据",
    humidity: "暂无数据",
    statusButton: "暂无数据"
  },

  temperatureButton: function(){
    this.setData({
      statusButton: "温度"
    })
  },

  humidityButton: function(){
    this.setData({
      statusButton: "湿度"
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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
      this.firstDraw(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    })
  },

  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Temperature,Humidity&limit=20`,

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
            temperature: response.data.datastreams[0].datapoints.reverse(),
            humidity: response.data.datastreams[1].datapoints.reverse()
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
      temperature: environmentData.temperature[environmentData.length - 1],
      humidity: environmentData.humidity[environmentData.length - 1],
    })

    this.lineChart_humidity.updateData({
      categories: environmentData.categories,
      series: [{
        name: 'humidity',
        data: environmentData.humidity,
        format: (val, name) => val.toFixed(2)
      }],
    })

    this.lineChart_temperature.updateData({
      categories: environmentData.categories,
      series: [{
        name: 'temperature',
        data: environmentData.temperature,
        format: (val, name) => val.toFixed(2)
      }],
    })

  },


  convert: function (datapoints) {
    var categories = [];
    var humidity = [];
    var temperature = [];

    var length = datapoints.temperature.length
    for (var i = 0; i < length; i++) {
      categories.push(datapoints.humidity[i].at.slice(5, 19));
      humidity.push(datapoints.humidity[i].value);
      temperature.push(datapoints.temperature[i].value);
    }

    return {
      length: length,
      categories: categories,
      humidity: humidity,
      temperature: temperature,      
    }
  },

  firstDraw: function (datapoints) {

    //得到屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var environmentData = this.convert(datapoints);

    //新建湿度图表
    this.lineChart_humidity = new myCharts({
      canvasId: 'humidity',
      type: 'line',
      categories: environmentData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: 'humidity',
        data: environmentData.humidity,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'humidity (%)',
        format: function (val) {
          return val.toFixed(2);
        }
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

    //新建温度图表
    this.lineChart_temperature = new myCharts({
      canvasId: 'temperature',
      type: 'line',
      categories: environmentData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: 'temperature',
        data: environmentData.temperature,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'temperature (摄氏度)',
        format: function (val) {
          return val.toFixed(2);
        }
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  environment_data: function(){
    wx.redirectTo({
      url: '/pages/environment_data/environment_data',
      })
  },

  classification_management: function(){
    wx.redirectTo({
      url: '/pages/classification_management/classification_management',
    })
  },

  systematic_management: function(){
    wx.redirectTo({
      url: '/pages/systematic_management/systematic_management',
      })
  },

  urgent_management: function(){
    wx.redirectTo({
      url: '/pages/urgent_management/urgent_management',
      })
  }

})
