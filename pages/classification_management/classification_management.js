import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['小鱼', '中鱼', '大鱼',],
        axisTick: { alignWithLabel: true},
        axisLabel:{ fontSize:20 },
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {show: false },
        axisLabel:{ show: false }, //显示x轴的数值
        axisLine: {show:false},//轴线不显示
        axisTick: {show:false},//
      }
    ],
    series: [
      {
        color:'#2f4554',
        name: 'Direct',
        type: 'bar',
        barWidth: '80%',
        data: [39,60,28],
        itemStyle: {
          normal: {
              label: {
                  show: true,		//开启显示
                  position: 'top',	//在上方显示
                  textStyle: {	    //数值样式
                      color: 'black',
                      fontSize: 18
                  }
              }
          }
      }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    weight:'',
    ec: {
      onInit: initChart
    }
  },

  onShow: function(){
    this.setData({
      weight:'45'+"公斤",

    })
  },

  showStandard: function(){
    wx.navigateTo({
      url: '/pages/weight_standard/index',
    })
  },

});