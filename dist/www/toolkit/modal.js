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
  var tostring = Object.prototype.toString,
    slice = Array.prototype.slice,
    shift = Array.prototype.shift,
    isFunction = isType("Function"),
    isArray = isType("Array"),
    isString = isType("String"),
    isObject = isType("Object"),
    events = {},
    items = {
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
    };
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
  function createItem(prop){
    return items[prop.type](prop);
  }
  function createProperties(title, properties, config){
    var events = {},
      values = [],
      fragement = createDocumentFragment(),
      cover = createElement("div", null, "modal-cover", null),
      modal = createElement("div", null, "fb-modal", null),
      table = createElement("div", null, "prop-table", null),
      titledom = createElement("div", null, "title", null),
      submit = createElement("button", null, "submit", null),
      tools = [];
    config = config || {};
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
      if(config.dirtycheck){
        tools.some(function(t){return t.isDirty()}) ?
          events["submit"] && events["submit"](rs) :
          events["close"] && events["close"](e);
      } else {
        events["submit"] && events["submit"](rs);
      }
      destroy();
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
      title.innerText = property.title;
      addClass(tr, "tr");
      addClass(title, "td-title");
      addClass(content, "td-content");
      values.push(["input", tool]);
      tr.appendChild(title);
      tr.appendChild(content);
      table.appendChild(tr);
    })
    document.body.appendChild(fragement);
    function destroy(){
      each(tools, function(t){
        t.destroy();
      })
      cover.remove();
      titledom = null;
      cover = null;
      modal = null;
      submit = null;
    }
    return {
      on : function(eventname, callback){
        events[eventname] = callback;
      },
      destroy : destroy
    }
  }
  return {
    createProperties : createProperties
  };
})