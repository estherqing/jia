//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);

var vm = new Vue({
    el:"#stockDetail",
    data:{
        table:[
            {field:'supplierName',text:'供应商'},
            {field:'productSpec',text:'规格型号'},
            {field:'productType',text:'产品类型',formater:'typeProduct'},
            {field:'imei',text:'IMEI'},
            {field:'sim',text:'SIM'},
            {field:'createTime',text:'入库时间'}
        ],
        pageType:3
    },
    methods:{
        btnSearch: function(){
            $("#table").bootstrapTable('refresh',{url:'...'})
        },
        //areaChoose: function(e){
        //    $("#userList").html("<option value=''>--请选择--</option>");
        //    var value = $(e.target).find("option:selected").val();
        //    if(value){
        //        $("#areaList").getGroupList(value);
        //    }else{
        //        $("#areaList").html("<option value=''>--请选择--</option>");
        //    }
        //},
        groupGet: function(e){
            var value = $(e.target).find("option:selected").val();
            if(value){
                $("#userList").getManager1(value);
            }else{
                $("#userList").html("<option value=''>--请选择--</option>");
            }
        },
        reset: function(){
            $("#areaList").html("<option value=''>--请选择--</option>");
        },
        confirm: function(){
            $("#deviceForm").validate();
            if($("#deviceForm").valid()==true){
                comn.ajax({
                    url:interUrl.purchase.deviceProcess,
                    data: $.extend({pageType:args['pageType']},$("#deviceForm").values()),
                    success: function(res){
                        $("#dealMode").modal('hide');
                        $("#table").bootstrapTable('refresh',{url:'...'})
                    }
                })
            }
        }
    },
    ready: function(){
        var args=comn.getArgs();
        this.pageType=args['pageType'];
        $("#orgId").getSingleBranchComp(function(name,id){
            $("#areaList").getGroupList1();
            $("input[name=orgId]").val(id);
        });
        $("#supplier").getSpecificSupp();
    }
});
var dataLoad,handle,events,typeProduct;
var args=comn.getArgs();
dataLoad=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,{pageType:args['pageType']}),
        interUrl.purchase.gpsRefund
    )
};
handle = function(value,row,index){
    if(row.status==7){
        return ['<button class="btn btn-success btn-xs" disabled="disabled">设备处理中</button>']
    }else{
        return ['<button class="btn btn-primary btn-xs deal">设备处理</button>']
    }

};
tableEvent={
  "click .deal": function(e,a,item,index){
      $("#dealMode").modal('show');
      $("#deviceForm").values(item);
      //comn.ajax({
      //    url:interUrl.purchase.doDevice,
      //    data:{
      //        imei:item.imei,
      //        sim:item.sim,
      //        pageType:args['pageType']
      //    },
      //    success: function(){
      //        $("#dealMode").modal('show');
      //        $("#deviceForm").values(item);
      //    }
      //})
  }
};
//产品类型
typeProduct = function(value,row,index){
   return [null,"有线","无线"][value];
};
