var args, dataLoad_1;

args = comn.getArgs();
if (args['registered'] === "registered") {
    $("#btnPreSave").hide();
}
dataLoad_1 = function(params) {
  return tableData(params, $("#recordInfo").values(), interUrl.mockList || interUrl.creditManagement.loanContracPlanList);
};

$(function() {
	$("input[name='bankInstallmentFee']").change(function(){
		var loanAmount = parseFloat($("input[name='requiredAmount']").val()),
			bankInstallmentFee = parseFloat($(this).val()),
			contractAmount = (loanAmount || 0) + (bankInstallmentFee || 0);
			$("input[name='contractAmount']").val(contractAmount); 
	});

	$("input[name='interestStartDate'], select[name='loanTerm']").change(function(){
		var M = parseInt(loanTerm($("select[name='loanTerm']").val())),
			date = $("input[name='interestStartDate']").val(),
			o = moment(date).add(M, 'M'),
			_text = o.format("YYYY-MM-DD");
		$("input[name='interestEndDate']").val(_text != "Invalid date" ? _text : "");

		if($(this).attr("name") == "interestStartDate"){
			var _ftext = moment(date).add(1, 'M').format("YYYY-MM-DD");
			$("input[name='firstRepaymentDate']").val(_ftext != "Invalid date" ? _ftext : "");
		}
	});

  comn.ajax({
    url: args["type"] == "show" ? interUrl.creditManagement.loanContractGet : interUrl.creditManagement.loanContractEdit,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
		var o = res.data;
		o.contractAmount = o.contractAmount || (o.requiredAmount + o.bankInstallmentFee);
		o.registerDate = o.registerDate || moment().format("YYYY-MM-DD");
		o.interestStartDate = o.interestStartDate || o.bankPaymentDate;
		o.interestEndDate = moment(o.interestStartDate || o.bankPaymentDate).add(parseInt(loanTerm(o.loanTerm)), 'M').format("YYYY-MM-DD");
      $(".ibox-content").values(o);
	 if (o.enableEdit == "0"){
		  $("input[name='billDate']").attr("readonly", true);
	  }
      if (args['type'] === "show") {
        $("#info").attr("disabled", true);
          $("#btn-isShow").hide();
        return $("#plan").removeClass("hide").find("table").bootstrapTable(comn.table);
      }
    }
  });
  $("#btnPlan").click(function() {
    if ($("#recordInfo").valid()) {
      return $("#plan").removeClass("hide").find("table").bootstrapTable("destroy").bootstrapTable(comn.table);
    }
  });
     $("#btnPreSave").click(function () {
        $("input").removeClass("required");
         comn.ajax({
            url: interUrl.creditManagement.tmpSave,
            data: $("#info").values(),
            success: function(res) {
                tip({
                    content: '暂存成功'
                });
                comn.closeTab();
            }
        });
    })
   $("#btnSave").click(function() {
    if ($("#recordInfo").valid()) {
       comn.ajax({
        url: interUrl.creditManagement.loanContractSave,
        data: $("#info").values(),
        success: function(res) {
          tip({
            content: '操作成功！！'
          });
		  comn.closeTab();
        }
      });
    }
  });
});
