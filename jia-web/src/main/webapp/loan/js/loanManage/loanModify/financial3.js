var table_pay,tableEvent_pay,handle_pay,flowType,conclusion,discountCaseId;
flowType={flowType:"LOAN_MODIFY_FLOW"};
//$.extend($.validator.defaults,{ignore:""});   //隐藏表单也验证

//type=1 第2个分公司财务主管  type=2 资金部主任 type=3 资金管理部出纳
$("#flowTitle").text(args['currentNodeName']);
if(type==1){
  $("#loanPool").hide(); //隐藏资金池账户
}else if(type==2) {
  $("#guaranteeAccount,#dealerAccount").attr("disabled", true);
}
if(type==3){
  $("#guaranteeAccount,#dealerAccount,#pollAccount").attr("disabled",true);
  $("#btn-payment-save").hide();
  $("#btn-loanReview-back").show();
  $("#f_type3").remove();
}

//审批信息
comn.ajax({
  url: interUrl.myTask.approvalInfo,
  data:loanApplyId,
  success: function(res) {
	if(res.data.businessTypeId == 2){
	  $("input[name='receivableAmount']").closest(".input-tip").removeClass("hide");
	  $("input[name='requiredAmount']").closest(".input-tip").addClass("hide"); 
	}
    if(res.data.carType==2){
      $("#sc-isAdvance").show();
    }
    $("#payModal2").on("shown.bs.modal", function(){
      //车商账户
      table_pay2 = function(params) {
        var p=params.data;
        p['dealerId']=res.data.dealerId;
        return comn.ajax({
          url: interUrl.myTask.getAccountList,
          //data: p,
          data: $.extend($("#userInfo").values(), p,{discountCaseId:discountCaseId}),
          success: function(res) {
            params.success({
              'total':res.totalItem,
              rows: res.data
            });
            return params.complete();
          }
        });
      };
      tableEvent_pay2 = {
        "click .pay": function(e, a, item, index) {
          $("[name='dealerAccountName']").val(item.accountName);
          $("[name='dealerAccountNo']").val(item.cardNumber);
          $("[name='dealerBank']").val(item.subBankName);
          $("#carDealerId").val(item.dealerId);
          $("#payModal2").modal("hide");
        }
      };
      handle_pay2 = function(value, row, index) {
        return ["<a class='pay' href='javascript:;'>选择</a>"].join("");
      };
      $("#table_pay2").bootstrapTable("refresh");
    });
    discountCaseId=res.data.discountCaseId?res.data.discountCaseId:'';
    $("#approvalInfoForm").values(res.data);

  }
});


//获取修改清单
getModify();

//退款信息部分
getPaymentInfo();

function getPaymentInfo(){
  comn.ajax({
    url: interUrl.myTask.paymentGetGuarantee,
    data: loanApplyId,
    success: function(res) {
      $("#paymentGetForm").values(res.data);
      if(type==3){
        //获取付款方式
        $('#payType').payTypeMent(args['loanApplyId'],res.data.payType, args["businessTypeCode"], args["currentNodeKey"]);
        $(".payTypeMent").removeClass("hidden");
      }
      $("#payModal").on("shown.bs.modal", function() {
        //分公司账户
        table_pay = function (params) {
          var p = params.data;
          p['orgId'] = res.data.orgId;
          return comn.ajax({
            url: interUrl.myTask.guaranteeList,
            data: p,
            success: function (res) {
              params.success({
                'total': res.totalItem,
                rows: res.data
              });
              return params.complete();
            }
          });
        };
        tableEvent_pay = {
          "click .pay": function (e, a, item, index) {
            $("[name='guaranteeCorporationAccountName']").val(item.accountName);
            $("[name='guaranteeCorporationAccountNo']").val(item.cardNumber);
            $("[name='guaranteeCorporationBank']").val(item.subBankName);
            $("#payModal").modal("hide");
          }
        };
        handle_pay = function (value, row, index) {
          return ["<a class='pay' href='javascript:;'>选择</a>"].join("");
        };
        $("#table_pay").bootstrapTable("refresh");
      });

      if(type=='2' || type=='3') {
        $("#payModal3").on("shown.bs.modal", function() {
          //资金池账户
          table_pay3 = function (params) {
            var p = params.data;
            return comn.ajax({
              url: interUrl.myTask.getCapatilPoolAccountList,
              data: p,
              success: function (res) {
                params.success({
                  'total': res.totalItem,
                  rows: res.data
                });
                return params.complete();
              }
            });
          };
          tableEvent_pay3 = {
            "click .pay": function (e, a, item, index) {
              $("[name='capitalPoolAccountName']").val(item.accountName);
              $("[name='capitalPoolAccountNo']").val(item.cardNumber);
              $("[name='capitalPoolBank']").val(item.subBankName);
              $("#payModal3").modal("hide");
            }
          };
          handle_pay3 = function (value, row, index) {
            return ["<a class='pay' href='javascript:;'>选择</a>"].join("");
          };
          $("#table_pay3").bootstrapTable("refresh");
        })

      }
    }
  });
}

//保存收款信息
$("#btn-payment-save").click(function () {
  $("#paymentGetForm").validate();
  if($("#paymentGetForm").valid() == true){
    comn.ajax({
      url: interUrl.myTask.saveToGuarantee,
      data: $.extend($("#paymentGetForm").values(),loanApplyId,flowType,{payeeMethod:2}),
      success: function(res) {
        tip({content:res.message || '保存成功!'})
      }
    });
  }
});

//担保公司选择收款人
$("#accountSelect").click(function(){
  $("#payModal").modal("show");
});

$("#accountSelect2").click(function(){
  $("#payModal2").modal("show");
});

$("#accountSelect3").click(function(){
  $("#payModal3").modal("show");
});

//判断显示提交还是退回
$("input[name='conclusion']").on('click',function(){
  var checkedV=$("input[name='conclusion']:checked").val();
  if(checkedV==1){
    $("#btn-opinion-save").show();
    $("#btn-loanReview-back").hide();
    if(type==1){
      $("#btn-be-invalid").hide();
    }
  }else{
    $("#btn-opinion-save").hide();
    $("#btn-loanReview-back").show();
    if(type==1){
      $("#btn-be-invalid").show()
    }
  }
});

//流程意见保存和流程提交
$("#btn-opinion-save").click(function () {
  $("#paymentGetForm").validate();
  $("#opinionForm").validate();
  if($("#paymentGetForm").valid() == true && $("#opinionForm").valid() == true) {
    oppSureModal("是否确认提交");
    $("#sureOption").unbind("click").click(function () {
      comn.ajax({
        url: interUrl.myTask.saveToGuarantee,
        data: $.extend($("#paymentGetForm").values(), loanApplyId),
        success: function (res) {
          $("#sureModal").modal("hide");
          //保存流程意见
          comn.ajax({
            url: interUrl.common.opinion,
            data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 1}),
            success: function (res) {
              if($('#payType').find('option:selected').val() && $('#payType').find('option:selected').val() != 0 ){
                flowSubmit(interUrl.loanModify.preSubmit, interUrl.loanModify.submit2next, './Modal/task/myTask/index.html', loanApplyId,"RT");
                return;
              }
              flowSubmit(interUrl.loanModify.preSubmit, interUrl.loanModify.submit2next, './Modal/task/myTask/index.html', loanApplyId);
            }
          });
        }
      });
    })
  }
});

//退回上一步
$("#btn-loanReview-back").click(function () {
  $("#opinionForm").validate();
  if($("#opinionForm").valid() == true) {
    oppSureModal("是否确认退回");
    $("#sureOption").unbind("click").click(function () {
      //保存流程意见
      comn.ajax({
        url: interUrl.common.opinion,
        data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 0}),
        success: function (res) {
          $("#sureModal").modal("hide");
          flowBack2Pre();
        }
      });
    })
  }
});

//贷款作废
$("#btn-be-invalid").click(function () {
  $("#opinionForm").validate();
  if($("#opinionForm").valid() == true) {
    oppSureModal("确认要作废此贷款申请吗？");
    $("#sureOption").unbind("click").click(function () {
      //保存流程意见
      comn.ajax({
        url: interUrl.common.opinion,
        data: $.extend($("#opinionForm").values(), argsBopInfoId, {conclusion: 0}),
        success: function (res) {
          $("#sureModal").modal("hide");
          loanToBeInvalid();
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
$(function () {
  $("#userSearch").click(function() {
    return $("#table_pay2").bootstrapTable('selectPage', '1');
  });
})
