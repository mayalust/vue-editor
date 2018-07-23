<template>
  <div v-mapchart:option="option" v-height:height="height" class="char-twrap" v-bind:class="option.theme">
  </div>
</template>
<script type="text/ecmascript">
  var echartDir = require("./components/echart-directive.js"),
    events;
  export default {
    title : "VUE地图组件",
    properties : [{
      "title" : "标题",
      "type" : "input",
      "name" : 'title',
      "default" : "[scope:select]"
    },{
      "title" : "高度",
      "type" : "input",
      "name" : 'height',
      "default" : "300"
    }],
    directives : echartDir,
    computed : {
      height : function(){
        return this.getAttribute("height");
      }
    },
    data : function(){
      var cur = this,
        colors = {
          normal : ['#a4eefe', '#31bcdc'],
          dark : ['#555', '#777'],
          blue : ['#a4eefe', '#31bcdc']
        },
        itemColors = {
          normal : "#eb5715",
          dark : "#ddb926",
          blue : "#eb5715"
        },
        val = this.getAttribute("title"),
        geoCoordMap = {
          "北京": [116.46, 39.92],
          "天津": [118.78, 32.04],
          "河北": [126.57, 43.87],
          "山西": [121.48, 31.22],
          "内蒙古": [104.06, 30.67],
          "辽宁": [126.63, 45.75],
          "吉林": [123.38, 41.8],
          "黑龙江": [114.31, 30.52],
          "上海": [114.48, 38.03],
          "江苏": [117.2, 39.13],
          "浙江": [112.53, 37.87],
          "安徽": [108.95, 34.27],
          "福建": [108.33, 22.84],
          "江西": [115.89, 28.68],
          "山东": [117, 36.65],
        },
        data = [
          {name:"北京",value:177},
          {name:"天津",value:42},
          {name:"河北",value:102},
          {name:"山西",value:81},
          {name:"内蒙古",value:47},
          {name:"辽宁",value:67},
          {name:"吉林",value:82},
          {name:"黑龙江",value:66},
          {name:"上海",value:24},
          {name:"江苏",value:92},
          {name:"浙江",value:114},
          {name:"安徽",value:109},
          {name:"福建",value:116},
          {name:"江西",value:91},
          {name:"山东",value:119},
          {name:"河南",value:137},
          {name:"湖北",value:116},
          {name:"湖南",value:114},
          {name:"重庆",value:91},
          {name:"四川",value:125},
          {name:"贵州",value:62},
          {name:"云南",value:83},
          {name:"西藏",value:9},
          {name:"陕西",value:80},
          {name:"甘肃",value:56},
          {name:"青海",value:10},
          {name:"宁夏",value:18},
          {name:"新疆",value:67},
          {name:"广东",value:123},
          {name:"广西",value:59},
          {name:"海南",value:14},
        ];
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            data[i].value = parseInt(Math.random() * 200);
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      function render(theme, title){
        for(var i = 0; i < data.length; i++){
          data[i].value = parseInt(Math.random() * 200);
        }
        return {
          theme : theme,
          title : {
            text : "全国产业园区分布",
            subtext : title,
            left : "center"
          },
          visualMap: {
            show: true,
            min: 0,
            max: 200,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [0],
            inRange: {
              color: colors[theme] // 浅蓝
            }
          },
          geo: {
            map: 'china',
            label: {
              emphasis: {
                show: false
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: 'rgba(48,56,69,0.8)',//地图默认的背景颜色
                borderColor: '#a6c84c'//地图默认的边线颜色
              },
              emphasis: {
                areaColor: '#a6c84c'//地图触发地区的背景颜色
              }
            }
          },
          series: [
            {
              name: val,
              type: 'map',
              mapType: 'china',
              data : data
            },
            {
              name: '产量',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              symbolSize: function (val) {
                return val[2] / 10;
              },
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  opacity : 1,
                  borderColor : "#fff",
                  borderWidth : 1,
                  shadowBlur: 10,
                  shadowColor: '#fff',
                  color: itemColors[theme]
                }
              }
            }
          ]
        }
      }
      cur.listen("change:theme", function(theme){
        cur.option = render(theme, cur.getAttribute("title"));
      })
      cur.listen("change:Global:select", function(title){
        cur.option = render(cur.getTheme(), title);
      })
      return {
        option: render(cur.getTheme()),
        rootComponent : this.getRootComponent()
      }
    }
  }
</script>
<style scoped>
  .char-twrap{
    border-radius : 10px;
    background-color : #eee;
    margin : 0 10px;
    border-top : 3px solid #ddd;
  }
  .freeboard.dark .char-twrap{
    border-top : 3px solid #666;
    background-color : rgba(250, 250, 250, .1);
  }
  .freeboard.blue .char-twrap{
    border-top : 3px solid #33b7fc;
    background-color : rgba(250, 250, 250, .7);
  }
</style>