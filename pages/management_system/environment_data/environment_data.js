var myCharts = require("../../../utils/wxcharts.js")//引入一个绘图的插件
const devicesId = "899161544" // devicesId
const api_key = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 

Page({
  data: {
    temperature: "无数据",
    humidity: "无数据",
    statusButton: "温度",
    expertise_content: "请移步交流广场咨询",
    breed_content: "请输入品种名称"
  },

  breed: function(res){
    console.log(res.detail.value);
    this.setData({
      breed_content: res.detail.value
    }),
    this.getSuggestion();
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
    wx.getSuggestion();
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
    }),

    this.getSuggestion();

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

  getSuggestion: function(){
    var S_temp = this.data.temperature;
    var S_hum = this.data.humidity;
    var S_breed = this.data.breed_content;
    switch (S_breed){
      case "鱼一":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼一正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼一建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼一警告"
          })
          break;
        };
      case "鱼二":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
          expertise_content: "鱼二正常"
        })
        break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼二建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼二警告"
          })
          break;
        };
      case "鱼三":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
        this.setData({
          expertise_content: "鱼三正常"
        })
        break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼三建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼三警告"
          })
          break;
        };
      case "鱼四":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼四正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼四建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼四警告"
          })
          break;
        };
      case "鱼五":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼五正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼五建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼五警告"
          })
          break;
        };
      case "鱼六":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼六正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼六建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼六警告"
          })
          break;
        };
      case "鱼七":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼七正常"
          })
            break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼七建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼七警告"
          })
          break;
        };
      case "鱼八":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼八正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼八建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼八警告"
          })
          break;
        };
      case "鱼九":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼九正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼九建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼九警告"
          })
          break;
        };
      case "鱼十":
        if (S_temp >= 25 && S_temp <= 30 && S_hum >= 65 && S_hum <= 80){
          this.setData({
            expertise_content: "鱼十正常"
          })
          break;
        }else if(S_temp >=20 && S_temp < 25 || S_temp > 30 && S_temp <= 35 || S_hum >= 50 && S_hum < 65 || S_hum > 80 && S_hum <= 95){
          this.setData({
            expertise_content: "鱼十建议"
          })
          break;
        }else{
          this.setData({
            expertise_content: "鱼十警告"
          })
          break;
        };
      default:
        this.setData({
          expertise_content: "请移步交流广场咨询"
        })          
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
