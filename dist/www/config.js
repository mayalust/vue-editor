import test from "./vue/test.vue";
var comps = {};
comps.install = function(Veditor){
  Veditor.register("test", test);
};
window.comps = comps;
