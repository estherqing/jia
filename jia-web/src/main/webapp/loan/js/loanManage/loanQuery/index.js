var dataLoad_1, handle, tableEvent,payStatus;

dataLoad_1 = function (params) {
    var p;
    p = params.data;
    tableData( //查询列表
        params,
        $.extend($("#searchForm").values(), p),
        interUrl.mockList || interUrl.gr.loanInfoList
    );
};
tableEvent = {
    "click .info": function (e, a, item, index) {
        var type;
        if(item.loanType == 5){
            type = 'ownersStaging';
        }
        //影像管理传 id的值（即projectId, 已和文林确认）
        return comn.addTab({
            title: "贷款详情",
            href: "./Modal/customManage/customer/loanDetail.html?id=" + item.projectId + "&loanApplyId=" + item.relativeApplyId1 + "&businessTypeCode=" + item.flowType + "&projectId=" + item.projectId + "&space=LOAN&releventFlowNode=LOAN_QUERY&releventFlow=LOAN_QUERY" + "&loanFlag=1&type=" + type
        })
    },
    "click .pay": function (e, a, item, index) {
        return comn.addTab({
            title: "付款详情",
            href: "./Modal/task/myTask/transaction.html?&customerName="+item.customerName+'&projectNo='+item.projectNo+'&loanApplyId='+item.relativeApplyId1
        });
    }
};
handle = function (value, row, index) {
    var pay;
    if(row.id){
        pay='<li><a href="javascript:;" class="pay">查看付款详情</a></li>'
    };
    return ['<div class="dropdown">',
        '<button class="btn btn-primary btn-xs dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">操作',
        '<span class="caret"></span>',
        '</button>',
        '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">',
        '<li><a href="javascript:;" class="info">查看贷款详情</a></li>',
        pay,
        '</ul>',
        '</div>'].join("");
};
payStatus = function(value,row,index){
    // return ['','人工付款','付款中','已付款'][value]
    return ['--','付款中','付款成功','付款失败','人工付款'][value]
}
$(function () {
    $("#lauchOrgId").getOrg(); //机构
    $("#loanType").on('change',function(){
        var val = $(this).val();
        if(val){
           $("#status").getLoanFlowStatusList(val); //贷款状态
        }else{
           $("#status").html('<option value="">--请选择--</option>')
        }

    });
    //搜索列表
    $("#btn-search-query").click(function () {
        $("#table").bootstrapTable("refresh", {url: "..."});
    });
});
