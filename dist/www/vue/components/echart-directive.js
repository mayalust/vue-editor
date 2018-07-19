(function(global, factory){
  if(typeof module !== "undefined" && typeof module.exports === "function"){
    /** CMD **/
    module.exports = factory();
  } else if(typeof define === "function"){
    /** AMD **/
    define(factory);
  } else if(global === window){
    /** Window **/
    global.Modal = factory();
  }
})(this, function(){
  return {
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
})