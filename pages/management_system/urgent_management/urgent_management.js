const devicesId1 = "899161544" // devicesId
const api_key1 = "E=0WdCeJBKGsORZhFxGGW0iaY2Q=" // Api-key 
const devicesId2 = "996195513" // devicesId
const api_key2 = "W8PWDxCoGQWaVF46zn4gQYS820Y=" // Api-key 
const devicesId3 = "996218346" // devicesId
const api_key3 = "UUTNLzsdIw7e=RZI8rZyAyV9WFQ=" // Api-key 

Page({

  data: {
    warnTemp: "32",
    oneTemp: "暂无数据",
    twoTemp: "暂无数据",
    threeTemp: "暂无数据",
    oneTwoDif: "暂无数据",
    oneThreeDif: "暂无数据",
    twoThreeDif: "暂无数据",
    statusNow: "暂无数据",
    member: "暂无数据",
    poolNo: "一号鱼池"
  },

  getMember: function () {
    var week = new Date().getDay();
    switch (week) {
      case 0:
        this.setData({
          member: "符雪媛"
        })
        break;
      case 1:
        this.setData({
          member: "柯家宝"
        })
        break;
      case 2:
        this.setData({
          member: "符雪媛"
        })
        break;
      case 3:
        this.setData({
          member: "柯家宝"
        })
        break;
      case 4:
        this.setData({
          member: "符雪媛"
        })
        break;
      case 5:
        this.setData({
          member: "柯家宝"
        })
        break;
      case 6:
        this.setData({
          member: "赵太宁"
        })
        break;
    }
  },

  /*打电话通知管理员*/
  phoneCall: function () {
    var week = new Date().getDay();
    var phoneNumber;
    switch (week) {
      case 0:
        phoneNumber = "15203013593";
        break;
      case 1:
        phoneNumber = "13141011254";
        break;
      case 2:
        phoneNumber = "15203013593";
        break;
      case 3:
        phoneNumber = "13141011254";
        break;
      case 4:
        phoneNumber = "15203013593";
        break;
      case 5:
        phoneNumber = "13141011254";
        break;
      case 6:
        phoneNumber = "17797028663";
        break;
    }
    if (week >= 0) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
      });
    }
  },

  calculate: function () {
    var oneTwoDif;
    if (this.data.oneTemp >= this.data.twoTemp) {
      oneTwoDif = this.data.oneTemp - this.data.twoTemp;
      this.setData({
        oneTwoDif: oneTwoDif
      })
    } else if (this.data.oneTemp < this.data.twoTemp) {
      oneTwoDif = this.data.twoTemp - this.data.oneTemp;
      this.setData({
        oneTwoDif: oneTwoDif
      })
    }
    var oneThreeDif;
    if (this.data.oneTemp >= this.data.threeTemp) {
      oneThreeDif = this.data.oneTemp - this.data.threeTemp;
      this.setData({
        oneThreeDif: oneThreeDif
      })
    } else if (this.data.oneTemp < this.data.threeTemp) {
      oneThreeDif = this.data.threeTemp - this.data.oneTemp;
      this.setData({
        oneThreeDif: oneThreeDif
      })
    }
    var twoThreeDif;
    if (this.data.twoTemp >= this.data.threeTemp) {
      twoThreeDif = this.data.twoTemp - this.data.threeTemp;
      this.setData({
        twoThreeDif: twoThreeDif
      })
    } else if (this.data.twoTemp < this.data.threeTemp) {
      twoThreeDif = this.data.threeTemp - this.data.twoTemp;
      this.setData({
        twoThreeDif: twoThreeDif
      })
    }
  },

  /*获取当前温度和容量并进行判定(只完成了判定的部分)*/
  getStatus: function () {
    this.calculate();
    if (this.data.oneTemp >= this.data.warnTemp && this.data.oneTemp != null && this.data.oneTemp != "暂无数据") {
      console.log(this.data.oneTemp)
      this.setData({
        statusNow: "一号鱼池水温过高"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '一号鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else if (this.data.twoTemp >= this.data.warnTemp && this.data.twoTemp != null && this.data.twoTemp != "暂无数据") {
      console.log(this.data.twoTemp)
      this.setData({
        statusNow: "二号鱼池水温过高"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '二号鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else if (this.data.threeTemp >= this.data.warnTemp && this.data.threeTemp != null && this.data.threeTemp != "暂无数据") {
      console.log(this.data.threeTemp)
      this.setData({
        statusNow: "三号鱼池水温过高"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '三号鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else if (this.data.oneTwoDif >= 5 && this.data.oneTwoDif != null && this.data.oneTemp != null && this.data.twoTemp != null) {
      console.log(this.data.oneTwoDif)
      this.setData({
        statusNow: "一、二号鱼池温差过大"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '一、二鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else if (this.data.oneThreeDif >= 5 && this.data.oneThreeDif != null && this.data.oneTemp != null && this.data.threeTemp != null) {
      console.log(this.data.oneThreeDif)
      this.setData({
        statusNow: "一、三号鱼池温差过大"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '一、三鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else if (this.data.twoThreeDif >= 5 && this.data.twoThreeDif != null && this.data.twoTemp != null && this.data.threeTemp != null) {
      console.log(this.data.twoThreeDif)
      this.setData({
        statusNow: "二、三号鱼池温差过大"
      })
      wx.vibrateLong();
      wx.showToast({
        title: '二、三鱼池异常',
        icon: "error",
        duration: 2500 //持续的时间
      })
    } else {
      if (this.data.oneTemp != null && this.data.twoTemp != null && this.data.threeTemp != null) {
        this.setData({
          statusNow: "所有鱼池状态正常"
        })
      }
    }
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    if (this.data.poolNo == "一号鱼池") {
      this.getDatapoints(devicesId1, api_key1).then(datapoints => {
        this.update(datapoints)
        this.setData({
          poolNo: "二号鱼池"
        })
        wx.hideLoading()
      }).catch((error) => {
        wx.hideLoading()
        console.error(error)
      })
    } else if (this.data.poolNo == "二号鱼池") {
      this.getDatapoints(devicesId2, api_key2).then(datapoints => {
        this.update(datapoints)
        this.setData({
          poolNo: "三号鱼池"
        })
        wx.hideLoading()
      }).catch((error) => {
        wx.hideLoading()
        console.error(error)
      })
    } else if (this.data.poolNo == "三号鱼池") {
      this.getDatapoints(devicesId3, api_key3).then(datapoints => {
        this.update(datapoints)
        this.setData({
          poolNo: "一号鱼池"
        })
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
          this.setData({
            poolNo: "二号鱼池"
          })
        })
      } else if (this.data.poolNo == "二号鱼池") {
        this.getDatapoints(devicesId2, api_key2).then(datapoints => {
          this.update(datapoints)
          this.setData({
            poolNo: "三号鱼池"
          })
        })
      } else if (this.data.poolNo == "三号鱼池") {
        this.getDatapoints(devicesId3, api_key3).then(datapoints => {
          this.update(datapoints)
          this.setData({
            poolNo: "一号鱼池"
          })
        })
      }
    }, 500)
    wx.showLoading({
      title: '加载中'
    })

    this.getDatapoints(devicesId1, api_key1).then((datapoints) => {
        wx.hideLoading()
        this.update(datapoints)
      }).catch((err) => {
        wx.hideLoading()
        console.error(err)
        clearInterval(timer) //首次渲染发生错误时禁止自动刷新
      }),

      this.getMember();
  },

  getDatapoints: function (devicesId, api_key) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Watertemperature&limit=20`,
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

    if (this.data.poolNo == "一号鱼池") {
      this.setData({
        oneTemp: urgentManagementData.oneTemp[0]
      })
    } else if (this.data.poolNo == "二号鱼池") {
      this.setData({
        twoTemp: urgentManagementData.twoTemp[0],
      })
    } else if (this.data.poolNo == "三号鱼池") {
      this.setData({
        threeTemp: urgentManagementData.threeTemp[0],
      })
    }

    this.getStatus();
    this.getMember();
  },

  convert: function (datapoints) {
    var oneTemp = [];
    var twoTemp = [];
    var threeTemp = [];

    var length = datapoints.temperature.length
    for (var i = 0; i < length; i++) {
      if (this.data.poolNo == "一号鱼池") {
        oneTemp.push(datapoints.temperature[i].value);
      } else if (this.data.poolNo == "二号鱼池") {
        twoTemp.push(datapoints.temperature[i].value);
      } else if (this.data.poolNo == "三号鱼池") {
        threeTemp.push(datapoints.temperature[i].value);
      }
    }
    return {
      oneTemp: oneTemp,
      twoTemp: twoTemp,
      threeTemp: threeTemp
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