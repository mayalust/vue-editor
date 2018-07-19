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
        ["big", "加大"],
        ["red", "红色"],
        ["gray", "灰背景"],
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

</style>