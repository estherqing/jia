//注册组件
Vue.component('v-input',vueComponent.inputComponent);
Vue.component('v-table',vueComponent.tableComp);
Vue.component('v-select',vueComponent.selectComp);
var vm=new Vue({
    el:'#gps',
    data:{
        table1:[
            {field:'orgName',text:'业务机构'},
            {field:'groupName',text:'业务组'},
            {field:'distributeUserName',text:'客户经理'},
            //{field:'supplierName',text:'供应商'},
            {field:'distributeAmount',text:'分配数量'},
            {field:'status',text:'签收状态',formater:'disStatus'},
            {formater:'handle1',events:'tableEvent1'}
        ],
        table2:[
            {field:'customerName',text:'客户名称'},
            {field:'cardNo',text:'身份证号'},
            {field:'carInfo',text:'车辆信息'},
            {field:'billingPrice',text:'开票价'},
            {field:'orgName',text:'业务机构'},
            {field:'groupName',text:'业务组'},
            //{field:'count',text:'GPS安装数'},
            {field:'wiredCount',text:'有线'},
            {field:'wirelessCount',text:'无线'},
            {field:'status',text:'安装状态',formater:'installStatus'},
            {formater:'handle2',events:'tableEvent2'}
        ],
        table3:[
            {field:'supplierName',text:'供应商'},
            {field:'productSpec',text:'规格型号'},
            {field:'productType',text:'产品类型',formater:'typeProduct'},
            {field:'price',text:'入库价格'},
            {field:'imei',text:'IMEI'},
            {field:'sim',text:'SIM'},
            {field:'stockTimeClerk',text:'签收时间'}
        ],
        installStatus:false,
        viewDist:false
    },
    methods: {
        btnSearch: function () {
            var table = $('.tab-pane.active').find('table').eq(1).attr('id');
            $("#" + table).bootstrapTable('refresh', {url: '...'});
        },
        signUp: function(){
            this.installStatus=false;
            $("#table1").bootstrapTable('refresh',{url:'...'});
        },
        install: function(){
            this.installStatus=true;
            $("#table2").bootstrapTable('refresh',{url:'...'})
        }
    },
    ready: function(){
        $("#supplier").getSpecificSupp();
    },
    watch: {
        installStatus:function(){
            if(this.installStatus==false){
                $("#supplier").getSpecificSupp();
            }
        }
    }
});

var handle1,tableEvent1,handle2,tableEvent2,dataLoad1,dataLoad2,dataLoad3,installStatus,disStatus,typeProduct;
//设备签收
dataLoad1=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p),
        interUrl.purchase.distributeList
    )
};
handle1=function(value,row,index){
    if(row.status==0){
        return ['<button class="btn btn-primary btn-xs apply">&nbsp;签&nbsp;收&nbsp;</button>'].join("")
    }else{
        return "";
    }
};
tableEvent1={
    "click .apply":function(e,a,item,index){
        comn.ajax({
            url:interUrl.purchase.distributeDetailUpdate,
            data:{
                distributeId:item.id
            },
            success:function(){
                tip({
                    content:'签收成功'
                });
                vm.viewList=false;
                $("#table1").bootstrapTable('refresh',{url:'...'});
                $("#table3").bootstrapTable("refresh",{url:'...'});
            }
        })
    }
};
disStatus = function(value,row,index){
    return ['未签收','已签收'][value]
};
$("#table1").on('click-row.bs.table',function(a,row){
    $(".viewList").val(row.distributeNo);
    $("#table3").bootstrapTable("refresh",{url:'...'});
    //Vue.nextTick(function(){
    //    window.scrollTo(47,700);
    //})
});
//设备安装
dataLoad2=function(params){
    var p;
    p = params.data;
    tableData(
        params,
        $.extend($("#searchForm").values(), p),
        //interUrl.myTask.paymentList
        interUrl.purchase.gpsInstallList
    )
};
handle2=function(value,row,index){
    if(row.status==0){
        return ['<button class="btn btn-primary btn-xs installGps">设备安装</button>'].join("")
    }else{
        return "";
    }
};
tableEvent2={
    'click .installGps':function(e,a,item,index){
        //comn.ajax({
        //    url:interUrl.purchase.insertGpsInstall,
        //    data: $.extend({},item),
        //    success:function(){
                comn.addTab({
                    title:"设备安装",
                    href:"./Modal/stockManage/installedGps/install.html?orgId="+item.orgId+"&projectId="+item.projectId
                })
        //    }
        //})

    }
};
installStatus= function(value,row,index){
    return ["待安装","已安装"][value];
};
//GPS详情列表
dataLoad3=function(params){
    var p;
    p = params.data;
    if($(".viewList").val()){
        vm.viewDist=true;
        tableData(
            params,
            $.extend({distributeNo:$(".viewList").val()}, p),
            interUrl.purchase.distributeDetail
        )
    }

};
typeProduct = function(value,row,index){
    return [null,'有线','无线'][value]
}

$("#table1").bootstrapTable({
    "pagination": true,
    "sidePagination": "server",
    "clickToSelect": true,
    "height": "300"
});