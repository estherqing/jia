var savePur, setButtonStatus, g_isModify = false, _orgCompany, _orgNameCompany, returnStatus;
$(".orgIdSelect").getSingleBranchComp(function(a, b){
    $(".orgId").val(b);
    _orgNameCompany = a;
    _orgCompany = b;
    dataLoad_1 = function(params) {
        return tableData(params, $.extend($("#searchForm").values(),{stockStatusCompany: 2}), interUrl.purchase.list);
    };
    dataLoad_2 = function(params) {
        return tableData(params, $.extend($("#searchForm").values(),{stockStatusCompany: 1}), interUrl.purchase.list);
    };
    //返修单号
    dataLoad_5 = function(params) {
        tableData(params, {
            orgId: $('#orgIdNum').val(),
            orgName: $("#orgNameNum").val(),
            groupId: $("#groupId").val(),
            entryTimeStart: $("#entryTimeStartNum").val(),
            entryTimeEnd: $("#entryTimeEndNum").val()

        }, interUrl.purchase.repairNum);
    };
    $("#table1, #table2").bootstrapTable('refresh');
    $("#groupId").getGroupList($("#orgIdNum").val());
});

//修改表格统一配置参数
var tableConfig = {};
$.map(comn.table, function (v, k) {
    tableConfig[k] = v;
});
tableConfig['height'] = "300";
tableConfig['pagination'] = false;

var tableConfig1 = {};
$.map(comn.table, function (v, k) {
    tableConfig1[k] = v;
});
tableConfig1['height'] = "400";
tableConfig1['pagination'] = false;
var _dataSupp = {
    entryTimeStart : $("#entryTimeStart").val(),
    entryTimeEnd: $("#entryTimeEnd").val()
}
tableEvent_1 = {
    "click .del": function(e, a, item, index) {
        oppSureModal("是否确认提交");
        $("#sureOption").unbind("click").click(function () {
            //提交时先保存流程意见
            comn.ajax({
                url: interUrl.purchase.del,
                data: {
                    orgId: item.orgId,
                    supplierId: item.supplierId,
                    stockNo: item.stockNo,
                    stockStatusCompany: 2
                },
                success: function(res) {
                    $("#sureModal").modal("hide");
                    tip({ content: "删除成功"});
                    $("#table1").bootstrapTable('refresh');
                }
            })
        })

    }
};
handle_1 = function(value, row, index) {
    return ["<button type='button' class='btn btn-xs btn-primary del'>删除</button>"].join("");
};



handle_2 = function(value, row, index) {
    return ["<input type='radio' name='id' class='role' value='" + value + "'/>"].join("");
};
dataLoad_3 = function(params) {
    tableData(params, {orgId: _orgCompany}, interUrl.purchase.addStockList);
};
handle_3 = function(value, row, index) {
    return ["<button type='button' class='btn btn-xs btn-primary editSupp'>编辑</button>"].join("");
};
tableEvent_3 = {
    "click .editSupp": function(e, a, item, index) {
        $("#index").val(index);
        $("#addPurForm").values(item);
        g_isModify = true;
        setButtonStatus();
        $("#productSpec").getProductSpec(item.supplierId, item.productSpec)
    }
};

tableEvent_5 = {
    "click .choose": function (e, a, item, index) {
        $("#repairNum").modal("hide");
        $("#imei").val(item.imei);
        $("#sim").val(item.sim);
        $("#refundNo").val(item.refundNo);
    }
};

handle_5 = function (value, row, index) {
    return ["<a class='choose' href='javascript:;'>选择</a>"].join("");
};
//$("#table3").bootstrapTable(tableConfig);
$("#table_5").bootstrapTable(tableConfig1);
dataLoad_4 = function(params) {
    //tableData(params, $.extend(_dataSupp,{orgId:row.orgId, supplierId: row.supplierId, stockStatusCompany: 2, stockNo: row.stockNo}), interUrl.purchase.confirmStockDetail);
    tableData(params, $.extend(_dataSupp,{orgId:_orgId, supplierId: _supplierId, stockStatusCompany: _stockStatusCompany, stockNo: _stockNo}), interUrl.purchase.confirmStockDetail);
}
var _orgId, _supplierId, _stockNo, _stockStatusCompany;
$(function(){
    $(".supplier").getSupplier();
    $("#table1").on('click-row.bs.table', function (e, row) {
        _orgId = row.orgId, _supplierId = row.supplierId, _stockNo = row.stockNo, _stockStatusCompany = 2;
        $("#divTable1").removeClass("hide");
        $("#table4").bootstrapTable("destroy").bootstrapTable(comn.table);
    });
    $("#table2").on('click-row.bs.table', function (e, row) {
        $("#divTable1").removeClass("hide");
        _orgId = row.orgId, _supplierId = row.supplierId, _stockNo = row.stockNo, _stockStatusCompany = 1;
        //dataLoad_4 = function(params) {
        //    tableData(params, $.extend(_dataSupp,{ stockNo:row.stockNo, orgId:row.orgId, supplierId: row.supplierId, stockStatusCompany: 1}), interUrl.purchase.confirmStockDetail);
        //}
        $("#table4").bootstrapTable("destroy").bootstrapTable(comn.table);
    });
    $("#importData").on("click", function(){
        $("#importPurchaseStock").modal("show");
    })
    $("#repairNum").on("shown.bs.modal", function(){
        $('#table_3').bootstrapTable(comn.table);
    });
    $("#modify").click(function(){
        g_isModify = g_isModify ? false : true;
        setButtonStatus();
    });
    $("#saveSupply").click(function(){
        if($("#addPurForm").valid() == false) return;
        saveSupply($("#addPurForm"));
    });
    $("#table1").on('click-row.bs.table', function (e, row) {
        billId = row.id;
        $("#divTable1").removeClass("hide");
        $("#dataTable1").bootstrapTable("destroy").bootstrapTable(comn.table);
    });
    //新增入库
    $("#addPur").on("shown.bs.modal", function(){
        $("#table3").bootstrapTable("destroy").bootstrapTable(tableConfig);
    });
    $("#addPurch").on("click", function(){
        $("#addPur").modal("show");
        $(".orgName").val(_orgNameCompany);
        $(".orgId").val(_orgCompany);
    });
    $(document).on("click", "#repairNumTable", function(){
        $("#repairNum").modal("show");
        $(".orgName").val(_orgNameCompany);
        $(".orgId").val(_orgCompany);

        $("#table_5").bootstrapTable('refresh',{url:'...'});
    })
    $(document).on("click", "#btnSearchRepairNum", function(){
        $("#table_5").bootstrapTable('refresh');
    })
    //确认入库
    $("#yesPurch").click(function(){
        var arr = {
            stockNos : []
        }
        var arrObj = $("#table1").bootstrapTable('getAllSelections');
        for (i = 0; i < arrObj.length; i++) {
            arr.stockNos.push(arrObj[i].stockNo);
        }
        var _stockNos = arr.stockNos.toString();
        comn.ajax({
            url: interUrl.purchase.confirmStock,
            data: {
                stockNos: _stockNos,
                stockStatusCompany: 2
            },
            success: function(res) {
                $("#table1").bootstrapTable('refresh');
                $("#table2").bootstrapTable('refresh');
            }
        })
    });
    $(".nav-tabs li a").click(function(){
        var id = $(this).attr("href");
        if(id === "#alloted") $("#yesPurch").addClass("hide");
        else $("#yesPurch").removeClass("hide");
        $("#divTable1").addClass("hide");
        $("#table4").bootstrapTable("destroy");
    });
    $(document).on("click", "#frameSearch", function(){
        $("#repairNum").modal("show");
    });
    $(document).on("change", "#stockType", function(){
        if ($(this).val() == "2"){
            $("#isReturn").removeClass("hide");
            $("#refundNo").prop("disabled", false)
        } else {
            $("#isReturn").addClass("hide");
            $("#refundNo").prop("disabled", "disabled")
        }
    });
    //供应商更改
    $(document).on("change", "#supplierId", function(){
        var _supplierId = $(this).val();
        $("#supplierName").val($(this).find("option:selected").html());
        $("#productSpec").getProductSpec(_supplierId)
    });
    //导入--供应商更改
    $(document).on("change", "#supplierImportId", function(){
        $("#supplierImportName").val($(this).find("option:selected").html());
    });
    //$(document).on("change", "#orgId1", function(){
    //    if($(this).val()){
    //        $("#groupId").getGroupList($(this).val());
    //    }
    //});
    $(document).on("change", "#productSpec", function(){
        $("#productTypeName").val(gpsType($(this).find("option:selected").attr("data-type")));
        $("#productType, #productTypeId").val($(this).find("option:selected").attr("data-type"));
    });
    $(document).on("click", "#btn_closed", function(){
        $("#table1").bootstrapTable('refresh');
    })
    return $("#btn-search").click(function() {
        var activeTab;
        activeTab = $(".tab-content").find(".tab-pane.active").attr("id");
        return $("#" + activeTab).find("table").bootstrapTable("refresh", {url: "..."});
    });
})
//保存/更新新增采购
saveSupply = function(_form, _callback){
    var _data = _form.values();
    var _url = _data.id ? interUrl.purchase.update : interUrl.purchase.add;
    return comn.ajax({
        url: _url,
        data: _data,
        success: function(res) {
            if(res.code == 10000){
                if(_callback) _callback();
                if (_data.id){
                    $("#table3").bootstrapTable('updateRow', {index: $("#index").val(), row: res.data})
                } else {
                    $("#table3").bootstrapTable('append', res.data);
                }
                g_isModify = false;
                setButtonStatus();
                $("#addPurForm input, #addPurForm select, #addPurForm textarea").val("");
                $(".orgName").val(_orgNameCompany);
                $(".orgId, .orgIdSelect").val(_orgCompany);
            }else{
                tip({content: res.message});
            }
        }
    });
}
setButtonStatus = function(){
    var span = $('#modify').find("span:last");
    if(g_isModify==true){
        span.html("&nbsp;取消&nbsp;");
        $("#addPurForm").find(":input");
        //$("#addPurForm").find("#parentOrg");
        $("#addPurForm").find("#saveSupply").show();
    }else{
        span.html("&nbsp;新增&nbsp;");
        $("#addPurForm").find(":input").not(":button");
        $("#addPurForm").find("#saveSupply").hide();
    }
}

//上传导入 和导出
// 上传方法
function upload(){
    return $.ajaxFileUpload({
        url: interUrl.basic + interUrl.purchase.uploadExcel,
        secureuri: false,
        fileElementId: 'upFileInput',
        dataType: "json",
        data:  $("#importForm").values(),
        success: function(data, status) {
            if (data.code == 10000) {
                tip({
                    content: "excel导入执行完成"
                });
            }else{
                tip({
                    content: data.message
                });
            }
            console.log(data);
            $("#importPurchaseStock").modal("hide");
        },
        complete: function() {
            $("#exportTime").trigger("changeDate");
            $("#importPurchaseStock").modal("hide");
        },
        error: function(data, status, e) {
            tip({
                content: data.message
            });
            $("#importPurchaseStock").modal("hide");
        }
    });


}

// 上传按钮改变时触发upload方法
$('#upFileInput').on('change', function() {
    if ($('input[type="file"]').val() != "") {
        var extend = $('input[type="file"]').val().substr($('input[type="file"]').val().lastIndexOf(".") + 1);
        var _this = $(this);
        var fileArr;
        fileArr = this.files;
        if ("xls|xlsx".indexOf(extend) == -1) {
            flagPic = false;
            layer.msg("选择的文件必须是EXCEL文件,请确认！");
        } else {
            return $("#fileName").val(fileArr[0].name);
        }
    } else {
        layer.msg("请选EXCEL文件");
    }
});
$("#setLoanSure").click(function(){
    upload();
    $("#upFileInput").replaceWith($("#upFileInput").clone(true));
})
// 数据导入
$("#importFile").click(function() {
    $("#upFileInput").trigger("click");
});

$("#downloadTem").click(function(){
    var downLink = interUrl.basic + interUrl.purchase.downloadExcel;
    window.open(downLink, "_blank");
})