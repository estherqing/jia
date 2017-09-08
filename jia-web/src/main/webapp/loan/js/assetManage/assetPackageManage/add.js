var dataLoad_1,dataLoad_2,handle_1,CustomerLoad, loanVal, messageCheck, selectCheck, args = comn.getArgs(),assetDifferenceAmount;

//加载客户数据
dataLoad_1 = function(params) {
  tableData(params,$("#searchForm").values()
  , interUrl.mockList || interUrl.asset.loanAssetList,function(){
	  var checkAmmount = 0;
	  var assetValue = 0;
		$("#table").on('check.bs.table', function(e, row) {
			var assetValue = parseFloat(row["assetValue"]);
			checkAmmount= checkAmmount + assetValue; 
			$('#checkAmmount').val(checkAmmount);
			changeColor(assetDifferenceAmount,checkAmmount);
		}).on('uncheck.bs.table', function(e, row) {
			var assetValue = parseFloat(row["assetValue"]);
		  checkAmmount= checkAmmount - row.assetValue;
		  $('#checkAmmount').val(checkAmmount);
		  changeColor(assetDifferenceAmount,checkAmmount);
		}).on('uncheck-all.bs.table', function(e, row) {
			assetValue = 0;
			checkAmmount = 0;
		  $('#checkAmmount').val(0);
		  changeColor(assetDifferenceAmount,checkAmmount);
		}).on('check-all.bs.table', function(e, row) {
			for (var i = row.length - 1; i >= 0; i--) {
				assetValue += parseFloat(row[i].assetValue);
			};
		  checkAmmount= checkAmmount + assetValue;
		  $('#checkAmmount').val(checkAmmount);
		  changeColor(assetDifferenceAmount,checkAmmount);
		});

  });
};

var date1 =new Date();
// date1 = date1.format("yyyy-MM-dd");
$("#orgId").getOrg();
$("input[name=dealerPaymentDateMin]").getMonthDay1();
$("input[name=dealerPaymentDateMax]").getToday();

$("#ok").click(function() {
	var _data = $("#table").bootstrapTable('getSelections');
	if(_data.length>0){
		var data;
		data = $("#addAssetForm").values();
    data["assetsPackageId"] = parseInt(args["id"]);
    data["loanApproveAssetsList"] = _data;
		return comn.ajax({
			url: interUrl.asset.loanAssetAdd,
			data: {
				"data":JSON.stringify(data)
			},
			success: function(res) {
				tip({
					content: "添加成功!!"
				});
				return comn.closeTab();
				// return comn.addTab({
				// 	title: "资产包管理",
	   //      href: "./Modal/assetManage/assetPackageManage/index.html"
	   //    });
			}
		});
	}else{
		$("#dialog").modal('show');
	}
});

$("#cancel").click(function() {
	return comn.addTab({
		title: "资产包管理",
      href: "./Modal/assetManage/assetPackageManage/index.html"
    });
});


orgName = function(value, row, index){
	var val = value;
	if(value.indexOf("中安金控资产管理有限公司") != -1){
		val = value.replace("中安金控资产管理有限公司", ""); 
	}
	return val;
}

// 差额警告色
function changeColor(a,b){
	if(b>=a){
		$("#checkAmmount").addClass('text-navy').removeClass('text-danger');
	}else{
		$("#checkAmmount").addClass('text-danger').removeClass('text-navy');
	}
}
comn.ajax({
		url: interUrl.asset.loanAssetPackageGet,
		data: {
			assetPackageId : args["id"]
		},
		success: function(res) {
			$("#coCompanyName").text(res["data"].coCompanyName);
			$("#assetPackageNo").text(res["data"].assetPackageNo);
			$("#assetDifferenceAmount").text(res["data"].assetDifferenceAmount);
			assetDifferenceAmount=res["data"].assetDifferenceAmount;

		}
	});
