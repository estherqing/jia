var args, dataLoad_1, curId = null,target;

args = comn.getArgs();

dataLoad_1 = function(params) {
    var p = {
        orgId: comn.user.companyId
    }
    return tableData(params, $.extend($("#searchForm").values(), p), interUrl.gr.userList);
};

//修改表格统一配置参数
var tableConfig = {};
$.map(comn.table, function (v, k) {
  tableConfig[k] = v;
});
tableConfig['height'] = "240";

//未抵押原因记录
dataLoad_2 = function(params) {
  return tableData(params, {
    projectId:args['projectId']
  }, interUrl.creditManagement.pledgeInfoFailRecordList);
};

$("#table_2").bootstrapTable(tableConfig);


$(function() {
  $(".tsbtn").click(function(){   //文档详情点击
	  if(!curId){
		layer.confirm('是否保存数据？', {
		    btn: ['是','否'] //按钮
		}, function(){

			var o;
			o = $("#mortgageInfo").find("form").values();
			if (o['pledgeStatus'] === "1" && !o['operatorUid']) {
			  return tip({
				content: "请先选择抵押经办人后再操作！"
			  });
			}
			if ($("#plateInfo").parent("form").valid()) {
			  return comn.ajax({
				url: interUrl.creditManagement.mortageSave,
				data: o,
				success: function(res) {
				  args['id'] = res.data;
				  $(".nav-tabs [href='#documentInfo']").attr("data-toggle", "tab").tab("show");
					layer.msg({time:10});
				}
			  });
			}
		}, function(){
			return;
		});
	  }else{
	  $(".nav-tabs [href='#documentInfo']").attr("data-toggle", "tab").tab("show");
	  }
  });


  $("#customerChoice").on("show.bs.modal", function() {
    return $("#customerChoice").find("table").bootstrapTable("destroy").bootstrapTable(comn.table);
  });
  $("#switch").html($("#tpl_1").html());
  $("#mortgageInfo select[name='pledgeStatus']").change(function() {
      var flag = this.value == 1 ? true : false;
      var o = {
          operatorUid: flag ? comn.user.uid : "",
          operatorRealname: flag ? comn.user.realname : ""
      };
    return $("#switch").html($("#tpl_" + this.value).html()).values(o);
  });
  comn.ajax({
    url: interUrl.creditManagement.mortageGgt,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
	  curId = res.data.id;
      args['id'] = res.data.id;
       res.data.operatorUid = res.data.operatorUid || comn.user.uid;
       res.data.operatorRealname = res.data.operatorRealname || comn.user.realname
	  target = $("#registerTargetSelect").html()
      $("#mortgageInfo").find("form").values(res.data);
      $("#mortgageInfo select[name='pledgeStatus']").change();
      $("#mortgageInfo").find("form").values(res.data);
	  $("#registerTarget").change(function(){
		  if (this.value == "2") {
			  $("#registerTargetSelect").html("");
		  }else{
			  $("#registerTargetSelect").html(target); 
		  }
	  }).trigger("change");
      $("#mortgageInfo").find("form").values(res.data);
      if (args['type'] === "show") {
        return $("#plateInfo").attr("disabled", true);
      }
    }
  });
  $("#btnSave").click(function() {
    var o;
    o = $("#mortgageInfo").find("form").values();
    if (o['pledgeStatus'] === "1" && !o['operatorUid']) {
      return tip({
        content: "请先选择抵押经办人后再操作！"
      });
    }
    if ($("#plateInfo").parent("form").valid()) {
      return comn.ajax({
        url: interUrl.creditManagement.mortageSave,
        data: o,
        success: function(res) {
			return comn.closeTab();
        }
      });
    }
  });
  return $("#btnSure").click(function() {
    var arr;
    arr = $("#customerChoice").find("table").bootstrapTable('getSelections');
    if (arr.length < 1) {
      return tip({
        content: "请先选择一个用户再进行操作！！！"
      });
    }
    $("#userChoice").values({
      operatorUid: arr[0].uid,
      operatorRealname: arr[0].realname
    });
    return $("#customerChoice").modal("hide");
  });
});
