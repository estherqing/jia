var handle, tableEvent, dataLoad_1, creditResult, checkResult;
//机构获取
comn.ajax({
    url:interUrl.customer.orglist,
    success: function(response){
        if(response.data.length ==1 ){
            var res = response.data[0];
            $("#orgId").html("<option value='" + res.companyId + "'>" + res.companyName + "</option>").attr('disabled','disabled');
            if(res.bzGroupId){
                $("#groupId").html('<option value="' +res.bzGroupId+'">'+res.bzGroupName+'</option>').attr('disabled','disabled')
            }else{
                $("#orgId").change();
            }
        }else{
            $("#orgId").html("<option value=''>--请选择--</option>" + ((function() {
                  var j, len, ref, results;
                  ref = response.data;
                  results = [];
                  for (j = 0, len = ref.length; j < len; j++) {
                      o = ref[j];
                      results.push("<option value='" + o.companyId + "'>" + o.companyName + "</option>");
                  }
                  return results;
              })()).join(""));
        }
        $("#table1").bootstrapTable('refresh',{url:'...'});
    }
});
//获取业务组
$("#orgId").on('change',function(){
    var val = $(this).val();
    $("#groupId").getOneGroup(val);
});



//$("#orgId").getOrgList(function (res) {
//    $("#orgId").html("<option value='" + res.companyId + "'>" + res.companyName + "</option>").attr('disabled','disabled');
//    if(res.bzGroupId){
//        $("#groupId").html('<option value="' +res.bzGroupId+'">'+res.bzGroupName+'</option>').attr('disabled','disabled')
//    }else{
//        $("#orgId").change();
//    }
//    $("#table1").bootstrapTable('refresh',{url:'...'});
//}).on('change',function(){
//    var val = $(this).val();
//    $("#groupId").getOneGroup(val);
//});

$("input[name='submitTime']").getToday();
$(function(){
    dataLoad_1 = function(params) {
        tableData(params, $.extend($("#searchForm").values(),{orgId:$("#orgId").val(),groupId:$("#groupId").val()}), interUrl.customer.query);
    };
});

creditResult=function(value,row,index){
    return [null,'征信中','征信通过','征信不通过',"已失效"][value] || null;
}

checkResult=function(value,row,index){
    return [null,'是','否'][value] || null;
}

tableEvent = {
    "click .show": function (e, a, item, index) {
        return comn.addTab({
            title: '征信详情',
            href: './Modal/loanManage/creditManage/creditInfo.html?type=1&businessId=' + item.creditId+'&user=' +item.canSee
        });
    },
    "click .entry": function (e, a, item, index) {
        return comn.addTab({
            title: '征信结果录入',
            href: './Modal/loanManage/creditManage/creditInfo.html?type=2&businessId=' + item.creditId
        });
    },
    "click .revert":function(e,a,item,index){
        comn.ajax({
            url:interUrl.customer.customCancel,
            data:{
                creditId:item.creditId
            },
            success:function(res){
                tip({
                    content:res.data
                });
                $("#table1").bootstrapTable("refresh",{url:"..."})
            }
        })
    }
}

handle = function(value, row, index) {
    var str = "";
    if(row['nodeKey']== "CREDIT_ENTER" &&　row['isSubmitted']== 0){
        str =  "<li><a class='entry'>征信录入</a></li>";
    }
    var repeal="";
    if(row.creditResult==3 || row.creditResult==2){
        repeal="<li><a class='revert'>退回征信接收</a></li>"
    }
  return ["<div class='btn-group btn-group-xs'>", "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>操作", "<span class='caret'></span>", "<span class='sr-only'>下拉切换</span>", "</button>",
   "<ul class='dropdown-menu' role='menu'>", "<li><a class='show'>查看详情</a></li>", str ,repeal, "</ul>", "</div>"].join("");
};
    $("#btn-search").click(function () {
        return $("#table1").bootstrapTable("refresh", {url: "..."});
    });

//导出报表数据
$("#exportBtn").on('click',function(){
    var search=$("#searchForm").serialize();
    var downLink = interUrl.basic + interUrl.customer.export + "?" + search;
    window.open(downLink, "_blank");
});


