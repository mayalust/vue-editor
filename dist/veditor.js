(function(global, factory){
  if(typeof module !== "undefined" && typeof module.exports === "function"){
    /** CMD **/
    module.exports = factory();
  } else if(typeof define === "function"){
    /** AMD **/
    define(factory);
  } else if(global === window){
    /** Window **/
    global.Veditor = factory();
  }
})(this, function(){
  var tostring = Object.prototype.toString,
    slice = Array.prototype.slice,
    isFunction = isType("Function"),
    isArray = isType("Array"),
    isString = isType("String"),
    isObject = isType("Object"),
    vueEditor = {}, events = {}, DragAndDrop,
    OFFSETY = 10, OFFSETX = 10,
    valExp = ["([0-9]+|[0-9]*.[0-9]+)", "(true)", "(false)", "^\"(.*)\"$"];
  function nextTick(fn){
    setTimeout(fn, 100);
  }
  function pushBack(arr, obj){
    if(isArray(obj)){
      push.apply(arr, obj)
    } else {
      push.call(arr, obj)
    }
  }
  function isType(type){
    return function(obj){
      return tostring.call(obj) == "[object " + type + "]" && obj === obj;
    }
  }
  function isNaN(num){
    return num !== num;
  }
  function bind(target, fn){
    return function() {
      fn.apply(target, arguments);
    }
  }
  function pushDiff(a, b){
    var i = 0;
    a = a || [];
    b = b || [];
    for(; i < b.length; i++){
      if(a.indexOf(b[i]) === -1){
        a.push(b[i])
      }
    }
    return a.length;
  }
  function find(arr, callback){
    var i;
    arr = arr || [];
    for(var i = 0; i < arr.length; i++){
      if(callback(arr[i], i)){
        return arr[i];
      }
    }
  }
  function filter(arr, callback){
    var i, rs = [];
    arr = arr || [];
    for(var i = 0; i < arr.length; i++){
      if(callback(arr[i], i)){
        rs.push(arr[i]);
      }
    }
    return rs;
  }
  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }
  function extend(a, b){
    for(var i in b){
      a[i] = b[i]
    }
    return a;
  }
  function each(arr, callback){
    var i;
    arr = arr || [];
    for(i=0; i<arr.length; i++){
      callback && callback(arr[i], i);
    }
  }
  function eachProp(obj, callback){
    var i;
    obj = obj || {};
    for(var i in obj){
      callback && callback(obj[i], i);
    }
  }
  function createElement(tag, id, cls, style){
    var dom = document.createElement("tag");
    id && dom.setAttribute("id", id);
    cls && dom.setAttribute("class", cls);
    style && eachProp(cls, function(elem, attr){
      dom.style[attr] = elem;
    });
    return dom;
  }
  function insertBefore(newItem, existItem){
    var parent = existItem.parentNode || document.body;
    parent.insertBefore(newItem, existItem);
  }
  function insertAfter(newItem, existItem){
    var parent = existItem.parentNode || document.body;
    if(existItem.nextSibling){
      parent.insertBefore(newItem, existItem.nextSibling)
    } else {
      parent.appendChild(newItem);
    }
  }
  function addClass(elem, cls){
    var oldcls = elem.getAttribute("class"),
      oldClsList = isString(oldcls) ? oldcls.split(" ") : [];
    clsList = cls.split(" ");
    pushDiff(oldClsList, clsList);
    elem.setAttribute("class", oldClsList.join(" "));
  }
  function setClass(elem, cs){
    elem.setAttribute("class", cs);
  }
  function hasClass(elem, cls){
    if(elem && typeof elem.getAttribute === "function"){
      var oldcls = elem.getAttribute("class"),
        oldClsList = isString(oldcls) ? oldcls.split(" ") : [];
      return oldClsList.indexOf(cls) != -1;
    } else {
      return false;
    }
  }
  function removeClass(elem, cls){
    if(!(elem && typeof elem.getAttribute === "function")){
      return;
    }
    var oldcls = elem.getAttribute("class"),
      oldClsList = isString(oldcls) ? oldcls.split(" ") : [],
      i = oldClsList.indexOf(cls);
    i != -1 && oldClsList.splice(i, 1);
    elem.setAttribute("class", oldClsList.join(" "));
  }
  function appendChildren(){
    var self = this;
    var arr = slice.call(arguments, 0);
    each(arr, function(el){
      self.append(el);
    })
  }
  function setStyle(dom, style){
    style && eachProp(style, function(elem, attr){
      dom.style[attr] = elem;
    })
  }
  function findParent(dom, callback){
    var parent = dom;
    do {
      if(callback(parent)){
        return parent;
      }
    } while(parent = parent.parentNode)

    return null;
  }
  function hasNode(dom, target){
    return !!findParent(target, function(el){
      return el === dom;
    });
  }
  function findNode(dom, query){
    return dom.querySelector(query);
  }
  function prop(dom, attr){
    return dom[attr];
  }
  function attachEvent(dom, eventname, callback){
    if(isFunction(dom.addEventListener)){
      /** webkit gesko presto */
      var arr = eventname.split("."),
        name = arr[0],
        cls = arr[1];
      dom.addEventListener(eventname, callback);
      dom.$eventlist = dom.$eventlist || [];
      if(name === eventname){
        dom.$eventlist.push(callback)
      } else {
        dom.$eventlist.cls = dom.$eventlist.cls || [];
        dom.$eventlist.cls.push(callback);
      }
    } else {
      /** ie 6,7,8 */
    }
  }
  function removeEvent(dom, callback){
    if(isFunction(dom.removeEventListener)){
      var arr = eventname.split("."),
        name = arr[0],
        cls = arr[1];
      if(cls){
        for(var i in dom.$eventlist[cls]){
          dom.removeEventListener(dom.$eventlist[cls][i]);
        }
      } else {
        for(var i in dom.$eventlist){
          if(isArray(typeof dom.$eventlist[i])){
            for(var j in dom.$eventlist[i]){
              dom.removeEventListener(dom.$eventlist[i][j]);
            }
          } else {
            dom.removeEventListener(dom.$eventlist[i]);
          }
        }
      }
    } else {
      /** ie 6,7,8 */
    }
  }
  function log(msg){
    console.log.apply(console, arguments);
  }
  function error(msg){
    console.error.apply(console, arguments);
  }
  function info(msg){
    console.info.apply(console, arguments);
  }
  function on(eventname, handler){
    if(!isFunction(handler)){
      throw new Error("handler is not a function");
    }
    events[eventname] = events[eventname] || [];
    events[eventname].push(handler);
  }
  function emit(eventname, data){
    var callbacks = events[eventname];
    each(callbacks, function(n, i){
      n(data);
    })
  }
  function newArray(obj){
    return slice.call(obj);
  }
  function getRoot(node){
    var parent = node;
    while(parent = parent.parent()){
      if(parent.isRoot === true){
        return parent;
      }
    }
  }
  function plainClone(obj){
    var queue = [], result, exclude = ["parent", "parentlist"];
    result = traverse(obj);
    function traverse(obj){
      var result;
      if(isObject(obj)){
        result = {};
      } else if(isArray(obj)){
        result = []
      } else {
        return obj;
      }
      for(var i in obj){
        if(obj.hasOwnProperty(i) && exclude.indexOf(i) == -1){
          result[i] = traverse(obj[i]);
        }
      }
      return result;
    }
    return result;
  }
  function recursive(tree, callback){
    var queue = [], treenodes = isArray(tree) ? tree : [tree], item;
    each(treenodes, function(n, i){
      n.parent = n.parent || null;
      n.parentlist = n.parentlist || treenodes;
      queue.push(n);
    });
    while(item = queue.shift()){
      callback && callback(item);
      each(item.children, function(n, i){
        n.parent = item;
        n.parentlist = item.children;
        queue.push(n);
      });
    }
  }
  /** DragAndDrop */
  var freeboardcontainer = {
    inserted : function(el, b, o, n){
      var vm = o.context;
      body = document.body,
        origin = createElement("span", "origin", null, {display : "none"}),
        helper = createElement("div", null, "helper", null);
      el.onmousedown = mousedown;
      function mousedown(e){
        var target = e.target,
          mx = e.offsetX,
          my = e.offsetY,
          fromValue,
          toValue,
          appendValue,
          parent,
          parentNode;
        body.appendChild(helper);
        setStyle(helper, {
          top : (e.pageY - OFFSETY) + "px",
          left : (e.pageX - OFFSETX) + "px"
        });
        if(hasClass(target, "header")){
          parent = target.parentNode.parentNode;
          addClass(parent, "hide");
          fromValue = prop(target, "_header");
          body.onmouseover = mouseover
          body.onmouseout = mouseout;
          body.onmouseup = mouseup;
          attachEvent(body, "mousemove", function(e){
            e.preventDefault();
            setStyle(helper, {
              top : (e.pageY - OFFSETY) + "px",
              left :  (e.pageX - OFFSETX) + "px"
            });
          })
          emit("freeboard:change");
        }
        function mouseup(e){
          var inx, cl,
            target = (function(t){
              return findParent(t, function(n){
                return hasClass(n, "blank");
              })
            })(e.target);
          helper.remove();
          removeClass(parent, "hide");
          if(target){
            removeClass(target, "hover");
            toValue = prop(target, "_blank");
            appendValue = prop(target, "_append");
            cl = plainClone(fromValue);
            if(toValue){
              insertChildNode(toValue, cl);
            } else if(appendValue){
              pushChildNode(appendValue, cl);
            }
            removeChildNode(fromValue);
            emit("freeboard:change");
          } else {
            insertBefore(origin, parent);
          }
          body.onmouseover = null
          body.onmouseout = null;
          body.mouseup = null;
          body.onmousemove = null;
        }
      }
      function mouseover(e){
        var target = (function(t){
          return findParent(t, function(n){
            return hasClass(n, "blank");
          })
        })(e.target);
        if(target){
          addClass(target, "hover");
        }
      }
      function mouseout(e){
        var target = (function(t){
          return findParent(t, function(n){
            return hasClass(n, "blank");
          })
        })(e.target);
        if(target){
          removeClass(target, "hover");
        }
      }
    }
  }
  function removeChildNode(node){
    var parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx, 1);
  }
  function pushChildNode(node, child){
    child.parentlist = node.children;
    child.parent = node;
    node.children = node.children || [];
    node.children.push(child);
    recursive(node);
  }
  function insertChildNode(node, child){
    var parent = child.parent = node.parent,
      parentlist = child.parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx, 0, child);
    recursive(parent || parentlist);
  }

  var tools = {
    inserted : function(el, b, o, n){
      var vm = o.context;
      body = document.body,
        helper = createElement("div", null, "helper", null);
      el.onmousedown = mousedown;
      function mousedown(e){
        var target = e.target,
          fromValue = prop(target, "_header"),
          toValue,
          parent,
          parentNode;
        body.appendChild(helper);
        setStyle(helper, {
          top : (e.pageY - OFFSETY) + "px",
          left : (e.pageX - OFFSETX) + "px"
        });
        attachEvent(body, "mousemove", function(e){
          e.preventDefault();
          setStyle(helper, {
            top : (e.pageY - OFFSETY) + "px",
            left :  (e.pageX - OFFSETX) + "px"
          });
        })
        body.onmouseover = mouseover
        body.onmouseout = mouseout;
        body.onmouseup = mouseup;
        emit("freeboard:change");
        function mouseup(e){
          var inx, cl,
            parentFromValue,
            parentToValue,
            target = (function(t){
              return findParent(t, function(n){
                return hasClass(n, "blank");
              })
            })(e.target);
          if(target){
            removeClass(target, "hover");
            toValue = prop(target, "_blank");
            appendValue = prop(target, "_append");
            cl = plainClone(fromValue);
            if(toValue){
              insertChildNode(toValue, cl);
            } else if(appendValue){
              pushChildNode(appendValue, cl);
            }
          }
          helper.remove();
          body.onmouseover = null
          body.onmouseout = null;
          body.onmousemove = null;
          body.onmouseup = null;
        }
      }
      function mouseover(e){
        var target = (function(t){
          return findParent(t, function(n){
            return hasClass(n, "blank");
          })
        })(e.target);
        if(target){
          addClass(target, "hover");
        }
      }
      function mouseout(e){
        var target = (function(t){
          return findParent(t, function(n){
            return hasClass(n, "blank");
          })
        })(e.target);
        if(target){
          removeClass(target, "hover");
        }
      }
    }
  }
  var setvalue = {
    inserted : function(el, b){
      var arg = b.arg;
      el["_" + arg] = b.value;
    },
    update : function(el, b) {
      var arg = b.arg;
      el["_" + arg] = b.value;
    }
  }
  /** vue set up **/
  var htmlRecursive = {
    name : "html-recursive",
    template : "<component v-bind:is=\"ctype\" v-bind:option=\"option\"></component>",
    components : {
      fbrow : {
        template : "\
          <div class = \"row\">\
            <div class=\"blank\" v-setvalue:blank=\"option\"></div>\
            <div class=\"col-xs-12 drdp\"\
              v-bind:class=\"cls\">\
              <div class=\"header\" v-setvalue:header=\"option\"></div>\
              <div class=\"row item\">\
                <html-recursive v-for=\"op in option.children\"\
                  v-bind:option=\"op\"\
                   >\
                </html-recursive>\
              </div>\
            </div>\
          </div>",
        data : function(){
          return {
            cls : ""
          }
        },
        methods : {
          select : function(e){
            this.cls = "highlight";
          },
          unselect : function(e){
            this.cls = "";
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      },
      fbcol : {
        template : "\
          <div v-bind:class=\"option.class + ' min-height-50'\">\
            <html-recursive v-for=\"op in option.children\"\
              v-bind:option=\"op\"\
              ></html-recursive>\
            <div class=\"blank\" \
              v-bind:class=\"end\" \
              v-setvalue:append=\"option\">\
            </div>\
          </div>",
        data : function() {
          var cur = this;
          return {
            empty: false
          }
        },
        computed : {
          end : function(){
            var vm = this;
            var _END = "end"
            var option = vm.option;
            if(vm.empty == true) return _END;
            if(!option.children) return _END;
            if(option.children.length == 0) return _END;
            return "";
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      },
      tool : {
        template : "<div>\
          <div class=\"blank\" v-setvalue:blank=\"option\"></div>\
            <div class=\"drdp\"\
              v-bind:class=\"cls\">\
              <div class=\"header\" v-setvalue:header=\"option\"></div>\
              <component v-bind:is=\"'fb-' + option.type\" v-bind:value=\"option.id\"></component>\
            </div>\
          </div>",
        data : function(){
          return {
            cls : ""
          }
        },
        methods : {
          select : function(e){
            this.cls = "highlight";
          },
          unselect : function(e){
            this.cls = "";
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      }
    },
    computed : {
      ctype : function(){
        var type = this.option.type,
          tp = (function(type){
            if(type != "row" && type != "col") return "tool"
            return "fb" + type
          })(type)
          return tp;
      }
    },
    props : ["option"]
  }
  var htmlRecursivePreview = {
    name : "html-recursive-prev",
    template : "<component v-bind:is=\"ctype\" v-bind:option=\"option\"></component>",
    components : {
      fbrow : {
        template : "\
          <div class = \"row\">\
            <div class=\"col-xs-12\"\
              v-bind:class=\"cls\">\
              <div class=\"row\">\
                <html-recursive-prev v-for=\"op in option.children\"\
                  v-bind:option=\"op\"\
                   >\
                </html-recursive-prev>\
              </div>\
            </div>\
          </div>",
        data : function(){
          return {
            cls : ""
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      },
      fbcol : {
        template : "\
          <div v-bind:class=\"option.class\">\
            <html-recursive-prev v-for=\"op in option.children\"\
              v-bind:option=\"op\"\
              ></html-recursive-prev>\
          </div>",
        data : function() {
          var cur = this;
          return {
            empty: false
          }
        },
        computed : {
          end : function(){
            var vm = this;
            var _END = "end"
            var option = vm.option;
            if(vm.empty == true) return _END;
            if(!option.children) return _END;
            if(option.children.length == 0) return _END;
            return "";
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      },
      tool : {
        template : "<div>\
            <component v-bind:is=\"'fb-' + option.type\" v-bind:value=\"option.id\"></component>\
          </div>",
        data : function(){
          return {
            cls : ""
          }
        },
        methods : {
          select : function(e){
            this.cls = "highlight";
          },
          unselect : function(e){
            this.cls = "";
          }
        },
        directives : {
          setvalue : setvalue
        },
        props : ['option']
      }
    },
    computed : {
      ctype : function(){
        var type = this.option.type,
          tp = (function(type){
            if(type != "row" && type != "col") return "tool"
            return "fb" + type
          })(type)
        return tp;
      }
    },
    props : ["option"]
  }
  var freeboard = {
    name : "free-board",
    template : "\
      <div class=\"row item\" v-freeboardcontainer>\
        <html-recursive \
          v-for=\"op in root.children\"\
          v-bind:option=\"op\"\>\
        </html-recursive>\
        <div class=\"blank\"\
          v-setvalue:append=\"root\">\
        </div>\
      </div>",
    created : function(){
      var cur = this;
    },
    directives : {
      freeboardcontainer : freeboardcontainer,
      setvalue : setvalue
    },
    computed : {
      root : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr),
          root = {
            children : options
          };
        recursive(root);
        return root;
      }
    }
  }
  var freeboardpreview = {
    name : "free-board-prev",
    template : "\
      <div class=\"freeboard\">\
        <html-recursive-prev\
          v-for=\"op in options\"\
          v-bind:option=\"op\"\>\
        </html-recursive-prev>\
      </div>",
    computed : {
      options : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr);
        //recursive(options, function(n){});
        return options;
      }
    }
  }
  var freeboardcontrol = {
    name : "free-board-control",
    template : "\
      <div class=\"free-board-prev\" v-tools >\
        <div class=\"comp-tool\"\
          v-for=\"op in options\"\
          v-setvalue:header=\"op\"\
        >\
        </div>\
      </div>",
    directives : {
      'tools' : tools,
      'setvalue' : setvalue
    },
    computed : {
      options : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr);
        //recursive(options, function(n){});
        return options;
      }
    }
  }
  vueEditor.install = function(Vue){
    Vue.prototype.parent = function(){
      return this.$parent
    }
    Vue.prototype.attr = function(str){
      return str ? this.$attrs[str] : undefined;
    }
    Vue.prototype.data = function(str){
      if(str)
        return this[str];
    }
    Vue.component("free-board", freeboard);
    Vue.component("free-board-prev", freeboardpreview);
    Vue.component("free-board-control", freeboardcontrol);
    Vue.component("html-recursive", htmlRecursive);
    Vue.component("html-recursive-prev", htmlRecursivePreview);
    Vue.component("fb-text", {
      template : "<span>{{value}}</span>",
      name : "fb-text",
      props : ['value']
    })
  }
  return vueEditor;
});