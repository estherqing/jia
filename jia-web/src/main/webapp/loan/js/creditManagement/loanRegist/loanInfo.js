var args;

args = comn.getArgs();

$(function() {
  args['id'] = args['projectId'];
  comn.ajax({
    url: interUrl.creditManagement.bankInfoGet,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
      return $("#basic").values(res.data);
    }
  });
  return $("#btnSave").click(function() {
    if ($("#basic").valid()) {
      return comn.ajax({
        url: interUrl.creditManagement.bankInfoSave,
        data: $("#recordInfo").values(),
        success: function(res) {
			comn.closeTab();
        }
      });
    }
  });
});
