<template>

    <div>

        <div style='width:600px;margin:0 auto'>
              
              <div>
                 <ul class='tag-box'>
                    <li  @click='handleClick(1)'>全部</li>
                    <li  @click='handleClick(2)'>企业名</li>
                    <li  @click=handleClick(3)>股东</li>
                    <li  @click=handleClick(4)>法人</li>
                 </ul> 
              </div>

              <div class="form-group">
                  <input class="form-control" type="text" :placeholder="phd" style="width:500px;display:inline-block">
                  <button type="button" class="btn btn-info">搜索</button>
              </div>
              <div class="form-group">
               
                <ul class='search-keyword-box'>
                    <li class='search-keyword-item bg1'>华为</li>
                    <li class='search-keyword-item bg2'>小米</li>
                    <li class='search-keyword-item bg3'>百度</li>
                    <li class='search-keyword-item bg4'>腾讯</li>
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
    }],
    data(){
           return {
             phd:'请输入企业名，人名，产品名或其他关键字'
           }
    },
    methods:{
           handleClick(num){
             console.log(111)
             switch (num){
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
.tag-box{
    overflow: hidden;
    margin-bottom: 10px;
    width : auto;
    margin : auto;
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


