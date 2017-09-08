//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);

var vm = new Vue({
    el:'#stockBack',
    data:{
        table:[
            {field:'createTime',text:'退回日期'},
            {field:'refundSource',text:'退回来源'},
            {field:'refundName',text:'退回人'},
            {field:'refundType',text:'退回原因',formater:'typeRefund'},
            {field:'supplierName',text:'供应商'},
            {field:'productSpec',text:'规格型号'},
            {field:'productType',text:'产品类型',formater:'typeProduct'},
            {field:'imei',text:'IMEI'},
            {field:'sim',text:'SIM'},
            {field:'status',text:'确认状态',formater:'confirmStatus'},
            {field:'remark',text:'备注'}
        ],
        toConfirm: true
    },
    methods:{
        btnSearch: function(){
            var table = $('.tab-pane.active').find('table').eq(1).attr('id');
            $("#" + table).bootstrapTable('refresh', {url: '...'});
        },
        confirm: function(){
            var data=$("#table1").bootstrapTable("getSelections");
            if(data.length>0){
                comn.ajax({
                    url:interUrl.purchase.confirmRefund,
                    data:{
                        data:JSON.stringify(data),
                        pageType:args['pageType']
                    },
                    success: function(){
                        $("#table1").bootstrapTable('refresh',{url:'...'});
                        $("#table2").bootstrapTable('refresh',{url:'...'});
                    }
                })
            }else{
                tip({
                    content:'请选择要退回的数据'
                })
            }

        },
        areaChoose: function(e){
            var value = $(e.target).find("option:selected").val();
            if(value){
                $("#areaList").getGroupList(value);
            }else{
                $("#areaList").html("<option value=''>--请选择--</option>");
            }
        },
        reset: function(){
            $("#areaList").html("<option value=''>--请选择--</option>");
        },
        isVerify: function(e){
            var verity = e.target.innerHTML;
            if(verity=="未确认"){
                this.toConfirm=true;
            }else if(verity=="已确认"){
                this.toConfirm=false;
            }

        }
    },
    ready: function(){
        //$("#orgId").getOrg();
        $("#orgId").getSingleBranchComp(function(name,id){
            $("#areaList").getGroupList1();
            $("input[name=orgId]").val(id);
        });
        $("#supplier").getSpecificSupp();
    }
});

var dataLoad1,typeProduct,confirmStatus,dataLoad2,typeRefund;
var args=comn.getArgs();
//未确认
dataLoad1=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,{mark:0,pageType:args['pageType']}),
        interUrl.purchase.confirmRefundData
    )
};
//产品类型
typeProduct = function(value,row,index){
    return [null,'有线','无线'][value];
};
//确认状态
confirmStatus = function(value,row,index){
  return ['区域未确认','区域已确认','分公司未确认','分公司确认'][value];
};
//退回原因
typeRefund = function(value,row,index){
    return [null,'设备维修','设备丢失','设备返库'][value]
};

//已确认
dataLoad2=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p,{mark:1,pageType:args['pageType']}),
        interUrl.purchase.confirmRefundData
    )
};