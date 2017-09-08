//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);

var vm=new Vue({
    el:'#demo',
    data:{
        viewDist:false,
        viewDetail:false,//是否展示分配详情
        table1:[
            {field:"orgName",text:"业务机构"},
            {field:"groupName",text:"业务组"},
            {field:"distributeUserName",text:"客户经理"},
            //{field:"supplierName",text:"供应商"},
            {field:"distributeAmount",text:"分配数量"},
            {field:"status",text:"签收状态",formater:'disStatus'}
        ],
        table2:[
            {field:"supplierName",text:"供应商"},
            {field:"productSpec",text:"规格型号"},
            {field:"productType",text:"产品类型",formater:'typeProduct'},
            {field:"imei",text:"IMEI"},
            {field:"sim",text:"SIM"},
            {field:"createTime",text:"区域入库时间"}
        ]
    },
    methods:{
        btnSearch: function(){
            $("#table1").bootstrapTable('refresh',{url:'...'})
        },
        modalSearch: function(){
            $("#table2").bootstrapTable('refresh',{url:'...'})
        },
        areaGet: function(e){
          var text = $(e.target).find("option:selected").html();
          var value = $(e.target).val();
          $("input[name=groupName]").val(text);
          if(value){
              $("#userList").getManager1(value,$("input[name=orgId]").val())
                  .on('change',function(){
                      var text=$(this).find("option:selected").text();
                      $("input[name=distributeUserName]").val(text)
                  })
          }else{
              $("#userList").html("<option value=''>--请选择--</option>")
          }
        },
        //分配设备
        distribution: function(){
            $("#disMode").modal('show');
            $(".disDetail").val(1);
            $("#userList").html("<option value=''>--请选择--</option>");
            $(".areaList1").html("<option value=''>--请选择--</option>");
            $(".areaList1").getGroupList1();
            $("#table2").bootstrapTable('refresh',{url:'...'});
        },
        allocation: function(){
            var distrData=$("#table2").bootstrapTable('getSelections');
            ids=distrData.map(function(row){
                return row.imei;
            });
            var newdistrData=distrData.concat($('#table3').bootstrapTable('getData'));
            var obj={},finalData=[];
            for(var i=0;i<newdistrData.length;i++){
                var o=newdistrData[i].imei;
                if(!obj[o]){
                    obj[o]=1;
                    finalData.push(newdistrData[i]);
                }
            }
            $("#table2").bootstrapTable('checkBy',{field:'imei',values:ids});
            $("#table3").bootstrapTable('load',finalData);
            $(".distributed").html(finalData.length);
        },
        confirm: function(){
            var confirmData=$("#table3").bootstrapTable('getData');
            var imeis=confirmData.map(function(row){
                return row.imei;
            });
            var sims=confirmData.map(function(row){
                return row.sim;
            });
            if(confirmData.length>0){
                //if(confirmData.length<=$("#approveAmount").html()){
                $("#userForm").validate();
                if($("#userForm").valid()==true){
                    comn.ajax({
                        url:interUrl.purchase.confirmToClerk,
                        data: $.extend($("#userForm").values(),{
                            imeis:imeis.join(","),
                            sims:sims.join(",")
                        }),
                        success:function(){
                            $("#disMode").modal('hide');
                            tip({
                                content:'设备分配成功'
                            });
                            $("#table1").bootstrapTable('refresh',{url:'...'})
                            $("#table3").bootstrapTable('load',[]);
                            $(".distributed").html(0);
                        }
                    });
                }
            }else{
                tip({
                    content:'请选择要分配的项目'
                })
            }



        }
    },
    ready:function(){
        $(".orgId").getSingleBranchComp(function(name,id){
            $(".areaList").getGroupList1();
            $("input[name=orgId]").val(id);
        });
        $(".supplier").getSpecificSupp();
    }
});
var ids,dataLoad1,dataLoad2,dataLoad3,equipment,equipmentAllocate,typeProduct,disStatus,handle,viewDetail;
//分配列表
dataLoad1=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,
            {
                orgId:$(".orgId").find("option:selected").val(),
                groupId:$(".areaList").find("option:selected").val()
            }
        ),
        interUrl.purchase.totalGps
    )
};
//产品类型 ： 1: 有线 2: 无线
typeProduct=function(value,row,index){
    return [null,"有线","无线"][value];
};
//签收状态 ： 0：未签收 1: 签收
disStatus=function(value,row,index){
    return ["未签收","已签收"][value];
};

//分配设备
dataLoad2=function(params){
    var p;
    p = params.data;
    if($(".disDetail").val()){
        tableData(
            params,
            $.extend($("#distributionForm").values(), p),
            interUrl.purchase.showDetail,
            function(res){
                //库存总数
                $("#total").html(res.totalItem);
                //可用库存
                $("#useAble").html(res.totalItem);

                $("#table2").bootstrapTable('checkBy',{field:'imei',values:ids})

            }
        );
    }
};

//分配详情
dataLoad3 = function(params){
    var p;
    p = params.data;
    if(vm.viewDetail){
        tableData(
            params,
            $.extend({distributeNo:$('input[name=distributeNo]').val()},p),
            interUrl.purchase.confirmToClerkDetail
        )
    }

};
handle = function(){
    return ['<button type="button" class="btn btn-primary btn-xs view">查看详情</button>']
};
equipment=function(){
    return ['<button class="btn btn-primary btn-xs del">&nbsp;删&nbsp;除&nbsp;</button>'].join("");
};
equipmentAllocate={
    "click .del": function(e,a,item,index){
        var items=[];
        items.push(item.imei);
        ids=ids.filter(function(ele){
            return ele !=item.imei;
        });
        $("#table3").bootstrapTable('remove',{field:'imei',values:items});
        $("#table2").bootstrapTable('uncheckBy',{field:'imei',values:items});
        $(".distributed").html($("#table3").bootstrapTable('getData').length);
    }
};
viewDetail = {
  "click .view": function(e,a,item,index){
      vm.viewDetail=true;
      $('input[name=distributeNo]').val(item.distributeNo);
      $("#detailTable").bootstrapTable('refresh',{url:'...'});
      vm.$nextTick(function(){
          window.scrollTo(40,600);
      })
  }
};
$("#table3").bootstrapTable({
    'clickToSelect':false,
    "height":320,
    "classes": "table-striped table-hover table"
});
