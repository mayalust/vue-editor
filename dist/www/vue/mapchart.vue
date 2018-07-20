<template>
  <div v-mapchart:option="option" v-height:height="height" class="char-twrap"></div>
</template>
<script type="text/ecmascript">
  var echartDir = require("./components/echart-directive.js");
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
      },
      option : function(){
        var cur = this,
          val = this.getAttribute("title"),
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
        for(var i = 0; i < data.length; i++){
          data[i].value = parseInt(Math.random() * 2000);
        }
        var option = {
          title : {
            text : val,
            left : "center"
          },
          visualMap: {
            show: true,
            min: 0,
            max: 2000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [0],
            inRange: {
              // color: ['#3B5077', '#031525'] // 蓝黑
              // color: ['#ffc0cb', '#800080'] // 红紫
              // color: ['#3C3B3F', '#605C3C'] // 黑绿
              // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
              // color: ['#23074d', '#cc5333'] // 紫红
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              color: ['#1488CC', '#2B32B2'] // 浅蓝
            }
          },
          series: [
            {
              name: val,
              type: 'map',
              mapType: 'china',
              data : data
            }
          ]
        }
        console.log(option);
        return option;
      }
    },
    data : function(){
      return {
        rootComponent : this.getRootComponent()
      }
    }
  }
</script>
<style scoped>
  .char-twrap{
    background-color : #eee;
  }
</style>