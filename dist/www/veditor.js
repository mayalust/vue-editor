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
    shift = Array.prototype.shift,
    isFunction = isType("Function"),
    isArray = isType("Array"),
    isString = isType("String"),
    isObject = isType("Object"),
    vueEditor = {}, events = {},
    OFFSETY = 10, OFFSETX = 10,
    _options = null,
    _filetree = null,
    commandId = null,
    Dictionary = {
      value : "取值",
      theme : "样式"
    },
    MenuDictionary = {
      echarts : "图表",
      layout : "布局",
      table : "表格"
    },
    watchers = [],
    watchersMap = {},
    storage = SessionStorageFactory(),
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
  function createDocumentFragment(){
    return document.createDocumentFragment()
  }
  function createElement(tag, id, cls, style){
    var dom = document.createElement(tag);
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
  function addStyle(elem, style){
    eachProp(style, function(n, i){
      elem.style[i] = n;
    })
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
  function warn(msg){
    console.warn.apply(console, arguments);
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
  function replaceAllQuate(str){
    /** remove all " with /" */
    for(var i = 0; i < str.length; i){
      if(str[i] === "\""){
        str = str.substring(0, i) + "\\" + str.substring(i);
        i += 2;
      } else {
        i++;
      }
    }
    return str;
  }
  function toHTML(treenodes){
    var html = "<template>\n";
    function createBlanks(n){
      var rs = "";
      for(var i = 0; i < n; i++){
        rs += "  "
      }
      return rs;
    };
    function getTag(n, depth){
      var rs = "", map = vueEditor.toolsMap[n['type']],
        propDefines = map ? map.propDefines : [],
        switchRule = {
          "input" : function(p){
            return replaceAllQuate(p)
          },
          "select" : function(p){
            return "\\\"" + p + "\\\""
          }
        };
      if(n.type === "row") {
        rs = createBlanks(depth) + "<div class=\"row\"";
      } else if(n.type === "col"){
        rs = createBlanks(depth) + "<div class=\"" + n.class +"\" ";
      } else {
        rs = createBlanks(depth) + "<fb-" + n.type;
      }
      function switchValue(p, i){
        var findDef = propDefines.find(function(n){
            return n.name === i;
          }) || {},
          rule = switchRule[findDef.type];
        return isFunction(rule) ? rule(p) : null
      }
      eachProp(n.properties, function(p, i){
        rs += "\n" + createBlanks(depth + 1) + i + "=\"" + switchValue(p, i) +
          ((i < n.properties.length - 1) ? "\"\n" : "\"");
      })
      rs += ">\n";
      return rs;
    }
    function getTagTail(n, depth){
      if(n.type === "row") {
        return createBlanks(depth) + "</div>\n";
      } else if(n.type === "col"){
        return createBlanks(depth) + "</div>\n";
      } else {
        return createBlanks(depth) + "</fb-" + n.type + ">\n";
      }
    }
    traverse(treenodes, 0)
    html += "</template>\n";
    function traverse(treenodes, depth){
      depth++;
      each(treenodes, function(n){
        html += getTag(n, depth);
        traverse(n.children, depth);
        html += getTagTail(n, depth);
      })
    }
    return html;
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
    return tree;
  }
  function removePropWatchers(n){
    var properties = n.properties, match, inx;
    eachProp(properties, function(n, i){
      match = getWatcher(n);
      if( isArray( match ) && match[0] == "_watch"){
        inx = watchers.indexOf(match[1]);
        watchers.splice(i, 1);
        delete watchersMap[item[1]];
      }
    })
  }
  function addPropWatchers(node){
    var properties = node.properties, match;
    eachProp(properties, function(n, i){
      match = getWatcher(n);
      if( isArray(match) && match[0] == "_watch" ){
        watchers.push( match );
        watchersMap[match[1]] = watchersMap[match[1]] || [];
        watchersMap[match[1]].push(function(){
          node.properties = extend({}, node.properties);
        });
      }
    })
  }
  function removeChildNode(node){
    var parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx, 1);
    recrusive(node, removePropWatchers);
    emit("node:removed", node);
  }
  function pushChildNode(node, child){
    child.parentlist = node.children;
    child.parent = node;
    node.children = node.children || [];
    node.children.push(child);
    recursive(node, addPropWatchers);
    emit("node:added", node);
  }
  function insertChildNode(node, child){
    var parent = child.parent = node.parent, fn,
      parentlist = child.parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx, 0, child);
    recursive(parent || parentlist, addPropWatchers);
    emit("node:added", node);
  }
  function afterChildNode(node, child){
    var parent = child.parent = node.parent,
      parentlist = child.parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx + 1, 0, child);
    recursive(parent || parentlist, addPropWatchers);
    emit("node:added", node);
  }
  function updateNode(target, obj){
    eachProp(obj, function(n, i){
      target[i] = n;
    });
    emit("node:updated", target);
  }
  function getNextNode(node){
    parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    return parentlist[inx + 1] || null;
  }
  function SessionStorageFactory(){
    return {
      get : function(name){
        return JSON.parse(sessionStorage.getItem(name))
      },
      set : function(name, val){
        sessionStorage.setItem(name, JSON.stringify(val))
      }
    }
  }
  var valueWatcher = {
    "fromVariable" : {
      exp : new RegExp("^\\[from:(.*)\\]$", "g"),
      watcher : function(d){
        return ["_watch", d, function (val){
          console.log(val);
        }];
      }
    },
    "toVariable" : {
      exp : new RegExp("^\\[to:(.*)\\]$", "g"),
      watcher : function(d){
        /** unit-test used only **/
        return ["_change", d, function (val){
          var filter = watchersMap[d];
          each(filter, function(n){
            n(val);
          })
        }];
      }
    }
  }
  var valueSwitcher = {
    "fromVariable" : {
      exp : new RegExp("^\\[from:(.*)\\]$", "g"),
      handler : function(d){
        return function(target){
          return target[d];
        }
      }
    },
    "toVariable" : {
      exp : new RegExp("^\\[to:(.*)\\]$", "g"),
      handler : function(d){
        return function(target){
          return target[d];
        }
      }
    },
    "number" : {
      exp : new RegExp("^(\\d+)$", "g"),
      handler : function(d){
        return parseFloat(d);
      }
    },
    "Array" : {
      exp : new RegExp("^\\[(.*)\\]$", "g"),
      handler : function(d){
        return d.split(",");
      }
    },
    "Object" : {
      exp : new RegExp("^(\\{.*\\})$" ,"g"),
      handler : function(d){
        return JSON.parse(d);
      }
    }
  }
  function getValue( str ){
    var match
    for(var i in valueSwitcher){
      valueSwitcher[i].exp.lastIndex = 0;
      match = valueSwitcher[i].exp.exec(str);
      if(match)
        return valueSwitcher[i].handler(match[1]);
    }
    return str;
  }
  function getWatcher( str ){
    var match
    for(var i in valueWatcher){
      valueWatcher[i].exp.lastIndex = 0;
      match = valueWatcher[i].exp.exec(str);
      if(match)
        return valueWatcher[i].watcher(match[1]);
    }
    return null;
  }
  function getOffset(target){
    var parent = target, style,
      left = parent.offsetLeft, top = parent.offsetTop;
    while((parent = parent.parentNode) !== document){
      style = window.getComputedStyle(parent, null);
      if(style.position !== "static"){
        left += parent.offsetLeft;
        top += parent.offsetTop;
      }
    }
    return {
      left : left,
      top : top
    }
  }
  function command(){
    var commandStack = [], trashStack = [], events = {}, commandInx = -1;
    function emit(eventname, data){
      events[eventname] && events[eventname](data);
    }
    return {
      on : function(eventname, callback){
        events[eventname] = callback;
      },
      init : function(){
        commandId = commandInx
      },
      addCommand : function(cmd){
        trashStack = [];
        cmd.process = [];
        return {
          process : function(prog){
            cmd.process.push(prog)
          },
          end : function(){
            commandStack.push(cmd);
            commandInx++;
            emit("command:add", cmd);
          }
        }
      },
      backward : function(){
        var back = commandStack.pop(), cmd, params, fn;
        if(back){
          trashStack.unshift(back),
            process = back.process;
          each(process, function(p){
            cmd = p.backward;
            fn = cmd[0];
            params = cmd[1];
            params = isArray(params) ? params : [params]
            fn.apply(null, params);
          });
          commandInx--;
          emit("command:back", cmd);
        }
      },
      forward : function(){
        var forward = trashStack.shift(), cmd, params, fn;
        if(forward){
          commandStack.push(forward);
          process = forward.process;
          each(process, function(p){
            cmd = p.forward;
            fn = cmd[0];
            params = cmd[1];
            params = isArray(params) ? params : [params]
            fn.apply(null, params);
          })
          commandInx++
          emit("command:forward", cmd);
        }
      },
      getCommandInx : function(){
        return commandInx;
      },
      getAllCommand : function(){
        return [commandStack, trashStack, commandInx === commandId];
      }
    }
  }
  var cmd = command();
  cmd.on("command:add", function(event){
    emit("command:change", cmd.getAllCommand());
  })
  cmd.on("command:back", function(event){
    emit("command:change", cmd.getAllCommand());
  })
  cmd.on("command:forward", function(event){
    emit("command:change", cmd.getAllCommand());
  })
  var items = {
    "input" : function(prop){
      var input = createElement("input"), dirty, old;
      addClass(input, "input");
      old = input.value = prop.value;
      input.onchange = function(){
        dirty = this.value !== old;
      }
      return {
        dom : input,
        destroy : function() {
          input.remove();
          input = null;
        },
        getValue : function(){
          return input.value
        },
        isDirty : function(){
          return dirty;
        }
      };
    },
    "select" : function(prop){
      var select = createElement("select"),
        map = {}, value = prop.value,
        option = createElement("option"),dp, offset, dirty, old;
      each(prop.options, function(n, i){
        map[n[0]] = n[1];
      })
      addClass(select, "select");
      old = prop.value;
      option.innerText = map[prop.value];
      select.appendChild(option);
      select.onmousedown = function(e){
        e.preventDefault();
        offset = getOffset(e.currentTarget);
        dp = createDrop(prop.options, {
          top : offset.top + e.currentTarget.clientHeight,
          left : offset.left,
          width : e.currentTarget.clientWidth
        });
        dp.on("select", function(e){
          option.innerText = e[1];
          value = e[0];
          dirty = value !== old;
        });
      }
      return {
        dom : select,
        destroy : function() {
          select.remove();
          option = null;
          select = null;
        },
        getValue : function(){
          return value
        },
        isDirty : function(){
          return dirty;
        }
      };
    }
  }
  function createDrop(options, config){
    var events = {},
      buttonWrap = createElement("div", null, "button-wrap", null),
      widget = createElement("div", null, "widget-bg", null),
      nodelists = [],
      fragment = createDocumentFragment();
    fragment.appendChild(widget);
    widget.appendChild(buttonWrap);
    addStyle(buttonWrap, {
      width : config.width + "px"
    });
    each(options, function(option, i){
      var node = createElement("div", null, "button-item", null);
      node.innerText = option[1];
      config.index == i && addClass(node, "highlight");
      node.onclick = function(e){
        emit("select", option, i);
        sethighlight(i);
        destroy();
      };
      nodelists.push(node);
      buttonWrap.append(node);
    })
    document.body.appendChild(fragment);
    setStyle(buttonWrap, {
      top : config.top + "px",
      left : config.left + "px"
    });
    setTimeout(function(){
      addClass(widget, "fade-in");
      addClass(buttonWrap, "fade-in");
    })
    widget.onclick = function(e){
      if(e.eventPhase === 2){
        destroy();
      }
    }
    function emit(){
      var args = slice.call(arguments),
        eventname = args.shift();
      events[eventname] && events[eventname].apply(null, args);
    }
    function sethighlight(inx){
      each(nodelists, function(n, i){
        i == inx ? addClass(n, "highlight") : removeClass(n, "highlight")
      })
    }
    function destroy(){
      widget.remove();
      each(nodelists, function(n, i){
        delete nodelists[i];
      })
      widget = null;
      buttonWrap = null;
    };
    return {
      on : function(eventname, callback){
        events[eventname] = callback;
      },
      sethighlight : sethighlight,
      destroy : destroy
    }
  }
  function createItem(prop){
    return items[prop.type](prop);
  }
  function createProperties(title, properties){
    var events = {},
      values = [],
      fragement = createDocumentFragment(),
      cover = createElement("div", null, "modal-cover", null),
      modal = createElement("div", null, "fb-modal", null),
      table = createElement("div", null, "prop-table", null),
      titledom = createElement("div", null, "title", null),
      submit = createElement("button", null, "submit", null),
      tools = [];
    titledom.innerText = title;
    modal.appendChild(titledom);
    cover.appendChild(modal);
    fragement.appendChild(cover);
    modal.appendChild(table);
    modal.appendChild(submit);
    submit.innerText = "提交";
    setTimeout(function(){
      addClass(cover, "fade-in");
    })
    setTimeout(function(){
      addClass(modal, "fade-in");
    });
    function getValue(tool){
      var type = tool[0];
      return tool[1].getValue();
    }
    submit.onclick = function(e){
      var rs = {};
      each(properties, function(n, i){
        rs[n.name] = getValue(values[i])
      })
      tools.some(function(t){return t.isDirty()}) ?
        events["submit"] && events["submit"](rs) :
        events["close"] && events["close"](e)
    }
    cover.onclick = function(e){
      if(e.eventPhase === 2){
        events["close"] && events["close"](e);
      }
    }
    each(properties, function(property){
      var tr = createElement("div"),
        title = createElement("div"),
        content = createElement("div"),
        tool;
      tool = createItem(property);
      tools.push(tool);
      tool.value = property.value;
      content.appendChild(tool.dom);
      title.innerText = Dictionary[property.name] || property.title || property.name;
      addClass(tr, "tr");
      addClass(title, "td-title");
      addClass(content, "td-content");
      values.push(["input", tool]);
      tr.appendChild(title);
      tr.appendChild(content);
      table.appendChild(tr);
    })
    document.body.appendChild(fragement);
    return {
      on : function(eventname, callback){
        events[eventname] = callback;
      },
      destroy : function(){
        each(tools, function(t){
          t.destroy();
        })
        cover.remove();
        titledom = null;
        cover = null;
        modal = null;
        submit = null;
      }
    }
  };
  function getNextBlank(dom){
    var next = dom.nextSibling;
    return next && hasClass(next, "blank") ? next : null;
  }

  /** 重要 */
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
          parentNode,
          command,
          fromValue = prop(target, "_header");
        if(fromValue){
          map = vueEditor.toolsMap[fromValue['type']];
          inx = fromValue.parentlist.indexOf(fromValue) + 1;
          command = cmd.addCommand({
            name : "append tool",
            msg : "移动了一个[" + map.title + "]",
          })
          body.appendChild(helper);
          setStyle(helper, {
            top : (e.pageY - OFFSETY) + "px",
            left : (e.pageX - OFFSETX) + "px"
          });
          parent = target.parentNode.parentNode;
          addClass(parent, "hide");
          setTimeout(function(){
            addClass(helper, "fade-in");
          })
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
          var inx, cl, next,
            target = (function(t){
              return findParent(t, function(n){
                return hasClass(n, "blank");
              })
            })(e.target);
          helper.remove();
          removeClass(parent, "hide");
          removeClass(helper, "fade-in");
          if(target){
            next = getNextNode(fromValue)
            toValue = prop(target, "_blank");
            removeClass(target, "hover");
            appendValue = prop(target, "_append");
            cl = plainClone(fromValue);
            if(toValue){
              insertChildNode(toValue, cl);
              command.process({
                forward : [insertChildNode, [toValue, cl]],
                backward : [removeChildNode, cl]
              })
            } else if(appendValue){
              pushChildNode(appendValue, cl);
              command.process({
                forward : [pushChildNode, [appendValue, cl]],
                backward : [removeChildNode, cl]
              })
            }
            if(next){
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [insertChildNode, [next, cl]]
              })
            } else {
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [pushChildNode, [fromValue.parent, fromValue]]
              })
            }
            /** if no value changed, history would not be recorded*/
            if(toValue){
              next !== toValue ? command.end() : null;
            } else {
              fromValue.parentlist !== appendValue.children ? command.end() : null;
            }
            removeChildNode(fromValue);
            emit("freeboard:change");
          } else {
            insertBefore(origin, parent);
          }
          body.onmouseover = null
          body.onmouseout = null;
          body.onmouseup = null;
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
  var tools = {
    inserted : function(el, b, o, n){
      var vm = o.context;
      body = document.body,
        helper = createElement("div", null, "helper", null);
      el.onmousedown = mousedown;
      function mousedown(e){
        var target = e.target, map, toValue, parent, parentNode, command,
          fromValue = prop(target, "_header");
        if(fromValue){
          map = vueEditor.toolsMap[fromValue['type']];
          command = cmd.addCommand({
            name : "append tool",
            msg : "增加了一个[" + map.title + "]组件",
          });
          body.appendChild(helper);
          setStyle(helper, {
            top : (e.pageY - OFFSETY) + "px",
            left : (e.pageX - OFFSETX) + "px"
          });
          setTimeout(function(){
            addClass(helper, "fade-in");
          })
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
        }
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
              command.process({
                forward : [insertChildNode, [toValue, cl]],
                backward : [removeChildNode, cl]
              })
            } else if(appendValue){
              pushChildNode(appendValue, cl);
              command.process({
                forward : [pushChildNode, [appendValue, cl]],
                backward : [removeChildNode, cl]
              })
            }
            command.end();
          }
          removeClass(helper, "fade-in");
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
  var widget = {
    inserted : function(el, b){
      var buttonWrap, widget, target,
        buttons = [{
          name : "编辑",
          onclick : function(e){
            var val = prop(el.parentNode, "_header"),
              map = vueEditor.toolsMap[val['type']],
              props = val.properties,
              command = cmd.addCommand({
                name : "edit tool",
                msg : "编辑了[" + map.title + "]组件的属性",
              }),
              propDefines = map.propDefines.map(function(n){
                var rs = plainClone(n);
                rs.value = props[rs.name];
                return rs;
              }),
              modal = createProperties("编辑属性", propDefines);
            modal.on("submit", function(e){
              var old = plainClone(props);
              command.process({
                forward : [updateNode, [props, e]],
                backward : [updateNode, [props, old]]
              })
              updateNode(props, e);
              command.end();
              modal.destroy();
            });
            modal.on("close", function(e){
              modal.destroy();
            })
          }
        },{
          name : "剪切",
          onclick : function(e){
            var fromValue = prop(el.parentNode, "_header"),
              map = vueEditor.toolsMap[fromValue['type']],
              command = cmd.addCommand({
                name : "remove tool",
                msg : "剪切[" + map.title + "]组件"
              }),
              next = getNextNode(fromValue);
            if(next){
              removeChildNode(fromValue);
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [insertChildNode, [next, fromValue]]
              })
            } else {
              removeChildNode(fromValue);
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [pushChildNode, [fromValue.parent, fromValue]]
              })
            }
            storage.set("freeboardcopy", plainClone(fromValue));
            command.end();
          }
        },{
          name : "复制",
          onclick : function(e){
            var val = prop(el.parentNode, "_header");
            storage.set("freeboardcopy", plainClone(val));
          }
        },{
          name : "前插粘贴",
          onclick : function(e){
            var target = e.currentTarget,
              fromValue = storage.get("freeboardcopy"),
              map = vueEditor.toolsMap[fromValue['type']],
              command = cmd.addCommand({
                name : "remove tool",
                msg : "粘贴(向前)[" + map.title + "]组件"
              }),
              toValue = prop(el.parentNode, "_header"),
              cl = plainClone(fromValue);
            if(toValue){
              insertChildNode(toValue, cl);
              command.process({
                forward : [insertChildNode, [toValue, cl]],
                backward : [removeChildNode, cl]
              })
            }
            command.end();
          }
        },{
          name : "后插粘贴",
          onclick : function(e){
            var target = e.currentTarget,
              fromValue = storage.get("freeboardcopy"),
              map = vueEditor.toolsMap[fromValue['type']],
              command = cmd.addCommand({
                name : "remove tool",
                msg : "粘贴(向后)[" + map.title + "]组件"
              }),
              toValue = prop(el.parentNode, "_header"),
              cl = plainClone(fromValue);
            if(toValue){
              afterChildNode(toValue, cl);
              command.process({
                forward : [afterChildNode, [toValue, cl]],
                backward : [removeChildNode, cl]
              })
            }
            command.end();
          }
        },{
          name : "删除",
          onclick : function(e){
            var fromValue = prop(el.parentNode, "_header"),
              map = vueEditor.toolsMap[fromValue['type']],
              command = cmd.addCommand({
                name : "remove tool",
                msg : "删除[" + map.title + "]组件"
              }),
              next = getNextNode(fromValue);
            if(next){
              removeChildNode(fromValue);
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [insertChildNode, [next, fromValue]]
              })
            } else {
              removeChildNode(fromValue);
              command.process({
                forward : [removeChildNode, fromValue],
                backward : [pushChildNode, [fromValue.parent, fromValue]]
              })
            }
            command.end();
          }
        }];
      function remove(){
        widget.remove();
        buttonWrap = null;
        widget = null;
      }
      el.onclick = function(e){
        buttonWrap = createElement("div", null, "button-wrap", null),
          widget = createElement("div", null, "widget-bg", null),
          fragment = createDocumentFragment();
        target = e.target;
        fragment.appendChild(widget);
        widget.appendChild(buttonWrap);
        each(buttons, function(btn, i){
          var node = createElement("div", null, "button-item", null);
          node.innerText = btn.name;
          node.onclick = function(e){
            remove();
            btn.onclick(e);
          };
          buttonWrap.append(node);
        })
        document.body.appendChild(fragment);
        setStyle(buttonWrap, {
          top : (e.clientY - 10) + "px",
          left : (e.clientX - 90) + "px"
        });
        setTimeout(function(){
          addClass(widget, "fade-in");
          addClass(buttonWrap, "fade-in");
        })
        widget.onclick = function(e){
          if(e.eventPhase === 2){
            remove();
          }
        }
      }
    }
  }
  var blankwidget = {
    inserted : function(el, b){
      var buttonWrap, widget, target, buttons = [{
        name : "粘贴",
        onclick : function(e){
          var target = e.currentTarget,
            fromValue = storage.get("freeboardcopy"),
            map = vueEditor.toolsMap[fromValue['type']],
            command = cmd.addCommand({
              name : "remove tool",
              msg : "粘贴[" + map.title + "]组件"
            }),
            appendValue = prop(el, "_append"),
            cl = plainClone(fromValue);
          pushChildNode(appendValue, cl);
          command.process({
            forward : [pushChildNode, [appendValue, cl]],
            backward : [removeChildNode, cl]
          })
          command.end();
        }
      }];
      var value = b.value;
      function remove(){
        widget.remove();
        buttonWrap = null;
        widget = null;
      }
      el.onclick = function(e){
        if(hasClass(e.target,"end")){
          buttonWrap = createElement("div", null, "button-wrap", null),
            widget = createElement("div", null, "widget-bg", null),
            fragment = createDocumentFragment();
          target = e.target;
          fragment.appendChild(widget);
          widget.appendChild(buttonWrap);
          each(buttons, function(btn, i){
            var node = createElement("div", null, "button-item", null);
            node.innerText = btn.name;
            node.onclick = function(e){
              remove();
              btn.onclick(e);
            };
            buttonWrap.append(node);
          })
          document.body.appendChild(fragment);
          setStyle(buttonWrap, {
            top : (e.clientY - 10) + "px",
            left : (e.clientX - 90) + "px"
          });
          setTimeout(function(){
            addClass(widget, "fade-in");
            addClass(buttonWrap, "fade-in");
          })
          widget.onclick = function(e){
            if(e.eventPhase === 2){
              remove();
            }
          }
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
  var htmlRecursive = {
    name : "html-recursive",
    template : "<component v-bind:is=\"ctype\" v-bind:option=\"option\"></component>",
    components : {
      fbrow : {
        template : "\
          <div class = \"row item\">\
            <div class=\"blank\" v-setvalue:blank=\"option\"></div>\
            <div class=\"col-xs-12 drdp\"\
              v-bind:class=\"cls\">\
              <div class=\"header\" v-setvalue:header=\"option\">\
                <div class=\"wiget\" v-widget></div>\
              </div>\
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
        directives : {
          widget : widget,
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
              v-blankwidget:isend=\"end\"\
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
            if(!option.children) return _END;
            if(option.children.length == 0) return _END;
            return "";
          }
        },
        directives : {
          blankwidget : blankwidget,
          setvalue : setvalue
        },
        props : ['option']
      },
      tool : {
        template : "<div class=\"wrap\">\
          <div class=\"blank\" v-setvalue:blank=\"option\"></div>\
            <div class=\"drdp\"\
              v-bind:class=\"cls\">\
              <div class=\"header\" v-setvalue:header=\"option\">\
                <div class=\"wiget\" v-widget></div>\
              </div>\
              <component v-bind:is=\"'fb-' + option.type\" v-bind:value=\"option.id\"></component>\
            </div>\
          </div>",
        data : function(){
          return {
            cls : ""
          }
        },
        directives : {
          widget : widget,
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
            <component v-bind:is=\"'fb-' + option.type\" \
             v-bind:option=\"option\"\
            ></component>\
          </div>",
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
      <div class=\"row freeboard edit\" v-freeboardcontainer>\
        <html-recursive \
          v-for=\"op in root.children\"\
          v-bind:option=\"op\"\>\
        </html-recursive>\
        <div class=\"blank\"\
          v-bind:class=\"end\"\
          v-setvalue:append=\"root\">\
        </div>\
      </div>",
    created : function(){
      this.isComponentRoot = true;
    },
    directives : {
      freeboardcontainer : freeboardcontainer,
      setvalue : setvalue
    },
    computed : {
      end : function(){
        var vm = this;
        var _END = "end whole"
        var root = vm.root;
        if(!root.children) return _END;
        if(root.children.length == 0) return _END;
        return "";
      },
      root : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr),
          root = recursive({
            children : options
          }, addPropWatchers);
        _options = options;
        return root;
      }
    }
  }
  var freeboardpreview = {
    name : "free-board-prev",
    template : "\
      <div class=\"freeboard preview\">\
        <html-recursive-prev\
          v-for=\"op in root.children\"\
          v-bind:option=\"op\"\>\
        </html-recursive-prev>\
      </div>",
    created : function(){
      this.isComponentRoot = true;
    },
    computed : {
      root : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr),
          root = recursive({
            children : options
          }, addPropWatchers);
        return root;
      }
    }
  }
  var columnEditor = {
    template : "<div class='col-editor'>\
      <div class=\"row\">\
        <div class=\"col-xs-9\">\
          <div class=\"row\">\
            <div v-for=\"d in colData.children\"\
              class=\"col-prev\"\
              v-bind:class=\"d.class\">\
                {{d.colnum}}\
            </div>\
          </div>\
          <div class=\"rulerwrap\">\
            <div v-select:status='i'\
              draggable=\"false\"\
              v-setvalue:status='i'\
              v-for=\"i in options\"\
              v-bind:class='column(i)'\
              class=\"column\"\
            ></div>\
          </div>\
        </div>\
        <div class=\"col-xs-3\">\
          <div v-setvalue:header=\"colData\" class=\"drag\">拖拽</div>\
        </div>\
      </div>\
    </div>",
    data : function(){
      var arr = [];
      for(var i = 0; i < 11; i++){
        arr.push({
          value : false
        });
      }
      return {
        options : arr
      }
    },
    props : ["colData"],
    methods : {
      column : function(active){
        return active.value ? "active" : "";
      }
    },
    directives : {
      setvalue : setvalue,
      select: {
        inserted: function (el, b, o, n) {
          var body = document.body,
            vm = o.context,
            cacheClick,
            value = b.value;
          el.onmousedown = mousedown;
          function redraw(){
            vm.colData.children = (function(options){
              var rs = [], inx = 0;
              for(var i in options){
                if(options[i].value){
                  rs.push({
                    type : "col",
                    "class" : "col-xs-" + (i - 0 + 1 - inx),
                    "colnum" : (i - 0 + 1 - inx),
                    children : []
                  });
                  inx = i - 0 + 1;
                }
              }
              if(inx < 12){
                rs.push({
                  type : "col",
                  "class" : "col-xs-" + (12 - inx),
                  "colnum" : (12 - inx),
                  children : []
                })
              }
              return rs;
            })(vm.options)
          }
          function mouseover(e){
            var status = prop(e.target, "_status");
            if(status){
              cacheClick.value = cacheClick._value;
              cacheClick = status;
              cacheClick._value = status.value;
              status.value = true;
              redraw();
            }
          }
          function mousedown(e) {
            var status = prop(e.target, "_status");
            addClass(el.parentNode, "moved");
            cacheClick = status;
            body.onmouseover = mouseover;
            if(status.value){
              status._value = false;
              el.onmouseout = mouseout;
              body.onmouseup = mouseupcancel;
            } else {
              status.value = true;
              body.onmouseup = mouseup;
            }
            //cacheClick._value = status.value;
            redraw();
          }
          function mouseout(e) {
            var target = (function(t){
              return findParent(t, function(p){
                return p === el;
              })
            })(e.target)
            body.onmouseup = mouseup;
          }
          function mouseupcancel(e){
            var status = prop(e.target, "_status");
            removeClass(el.parentNode, "moved");
            delete cacheClick._value;
            cacheClick = null;
            status.value = false;
            body.onmouseup = null;
            body.onmouseover = null;
            redraw();
          }
          function mouseup(e) {
            var status = prop(e.target, "_status");
            removeClass(el.parentNode, "moved");
            status.value = true;
            body.onmouseup = null;
            body.onmouseover = null;
            cacheClick = null;
            redraw();
          }
        }
      }
    }
  }
  function postJSON(url, param, callback){
    var xhr = new XMLHttpRequest();
    param = JSON.stringify(param);
    xhr.onreadystatechange = state_Change;
    xhr.withCredentials = true;
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(param);
    function state_Change(){
      if(xhr.readyState == 4){
        if(xhr.status == 200){
          var json = JSON.parse(xhr.responseText);
          callback && callback(json);
        }
      };
    }
  }
  function getJSON(url, param, callback){
    var xhr = new XMLHttpRequest();
    param = JSON.stringify(param);
    xhr.onreadystatechange = state_Change;
    xhr.withCredentials = true;
    xhr.open("GET",url,true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(param);
    function state_Change(){
      if(xhr.readyState == 4){
        if(xhr.status == 200){
          var json = JSON.parse(xhr.responseText);
          callback && callback(json);
        }
      };
    }
  }
  var filetree = {
    update : function(e, b, o, n){
      var data = b.value,
        ins = psTree(e, {
          showline : true,
          animate : false,
          data : data,
          themes : "show-line",
          on : {
            init : function(event){
              var cur = this,
                url = urlparse(),
                viewId = url.param.id,
                match = new RegExp("^view_(.*)\\.json$", "g").exec(this.basename),
                group = this.createGroup("group");
              this.type !== "directory" ? this.icon = "circle" : null;
              this.label = this.title || MenuDictionary[this.basename] || this.basename;
              if ( this.basename == "view_" + viewId + ".json"){
                nextTick(function(){
                  cur.highlight();
                });
              }
              if(this.type !== "directory"){
                var dragBtn = this.createButton("b", "拖拽", {
                  float : "right"
                }, function(e){

                });
                dragBtn["_header"] = this.data;
                var editBtn = this.createButton("c", "编辑", {
                  float : "right"
                }, function(e){
                  window.open("edit?id=" + match[1]);
                });
                dragBtn.setAttribute("class", "drag");
                this.type !== "file" && group.appendChild(dragBtn);
                this.type == "file" && this.basename !== "view_" + viewId + ".json"  && group.appendChild(editBtn);
                this.type == "file" && setTimeout(function(){
                  cur.text.style.color = "#6061a6";
                  cur.text.style.textDecoration = "underline";
                });
                this.render(group);
              } else {
                if(this.path === "layout"){
                  var addBtn = this.createButton("d", "新建", {
                    float : "right"
                  }, function(e){
                    window.open("edit");
                  });
                  group.appendChild(addBtn);
                  this.render(group);
                }
              }
            },
            click : function(event){
              var match = new RegExp("^view_(.*)\\.json$", "g").exec(this.basename);
              event.preventDefault();
              if(this.type == "file"){
                window.open("preview?id=" + match[1]);
              }
            }
          }
        });
    }
  }
  var freeboardcontrol = {
    name : "free-board-control",
    template : "\
      <div class=\"free-board-control\" v-tools >\
        <column-editor v-setvalue=\"colData\" :colData=\"colData\">\
        </column-editor>\
        <div v-filetree:options=\"options\"></div>\
        <!--\
        <div class=\"comp-tool\"\
          v-for=\"op in options\"\
          >\
          <span>{{op.title}}</span>\
          <div v-setvalue:header=\"op.data\" class='drag'>拖拽</div>\
        </div>-->\
      </div>",
    components : {
      "column-editor" : columnEditor
    },
    directives : {
      'tools' : tools,
      'setvalue' : setvalue,
      'filetree' : filetree
    },
    data : function(){
      var arr = [];
      for(var i = 0; i < 11; i++){
        arr.push(false);
      }
      return {
        split : arr
      }
    },
    data : function(){
      var cur = this, row = extend({}, vueEditor.toolsMap["row"].data);
      return {
        colData : extend(row, {
          children : [{
            type : "col",
            colnum : 12,
            class: "col-xs-12",
            children : []
          }]
        })
      }
    },
    props : ['options']
  }
  vueEditor.install = function(Vue){
    Vue.prototype.getJSON = getJSON;
    Vue.prototype.postJSON = postJSON;
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
    Vue.prototype.getAttribute = function(name){
      var rootCompoent = this.getRootComponent(),
        option = this.getComponent(),
        map = vueEditor.toolsMap[option['type']],
        propDefines = map ? map.propDefines : [],
        findDef = propDefines.find(function(n){
          return n.name == name;
        }),
        attr = option.properties[name],
        match = getValue( attr );
      return isFunction(match) ? match(rootCompoent) : match;
    }
    Vue.prototype.setAttribute = function(name, value){
      var rootCompoent = this.getRootComponent(),
        item,
        option = this.getComponent(),
        map = vueEditor.toolsMap[option['type']],
        propDefines = map ? map.propDefines : [],
        findDef = propDefines.find(function(n){
          return n.name == name;
        }),
        attr = option.properties[name],
        match = getWatcher( attr );
      if(isArray(match) && match[0] === "_change"){
        item = match[2];
        rootCompoent[match[1]] = value;
        item(value);
      }
    }
    Vue.prototype.getComponent = function(){
      var parent = this;
      do{
        if(parent.freeboardComponent){
          return parent.$parent.option;
        }
      } while (parent = parent.$parent);
      return null;
    }
    Vue.prototype.getRootComponent = function(){
      var parent = this;
      do{
        if(parent.isComponentRoot){
          return parent;
        }
      } while (parent = parent.$parent);
      return null;
    }
    Vue.component("free-board", freeboard);
    Vue.component("free-board-prev", freeboardpreview);
    Vue.component("free-board-control", freeboardcontrol);
    Vue.component("html-recursive", htmlRecursive);
    Vue.component("html-recursive-prev", htmlRecursivePreview);
    each(vueEditor.tools, function(n){
      if(n.component){
        Vue.component(n.component.name, {
          template : "<comp></comp>",
          data : function(){
            return {
              freeboardComponent : n
            };
          },
          components : {
            "comp" : n.component
          }
        });
      }
    })
  }
  vueEditor.save = function(){
    alert("视图[view_" + viewId + ".json]保存完毕");
    cmd.init();
    emit("command:change", cmd.getAllCommand());
    var params = JSON.stringify(plainClone(_options), null, 2),
      url = urlparse(),
      viewId = url.param.id;
    postJSON("api/savelayout/" + viewId, params, function(event){
      if(event.code == 0){
        console.log("event");
      }
    });
  }
  vueEditor.back = function(button, e){
    cmd.backward();
  }
  vueEditor.forward = function(button, e){
    cmd.forward();
  }
  vueEditor.history = function(button, e){
    var commands = cmd.getAllCommand(),
      offset = getOffset(e.currentTarget)
    historys = commands[0].concat(commands[1]).map(function(n, i){
      return [i, n.msg];
    }), offsetLeft = 200;
    var dp = createDrop(historys, {
      index : commands[0].length - 1,
      top : offset.top + e.currentTarget.clientHeight,
      left : offset.left - offsetLeft,
      width : offsetLeft + 50
    });
    dp.on("select", function(e, i){
      function execCommand(){
        if(cmd.getCommandInx() < i){
          cmd.forward();
          execCommand();
        } else if(cmd.getCommandInx() > i){
          cmd.backward();
          execCommand()
        }
      }
      execCommand();
    })
  }
  vueEditor.use = function(tool){
    tool.install(Veditor);
  }
  vueEditor.on = on;
  vueEditor.register = function(name, config, toTools){
    var properties = (function(props){
        var rs = {};
        each(props, function(p){
          if(isObject(p)){
            rs[p.name] = p["default"];
          } else if (isArray(p)){
            rs[p[1]] = p[2];
          } else if (isString(p)){
            rs[p] = null;
          }
        })
        return rs;
      })(config.properties),
      tool = config._compiled ? {
        title : config.title || config.name,
        type : "predefined",
        data : {
          type : name,
          properties : properties
        },
        propDefines : config.properties,
        component : config
      } : {
        title : config.name,
        type : "predefined",
        data : {
          type : name,
          properties : properties
        },
        propDefines : config.properties,
        component : config.component
      };
    tool.component && (tool.component.name = "fb-" + name);
    vueEditor.toolsMap = vueEditor.toolsMap || {};
    vueEditor.toolsMap[name] = tool;
    if(toTools !== false){
      vueEditor.tools = vueEditor.tools || [];
      vueEditor.tools.push(tool);
    }
  }
  vueEditor.register("row", {
    name : "栅格",
    properties : [{
      "type" : "select",
      "name" : 'theme',
      "default" : "normal",
      "options" : [
        ["normal", "普通"],
        ["center", "居中"]
      ]
    }]
  }, false);
  return vueEditor;
});