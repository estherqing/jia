var riskStatus  = function (value, row, index) {
    return ["", "申请用户未检出高危风险，建议通过", "申请用户检测出高危风险，建议拒绝", "申请用户存在较大风险，建议进行人工审核"][value] || null;
};
(function(){
    var pictures = document.querySelector('#documentList_credit');
    var viewer;
    var options = {
        url: 'data-original',
        title: true,
        transition: false,
        build: function (e) {},
        built: function(e){},
        show:  function (e) {
            imgIds = {};
            window.parent.toggleTopNav();
        },
        viewed: function(e){},
        hide: function(e){
            window.parent.toggleTopNav();
        }
    };

    getValue = function (o, key) { //处理undefine
        return (o[key] || o[key]==0) ? o[key] : "";
    }
    loanVal = function (a, b) {
        for (var i = 0; i < a.length; i++) {
            var imgHtml = "";
            if(a[i]['creditFiles'] && a[i]['creditFiles'].length){
                for (var j = 0, len = a[i]['creditFiles'].length; j < len; j++) {
                    var o =  a[i]['creditFiles'][j];
                    imgHtml += "<img class='img-thumbnail' src= '" + o['creditFile'] + "' height='80' data-original='" + o['creditFile'] + "' style='margin-right: 10px; height:80px' />"
                }
            }
            setTimeout(function () {
                viewer = new Viewer(pictures, options);
            }, 500);
            var htmlArr = [
                '<div class="panel panel-default partyList party_List">',
                '<div class="panel-heading">',
                '<h3 class="panel-title">借款人 - ' + a[i].fullName + '</h3>',
                '</div>',
                '<div class="panel-body" style="padding-bottom:0;" id="accordion_'+ i +'" role="tablist" aria-multiselectable="true">',

                //'<div class="panel panel-default">',

                // '<div class="form-group form-group-sm panel-heading row"  role="tab" id="headingOne_'+ i +'"  style="margin: 0; padding: 0;">',
                // '<div class="col-md-18"><h3 class="panel-title" style="line-height: 34px;">银行征信信息</h3></div>',
                // '<div class="col-md-6 text-right">',
                // '<a role="button" style="margin-top: 5px" data-toggle="collapse" class="btn btn-primary" data-parent="#accordion_'+ i +'" href="#collapseOne_'+ i +'" aria-expanded="true" aria-controls="collapseOne"><span>查看详细信息</span></a>',
                // '</div>',
                // '</div>',
                '<div class="panel panel-default collapseFlex">',
                '<div class="panel-heading">',
                '<div class="col-md-8">',
                '<h3 class="panel-title">银行征信信息</h3>',
                '</div>' ,
                '<div class="col-md-16 text-right">' +
                '<a href="javascript:;" class="btn flexBtn" data-status="0"><span class="glyphicon glyphicon-chevron-right"></span></a>',
                '</div>',
                '</div>',
                '<div class="panel-body">',
                '<fieldset class="disabled1Class">',
                '<div class="form-group form-group-sm">',
                '<div class="form-group form-group-sm">',
                '<div class="input-tip">',
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">与主贷人关系：</label>',
                '<div class="col-md-5 cl-sm-5 col-xs-5">',
                '<select name="relavants[' + i + '].borrowerRelationship" value="'+a[i].borrowerRelationship+'" class="form-control">',
                '<option value="">--请选择--</option>',
                '<option value="1">本人</option>',
                '<option value="2">夫妻</option>',
                '<option value="3">父亲</option>',
                '<option value="4">母亲</option>',
                '<option value="5">姐妹</option>',
                '<option value="6">兄弟</option>',
                '<option value="7">儿子</option>',
                '<option value="8">亲戚</option>',
                '<option value="9">朋友</option>',
                '<option value="10">合伙人</option>',
                '<option value="11">同事</option>',
                '<option value="12">女儿</option>',
                '<option value="13">姐夫</option>',
                '<option value="14">嫂子</option>',
                '<option value="15">儿媳</option>',
                '</select>',
                '</div>',
                '</div>',
                '<div class="input-tip">',
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">证件号码：</label>',
                '<div class="col-md-5 cl-sm-5 col-xs-5">',
                '<input name="relavants[' + i + '].cardId" value="'+a[i].cardId+'" class="form-control">',
                '</div>',
                '</div>',
                '</div>',
                '<div class="input-tip">',
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">调查方式：</label>',
                '<div class="col-md-5 cl-sm-5 col-xs-5">',
                '<select id="seHan" name="relavants[' + i + '].checkType" value="' + a[i].checkType + '" class="form-control" required="" aria-required="true">',
                '<option value="">--请选择--</option>',
                '<option value="1">电话</option>',
                '<option value="2">网络</option>',
                '</select>',
                '</div>',
                '</div>',
                '<div class="input-tip">',
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">调查人：</label>',
                '<div class="col-md-5 cl-sm-5 col-xs-5">',
                '<input type="text" maxlength="5" name="relavants[' + i + '].reportUser" value="' + getValue(a[i], 'reportUser') + '" for="staffName" placeholder="请输入调查人姓名" class="form-control" required="" aria-required="true" />',
                '<input type="hidden" name="relavants[' + i + '].staffId" value="' + getValue(a[i], 'staffId') + '" />',
                '</div>',
                '</div>',
                '<div class="input-tip">',
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">调查日期：</label>',
                '<div class="col-md-5 cl-sm-5 col-xs-5">',
                '<input type="text" name="relavants[' + i + '].checkDate" placeholder="请输入调查日期" value="' + getValue(a[i], 'checkDate') + '" class="form-control date required dateISO" required="" aria-required="true" />',
                '</div>',
                '</div>',
                '</div>',
                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">' +
                '<span class="text-danger">*&nbsp;</span>征信结论：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<select name="relavants[' + i + '].checkResult" value="' + a[i].checkResult + '" class="form-control checkResult" required="" aria-required="true">' +
                '<option value="">--请选择--</option>' +
                '<option value="1">通过</option>' +
                '<option value="2">不通过</option>' +
                '</select>' +
                '</div></div>' +
                '</div>'+

                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">征信内容描述：</label>' +
                '<div class="col-md-21 cl-sm-21 col-xs-21">' +
                '<textarea class="form-control" rows="3" name="relavants['+i+'].creditRemark">' + getValue(a[i], 'creditRemark') + '</textarea>' +
                '</div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '<div class="creditEntry">'+
                '<fieldset class="disabled1Class">'+
                    //总体信息
                '<div class="panel panel-default collapseFlex '+(a[i].checkResult==2?"hidden":"")+'">' +
                '<div class="panel-heading">' +
                '<div class="col-md-8">' +
                '<h3 class="panel-title">总体信息</h3>' +
                '</div>' +
                '</div>' +
                '<div class="panel-body">' +

                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-xs-4 col-sm-4 col-md-4 control-label">有无信贷：</label>' +
                '<div class="col-md-20 cl-sm-20 col-xs-20">' +
                '<label class="radio-inline"><input type="radio" class="loanRepayment" name="relavants[' + i + '].loanRepayment" ' + (a[i].loanRepayment == 1 ? 'checked' : '') + ' value="1" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true">有</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<label class="radio-inline"><input type="radio" class="loanRepayment" name="relavants[' + i + '].loanRepayment" ' + (a[i].loanRepayment == 0 ? 'checked' : '') + ' value="0" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true">无</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '</div>' +
                '</div>' +
                '</div>' +
                //'<div class="form-group form-group-sm">' +
                //'<div class="input-tip">' +
                //'<label class="col-xs-4 col-sm-4 col-md-4 control-label">' +
                //'<span class="text-danger">*&nbsp;</span>信用报告综合等级：</label>' +
                //'<div class="col-md-20 cl-sm-20 col-xs-20">' +
                //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].creditRating" ' + (a[i].creditRating == 0 ? 'checked' : '') + ' value="0" required="" aria-required="true">正常</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].creditRating" ' + (a[i].creditRating == 1 ? 'checked' : '') + ' value="1" required="" aria-required="true">关注</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].creditRating" ' + (a[i].creditRating == 2 ? 'checked' : '') + ' value="2" required="" aria-required="true">禁入</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                //'</div>' +
                //'</div>' +
                //'</div>' +

                '<div class="form-group form-group-sm noCredit '+(a[i].loanRepayment==0 ? "hidden" : "")+'">' +
                '<div class="input-tip">' +
                '<label class="col-xs-4 col-sm-4 col-md-4 control-label">婚姻状况：</label>' +
                '<div class="col-md-20 cl-sm-20 col-xs-20">' +
                '<label class="radio-inline"><input type="radio" name="relavants[' + i + '].maritalStatus" ' + (a[i].maritalStatus == 0 ? 'checked' : '') + ' value="0" >未婚</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<label class="radio-inline"><input type="radio" name="relavants[' + i + '].maritalStatus" ' + (a[i].maritalStatus == 1 ? 'checked' : '') + ' value="1" >已婚</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<label class="radio-inline"><input type="radio" name="relavants[' + i + '].maritalStatus" ' + (a[i].maritalStatus == 3 ? 'checked' : '') + ' value="3" >离婚</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<label class="radio-inline"><input type="radio" name="relavants[' + i + '].maritalStatus" ' + (a[i].maritalStatus == 2 ? 'checked' : '') + ' value="2" >不明确</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<div class="form-group form-group-sm noCredit '+(a[i].loanRepayment==0 ? "hidden" : "")+'">'+
                '<div class="input-tip">'+
                '<label class="col-xs-3 col-sm-3 col-md-3 col-lg-3 control-label">信贷情况：</label>'+
                '<input type="hidden" name="relavants['+i+'].creditMemoFlag" value="'+a[i].creditMemoFlag+'"/>'+
                '<div class="col-xs-21 col-sm-21 col-md-21 col-lg-21 creditMemoFlag">'+
                // '<fieldset class="ltFirst" '+((a[i].creditMemoFlag < 8 && a[i].creditMemoFlag > 0) ? "disabled" : '')+' >'+
                // '<label class="checkbox-inline"><input type="checkbox" name="creditMemoFlag_1" '+((a[i].creditMemoFlag == '8') ? 'checked' : '')+' value="8" required="" aria-required="true">无信贷</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
                // '</fieldset>'+
                '<fieldset class="gtFirst" '+((a[i].creditMemoFlag == 8) ? "disabled" : '')+' >'+
                '<label class="checkbox-inline"><input type="checkbox" name="creditMemoFlag_1" '+((a[i].creditMemoFlag == '1' || a[i].creditMemoFlag == '3' || a[i].creditMemoFlag == '5' || a[i].creditMemoFlag == '7' || a[i].creditMemoFlag == '17' || a[i].creditMemoFlag == '19' || a[i].creditMemoFlag == '21' || a[i].creditMemoFlag == '23')? 'checked' : '')+' value="1" required="" aria-required="true">有房贷</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<label class="checkbox-inline"><input type="checkbox" name="creditMemoFlag_1" '+((a[i].creditMemoFlag == '2' || a[i].creditMemoFlag == '3' || a[i].creditMemoFlag == '6' || a[i].creditMemoFlag == '7' || a[i].creditMemoFlag == '18' || a[i].creditMemoFlag == '19' || a[i].creditMemoFlag == '22' || a[i].creditMemoFlag == '23')? 'checked' : '')+' value="2" required="" aria-required="true">有经营性贷款</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<label class="checkbox-inline"><input type="checkbox" name="creditMemoFlag_1" '+((a[i].creditMemoFlag == '4' || a[i].creditMemoFlag == '5' || a[i].creditMemoFlag == '6' || a[i].creditMemoFlag == '7' || a[i].creditMemoFlag == '20' || a[i].creditMemoFlag == '21' || a[i].creditMemoFlag == '22' || a[i].creditMemoFlag == '23')? 'checked' : '')+' value="4" required="" aria-required="true">有信用卡</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<label class="checkbox-inline"><input type="checkbox" name="creditMemoFlag_1" '+((a[i].creditMemoFlag == '16' || a[i].creditMemoFlag == '17' || a[i].creditMemoFlag == '18' || a[i].creditMemoFlag == '19' || a[i].creditMemoFlag == '20' || a[i].creditMemoFlag == '21' || a[i].creditMemoFlag == '22' || a[i].creditMemoFlag == '23')? 'checked' : '')+' value="16" required="" aria-required="true">其他贷款</label>'+
                '</fieldset>'+
                '</div>'+
                '</div>'+
                '</div>'+

                //'<div class="form-group form-group-sm">' +
                //'<div class="input-tip">' +
                //'<label class="col-xs-4 col-sm-4 col-md-4 control-label">最近两个月内贷款、信用卡审批查询次数：</label>' +
                //'<div class="col-md-5 cl-sm-5 col-xs-5">' +
                //'<input type="text" name="relavants[' + i + '].applyTimesInmonths"  class="form-control number" value=' + getValue(a[i], 'applyTimesInmonths') + '>' +
                //'</div>' +
                //'</div>' +
                //'</div>' +
                '</div>' +
                '</div>' +
                    //贷款汇总信息部分
                '<div class="panel panel-default collapseFlex noCredit '+((a[i].loanRepayment==0 || a[i].checkResult==2)? "hidden" : "")+'">' +
                '<div class="panel-heading">' +
                '<div class="col-md-8">' +
                '<h3 class="panel-title">贷款汇总信息</h3>' +
                '</div>' +
                '</div>' +
                '<div class="panel-body">' +

                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">贷款余额：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text" name="relavants[' + i + '].loanBalance"   class="form-control digital" value=' + getValue(a[i], 'loanBalance') + '>' +
                '</div>' +
                '</div>' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">为他人提供担保额：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text" name="relavants[' + i + '].amountGuaranteed"  class="form-control digital" value=' + getValue(a[i], 'amountGuaranteed') + '>' +
                '</div>' +
                '</div>' +

                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">当前逾期总额：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text" name="relavants[' + i + '].loanAmnout"  class="form-control digital" value=' + getValue(a[i], 'loanAmnout') + '>' +
                '</div>' +
                '</div>' +
                '</div>' +

                    //'<div class="form-group form-group-sm">' +
                    //'<div class="input-tip">' +
                    //'<label class="col-xs-3 col-sm-3 col-md-3 control-label">' +
                    //'<span class="text-danger">*&nbsp;</span>五级分类：</label>' +
                    //'<div class="col-md-21 cl-sm-21 col-xs-21">' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].fiveClass" ' + (a[i].fiveClass == 1 ? 'checked' : '') + '  value="1" required="" aria-required="true">正常</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].fiveClass" ' + (a[i].fiveClass == 2 ? 'checked' : '') + '  value="2" required="" aria-required="true">关注</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].fiveClass" ' + (a[i].fiveClass == 3 ? 'checked' : '') + '  value="3" required="" aria-required="true">次级</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].fiveClass" ' + (a[i].fiveClass == 4 ? 'checked' : '') + '  value="4" required="" aria-required="true">可疑</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].fiveClass" ' + (a[i].fiveClass == 5 ? 'checked' : '') + '  value="5" required="" aria-required="true">损失</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'</div>' +
                    //'</div>' +
                    //'</div>' +

                '</div>' +
                '</div>' +
                    //银行卡汇总信息部分
                '<div class="panel panel-default collapseFlex noCredit '+((a[i].loanRepayment==0 || a[i].checkResult==2)? "hidden" : "")+'">' +
                '<div class="panel-heading">' +
                '<div class="col-md-8">' +
                '<h3 class="panel-title">银行卡汇总信息</h3>' +
                '</div>' +
                '</div>' +
                '<div class="panel-body">' +

                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">授信总额：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text"  name="relavants[' + i + '].creditAmount"  class="form-control number" value=' + getValue(a[i], 'creditAmount') + '>' +
                '</div>' +
                '</div>' +
                '<div class="input-tip">' +
                '<label class="col-md-3 col-xs-3 col-sm-3 control-label">信用卡最近6个月平均使用额度（透支余额）：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text" name="relavants[' + i + '].averageSpendingInmonths"  class="form-control digital" value=' + getValue(a[i], 'averageSpendingInmonths') + '>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '</div>' +
                '</div>' +
                    //逾期信息部分
                '<div class="panel panel-default collapseFlex noCredit '+((a[i].loanRepayment==0 || a[i].checkResult==2)? "hidden" : "")+'">' +
                '<div class="panel-heading">' +
                '<div class="col-md-8">' +
                '<h3 class="panel-title">逾期信息</h3>' +
                '</div>' +
                '</div>' +
                '<div class="panel-body">' +

                // '<div class="form-group form-group-sm">' +
                // '<div class="input-tip">' +
                // '<label class="col-xs-4 col-sm-4 col-md-4 control-label">最近24个月所有贷款还款记录的最差状态：</label>' +
                // '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                // '<input type="text" name="relavants[' + i + '].worstRepaymentStatusInmonths"  class="form-control number" value=' + getValue(a[i], 'worstRepaymentStatusInmonths') + '>' +
                // '</div>' +
                // '</div>' +
                // '</div>' +
                //
                // '<div class="form-group form-group-sm">' +
                // '<div class="input-tip">' +
                // '<label class="col-xs-4 col-sm-4 col-md-4 control-label">最近6个月所有信用卡记录的最差状态：</label>' +
                // '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                // '<input type="text" name="relavants[' + i + '].worstCreditStatusInmonths"  class="form-control number" value=' + getValue(a[i], 'worstCreditStatusInmonths') + '>' +
                // '</div>' +
                // '</div>' +
                // '</div>' +

                '<div class="form-group form-group-sm">' +
                '<div class="input-tip">' +
                '<label class="col-xs-4 col-sm-4 col-md-4 control-label">' +
                '<span class="text-danger">*&nbsp;</span>最近12个月内累计逾期次数：</label>' +
                '<div class="col-md-5 cl-sm-5 col-xs-5">' +
                '<input type="text" required="" aria-required="true" name="relavants[' + i + '].overdueTimesInmonths"  class="form-control number" value=' + getValue(a[i], 'overdueTimesInmonths') + '>' +
                '</div>' +
                '</div>' +
                '</div>' +

                    //'<div class="form-group form-group-sm">' +
                    //'<div class="input-tip">' +
                    //'<label class="col-xs-4 col-sm-4 col-md-4 control-label">24个月前贷款（信用卡）逾期7次以上或逾期金额5万以上：</label>' +
                    //'<div class="col-md-20 cl-sm-20 col-xs-20">' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].overdueTimesOverthsBeforemonths" ' + (a[i].overdueTimesOverthsBeforemonths == 1 ? 'checked' : '') + ' value="1" >是</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<label class="radio-inline"><input type="radio" name="relavants[' + i + '].overdueTimesOverthsBeforemonths" ' + (a[i].overdueTimesOverthsBeforemonths == 0 ? 'checked' : '') + ' value="0" >否</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'</div>' +
                    //'</div>' +
                    //'</div>' +

                '</div>' +
                '</div>' +
                '<div class="row">',
                '<div class="col-md-21 col-md-offset-3">',
                imgHtml,
                '</div>',
                '</div>',
                '</fieldset>',
                '</div>',
                '</div>',
                '</fieldset>',
                (function(){
                    return a[i].riskDetailJson ? (['<div class="panel panel-default collapseFlex panelMargin20">',
                        '<div class="panel-heading">',
                        '<div class="col-md-8">' ,
                        '<h3 class="panel-title">网络征信信息</h3>' ,
                        '</div>',
                        '<div class="col-md-16 text-right">' ,
                        '<a href="javascript:;" class="btn flexBtn" data-status="0"><span class="glyphicon glyphicon-chevron-right"></span></a>' ,
                        '</div>',
                        '</div>',
                        '<div class="panel-body">',
                    '<fieldset class="disabled1Class"><div class="form-group form-group-sm"><div class="input-tip"><label class="col-md-3 col-xs-3 col-sm-3 control-label">报告日期：</label><div class="col-md-5 cl-sm-5 col-xs-5"><input type="hidden" name="relavants[' + i + '].netResult" value="1" /><input type="text" name="relavants[' + i + '].netReportDate" value="' + getValue(a[i], 'netReportDate') + '" placeholder="请输入报告日期" disabled="disabled" class="form-control date required dateISO" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true" /></div></div><div class="input-tip"><label class="col-md-3 col-xs-3 col-sm-3 control-label">风险等级：</label><div class="col-md-5 cl-sm-5 col-xs-5"><select disabled="disabled" name="relavants[' + i + '].riskStatus" value="' + a[i].riskStatus + '" class="form-control riskStatus" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true"><option value="0">等待结果</option><option value="1">正常</option><option value="2">黑名单</option><option value="3">灰名单</option></select></div></div></div>' ,
                        '<div class="form-group form-group-sm">' ,
                    //     '<div class="input-tip">',
                    //     '<label class="col-md-3 control-label">风险建议：</label><div class="col-md-13">' ,
                    // '<input type="text" class="form-control" value="'+ riskStatus(a[i].riskStatus)+'" />' ,
                    //     '</div>',
                    //     '</div>' ,
                        '<div class="input-tip">',
                        '<label class="col-md-3 control-label">异常信息数量：</label><div class="col-md-5">',
                    '<input type="text" class="form-control" value="'+ a[i].riskDetailJson.riskItem.length +'" />',
                        '</div>' ,
                        '</div>',
                        '</div>' ,
                        '<table class="table table-hover">',
                        '<thead>' ,
                        '<tr>',
                        '<th>检查项目</th>' ,
                        '<th>检查结果</th>',
                        '<th>备注</th>' ,
                        '</tr>',
                        '</thead>',
                    '<tbody>' + dataStr(a[i].riskDetailJson.riskItem, a[i].borrowerRelationship, a[i].id) ,
                        '</tbody>' ,
                        '</table>',
                        '</fieldset>' ,
                        '</div>',
                        '</div>'].join('')) : ( ['<div class="panel panel-default collapseFlex">' +
                    '<div class="panel-heading">' +
                    '<div class="col-md-8">' +
                    '<h3 class="panel-title">大数据征信信息</h3>' +
                    '</div>' +
                    '<div class="col-md-16 text-right">' +
                    '<a href="javascript:;" class="btn flexBtn" data-status="0"><span class="glyphicon glyphicon-chevron-right"></span></a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="panel-body">' +
                    '<fieldset class="disabled1Class"><div class="form-group form-group-sm"><div class="form-group form-group-sm"><div class="input-tip"><label class="col-md-3 col-xs-3 col-sm-3 control-label">报告日期：</label><div class="col-md-5 cl-sm-5 col-xs-5"><input type="hidden" name="relavants[' + i + '].netResult" value="1" /><input type="text" name="relavants[' + i + '].riskTime" value="' + getValue(a[i], 'riskTime') + '" placeholder="请输入报告日期" disabled="disabled" class="form-control date required dateISO" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true" /></div></div><div class="input-tip"><label class="col-md-3 col-xs-3 col-sm-3 control-label">征信结论：</label><div class="col-md-5 cl-sm-5 col-xs-5"><select disabled="disabled" name="relavants[' + i + '].riskStatus" value="' + a[i].riskStatus + '" class="form-control riskStatus" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true"><option value="0">等待结果</option><option value="1">正常</option><option value="2">建议拒绝</option><option value="3">关注</option></select></div></div></div></div><div class="form-group form-group-sm"><label class="col-md-3 control-label">大数据征信详情：</label><div class="col-md-21"><textarea disabled="disabled" '+((a[i].isSended==false)?'':'required=""')+' aria-required="true" class="form-control netReportDetailVal netReportDetail' + i + '" rows="3" name="relavants[' + i + '].riskDetail"></textarea></div></div>' +
                    '</fieldset>' +
                    '</div>' +
                    '</div>' ].join(""));
                })()+

                '</div>',
                '</div>',
                '</div>'
            ];
            if (a[i].borrowerRelationship == 1) {    //本人
                var oneself = htmlArr.join('');
                $(".partyBox").append(oneself);
            } else if (a[i].borrowerRelationship == 2) {    //妻子
                htmlArr[0] = '<div class="panel panel-default partyList">';
                htmlArr[2] = '<h3 class="panel-title">配偶 - ' + a[i].fullName + '</h3>';
                var wife = htmlArr.join('');
                $("#wife").append(wife);
            } else {
                htmlArr[0] = '<div class="panel panel-default partyList party_mean">';
                htmlArr[2] = '<h3 class="panel-title">借款关系人 - ' + a[i].fullName + '</h3>';
                var Borrower = htmlArr.join('');
                $("#partyBox").append(Borrower);
            }
            ;
            if (a[i].riskDetail) {
                $(".netReportDetail" + i + "").html(a[i].riskDetail);
            } else {
                if (a[i].riskStatus === 0) {
                    $(".netReportDetail" + i + "").html('待查询');
                } else {
                    $(".netReportDetail" + i + "").html('无记录');
                }
            }
            $("select[name='relavants[" + i + "].checkResult']").attr("value", a[i].checkResult).change();    //调查结果
            $("input[name='relavants[" + i + "].checkResultStatus'][value='" + a[i].checkResultStatus + "']").attr("checked", true);    //调查结果状态
        }
        selectCheck();
        $(".disabledClass,.disabled1Class").attr("disabled", true);
        $('.flexBtn').each(function(){
            var value = $(this).attr("data-status");
            $(this).flexBtnInit(value);
        })
    };

    CustomerLoad = function (a, b, c) {
        comn.ajax({
            url: b,
            async: false,
            data: {
                projectId: a.projectId,
                loanApplyId: a.loanApplyId,
                flowType: a.flowType
            },
            success: function (res) {
                $("#creditInfoForm").values(res.data);
                if (res.data.source == 2) $(".Number").addClass('hide');
                args["creditApplyId"] = res.data.id;
                args["customerId"] = res.data.customerId;
                if ($('#loadCreditInfo')) {
                    $('#loadCreditInfo').getLoad();
                }
                loanVal(res.data.relavants, c); //借款人、借款关系人信息处理
            }
        });
    };

    selectCheck = function () {
        var length = $("select").length;
        for (var i = 0; i < length; i++) {
            var val = $("select:eq(" + i + ")").attr('value');
            $("select:eq(" + i + ") option[value=" + val + "]").attr("selected", true);
        }
    };


})()
var obj = {
    personal : {len:0, itemName:[], itemDetail:[]},
    bad : {len:0, itemName:[], itemDetail:[]},
    multiPlatform : {len:0, itemName:[], itemDetail:[]},
    multiMan : {len:0, itemName:[], itemDetail:[]},
    cusBehavior : {len:0, itemName:[], itemDetail:[]}
}


function dataObj(num, _obj, o, relationId, creditApplyId){
    console.log(o)
    _obj.len = num;
    _obj.itemName.push(o.name);
    _obj.itemDetail.push(o.detail ? detailData(o, o.id, relationId, creditApplyId): "");
}
function detailData(o, oId, relationId, creditApplyId) {
    var html = "";
    var o = o.detail;
    if (o.frequency_detail) {
        var o = o.frequency_detail;
        var html = "";
        for (var i = 0; i < o.length; i++) {
            html += "<li>" + o[i] + "</li>"
        }
    }
    if (o.frequency_detail_list) {
        var o = o.frequency_detail_list;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "<li>" + o[i].detail + "</li>"
        }
        html += platform_detail;
    }
    if (o.discredit_times) html += "<li><b>信贷逾期次数:</b>"+ o.discredit_times +"</li>";
    if (o.fraud_type) html += "<li><b>风险类型:</b>"+ o.fraud_type +"</li>";
    if (o.type) html += "<li><b>规则的类型:</b>"+ o.type +"</li>";
    if (o.platform_count) html += "<li><b>多头借贷:</b>"+ o.platform_count +"</li>";
    if (o.platform_detail) {
        var o = o.platform_detail;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "[" + o[i] + "]"
        }
        html += '<li><b>借贷详情:</b><ul>'+ platform_detail +'</ul></li>'
    }
    if (o.platform_detail_dimension){
        var o = o.platform_detail_dimension.detail;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "[" + o[i] + "]"
        }
        html += '<li><b>维度命中多头个数:</b>'+ o.platform_detail_dimension.count+'</li><li><b>维度命中多头详情:</b><ul>'+ platform_detail +'</ul></li><li><b></b>维度展示名:'+ o.platform_detail_dimension.dimension+'</li>'
    }
    if (o.high_risk_areas){
        var o = o.high_risk_areas;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "<li>" + o[i] + "</li>";
        }
        html += '<li><b>高风险区域:</b><ul>'+ platform_detail +'</ul></li>'

    }
    if (o.hit_list_datas){
        var o = o.hit_list_datas;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "<li>" + o[i] + "</li>";
        }
        html += '<li><b>列表数据:</b><ul>'+ platform_detail +'</ul></li>'
    }
    if (o.namelist_hit_details){
        var o = o.namelist_hit_details;
        var platform_detail = "";
        for (var i = 0; i < o.length; i++) {
            platform_detail += "<li>" + o[i] + "</li>";
        }
        html += '<li><b>命中名单详情列表:</b><ul>'+ platform_detail +'</ul></li>'
    }
    if (o.overdue_details) html += '<li><a class="courtDetail" data-name="overdue_details" data-id="'+ oId +'" data-creditId="'+ creditApplyId +'" data-relationId="'+ relationId +'">逾期详情</a></li>';
    if (o.court_details) html += '<li><a class="courtDetail" data-name="court_details" data-id="'+ oId +'" data-creditId="'+ creditApplyId +'" data-relationId="'+ relationId +'">法院详情</a></li>';
    return html;
}

function dataStr(o, relationId, creditApplyId) {
    var perLen = 0, badLen = 0, multiPlatformLen = 0, multiManLen = 0, cusBehaviorLen = 0;
    for (i = 0; i < o.length; i++) {
        switch (o[i].group) {
            case "个人基本信息核查":
                perLen++;
                dataObj(perLen, obj.personal, o[i], relationId, creditApplyId);
                break;

            case "不良信息扫描":
                badLen++;
                dataObj(badLen, obj.bad, o[i], relationId, creditApplyId);
                break;

            case "多平台借贷申请检测":
                multiPlatformLen++;
                dataObj(multiPlatformLen, obj.multiPlatform, o[i], relationId, creditApplyId);
                break;

            case "关联人信息扫描":
                multiManLen++;
                dataObj(multiManLen, obj.multiMan, o[i], relationId, creditApplyId);
                break;

            case "客户行为检测":
                cusBehaviorLen++;
                dataObj(cusBehaviorLen, obj.cusBehavior, o[i], relationId, creditApplyId)
                break;
            default:
                break;
        }
    }
    var htmlPer = htmlString("个人基本信息核查", obj.personal);
    var htmlBad = htmlString("不良信息扫描", obj.bad);
    var htmlMultiPlat = htmlString("多平台借贷申请检测", obj.multiPlatform);
    var htmlMultiMan = htmlString("关联人信息扫描", obj.multiMan);
    var htmlCusBehavior = htmlString("客户行为检测", obj.cusBehavior);
    obj = {
        personal : {len:0, itemName:[], itemDetail:[]},
        bad : {len:0, itemName:[], itemDetail:[]},
        multiPlatform : {len:0, itemName:[], itemDetail:[]},
        multiMan : {len:0, itemName:[], itemDetail:[]},
        cusBehavior : {len:0, itemName:[], itemDetail:[]}
    }
    return htmlPer+htmlBad + htmlMultiPlat + htmlMultiMan + htmlCusBehavior;
}
function htmlString(title, _obj){
    var htmlString = "";
    htmlString = "<tr><td rowspan='"+ (_obj.len > 1 ? _obj.len : '') +"'>"+ title +"</td><td>"+ (_obj.itemName[0] ? _obj.itemName[0]: '<span class="glyphicon glyphicon-ok-sign" style="color:#3bc995; font-size:20px;"></span>') +"</td><td>"+ (_obj.itemDetail[0]  ? _obj.itemDetail[0] : "" ) +"</td></tr>";
    if (_obj.len > 1) {
        for (i = 1; i < _obj.len; i++) {
            htmlString += "<tr><td>"+ (_obj.itemName[i] ? _obj.itemName[i] : '<span class="glyphicon glyphicon-ok-sign" style="color:#3bc995; font-size:20px;"></span>') +"</td><td>"+ (_obj.itemDetail[i] ? _obj.itemDetail[i] : "") +"</td></tr>";
        }
    }
    return htmlString;
}
$(document).on("click", ".courtDetail", function(){
    var creditApplyId = $(this).attr("data-creditid");
    var itemId = $(this).attr("data-id");
    var relationId = $(this).attr("data-relationid");
    var name = $(this).attr("data-name");
    $("#detail ul").html("");
    comn.ajax({
        url: interUrl.customer.getNetCreditInfoDetail,
        data :{
            relavantId : creditApplyId,
            itemId: itemId
        },
        success : function(res){
            $("#showDetail").modal("show");
            $("#court-detail").html("");
            if (res.court_details) {
                var courtDetail = '';
                for (var i = 0; i < res.court_details.length; i++) {
                    var o = res.court_details[i];
                    console.log(o)
                    courtDetail += ['<div class="input-tip">',
                        '<label class="control-label col-md-24" style="text-align: left; padding-bottom:5px">法院详情：'+o.fraud_type +'</label>',
                        '<div class="col-md-24">',
                        '<table class="table table-hover">',
                        o.name? ('<tr><td width="40%">被执行人姓名：</td><td>'+ o.name+'</td></tr>'):'',
                        o.age? ('<tr><td>年龄：</td><td>'+ o.age+'</td></tr>'):'',
                        o.gender? ('<tr><td>性别：</td><td>'+ o.gender+'</td></tr>'):'',
                        o.province? ('<tr><td>省份：</td><td>'+ o.province+'</td></tr>'):'',
                        o.filing_time?'<tr><td>立案时间：</td><td>'+ o.filing_time+'</td></tr>':'',
                        o.court_name?'<tr><td>执行法院：</td><td>'+ o.court_name+'</td></tr>':'',
                        o.execution_department?'<tr><td>做出执行依据单位：</td><td>'+ o.execution_department+'</td></tr>':'',
                        o.duty?'<tr><td>生效法律文书确定的义务：</td><td>'+ o.duty+'</td></tr>':'',
                        o.situation?'<tr><td>被执行人的履行情况：</td><td>'+ o.situation+'</td></tr>':'',
                        o.discredit_detail?'<tr><td>失信被执行人行为具体情形：</td><td>'+ o.discredit_detail+'</td></tr>':'',
                        o.execution_base?'<tr><td>执行依据文号：</td><td>'+ o.execution_base+'</td></tr>':'',
                        o.case_number?'<tr><td>案号：</td><td>'+ o.case_number+'</td></tr>':'',
                        o.execution_number? '<tr><td>执行标的：</td><td>'+ o.execution_number+'</td></tr>':'',
                        o.execution_status?'<tr><td>执行状态：</td><td>'+ o.execution_status+'</td></tr>':'',
                        '</table>',
                        '</div>',
                        '</div>'].join('')
                }

                $("#court-detail").removeClass("hide").append(courtDetail);
            }
            if (res.overdue_details) {
                var o = res.overdue_details;
                var html =['<div class="input-tip">',
                    '<label class="control-label col-md-24" style="text-align: left; padding-bottom:5px">	逾期详情：',
                    '</label>',
                    '<div class="col-md-24">',
                    '<table class="table table-hover">',
                    '<tr><th>逾期金额</th><th>逾期笔数</th><th>逾期天数</th></tr>'].join('');

                for (var i = 0; i < o.length; i++){
                    html += ['<tr><td>'+(o[i].overdue_amount ? o[i].overdue_amount : '')+'</td><td>'+(o[i].overdue_count?o[i].overdue_count:'')+'</td><td>'+(o[i].overdue_day?o[i].overdue_day:'')+'</td></tr>'].join('')
                }
                html += '</table></div></div>'
                $("#court-detail").removeClass("hide").append(html);
            }
            $("#btn_yes").unbind("click").on("click", function(){
                $("#showDetail").modal("hide");
            })
        }
    })
});
$(function () {
    CustomerLoad({
        flowType: args['releventFlow'] || "",
        projectId: args["projectId"],
        loanApplyId: args["loanApplyId"]
    }, interUrl.credit.loanCreditInfo, '1');

    //展开关闭动画
    $(document).on("click", ".open", function () {
        $(this).removeClass("open").addClass("closeOp").parents(".openBox").next(".openValBox").stop().slideDown(1000);
    });
    $(document).on("click", ".closeOp", function () {
        $(this).removeClass("closeOp").addClass("open").parents(".openBox").next(".openValBox").stop().slideUp(1000);
    });
    $(document).on("change", "input[name=creditMemoFlag_1]", function(){
        var _value = $(this).parents(".creditMemoFlag").prev().val();
        if($(this).is(":checked")){
            $(this).parents(".creditMemoFlag").prev().val(comn.accAdd(_value, $(this).val()));
            if ($(this).val() < 8 && $(this).val() > 0) {
                $(this).parents(".creditMemoFlag").children(".ltFirst").prop("disabled", "disabled");
            } else if ($(this).val() == 8) {
                $(this).parents(".creditMemoFlag").children(".gtFirst").prop("disabled", "disabled")
            }
        } else {
            $(this).parents(".creditMemoFlag").prev().val(comn.accSub(_value, $(this).val()));
            if (comn.accSub(_value, $(this).val()) == 0) {
                $(this).parents(".creditMemoFlag").children(".ltFirst").prop("disabled", "");
                $(this).parents(".creditMemoFlag").children(".gtFirst").prop("disabled", "")
            }
        }
    });
});

