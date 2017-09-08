//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);

var vm=new Vue({
    el:'#demo',
    data:{
        viewDist:false,
        table1:[
            {field:"applyOrgName",text:"业务机构"},
            {field:"groupName",text:"业务组"},
            {field:"applyDate",text:"申请日期"},
            {field:"applyUserName",text:"申领人"},
            {field:"supplierName",text:"供应商"},
            {field:"productSpec",text:"规格型号"},
            {field:"productType",text:"产品类型",formater:'typeProduct'},
            {field:"approveAmount",text:"同意申请数量"},
            {field:"count",text:"当前库存数量"}
        ],
        table2:[
            {field:"supplierName",text:"供应商"},
            {field:"productSpec",text:"规格型号"},
            {field:"productType",text:"产品类型",formater:'typeProduct'},
            {field:"imei",text:"IMEI"},
            {field:"sim",text:"SIM"},
            {field:"createTime",text:"分公司入库时间"}
        ],
        table3:[
            {field:"supplierName",text:"供应商"},
            {field:"productSpec",text:"规格型号"},
            {field:"productType",text:"产品类型",formater:'typeProduct'},
            {field:"imei",text:"IMEI"},
            {field:"sim",text:"SIM"},
            {field:"createTime",text:"分公司入库时间"}
        ]
    },
    methods:{
        btnSearch: function(){
            var table=$('.tab-pane.active').find('table').eq(1).attr('id');
            $("#"+table).bootstrapTable('refresh',{url:'...'});
        },
        modalSearch: function(){
            $("#table4").bootstrapTable('refresh',{url:'...'})
        },
        modalReset: function(){
          $("#modalImei").val('');
        },
        allocation: function(){
            var distrData=$("#table4").bootstrapTable('getSelections');
            ids=distrData.map(function(row){
                return row.id;
            });
            var newdistrData=distrData.concat($('#table5').bootstrapTable('getData'));
            var obj={},finalData=[];
            for(var i=0;i<newdistrData.length;i++){
                var o=newdistrData[i].id;
                if(!obj[o]){
                    obj[o]=1;
                    finalData.push(newdistrData[i]);
                }
            }
            $("#table4").bootstrapTable('checkBy',{field:'id',values:ids});
            $("#table5").bootstrapTable('load',finalData);
            $(".distributed").html(finalData.length);
        },
        toDis: function(){
            this.viewDist=false;
        },
        dised: function(){
            this.viewDist=false;
        },
        confirm: function(){
            var confirmData=$("#table5").bootstrapTable('getData');
            var imeis=confirmData.map(function(row){
                return row.imei;
            });
            var sims=confirmData.map(function(row){
                return row.sim;
            });
            if(confirmData.length>0){
                if(confirmData.length<=$("#approveAmount").html()){
                    comn.ajax({
                        url:interUrl.purchase.distribute,
                        data:{
                            imeis:imeis.join(","),
                            sims:sims.join(","),
                            applyNo:$("input[name=applyNo]").val(),
                            orgId:$("input[name=orgId]").val()
                        },
                        success:function(){
                            $("#disMode").modal('hide');
                            $("#table1, #table2").bootstrapTable('refresh',{url:'...'})
                        }
                    })
                }else{
                    tip({
                        content:'分配数量不能大于同意分配数量'
                    })
                }
            }else{
                tip({
                    content:'请选择要分配的项目'
                })
            }



        }
    },
    ready:function(){
        comn.ajax({
            url:interUrl.purchase.singleBranchComp,
            success:function(res){
                $("input[name=orgId]").val(res.data[0].id);
                $("#areaList").getGroupList(res.data[0].id);
                $("#orgId").html(((function() {
                    var results = [];
                    results.push("<option value='" + res.data[0].id + "'>" + res.data[0].name + "</option>");
                    return results;
                })()).join(""));
            }
        });
        $("#supplier").getSpecificSupp();
    }
});
var ids,handle1,tableEvent1,handle2,tableEvent2,dataLoad1,dataLoad2,dataLoad3,dataLoad4,handle5,tableEvent5,typeProduct;
//待分配
dataLoad1=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,{status:2}),
        interUrl.purchase.finishApplyStock
    )
};
handle1=function(value,row,index){
    return ['<button class="btn btn-primary btn-xs apply">申请单分配</button>'].join("")
};
tableEvent1={
    "click .apply":function(e,a,item,index){
        $("#disMode").modal('show');
        $("#table5").bootstrapTable("load",[]);
        $("#approveAmount").html(item.approveAmount);
        $("#useAble").html(item.count);
        $("#distributionForm").values(item);
        $("input[name=orgName]").val(item.applyOrgName);
        $("#table4").bootstrapTable('refresh',{url:'...'});
        comn.ajax({
            url:interUrl.purchase.comapnyStock,
            data:{orgId:item.applyOrgId},
            success:function(res){
                $("#total").html(res);
            }
        })
    }
};
//产品类型 ： 1：有限 2 无线
typeProduct=function(value,row,index){
    return [null,"有线","无线"][value];
};
//已分配
dataLoad2=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,{status:4}),
        interUrl.purchase.finishApplyStock
    )
};
handle2=function(){
    return ['<button class="btn btn-primary btn-xs viewDetail">查看详情</button>'].join("")
};
tableEvent2={
    'click .viewDetail':function(e,a,item,index){
        $(".viewList").val(item.applyOrgId);
        $(".applyNo").val(item.applyNo);
        vm.viewDist=true;
        $("#table3").bootstrapTable("refresh",{url:'...'});
    }
};
//分配详情
dataLoad3=function(params){
    var p;
    p = params.data;
    if($(".applyNo").val()){
        tableData(
            params,
            $.extend({orgId:$('.viewList').val(),applyNo:$(".applyNo").val()}, p),
            interUrl.purchase.detail
            //function(){
            //    $("#table4").bootstrapTable('checkBy',{field:'id',values:ids})
            //}
        )
    }

};
//分配设备
dataLoad4=function(params){
    var p;
    p = params.data;
    if($("input[name=orgName]").val()){
        tableData(
            params,
            $.extend($("#distributionForm").values(), p),
            interUrl.purchase.applyDanStock,
            function(){
                $("#table4").bootstrapTable('checkBy',{field:'id',values:ids})
            }
        )
    }
};

//待分配结果
handle5=function(){
    return ['<a href="javascript:;" class="del">删除</a>'].join("");
};
tableEvent5={
    "click .del": function(e,a,item,index){
        var items=[];
        items.push(item.id);
        ids=ids.filter(function(ele){
            return ele !=item.id;
        });
        $("#table5").bootstrapTable('remove',{field:'id',values:items});
        $("#table4").bootstrapTable('uncheckBy',{field:'id',values:items});
        $(".distributed").html($("#table5").bootstrapTable('getData').length);
    }
};
$("#table5").bootstrapTable({
    'clickToSelect':false,
    "height":320,
    "classes": "table-striped table-hover table"
});
