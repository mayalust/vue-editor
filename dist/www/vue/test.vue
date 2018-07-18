<template>
  <div class="test">{{a}}</div>
</template>
<script type="text/ecmascript">
  export default {
    name: "test",
    data : function(){
      return {
        a : 20
      }
    },
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
    }]
  }
</script>
<style scoped>
  .test {
    font-size : 60px;
  }
</style>