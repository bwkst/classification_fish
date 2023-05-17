var myCharts = require("../../../utils/wxcharts.js") //引入一个绘图的插件
const devicesId1 = "899161544" // devicesId
const api_key1 = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 
const devicesId2 = "996195513" // devicesId
const api_key2 = "W8PWDxCoGQWaVF46zn4gQYS820Y=" // Api-key 
const devicesId3 = "996218346" // devicesId
const api_key3 = "UUTNLzsdIw7e=RZI8rZyAyV9WFQ=" // Api-key 


Page({
  data: {
    // selectStatus: "normal",
    // videoStatus: "",
    // normalURL: "",
    // smallURL: "",
    // mediumURL: "",
    // largeURL: ""
    waterTemperature1: "无数据",
    Light1: "无数据",
    TDS1: "无数据",
    waterTemperature2: "无数据",
    Light2: "无数据",
    TDS2: "无数据",
    waterTemperature3: "无数据",
    Light3: "无数据",
    TDS3: "无数据",
    statusButton: "",
    poolNo: "一号鱼池"
  },

  oneButton: function () {
    this.setData({
      poolNo: "一号鱼池"
    })
  },

  twoButton: function () {
    this.setData({
      poolNo: "二号鱼池"
    })
  },

  threeButton: function () {
    this.setData({
      poolNo: "三号鱼池"
    })
  },

  waterTemperatureButton: function () {
    this.setData({
      statusButton: "水温"
    })
    wx.showLoading({
      title: '加载中'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  lightButton: function () {
    this.setData({
      statusButton: "光照"
    })
    wx.showLoading({
      title: '加载中'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    if (this.data.poolNo == "一号鱼池") {
      this.getDatapoints(devicesId1, api_key1).then(datapoints => {
        this.update(datapoints)
        wx.hideLoading()
      }).catch((error) => {
        wx.hideLoading()
        console.error(error)
      })
    } else if (this.data.poolNo == "二号鱼池") {
      this.getDatapoints(devicesId2, api_key2).then(datapoints => {
        this.update(datapoints)
        wx.hideLoading()
      }).catch((error) => {
        wx.hideLoading()
        console.error(error)
      })
    } else if (this.data.poolNo == "三号鱼池") {
      this.getDatapoints(devicesId3, api_key3).then(datapoints => {
        this.update(datapoints)
        wx.hideLoading()
      }).catch((error) => {
        wx.hideLoading()
        console.error(error)
      })
    }
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onLoad: function () {
      //每隔6s自动获取一次数据进行更新
      const timer = setInterval(() => {
        if (this.data.poolNo == "一号鱼池") {
        this.getDatapoints(devicesId1, api_key1).then(datapoints => {
          this.update(datapoints)
        })} else if (this.data.poolNo == "二号鱼池"){
          this.getDatapoints(devicesId2, api_key2).then(datapoints => {
            this.update(datapoints)
          })
        } else if (this.data.poolNo == "三号鱼池"){
          this.getDatapoints(devicesId3, api_key3).then(datapoints => {
            this.update(datapoints)
          })
        }
      }, 2000)
      wx.showLoading({
        title: '加载中'
      })

      this.getDatapoints(devicesId1, api_key1).then((datapoints) => {
        wx.hideLoading()
        this.firstDraw(datapoints)
      }).catch((err) => {
        wx.hideLoading()
        console.error(err)
        clearInterval(timer) //首次渲染发生错误时禁止自动刷新
      })
  },

  getDatapoints: function (devicesId, api_key) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Watertemperature,Light,TDS&limit=20`,
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
            reject(res.data)
            return;
          }
          if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
            reject(response.error)
            return;
          }

          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }

          //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
          resolve({
            waterTemperature: response.data.datastreams[0].datapoints.reverse(),
            Light: response.data.datastreams[2].datapoints.reverse(),
            TDS: response.data.datastreams[1].datapoints.reverse(),
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  update: function (datapoints) {
    console.log(datapoints)
    const environmentData = this.convert(datapoints);

    this.setData({
      waterTemperature1: environmentData.waterTemperature1[environmentData.length - 1],
      Light1: environmentData.Light1[environmentData.length - 1],
      TDS1: environmentData.TDS1[environmentData.length - 1],
      waterTemperature2: environmentData.waterTemperature2[environmentData.length - 1],
      Light2: environmentData.Light2[environmentData.length - 1],
      TDS2: environmentData.TDS2[environmentData.length - 1],
      waterTemperature3: environmentData.waterTemperature3[environmentData.length - 1],
      Light3: environmentData.Light3[environmentData.length - 1],
      TDS3: environmentData.TDS3[environmentData.length - 1]
    })

    console.log(this.data.statusButton)

    if (this.data.poolNo == "一号鱼池") {
      if (this.data.statusButton == "水温") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '一号鱼池 - Water Temperature',
            data: environmentData.waterTemperature1,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Water Temperature (摄氏度)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      } else if (this.data.statusButton == "光照") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '一号鱼池 - Illumination',
            data: environmentData.Light1,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Illumination (lux)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      }
    } else if (this.data.poolNo == "二号鱼池") {
      if (this.data.statusButton == "水温") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '二号鱼池 - Water Temperature',
            data: environmentData.waterTemperature2,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Water Temperature (摄氏度)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      } else if (this.data.statusButton == "光照") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '二号鱼池 - Illumination',
            data: environmentData.Light2,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Illumination (lux)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      }
    } else if (this.data.poolNo == "三号鱼池") {
      if (this.data.statusButton == "水温") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '三号鱼池 - Water Temperature',
            data: environmentData.waterTemperature3,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Water Temperature (摄氏度)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      } else if (this.data.statusButton == "光照") {
        this.lineChart.updateData({
          categories: environmentData.categories,
          series: [{
            name: '三号鱼池 - Illumination',
            data: environmentData.Light3,
            format: (val, name) => val.toFixed(2)
          }],
          yAxis: {
            title: 'Illumination (lux)',
            format: function (val) {
              return val.toFixed(2);
            }
          },
        })
      }
    }
  },

  convert: function (datapoints) {
    var categories = [];
    var Light1 = [];
    var waterTemperature1 = [];
    var TDS1 = [];
    var Light2 = [];
    var waterTemperature2 = [];
    var TDS2 = [];
    var Light3 = [];
    var waterTemperature3 = [];
    var TDS3 = [];

    console.log(datapoints)
    var length = datapoints.waterTemperature.length
    console.log(length)
    for (var i = 0; i < length; i++) {
      categories.push(datapoints.Light[i].at.slice(5, 19));
      if (this.data.poolNo == "一号鱼池") {
        Light1.push(datapoints.Light[i].value);
        waterTemperature1.push(datapoints.waterTemperature[i].value);
        TDS1.push(datapoints.TDS[i].value)
      } else if (this.data.poolNo == "二号鱼池") {
        Light2.push(datapoints.Light[i].value);
        waterTemperature2.push(datapoints.waterTemperature[i].value);
        TDS2.push(datapoints.TDS[i].value)
      } else if (this.data.poolNo == "三号鱼池") {
        Light3.push(datapoints.Light[i].value);
        waterTemperature3.push(datapoints.waterTemperature[i].value);
        TDS3.push(datapoints.TDS[i].value)
      }
    }

    return {
      length: length,
      categories: categories,
      Light1: Light1,
      waterTemperature1: waterTemperature1,
      TDS1: TDS1,
      Light2: Light2,
      waterTemperature2: waterTemperature2,
      TDS2: TDS2,
      Light3: Light3,
      waterTemperature3: waterTemperature3,
      TDS3: TDS3
    }
  },

  firstDraw: function (datapoints) {
    console.log(datapoints)
    //得到屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var environmentData = this.convert(datapoints);

    console.log(environmentData)
    //新建图表
    this.lineChart = new myCharts({
      canvasId: 'lineChart',
      type: 'line',
      categories: environmentData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: '一号鱼池 - Water Temperature',
        data: environmentData.waterTemperature1,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'Water Temperature (摄氏度)',
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

  // onLoad: function () {
  //   // wx.cloud.database().collection('status')
  //   //   .get()
  //   //   .then(res => {
  //   //     console.log(res);
  //   //     this.setData({
  //   //       videoStatus: res.data[0].videoS,
  //   //       normalURL: res.data[0].normalURL,
  //   //       smallURL: res.data[0].smallURL,
  //   //       mediumURL: res.data[0].mediumURL,
  //   //       largeURL: res.data[0].largeURL
  //   //     })
  //   //   })
  // },

  environment_data: function () {
    wx.redirectTo({
      url: '/pages/management_system/environment_data/environment_data',
    })
  },

  classification_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/classification_management/classification_management',
    })
  },

  systematic_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/systematic_management/systematic_management',
    })
  },

  urgent_management: function () {
    wx.redirectTo({
      url: '/pages/management_system/urgent_management/urgent_management',
    })
  }
})

// wholeButton: function () {
//   this.setData({
//     selectStatus: "normal"
//   })
// },

// smallButton: function () {
//   this.setData({
//     selectStatus: "small"
//   })
// },

// mediumButton: function () {
//   this.setData({
//     selectStatus: "medium"
//   })
// },

// largeButton: function () {
//   this.setData({
//     selectStatus: "large"
//   })
// }