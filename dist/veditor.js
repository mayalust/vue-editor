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
    commandId = null;
    Dictionary = {
      value : "取值",
      theme : "样式"
    },
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
  function getNextNode(node){
    parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    return parentlist[inx + 1] || null;
  }
  function afterChildNode(node, child){
    var parent = child.parent = node.parent,
      parentlist = child.parentlist = node.parentlist;
    inx = parentlist.indexOf(node);
    parentlist.splice(inx + 1, 0, child);
    recursive(parent || parentlist);
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
  function getValue(str){
    var exps = [/^\"(.*)\"$/g], match;
    while(match = exps.shift()){
      match = match.exec(str);
      if(match){
        return match[1];
      }
    }
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
            emit("command:add", cmd);
            commandInx++;
            console.log(commandInx)
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
          console.log(commandInx)
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
          console.log(commandInx)
        }
      },
      getCommandInx : function(){
        console.log(commandInx);
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
  }
  var storage = SessionStorageFactory();
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
          command = cmd.addCommand({
            name : "append tool",
            msg : "增加了一个那啥",
          }),
          fromValue = prop(target, "_header");
        if(fromValue){
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
          console.error("body mouseup");
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
            next = getNextNode(fromValue);
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
            removeChildNode(fromValue);
            emit("freeboard:change");
          } else {
            insertBefore(origin, parent);
          }
          command.end();
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
        var target = e.target,
          fromValue = prop(target, "_header"),
          map = vueEditor.toolsMap[fromValue['type']],
          toValue,
          parent,
          parentNode,
          command = cmd.addCommand({
            name : "append tool",
            msg : "增加了一个[" + map.title + "]组件",
          });
        if(fromValue){
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
  function updateNode(target, obj){
    eachProp(obj, function(n, i){
      target[i] = n;
    });
  }
  var widget = {
    inserted : function(el, b){
      var buttonWrap, widget, target,
        buttons = [{
        name : "编辑",
        onclick : function(e){
          var val = prop(el.parentNode, "_header"),
            map = vueEditor.toolsMap[val['type']],
            props = val.props,
            command = cmd.addCommand({
              name : "edit tool",
              msg : "编辑了[" + map.title + "]组件的属性信息",
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
          var val = prop(el.parentNode, "_header");
          storage.set("freeboardcopy", plainClone(val));
          removeChildNode(val);
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
          var val = prop(el.parentNode, "_header"),
            fromValue = storage.get("freeboardcopy");
          insertChildNode(val, fromValue);
        }
      },{
        name : "后插粘贴",
        onclick : function(e){
          var val = prop(el.parentNode, "_header"),
            fromValue = storage.get("freeboardcopy");
          afterChildNode(val, fromValue);
        }
      },{
        name : "删除",
        onclick : function(e){
          var val = prop(el.parentNode, "_header");
          removeChildNode(val);
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
          var appendValue = prop(el, "_append"),
            fromValue = storage.get("freeboardcopy")
          pushChildNode(appendValue, fromValue);
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
          <div class = \"row\">\
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
        template : "<div>\
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
      <div class=\"row whole\" v-freeboardcontainer>\
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
      var cur = this;
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
          root = {
            children : options
          };
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
  var freeboardcontrol = {
    name : "free-board-control",
    template : "\
      <div class=\"free-board-control\" v-tools >\
        <column-editor v-setvalue=\"colData\" :colData=\"colData\">\
        </column-editor>\
          <div class=\"comp-tool\"\
            v-for=\"op in options\"\
            >\
          <span>{{op.title}}</span>\
          <div v-setvalue:header=\"op.data\" class='drag'>拖拽</div>\
        </div>\
      </div>",
    components : {
      "column-editor" : columnEditor
    },
    directives : {
      'tools' : tools,
      'setvalue' : setvalue
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
      return {
        colData : {
          type : "row",
          children : [{
            type : "col",
            colnum : 12,
            class: "col-xs-12",
            children : []
          }]
        }
      }
    },
    computed : {
      options : function(){
        var attr = this.attr("options"),
          options = this.parent().data(attr);
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
    Vue.prototype.getAttribute = function(name){
      var option = this.getComponent(),
        attr = getValue(option.props[name]);
      return attr;
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
    cmd.init();
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
  vueEditor.on = on;
  vueEditor.register = function(name, config, toTools){
    var props = (function(props){
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
    })(config.props), tool = {
      title : config.name,
      data : {
        type : name,
        props : props
      },
      propDefines : config.props,
      component : config.component
    };
    config.component && (config.component.name = "fb-" + name);
    config.component && (config.component.props = config.props);
    vueEditor.toolsMap = vueEditor.toolsMap || {};
    vueEditor.toolsMap[name] = tool;
    if(toTools !== false){
      vueEditor.tools = vueEditor.tools || [];
      vueEditor.tools.push(tool);
    }
  }
  vueEditor.register("row", {
    name : "栅格",
    props : [{
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