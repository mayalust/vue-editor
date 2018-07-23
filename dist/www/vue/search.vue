<template>

  <div>

    <div>

      <div>
        <ul class='tag-box'>
          <li  @click='handleClick(key)' v-for="(item, key) in searchsort">{{item}}</li>
        </ul>
      </div>

      <div class="form-group search">
        <div class="search-input">
          <input class="form-control" type="text" :placeholder="phd"/>
        </div>
        <button type="button" class="search-submit">搜索</button>
      </div>
      <div class="form-group">

        <ul class='search-keyword-box'>
          <li class='search-keyword-item' v-bind:class="cls(key)" v-for="(item, key) in searchsort">{{item}}</li>
        </ul>

      </div>
    </div>

  </div>

</template>

<script>
  export default {
    title:'搜索框组件',
    properties:[{
      'title':'年份',
      'type':'select',
      'name':'time',
      'default':'2018',
      'options':[
        ['2018', '2018'],
        ['2018', '2017'],
        ['2018', '2016']
      ]
    },
      {
        'title': '地区',
        'type': 'select',
        'name': 'area',
        'default': 'bj',
        'options': [
          ['bj', '北京'],
          ['sh', '上海'],
          ['hz', '杭州']
        ]
      }, {
        'title': '搜索分类',
        'type': 'input',
        'name': 'searchsort',
        'default': '[华为,小米,百度,腾讯]'
      }, {
        'title': '快捷按钮',
        'type': 'input',
        'name': 'quicksearch',
        'default': '[华为,小米,百度,腾讯]'
      }],
    computed : {
      searchsort : function(){
        return this.getAttribute("searchsort");
      },
      quicksearch : function(){
        return this.getAttribute("quicksearch");
      }
    },
    data(){
      return {
        phd:'请输入企业名，人名，产品名或其他关键字'
      }
    },
    methods:{
      cls(num){
        console.log(num);
        return "bg" + ((num - 0) % 4 + 1);
      },
      handleClick(num){
        switch (num - 0 + 1){
          case 1 :this.phd='请输入企业名，人名，产品名或其他关键字';
            break;
          case 2 :this.phd='请输入企业名关键字';
            break;
          case 3: this.phd='请输入股东名称';
            break;
          case 4 :this.phd='请输入法人名称';
            break;
        }
      }
    }
  }
</script>


<style scoped>
  .whole {

  }
  .search{
    position : relative;
    height : 30px;
  }
  .search .search-input{
    left : 20px; right:20px;
    position : absolute;
  }
  .search .search-input input{
    border-radius : 15px;
  }
  .search .search-submit{
    position : absolute;
    top : 5px;
    right : 30px;
  }
  .tag-box{
    overflow: hidden;
    padding : 0;
    margin-bottom: 10px;
    width : auto;
    margin : auto;
    display : inline-block;
  }
  .tag-box:after{
    content : "";
    display : block;
    clear : both;
    height : 1px;
  }
  .tag-box li {
    cursor : pointer;
    color: #7ed2ff;
    list-style: none;
    float:left;
    margin-left:10px;
  }

  .search-keyword-box{
    padding : 0;
    display : inline-block;
    overflow: hidden;
  }
  .search-keyword-item{
    cursor : pointer;
    list-style: none;
    border-radius: 10px;
    color: #fff;
    float: left;
    font-size: 12px;
    line-height: 1.8rem;
    margin-left:20px;
    text-align: center;
    width: 50px

  }

  .bg1{
    background-color: rgb(29, 197, 208)
  }

  .bg2{
    background-color: rgb(238, 133, 156);
  }

  .bg3{
    background-color: rgb(223, 186, 108);
  }

  .bg4 {
    background-color: rgb(38, 182, 255);
  }



</style>


