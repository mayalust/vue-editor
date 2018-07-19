<template>
  <div>
    <div class="list-item"
         v-for="item in items"
         v-on:click="itemclick(item)">
      {{item.label}}
    </div>
  </div>
</template>
<script type="text/ecmascript">
  export default {
    title : "VUE下拉列表",
    properties : [{
      "type" : "input",
      "name" : 'output',
      "default" : "select"
    }],
    methods : {
      itemclick : function(item){
        console.log(item.label);
      }
    },
    data : function(){
      var list = [{
        label : "第1机械厂"
      },{
        label : "第2机械厂"
      },{
        label : "第4机械厂"
      },{
        label : "第5机械厂"
      },{
        label : "第6机械厂"
      }]
      return {
        items : list
      }
    },
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
  .list-item {
    background-color : blue;
    line-height : 50px;
    color : #fff;
    border-bottom : 1px solid #fff;
  }
</style>