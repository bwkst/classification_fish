var myCharts = require("../../../utils/wxcharts.js") //引入一个绘图的插件
const devicesId = "899161544" // devicesId
const api_key = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 

Page({
  data: {
    temperature: "无数据",
    humidity: "无数据",
    statusButton: "",
    expertise_content: "请输入鱼的种类",
    breed_content: "请输入品种名称"
  },

  breed: function (res) {
    console.log(res.detail.value);
    this.setData({
        breed_content: res.detail.value
      }),
      this.getSuggestion();
  },

  temperatureButton: function () {
    this.setData({
      statusButton: "温度"
    })
    wx.showLoading({
      title: '加载中'
    })
    setTimeout(function(){
      wx.hideLoading()
    }, 2000)
  },

  humidityButton: function () {
    this.setData({
      statusButton: "湿度"
    })
    wx.showLoading({
      title: '加载中'
    })
    setTimeout(function(){
      wx.hideLoading()
    }, 2000)
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
    }, 2000)
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

    console.log(this.data.statusButton)
    if (this.data.statusButton == "湿度") {
      this.lineChart.updateData({
        categories: environmentData.categories,
        series: [{
          name: 'humidity',
          data: environmentData.humidity,
          format: (val, name) => val.toFixed(2)
        }],
        yAxis: {
          title: 'humidity (%)',
          format: function (val) {
            return val.toFixed(2);
          }
        },
      })
    } else if (this.data.statusButton == "温度") {
      this.lineChart.updateData({
        categories: environmentData.categories,
        series: [{
          name: 'temperature',
          data: environmentData.temperature,
          format: (val, name) => val.toFixed(2)
        }],
        yAxis: {
          title: 'temperature (摄氏度)',
          format: function (val) {
            return val.toFixed(2);
          }
        },
      })
    }
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

    //新建图表
    this.lineChart = new myCharts({
      canvasId: 'lineChart',
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

  getSuggestion: function () {
    var S_temp = this.data.temperature;
    //var S_hum = this.data.humidity;
    var S_breed = this.data.breed_content;
    switch (S_breed) {
      case "东星斑":
        if (S_temp >= 25 && S_temp <= 30) {
          this.setData({
            expertise_content: "目前环境适合养殖东星斑；由于东星斑并非淡水鱼，因此建议将东星斑与石斑鱼进行混养。"
          })
          break;
        } else if (S_temp >= 21 && S_temp < 25) {
          this.setData({
            expertise_content: "目前环境会让东星斑生长缓慢，且易生病，建议将温度调至25°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对东星斑造成较大的死亡风险，请尽快将温度调至25°。"
          })
          break;
        };
      case "石斑鱼":
        if (S_temp >= 25 && S_temp <= 30) {
          this.setData({
            expertise_content: "目前环境适合养殖石斑鱼；由于石斑鱼为淡水鱼，因此需要在冬季时期多加注意，防止冻伤。"
          })
          break;
        } else if (S_temp >= 21 && S_temp < 25 || S_temp > 30 && S_temp <= 32) {
          this.setData({
            expertise_content: "目前环境会让石斑鱼生长缓慢，且易生病，建议将温度调至25°-30°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对东星斑造成较大的死亡风险，请尽快将温度调至25°-30°。"
          })
          break;
        };
      case "罗非鱼":
        if (S_temp >= 28 && S_temp <= 32) {
          this.setData({
            expertise_content: "目前环境适合养殖罗非鱼。"
          })
          break;
        } else if (S_temp >= 16 && S_temp < 28 || S_temp > 32 && S_temp <= 35) {
          this.setData({
            expertise_content: "目前环境会让罗非鱼生长缓慢，且易生病，建议将温度调至28°-32°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对罗非鱼造成较大的死亡风险，请尽快将温度调至28°-32°。"
          })
          break;
        };
      case "金鲳鱼":
        if (S_temp >= 22 && S_temp <= 28) {
          this.setData({
            expertise_content: "目前环境适合养殖金鲳鱼；请保持水质清爽，环境稳定。"
          })
          break;
        } else if (S_temp >= 17 && S_temp < 22 || S_temp > 28 && S_temp <= 30) {
          this.setData({
            expertise_content: "目前环境会让金鲳鱼生长缓慢，且易生病，建议将温度调至22°-28°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对金鲳鱼造成较大的死亡风险，请尽快将温度调至22°-28°。"
          })
          break;
        };
      case "鲫鱼":
        if (S_temp >= 15 && S_temp <= 25) {
          this.setData({
            expertise_content: "目前环境适合养殖鲫鱼；由于鲫鱼为冷水鱼，因此在高温季节，需要一周加注一次新水。"
          })
          break;
        } else if (S_temp >= 13 && S_temp < 15 || S_temp > 25 && S_temp <= 39) {
          this.setData({
            expertise_content: "目前环境会让鲫鱼生长缓慢，且易生病，建议将温度调至15°-25°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对鲫鱼造成较大的死亡风险，请尽快将温度调至15°-25°。"
          })
          break;
        };
      case "鲢鱼":
        if (S_temp >= 25 && S_temp <= 30) {
          this.setData({
            expertise_content: "目前环境适合养殖鲢鱼；由于鲢鱼喜热不喜冷，因此需要注意水体内有足够的氧气。"
          })
          break;
        } else if (S_temp >= 16 && S_temp < 25 || S_temp > 30 && S_temp <= 32) {
          this.setData({
            expertise_content: "目前环境会让鲢鱼生长缓慢，且易生病，建议将温度调至25°-30°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对鲢鱼造成较大的死亡风险，请尽快将温度调至25°-30°。"
          })
          break;
        };
      case "鲈鱼":
        if (S_temp >= 23 && S_temp <= 28) {
          this.setData({
            expertise_content: "目前环境适合养殖鲈鱼；由于鲈鱼易受惊吓，因此请保持水质清洁。"
          })
          break;
        } else if (S_temp >= 8 && S_temp < 23 || S_temp > 28 && S_temp <= 30) {
          this.setData({
            expertise_content: "目前环境会让鲈鱼难以觅食，生长缓慢，建议将温度调至23°-28°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对鲈鱼造成较大的死亡风险，请尽快将温度调至23°-28°。"
          })
          break;
        };
      case "鳜鱼":
        if (S_temp >= 15 && S_temp <= 32) {
          this.setData({
            expertise_content: "目前环境适合养殖鳜鱼；鳜鱼需要活水，水质要求会较高。"
          })
          break;
        } else if (S_temp >= 11 && S_temp < 15 || S_temp > 32 && S_temp <= 35) {
          this.setData({
            expertise_content: "目前环境会让鳜鱼难以觅食，生长缓慢，建议将温度调至15°-32°。"
          })
          break;
        } else {
          this.setData({
            expertise_content: "目前环境会对鳜鱼造成较大的死亡风险，请尽快将温度调至15°-32°。"
          })
          break;
        };
      case "":
        this.setData({
          expertise_content: "请输入鱼的种类"
        })
        break;
      default:
        this.setData({
          expertise_content: "暂无此品种的建议，请移步交流广场咨询"
        })
    }
  },

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