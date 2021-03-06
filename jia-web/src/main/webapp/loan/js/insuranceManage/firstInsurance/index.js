/**
 * Created by hyb on 15/12/31.
 */
var table_1, table_2,handle_1, handle_2, tableEvent_1, tableEvent_2;

//待登记
table_1 = function(params) {
    var p = params.data;
    p['status'] = 1;
    return comn.ajax({
        url: interUrl.insurance.loanInsuranceList,
        data: $.extend($("#loanInsuranceForm").values(),p),
        success: function(res) {
            params.success({
                'total': res.totalItem,
                rows: res.data
            });
            return params.complete();
        }
    });
};

handle_1 = function(value, row, index) {
    return ["<div class='btn-group btn-group-xs'>", "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>操作", "<span class='caret'></span>", "<span class='sr-only'>下拉切换</span>", "</button>", "<ul class='dropdown-menu' role='menu'>","<li><a class='edit'>首保信息录入</a></li>" , "<li><a class='info'>查看贷款详情</a></li>", "</ul>", "</div>"].join("");
};

handle_3 = function(value, row, index) {
    return value+"+"+row.carMakeName+"+"+row.carModelName;
};


tableEvent_1 = {
    "click .edit": function(e, a, item, index) {
        comn.cache.insuranceStatus = item.premiumType;
        comn.cache.bankName = item.coBankName;
        return comn.addTab({
            href:'./Modal/insuranceManage/firstInsurance/insuranceInfo.html?projectId='+a+"&predictedPurchasetax="+item['predictedPurchasetax'],
            title: '首保信息录入'
        })
    },
    "click .info": function(e, a, item, index) {
        return comn.addTab({
            href: "./Modal/customManage/customer/loanDetail.html?id="+item.projectId+"&loanApplyId="+item.relativeApplyId1+"&businessTypeCode=" + item.flowType+"&projectId="+item.projectId+"&space=LOAN&releventFlowNode=LOAN_QUERY&releventFlow=LOAN_QUERY",
            title: '查看贷款项目'
        })
    }

};


//已登记
table_2 = function(params) {
    var p = params.data;
    p['status'] = 2;
    return comn.ajax({
        url: interUrl.insurance.loanInsuranceList,
        data: $.extend($("#loanInsuranceForm").values(), p),
        success: function(res) {
            params.success({
                'total': res.totalItem,
                rows: res.data
            });
            return params.complete();
        }
    });
};


handle_2 = function(value, row, index) {
    return ["<a class='modify' href='javascript:;'>修改</a>"].join("");
};

tableEvent_2 = {
    "click .modify": function(e, a, item, index) {
		comn.cache.insuranceStatus = item.premiumType;
		comn.cache.bankName = item.coBankName;
        return comn.addTab({
            title:"修改保单",
            href:'./Modal/insuranceManage/firstInsurance/insuranceInfo.html?projectId='+a+"&predictedPurchasetax="+item['predictedPurchasetax']
        })
    }
};
//查询列表
$("#btn-search").click(function() {
    var activeTab=$(".tab-content").find(".tab-pane.active").attr("id");
    if(activeTab=="todo"){
        $("#table1").bootstrapTable("refresh", {url: "..."});
    }else if(activeTab=="done"){
        $("#table2").bootstrapTable("refresh", {url: "..."});
    }
});



