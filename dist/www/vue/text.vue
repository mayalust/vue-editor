<template>
  <div class="test" v-bind:class="theme">{{value}}</div>
</template>
<script type="text/ecmascript">
  export default {
    title : "VUE文字组件",
    properties : [{
      "type" : "input",
      "name" : 'value',
      "default" : "\"输入文字\""
    },{
      "type" : "select",
      "name" : 'theme',
      "default" : "normal",
      "options" : [
        ["normal", "普通"],
        ["big", "大标题"]
      ]
    }],
    computed : {
      value : function(){
        return this.getAttribute("value")
      },
      theme : function(){
        return this.getAttribute("theme")
      }
    }
  }
</script>
<style scoped>
  .big{
    color : #666;
    font-size : 30px;
    font-weight : bold;
    line-height : 90px;
  }
  .freeboard.dark .normal {
    color : #eee;
  }
  .freeboard.dark .big {
    color : #eee;
  }
  .freeboard.blue .big {
    color : #fff;
  }
  .freeboard.blue .normal {
    color : #fff;
  }
</style>