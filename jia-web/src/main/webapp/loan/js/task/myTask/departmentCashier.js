var table_pay,tableEvent_pay,handle_pay;
//$.extend($.validator.defaults,{ignore:""});   //隐藏表单也验证
//审批信息
//getApprovalInfo();
$("#flowTitle").text(args['currentNodeName']);
var controlPre=true;
comn.ajax({
    url: interUrl.myTask.approvalInfo,
    data: loanApplyId,
    success: function(res) {
        if(res.data.carType=='2'){
            $("#sc-isAdvance").show();
        }
        /*
         if(res.data.maritalStatus!=1){
         $("#singleImg").show();
         }
         if(res.data.freeDoor=='1'){
         $("#needDoorImg").show();
         }*/
        if(res.data.maritalStatus!= 1){
            //$("#singleImg").show();
            $("#isMaritalStatus").removeClass("hide");
        }
        if(res.data.freeDoor == '1'){
            //$("#needDoorImg").show();
            $("#isFreeDoor").removeClass("hide");
        }
        if(res.data.isDiscount == '1'){
            //$("#needDoorImg").show();
            $("#isDiscount").removeClass("hide");
        }
        $("#approvalInfoForm").values(res.data);
        //银行直销逻辑判断  businessTypeId
        if(res.data.businessTypeId==2){
            $("#yhzx").show();
            $("#ptlc").remove();
            $("#paymentGetForm2").show();
            $("#paymentGetForm").hide();
            controlPre=false;
            getLoanCollection(); //获取收款信息
        }else{
            controlPre=true;
            table_pay = function(params) {
                var p=params.data;
                p['dealerId']=res.data.dealerId;
                return comn.ajax({
                    url: interUrl.myTask.getAccountList,
                    data: $.extend(p, {discountCaseId : res.data.discountCaseId}),
                    success: function(res) {
                        params.success({
                            'total':res.totalItem,
                            rows: res.data
                        });
                        return params.complete();
                    }
                });
            };
            tableEvent_pay = {
                "click .pay": function(e, a, item, index) {
                    $("[name='dealerAccountName']").val(item.accountName);
                    $("[name='dealerAccountNo']").val(item.cardNumber);
                    $("[name='dealerBank']").val(item.subBankName);
                    $("#payModal").modal("hide");
                }
            };
            handle_pay = function(value, row, index) {
                return ["<a class='pay' href='javascript:;'>选择</a>"].join("");
            };
            $("#table_pay").bootstrapTable("refresh");
            getCarDealerPayment();
        }
    }
});

//普通流程-获取付款信息
function getCarDealerPayment(){
    comn.ajax({
        url: interUrl.myTask.getCarDealerPayment,
        data: loanApplyId,
        success: function (res) {
            $("#paymentGetForm").values(res.data);
            //获取付款方式
            $("#payType").payTypeMent(args['loanApplyId'],res.data.payType, args["businessTypeCode"], args["currentNodeKey"]);
            $("[name='dealerPaymentDate']").getToday();
        }
    });
}



//选择收款人
$("#accountSelect").click(function(){
    $("#payModal").modal("show");
});

function diffDate(date){
    var newDate=date.replace(/-/g,'/');
    if(new Date()>Date.parse(newDate)){
        return true;
    }else{
        return false;
    }
}

//保存付款信息
$("#btn-save-pay").click(function(){
    $("#paymentGetForm").validate();
    if($("#paymentGetForm").valid() == true){
        if(diffDate($("input[name=dealerPaymentDate]").val())){
            comn.ajax({
                url: interUrl.myTask.paymentSave,
                data: $.extend($("#paymentGetForm").values(),loanApplyId),
                success: function (res) {
                    tip({content:res.message || "保存成功!"});
                }
            });
        }else{
            tip({
                content:'付款日期不能大于当前日期'
            })
        }

    }
});

//银行直销流程
//获取收款信息
function getLoanCollection(){
    comn.ajax({
        url: interUrl.myTask.getLoanCollection,
        data: loanApplyId,
        success: function (res) {
            if(res.data){
                $("#paymentGetForm2").values(res.data);
                $("#payForm").values(res.data);
                if(!res.data.collectedDate){
                    $("#collectedDate").getToday();
                }
            }
        }
    });
}
//获取cbs付款信息
function getCbsPayment(){
    comn.ajax({
        url: interUrl.myTask.getCarDealerPayment,
        data: loanApplyId,
        success: function (res) {
            $("#payForm").values(res.data);
            $('.mon').val(comn.toThousands(res.data.dealerPaymentAmount));
            if(res.data.cash){
                $(".overage").html("<p>账户余额:"+comn.toThousands(res.data.cash)+"</p><p>更新时间:"+res.data.cashUpdateTime+"</p>");
            }
        }
    });
}
//保存收款信息
function saveLoanCollection(){
    comn.ajax({
        url: interUrl.myTask.saveLoanCollection,
        data: $.extend($("#paymentGetForm2").values(),loanApplyId),
        success: function (res) {
            tip({content:res.message || "保存成功!"})
        }
    });
}

$("#btn-save-pay2").click(function(){
    $("#paymentGetForm2").validate();
    if($("#paymentGetForm2").valid() == true){
        saveLoanCollection();
    }
});

//发起付款
function startPayment(isSplit){
    comn.ajax({
        url:interUrl.myTask.startPayment,
        data:{
            token:$("input[name=token]").val(),
            isSplit:isSplit,
            applyId:args["loanApplyId"],
            priorityFlag:$("input[name=priorityFlag]:checked").val(),
            purpose:$("input[name=purpose]").val(),
            payType:"AP"
        },
        success:function(res){
            $("#takeApart").modal('hide');
            comn.ajax({
                url: interUrl.myTask.preSubmit,
                data: loanApplyId,
                success: function (res1) {
                    var nextNodeUserName = res1.data.userTasks[0].userName;
                    var nextNodeUserId = res1.data.userTasks[0].userId;
                    var nodeCode = {nodeCode: res1.data.nextFlowNodeCode};
                    var p3 = {nextNodeUserName: nextNodeUserName, nextNodeUserId: nextNodeUserId};
                    comn.ajax({
                        url: interUrl.myTask.submit2next,
                        data: $.extend(loanApplyId, p3),
                        success: function (res2) {
                            tip({content: res2.message});
                            comn.closeTab();
                        }
                    })
                }
            });
        }
    })
}

//普通流程保存收付款信息
function savePayment1(){
    oppSureModal("是否确认提交");
    $("#sureOption").unbind("click").click(function () {
        comn.ajax({
            url: interUrl.myTask.paymentSave,
            data: $.extend($("#paymentGetForm").values(), loanApplyId),
            success: function (res) {
                $("#sureModal").modal("hide");
                //保存流程意见
                comn.ajax({
                    url: interUrl.common.opinion,
                    data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 1}),
                    success: function (res) {
                        //招行CBS
                        if($("#payType").val() != 0){
                            $("#payMode").modal("show");
                            //获取系统时间
                            $(".time").getPayDate();
                            //付款信息
                            getCbsPayment();
                            //生成token,校验重复点击
                            $("input[name=token]").getPaymentToken();
                            $("[name='dealerAccountName1']").val($("[name='dealerAccountName']").val());
                            $("[name='dealerAccountNo1']").val($("[name='dealerAccountNo']").val());
                            $("[name='dealerBank1']").val($("[name='dealerBank']").val());
                            $("input[name=purpose]").val($("input[name=customerName]").val()+"  (车款)");
                            $("#payTitle").html($("#payType").find("option:checked").html()+' | 付款信息');
                            $("#payment").on("click",function(){
                                $("#payForm").validate();
                                if($("#payForm").valid()==true){
                                    comn.ajax({
                                        url:interUrl.myTask.preStartPayment,//校验时间
                                        data: $.extend(loanApplyId, {payType:"AP"}),
                                        success:function(res){
                                            if(res.code===25000){
                                                $("#takeApart").modal('show');
                                                $("#agree").unbind('click').click(function(){
                                                    startPayment(1)
                                                });
                                                $("#disAgree").unbind('click').click(function(){
                                                    startPayment(0)
                                                })
                                            }else{
                                                startPayment(0)
                                            }
                                        }
                                    })
                                }
                            })
                        }else{
                            comn.ajax({
                                url: interUrl.myTask.manualPayment,
                                data: {
                                    projectId: $("input[name=projectId]").val() || args["projectId"],
                                    oldDetailId: ''
                                },
                                success: function(res) {
                                    //sign lists
                                    comn.ajax({
                                        url: interUrl.myTask.preSubmit,
                                        data: loanApplyId,
                                        success: function (res1) {
                                            var nextNodeUserName = res1.data.userTasks[0].userName;
                                            var nextNodeUserId = res1.data.userTasks[0].userId;
                                            var nodeCode = {nodeCode: res1.data.nextFlowNodeCode};
                                            var p3 = {nextNodeUserName: nextNodeUserName, nextNodeUserId: nextNodeUserId};
                                            comn.ajax({
                                                url: interUrl.myTask.submit2next,
                                                data: $.extend(loanApplyId, p3),
                                                success: function (res2) {
                                                    tip({content: res2.message});
                                                    comn.closeTab();
                                                }
                                            })
                                        }
                                    });
                                }
                            })
                        }

                    }
                });
            }
        });
    })
}

//银行直销流程保存收付款信息
function savePayment2(){
    oppSureModal("是否确认提交");
    $("#sureOption").unbind("click").click(function () {
        comn.ajax({
            url: interUrl.myTask.saveLoanCollection,
            data: $.extend($("#paymentGetForm2").values(), loanApplyId),
            success: function (res) {
                $("#sureModal").modal("hide");
                //保存流程意见
                comn.ajax({
                    url: interUrl.common.opinion,
                    data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 1}),
                    success: function (res1) {
                        //sign lists
                        comn.ajax({
                            url: interUrl.myTask.preSubmit,
                            data: loanApplyId,
                            success: function (res1) {
                                var nextNodeUserName = res1.data.userTasks[0].userName;
                                var nextNodeUserId = res1.data.userTasks[0].userId;
                                var nodeCode = {nodeCode: res1.data.nextFlowNodeCode};
                                var p3 = {nextNodeUserName: nextNodeUserName, nextNodeUserId: nextNodeUserId};
                                comn.ajax({
                                    url: interUrl.myTask.submit2next,
                                    data: $.extend(loanApplyId, p3),
                                    success: function (res2) {
                                        tip({content: res2.message});
                                        comn.closeTab();
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
    })
}
//流程意见保存和流程提交,退回上一步
$("#btn-opinion-save").click(function () {
    if(controlPre){
        $("#paymentGetForm").validate();
        $("#opinionForm").validate();
        if($("#paymentGetForm").valid() == true && $("#opinionForm").valid() == true){
            if(diffDate($("input[name=dealerPaymentDate]").val())){
                savePayment1();
            }else{
                tip({
                    content:'付款日期不能大于当前日期'
                })
            }
        }
    }else{
        $("#paymentGetForm2").validate();
        $("#opinionForm").validate();
        if($("#paymentGetForm2").valid() == true && $("#opinionForm").valid() == true){
            savePayment2();
        }
    }

});

//退回上一步
$("#btn-loanReview-back").click(function () {
    $("#opinionForm").validate();
    if($("#opinionForm").valid() == true){
        oppSureModal("是否确认退回");
        $("#sureOption").unbind("click").click(function () {
            //保存流程意见
            comn.ajax({
                url: interUrl.common.opinion,
                data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 0}),
                success: function (res1) {
                    $("#sureModal").modal("hide");
                    //退回上一步
                    comn.ajax({
                        url: interUrl.myTask.back2pre,
                        data: loanApplyId,
                        success: function (res1) {
                            tip({content: res1.message});
                            comn.closeTab();
                        }

                    });
                }
            });
        })
    }
});

//opinionForm单独保存
$("#saveBtn").click(function(){
    oppSureModal("是否确认保存");
    $("#sureOption").unbind("click").click(function () {
        //保存流程意见
        comn.ajax({
            url: interUrl.common.opinionOnly,
            data: $.extend($("#opinionForm").values(), argsBopInfoId),
            success: function (res) {
                $("#sureModal").modal("hide");
                tip({
                    content: "保存成功！"
                });
            }
        });
    });
});
//页面加载获取opinion内容
$("#opinionText").getOpinion_s(argsBopInfoId);

$('#loadCredit').getLoad();
