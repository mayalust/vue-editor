#!/usr/bin/env node
const bodyParser = require('body-parser'),
  fs = require("fs"),
  pathLib = require("path"),
  express = require("express"),
  ejs = require("ejs"),
  url = require("url"),
  app = express(),
  tostring = Object.prototype.toString,
  slice = [].slice,
  shift = [].shift,
  filtree = require("./filetree"),
  isFunction = isType("Function"),
  isArray = isType("Array"),
  isString = isType("String"),
  isObject = isType("Object")
function isType(type){
  return function(obj){
    return tostring.call(obj) == "[object " + type + "]" && obj === obj;
  }
}
function payload(req, res, next){
  let rs = "";
  req.on("data", (d) => {
    rs += d;
  })
  req.on("end", (d) => {
    req.payload = rs;
    next();
  })
}
function plainClone(obj){
  var queue = [], result, exclude = ["parent", "root"];
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
app.use(payload);
app.use(express.static(pathLib.join(__dirname , 'www')));
app.use(express.static(pathLib.join(__dirname , '../node_modules')));
app.use(bodyParser.json());
/** set up view engine*/
app.set("views", pathLib.join(__dirname , 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html')
/** set up view engine*/

app.get("/edit", (req, res) => {
  res.render("index");
  res.end();
});
app.get("/preview", (req, res) => {
  res.render("preview");
  res.end();
});
app.post("/api/savelayout/:viewId", (req, res) => {
  let viewId = req.params.viewId, returnData, savepath;
  viewId = viewId || uuid();
  savepath = pathLib.join(__dirname, "json/layout/view_" + viewId + ".json");
  fs.writeFile(savepath, JSON.parse(req.payload), (err) => {
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    if(!err){
      returnData = {
        code : 0,
        msg : "保存文件成功",
        data : JSON.parse(req.payload)
      }
    } else {
      returnData = {
        code : 502,
        msg : "保存文件失败"
      }
    }
    res.write(JSON.stringify(returnData))
    res.end();
  })
});
app.post("/api/getlayout/:viewId", (req, res) => {
  let viewId = req.params.viewId, returnData,
  readpath = pathLib.join(__dirname, "json/layout/view_" + viewId + ".json");
  fs.readFile(readpath, (err, d) => {
    if(!err){
      returnData ={
        code : 0,
        msg : "文件读取成功",
        data : JSON.parse(d)
      }
    } else {
      returnData = {
        code : 502,
        msg : "文件读取失败"
      }
    }
    res.write(JSON.stringify(returnData));
    res.end();
  })
});
app.post("/api/getfiletree", (req, res) => {
  let tree = filtree(pathLib.join(__dirname, "json"));
  tree.on("start", (d) => {
    returnData = {
      code : 0,
      msg : null,
      data : plainClone(d)
    };
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.write(JSON.stringify(returnData));
    res.end();
  })
});
app.post("/api/createlayout/:viewId", (req, res) => {
  let tree = filtree(pathLib.join(__dirname, "json")),
    layout,
    viewId = req.params.viewId;
  tree.on("start", (d) => {
    layout = tree.findNode((n, i) => {
      return n.basename === "layout"
    });
    layout.write("view_" + viewId + ".json", "[]", (e) => {
      res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
      if(e.code == 0){
        returnData = {
          code : 0,
          msg : null,
          data : {}
        };
      } else {
        returnData = e;
      }
      res.write(JSON.stringify(returnData));
      res.end();
    });

  })
});
app.listen(9000);
console.log("设计器已启动，请访问localhost:9000")