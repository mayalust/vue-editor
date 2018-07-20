(function(global, factory){
  if(typeof module !== "undefined" && typeof module.exports === "function"){
    /** CMD **/
    module.exports = factory();
  } else if(typeof define === "function"){
    /** AMD **/
    define(factory);
  } else if(global === window){
    /** Window **/
    global.Components = factory();
  }
})(this, function(){
  var components = {};
  var echartDir = {
    echart : {
      inserted : function(e, b, o, n){
        var option = b.value;
        function resize(){
          e.echart.resize();
        }
        e.resizeEvent = resize;
        setTimeout(function(){
          e.theme = option.theme;
          e.echart = echarts.init(e, option.theme);
          if(option){
            e.echart.setOption(option);
          } else {
            e.echart.showLoading();
          }

        });
        window.addEventListener("resize", resize);
      },
      update : function(e, b, o, n){
        var option = b.value;
        if(e.theme != option.theme){
          e.theme = option.theme;
          e.echart.dispose();
          e.echart = echarts.init(e, option.theme);
          if(option){
            e.echart.setOption(option);
            e.echart.hideLoading();
          } else {
            e.echart.showLoading();
          }
        } else {
          e.echart.setOption(option);
          e.echart.hideLoading();
        }
      },
      unbind : function(e){
        e.echart.dispose();
        window.removeEventListener("resize", e.resizeEvent)
      }
    },
    mapchart : {
      inserted : function(e, b, o, n){
        var option = b.value,
          vm = o.context,
          promise = new Promise(function(res, rej){
            vm.getJSON("china.json", null, function(d){
              echarts.registerMap("china", d);
              res("ready");
            })
          });
        function resize(){
          e.echart.resize();
        }
        e._promise = promise;
        e.resizeEvent = resize;
        setTimeout(function(){
          e.theme = option.theme;
          e.echart = echarts.init(e, option.theme);
          e.echart.showLoading();
          promise.then(function(){
            e.echart.hideLoading();
            e.echart.setOption(option);
          });
        });
        window.addEventListener("resize", resize);
      },
      update : function(e, b, o, n){
        var option = b.value;
        promise.then(function() {
          if (e.theme != option.theme) {
            e.theme = option.theme;
            e.echart.dispose();
            e.echart = echarts.init(e, option.theme);
            e.echart.setOption(option);
          } else {
            e.echart.setOption(option);
          }
        })
      },
      unbind : function(e){
        e.echart.dispose();
        window.removeEventListener("resize", e.resizeEvent)
      }
    },
    height : function(e, b, o, n){
      e.style.height = b.value + "px";
      e.echart && e.echart.resize();
    }
  }
  components.install = function(Veditor){
    /**
    Veditor.register("test", {
      name : "文字",
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
      component : {
        template : "<p v-bind:class = \"theme\">{{value}}</p>",
        computed : {
          value : function(){
            return this.getAttribute("value");
          },
          theme : function(){
            return "fb-" + this.getAttribute("theme");
          }
        }
      }
    });**/
    Veditor.register("linechart", {
      name : "折线图(类目)",
      properties : [{
        "title" : "标题",
        "type" : "input",
        "name" : 'title',
        "default" : "\"折线图\""
      },{
        "title" : "类目",
        "type" : "input",
        "name" : 'category',
        "default" : "[\"第一条\",\"第二条\",\"第三条\",\"第四条\",\"第五条\",\"第六条\"]"
      },{
        "type" : "input",
        "name" : 'value',
        "default" : "[[1,2],[3,4],[5,2],[3,1],[1,6],[2,7]]"
      },{
        "title" : "高度",
        "type" : "input",
        "name" : 'height',
        "default" : "300"
      },{
        "type" : "select",
        "name" : 'theme',
        "default" : "default",
        "options" : [
          ["default", "默认"],
          ["macarons", "蓝色"],
          ["dark", "黑色"],
          ["light", "亮色"]
        ]
      }],
      component : {
        template : "<div \
            v-echart:option=\"option\"\
            v-height:height=\"height\"></div>",
        directives : echartDir,
        computed : {
          height : function(){
            var height = this.getAttribute("height");
            return height;
          },
          option : function(){
            var cat = this.getAttribute("category");
            var title = this.getAttribute("title");
            var theme = this.getAttribute("theme");
            var series = this.getAttribute("value").reduce(function(a, b){
              b = typeof b === "number" ? [b] : b;
              for(var i = 0; i< b.length; i++){
                a[i] = a[i] || {
                  data: [],
                  type: 'line'
                };
                a[i].data.push(b[i])
              }
              return a;
            },[]);
            var option = {
              theme : theme,
              title : {
                text : title,
                left : "center"
              },
              xAxis: {
                type: 'category',
                data: cat
              },
              yAxis: {
                type: 'value'
              },
              series: series
            }
            return option;
          }
        }
      }
    });

    Veditor.register("linechart_t", {
      name : "折线图(取值)",
      properties : [{
        "title" : "标题",
        "type" : "input",
        "name" : 'title',
        "default" : "\"折线图\""
      },{
        "type" : "input",
        "name" : 'value',
        "default" : "[[1,2],[1.5,4],[2,2],[5,1],[7,6],[8,7]]"
      },{
        "title" : "高度",
        "type" : "input",
        "name" : 'height',
        "default" : "300"
      },{
        "type" : "select",
        "name" : 'theme',
        "default" : "default",
        "options" : [
          ["default", "默认"],
          ["macarons", "蓝色"],
          ["dark", "黑色"],
          ["light", "亮色"]
        ]
      }],
      component : {
        template : "<div v-echart:option=\"option\" v-height:height=\"height\"></div>",
        directives : echartDir,
        computed : {
          height : function(){
            var height = this.getAttribute("height");
            return height;
          },
          option : function(){
            var theme = this.getAttribute("theme");
            var cat = this.getAttribute("category");
            var title = this.getAttribute("title");
            var values = this.getAttribute("value");
            var option = {
              theme : theme,
              title : {
                text : title,
                left : "center"
              },
              xAxis: {
                type: 'value'
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                type : "line",
                data : values
              }]
            }
            return option;
          },
          theme : function(){
            return "fb-" + this.getAttribute("theme");
          }
        }
      }
    });

    Veditor.register("barchart", {
      name : "柱状图(普通)",
      properties : [{
        "title" : "标题",
        "type" : "input",
        "name" : 'title',
        "default" : "\"折线图\""
      },{
        "title" : "类目",
        "type" : "input",
        "name" : 'category',
        "default" : "[\"第一条\",\"第二条\",\"第三条\",\"第四条\",\"第五条\",\"第六条\"]"
      },{
        "type" : "input",
        "name" : 'value',
        "default" : "[[1,2],[3,4],[5,2],[3,1],[1,6],[2,7]]"
      },{
        "title" : "高度",
        "type" : "input",
        "name" : 'height',
        "default" : "300"
      },{
        "type" : "select",
        "name" : 'theme',
        "default" : "default",
        "options" : [
          ["default", "默认"],
          ["macarons", "蓝色"],
          ["dark", "黑色"],
          ["light", "亮色"]
        ]
      }],
      component : {
        template : "<div v-echart:option=\"option\" v-height:height=\"height\"></div>",
        directives : echartDir,
        computed : {
          height : function(){
            var height = this.getAttribute("height");
            return height;
          },
          option : function(){
            var cat = this.getAttribute("category");
            var title = this.getAttribute("title");
            var theme = this.getAttribute("theme");
            var series = this.getAttribute("value").reduce(function(a, b){
              b = typeof b === "number" ? [b] : b;
              for(var i = 0; i< b.length; i++){
                a[i] = a[i] || {
                  data: [],
                  type: 'bar'
                };
                a[i].data.push(b[i])
              }
              return a;
            },[]);
            var option = {
              theme : theme,
              title : {
                text : title,
                left : "center"
              },
              xAxis: {
                type: 'category',
                data: cat
              },
              yAxis: {
                type: 'value'
              },
              series: series
            }
            return option;
          },
          theme : function(){
            return "fb-" + this.getAttribute("theme");
          }
        }
      }
    });
    Veditor.register("barchart_stack", {
      name : "柱状图(堆积)",
      properties : [{
        "title" : "标题",
        "type" : "input",
        "name" : 'title',
        "default" : "\"折线图\""
      },{
        "title" : "类目",
        "type" : "input",
        "name" : 'category',
        "default" : "[\"第一条\",\"第二条\",\"第三条\",\"第四条\",\"第五条\",\"第六条\"]"
      },{
        "type" : "input",
        "name" : 'value',
        "default" : "[[1,2],[3,4],[5,2],[3,1],[1,6],[2,7]]"
      },{
        "title" : "高度",
        "type" : "input",
        "name" : 'height',
        "default" : "300"
      },{
        "type" : "select",
        "name" : 'theme',
        "default" : "default",
        "options" : [
          ["default", "默认"],
          ["macarons", "蓝色"],
          ["dark", "黑色"],
          ["light", "亮色"]
        ]
      }],
      component : {
        template : "<div v-echart:option=\"option\" v-height:height=\"height\"></div>",
        directives : echartDir,
        computed : {
          height : function(){
            var height = this.getAttribute("height");
            return height;
          },
          option : function(){
            var cat = this.getAttribute("category");
            var title = this.getAttribute("title");
            var theme = this.getAttribute("theme");
            var series = this.getAttribute("value").reduce(function(a, b){
              b = typeof b === "number" ? [b] : b;
              for(var i = 0; i< b.length; i++){
                a[i] = a[i] || {
                  data: [],
                  type: 'bar',
                  stack: "总量"
                };
                a[i].data.push(b[i])
              }
              return a;
            },[]);
            var option = {
              theme : theme,
              title : {
                text : title,
                left : "center"
              },
              xAxis: {
                type: 'category',
                data: cat
              },
              yAxis: {
                type: 'value'
              },
              series: series
            }
            return option;
          },
          theme : function(){
            return "fb-" + this.getAttribute("theme");
          }
        }
      }
    });
  }
  return components;
})