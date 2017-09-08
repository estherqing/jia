//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);

var vm=new Vue({
  el:"#install",
  data:{
    table1:[
      {field:'supplierName',text:'供应商'},
      {field:'productSpec',text:'规格型号'},
      {field:'productType',text:'产品类型',formater:'typeProduct'},
      {field:'imei',text:'IMEI'},
      {field:'sim',text:'SIM'},
      {field:'modifyTime',text:'签收时间'}
    ],
    imgSrc:[],
    gpsData:[],
    installProductId:0,
    imei:0,
    index:'',
    imgId: 0
  },
  methods:{
    allocation: function(){
      var gpData=$("#table1").bootstrapTable('getSelections');
      this.gpsData=gpData;
    },
    delete: function(id){
      this.gpsData=this.gpsData.filter(function(ele,index){
        return ele.id != id;
      });
    },
    btnSearch: function(){
      $("#table1").bootstrapTable('refresh',{url:'...'})
    },
    imgUp: function(id,index){
      this.index=index;
      this.imei=id;
      $("#upImageInput").trigger('click');
    },
    //上传图片
    imgGet: function(){
      var _this=this;
      _this.imgId += 1;
      var file= event.target.files[0];
      var typeImg = function(file){
        var index = file.name.indexOf('.');
        var imgType = file.name.substr(index);
        var reg = /^\.jpg|png|.JPG|.PNG$/;
        if(reg.test(imgType)){
          lrz(file)
            .then(function(rst){
              var imgRst=rst.base64;
              var arr={};
              var args = comn.getArgs();
              arr = {
                imei:_this.imei,
                imageName:file.name,
                imagePath:imgRst,
                imgId: _this.imgId,
                projectId:args['projectId'],
                position:$(".position")[_this.index].value
              };
              _this.imgSrc.push(arr);
            })
        }else{
          tip({
            content:'图片上传只支持jpg/png格式'
          })
        };
      };
      typeImg(file);

    },
    //删除图片
    imgDelete: function(id){
      var _this=this;
      _this.imgSrc=_this.imgSrc.filter(function(ele){
        return ele.imgId != id;
      });
      tip({
        content:'图片删除成功'
      });
    },
    back: function(){
      comn.closeTab();
    },
    //确认安装
    confirm: function(){
      var _this=this;
      var args = comn.getArgs();
      $("#imgSrc").validate();
      if($("#imgSrc").valid()){
        for(var i= 0;i<$(".position").length;i++){
          _this.gpsData[i]['position']=$(".position")[i].value;
        };
        var imeis=_this.imgSrc.map(function(ele,index){
          return ele.imei
        });
        function unique(arr){
          var newArr=[];
          var obj={};
          for(var i=0;i<arr.length;i++){
            if(!obj[arr[i]]){
              obj[arr[i]]=1;
              newArr.push(arr[i])
            }
          }
          return newArr;
        }
        unique(imeis);
        if(_this.gpsData.length>0){
          if(unique(imeis).length==_this.gpsData.length){
            var imgUp = new Promise(function(resolve,reject){
              comn.ajax({
                url:interUrl.purchase.uploadFile,
                data:{
                  data: JSON.stringify(_this.imgSrc)
                },
                success:function(res){
                  resolve();
                }
              });
            });
            imgUp.then(function(){
              comn.ajax({
                url:interUrl.purchase.gpsInstall,
                data:{
                  date:JSON.stringify(_this.gpsData),
                  projectId:args['projectId']
                },
                success:function(res){
                  tip({
                    content:'GPS安装成功'
                  });
                  comn.closeTab();
                }
              })
            })
          }else{
            tip({
              content:'请上传gps安装照片'
            })
          }
        }else{
          tip({
            content:'请选择要安装的设备'
          })
        }
      }

    },
    reset: function(){
      debugger;
      var args = comn.getArgs();
      Vue.nextTick(function(){
        $("#orgId").getOrg(args['orgId']);
        $("input[name=productType]").val("");
        $("#productType").attr("disabled",false);
        $("#spec").html("<option value=''>--请选择--</option>");
      })

    }
  },
  watch: {
    imgSrc: function () {
      var pictures = document.getElementById('imgSrc');
      var options = {
        url: 'data-src',
        title: true,
        transition: false,
        fullscreen: false,
        build: function (e) {
        },
        built: function (e) {
        },
        show: function (e) {
          window.parent.toggleTopNav();
        },
        hide: function (e) {
          window.parent.toggleTopNav();
        }
      };
      viewer = new Viewer(pictures, options);
    }
  },
  ready: function(){
    var args = comn.getArgs();
    $("input[name=orgId]").val(args['orgId']);
    $("#orgId").getOrg(args['orgId']);
    $("#supplier").getSpecificSupp();
  }
});
var dataLoad1,typeProduct;
//安装详情列表
dataLoad1=function(params){
  var p;
  p = params.data;
  tableData(
    params,
    $.extend($("#installForm").values(), p),
    interUrl.purchase.stocklist
  )
};
typeProduct = function(value,row,index){
  return [null,'有线','无线'][value];
};
$("#supplier").on("change",function(){
  var $productType=$("#productType");
  $productType.val('').attr("disabled",false);
  $("input[name=productType]").val("");
  if($(this).val()){
    $("#spec").getProductSpec($(this).val())
      .on('change',function(){
        var type=$(this).find("option:selected").attr('data-type');
        $productType.val(type).attr("disabled",true);
        $("input[name=productType]").val(type);
      });
  }else{
    $("#spec").html("<option value=''>--请选择--</option>");
  }
});

