import mapchart from "./vue/mapchart.vue";
import search from "./vue/search.vue";
import selectlist from "./vue/selectlist.vue";
import text from "./vue/text.vue";
var comps = {};
comps.install = function(Veditor){
  Veditor.register("mapchart", mapchart);
  Veditor.register("search", search);
  Veditor.register("selectlist", selectlist);
  Veditor.register("text", text);
};
window.comps = comps;
