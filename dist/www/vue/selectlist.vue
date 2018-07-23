<template>
  <div class="list-all">
    <div class="list-item"
         v-bind:class="item.active"
         v-for="item in items"
         v-on:click="itemclick(item)">
      {{item.label}}
    </div>
  </div>
</template>
<script type="text/ecmascript">
  var cached;
  export default {
    title : "VUE下拉列表",
    properties : [{
      "type" : "input",
      "name" : 'output',
      "default" : "[scope:select]"
    }],
    created : function(){
      this.setAttribute("output", this.items[0].label);
    },
    methods : {
      itemclick : function(item){
        item.active = "active";
        this.setAttribute("output", item.label);
        this.items = this.items.map(function(n){
          n.active = n === item ? "active" : "";
          return n;
        })
      }
    },
    data : function(){
      var list = [{
        label : "汽车产业",
        active : "active"
      },{
        label : "电子信息"
      },{
        label : "光伏机电"
      },{
        label : "生物医药"
      },{
        label : "能源材料"
      },{
        label : "装备制造"
      },{
        label : "环保生态"
      },{
        label : "石油化工"
      },{
        label : "航空航天"
      },{
        label : "轨道交通"
      }];
      cached = list[0];
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
  .list-all {
    margin : 0 10px;
    border-radius : 10px;
    box-shadow : 1px 1px 10px 1px rgba(0,0,0,.3);
    overflow : hidden;
  }
  .list-item {
    cursor : pointer;
    transition: background-color 1s;
    -moz-transition: background-color 1s; /* Firefox 4 */
    -webkit-transition: background-color 1s; /* Safari 和 Chrome */
    -o-transition: background-color 1s; /* Opera */
    background-color : #eee;
    line-height : 50px;
    color : #666;
    border-bottom : 1px solid rgba(0,0,0,.2);
  }
  .list-item.active{
    background-color : #ccc;
  }
  .list-item:hover{
    background-color : #ccc;
  }
  .freeboard.blue .list-item {
    color : #fff;
    background-color : #58afd4;
  }
  .freeboard.blue .list-item:hover{
    background-color : #194c73;
  }
  .freeboard.blue .list-item.active{
    background-color : #194c73;
  }
  .freeboard.dark .list-item {
    color : #eee;
    background-color : #555;
  }
  .freeboard.dark .list-item:hover{
    color : yellow;
    background-color : #222;
  }
  .freeboard.dark .list-item.active{
    color : yellow;
    background-color : #222;
  }
</style>