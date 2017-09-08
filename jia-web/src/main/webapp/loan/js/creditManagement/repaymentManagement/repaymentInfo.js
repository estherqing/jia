$(function() {
  var args;
  args = comn.getArgs();
  $("#basic select[name='deliverType']").change(function() {
    return $("#switch").html($("#tpl_" + this.value).html() || "");
  });
  comn.ajax({
    url: interUrl.creditManagement.repayCardGet,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
      $("#basic").values(res.data);
      $("#basic select[name='deliverType']").change();
      $("#basic").values(res.data);
      if (args['type'] === "show") {
        return $("#basic").children("fieldset").attr("disabled", true);
      }
    }
  });
  $("#btnSave").click(function() {
    if ($("#basic").find("form").valid()) {
      return comn.ajax({
        url: interUrl.creditManagement.repayCardSave,
        data: $("#basic").values(),
        success: function(res) {
          return window.parent.toUrl({
            url: "./Modal/creditManagement/repaymentManagement/index.html"
          });
        }
      });
    }
  });

	$("#btnBack").click(function(){
		window.parent.toUrl({url: "./Modal/creditManagement/repaymentManagement/index.html"})
	});

});
