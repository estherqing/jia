var dataLoad_1, dataLoad_2;
var args = comn.getArgs();
handle_2 = function(value, row, index) {
    return row.status === 4 ? ["<button type='button' class='btn btn-xs btn-primary arrived'>确认到货</button>"].join("") : "--"
};
tableEvent_2 = {
    "click .arrived": function(e, a, item, index) {
        $("#arrived").modal("show");
        $("#arrivedForm").values(item);
        dataLoad_3 = function(params) {
            return tableData(params, {applyNo: item.applyNo}, interUrl.purchase.receivedGpsDetail);
        }
        comn.ajax({
            url: interUrl.purchase.receivedGpsDetailNum,
            data: {
                applyNo: item.applyNo
            },
            success: function(res){
                $("#approveAmount").val(res.data);
            }
        })
        $("#table3").bootstrapTable('refresh');
        $("#table3").bootstrapTable({
            "height": "300"
        });
    }
};
stockStatus = function(value, row, index){
    if (row.status === 4){
        return '未确认'
    } else if (row.status === 0){
        return '已确认'
    } else {
        return '--'
    }
}
$(function(){
    $("#orgId").getSingleBranchComp(function(){
        dataLoad_1 = function(params) {
            return tableData(params, $("#searchForm").values(), interUrl.purchase.areaStockList);
        };
        dataLoad_2 = function(params) {
            return tableData(params, $("#searchForm").values(), interUrl.purchase.applyStockLIst);
        };
        $("#table1, #table2").bootstrapTable('refresh')
    });
    $(".supplier").getSupplier();
    $("#isShowBtn").click(function(){
        return comn.addTab({
            title: "GPS申请",
            href: "./Modal/stockManage/GPSBatchApply/applyGps.html"
        });
    });
    //确认到货
    $("#btn_repairNum").click(function(){
        var _data = $("#table3").bootstrapTable('getData');
        comn.ajax({
            url: interUrl.purchase.receivedGps,
            data:{
               data: JSON.stringify(_data)
            },
            success: function(){
                $("#arrived").modal("hide");
                tip({content: "确认到货！"})
                $("#table2").bootstrapTable('refresh',{url:'...'})
            }
        })
    });
    $(document).on("click", "", function(){
        $("#repairNum").modal("show");
    });
    $(document).on("change", "#supplierId", function(){
        var _supplierId = $(this).val();
        $("#supplierName").val($(this).find("option:selected").html());
    })
    $("#btn_confirm").click(function(){
        $("#batchApplyForm").validate();
        if ($("#batchApplyForm").valid() == true) {
            comn.ajax({
                url: interUrl.purchase.applyAdd,
                data: $("#batchApplyForm").values(),
                success: function(res) {
                    $("#batchApply").modal("hide");
                    //tip({content: "批量申请保存成功！"})
                }
            })
        }
    });
    $("#btn_approve_confirm").click(function(){
        oppSureModal("是否确认提交");
        $("#sureOption").unbind("click").click(function () {
            comn.ajax({
                url: interUrl.purchase.applyAdd,
                data: $("#batchApplyForm").values(),
                success: function (res) {
                    $("#sureModal").modal("hide");
                    //保存流程意见
                    flowSubmit(interUrl.purchase.preSubmit, interUrl.purchase.submit2next, './Modal/task/myTask/index.html', {gpsApplyId: res.data});
                }
            });
        })
    })
    $(".nav-tabs li a").click(function(){
        var id = $(this).attr("href");
        if(id === "#alloted") $("#yesPurch").addClass("hide");
        else $("#yesPurch").removeClass("hide");
    });
    return $("#btn-search").click(function() {
        var activeTab;
        activeTab = $(".tab-content").find(".tab-pane.active").attr("id");
        return $("#" + activeTab).find("table").bootstrapTable("refresh", {url: "..."});
    });
})
