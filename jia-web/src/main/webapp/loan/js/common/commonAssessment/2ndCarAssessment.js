comn.ajax({
    url: interUrl.common.secondCarAssessment,
    data: {
        applyId: args["loanApplyId"]
    },
    success: function (res) {
        $("#2ndCarAssessment").values(res.data);
    }
});
if(args['type'] == 'ownersStaging'){
    $(".ownersStaging").removeClass('hide');
    $('.secondCarAssessment').addClass('hide');
}else{
    $('.ownersStaging input,.ownersStaging select,.ownersStaging textarea').attr('disabled',true);
}
