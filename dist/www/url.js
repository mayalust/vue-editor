function urlparse(){
  var url = window.location.href,
    hashpoint = url.indexOf("#"),
    main = hashpoint === -1 ? url : url.substring(0, hashpoint),
    hash = hashpoint === -1 ? "" : url.substring(hashpoint),
    mainarr = main.split("?"),
    params = stringToParam(mainarr[1]),
    originpath = mainarr[0];
  function stringToParam(str){
    var arr, rs = {};
    if(typeof str === "string"){
      arr = str.split("&")
      for(var i = 0; i < arr.length; i++){
        var tmp = arr[i].split("=")
        rs[tmp[0]] = tmp[1];
      }
    }
    return rs;
  }
  return {
    originpath : originpath,
    param : params,
    hash : hash
  }
}