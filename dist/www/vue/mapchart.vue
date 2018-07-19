<template>
  <div v-mapchart:option="option" v-height:height="height"></div>
</template>
<script type="text/ecmascript">
  var echartDir = require("./components/echart-directive.js");
  export default {
    title : "VUE地图组件",
    properties : [{
      "title" : "标题",
      "type" : "input",
      "name" : 'title',
      "default" : "\"地图组件\""
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
        var title = this.getAttribute("title");
        var option = {
          title : {
            text : title,
            left : "center"
          },
          series: [
            {
              name: title,
              type: 'map',
              mapType: 'china',
              data:[]
            }
          ]
        }
        return option;
      }
    }
  }
</script>
<style scoped>

</style>