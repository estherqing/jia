var args, base64, cureent_dir, dataLoad_1, dataLoad_2, getDocumentList, getSelectImage, handle_1, handle_2, loadTree, targetDir, treeObj, treeTarget, zTreeOnClick,dataLoad_4;

var pledgeStatus = function (value) { return [null, "已抵押", "未抵押"][value] || null; };
var bankPaymentStatus = function (value) { return [null, "未放款", "已放款"][value] || "未放款"; };
var policyFinishFlag = function (value) { return [null, "未保", "已保", "未保", "未保"][value] || null; };
var isRegistered = function (value) { return [null, "已上牌", "未上牌"][value] || null; };
var overloadStatus = function (value) { return [null, "已逾期", "未逾期"][value] || "未逾期"};
var settleStatus = function (value) { return [null, "已结清", "未结清"][value] || "未结清"};
args = comn.getArgs();

//客户资料，反担保信息，征信信息，影像管理，预算单，过程信息   我的任务-已办,贷款流程查看详情只显示所列出的tab
if(args['type']=='taskDoneLoan'){
      $("#tab1,#tab4,#tab6,#tab7,#tab9,#tab11").hide();
      $("#allInfo").removeClass("active");
      $("#tab2,#info").addClass("active");
}
//总部审批中心节点:LOAN_CAR_FINANCE，LOAN_CAR_FINANCE_MANAGER，LOAN_CAR_FINANCE_MAJORDOMO，LOAN_GROUP_GENERAL_MANAGER,LOAN_MODIFY_CAR_FINANCE
//var HEAD_QUARTERS="LOAN_CAR_FINANCE,LOAN_CAR_FINANCE_MANAGER,LOAN_CAR_FINANCE_MAJORDOMO,LOAN_GROUP_GENERAL_MANAGER,LOAN_MODIFY_CAR_FINANCE";
if(comn.user.level=='40'){ //如果是集团用户,显示评分卡B
    $("#tabScoreCard1").hide();
    $("#tabScoreCard2").show();
}

var actionType = function(value, row) {
	var text = "";
	switch (value) {
		case 'add':
			text = "增加"; 
			break;
		case 'modify':
			text = "修改"; 
			break;
		case 'delete':
			text = "删除"; 
			break;
	}
	return text; 
}

var objectType = function(value, row) {
	var text = "";
	switch (value) {
		case 'LOAN_APPLY':
			text = "贷款申请"; 
			break;
		case 'LOAN_PROJECT':
			text = "贷款项目"; 
			break;
		case 'LOAN_CUSTOMER':
			text = "贷款客户"; 
			break;
		case 'LOAN_CONTRACT':
			text = "贷款联系人"; 
			break;
		case 'LOAN_FEE':
			text = "贷款费用"; 
			break;
		case 'LOAN_GUARANTOR':
			text = "贷款保证人"; 
			break;
		case 'LOAN_PAYMENT':
			text = "贷款支付"; 
			break;
	}
	return text; 
}

//文档传递流程
var table_document,handle_document,tableEvent_document;
table_document = function (params) {
	tableData(
		params,
		{
			projectId: args['projectId']
		},
		interUrl.loanDetail.getLoanDocumentTransmitList
	); 
};

var getLoanModifyHistory = function(params){
	tableData(
		params,
		{
			projectId: args['projectId']
		},
		interUrl.gr.getLoanModifyHistory
	); 
}

//保单信息 api=getLoanInsuranceInfoList
var table_insurance,handle_insurance1,handle_insurance,tableEvent_insurance;
table_insurance = function (params) {
	tableData(
		params,
		{
			projectId: args['projectId']
		},
		interUrl.loanDetail.getLoanInsuranceInfoList
	); 
};

handle_insurance1=function(value,row,index){
  return "首保";
};

handle_insurance=function(value,row,index){
  return "<a href='javascript:;' class='info'>首保查看</a>"
};

tableEvent_insurance={
  "click .info":function(e,a,index,item){
      return comn.addTab({
        title:"首保查看",
        href:'./Modal/insuranceManage/firstInsurance/seeInsurance.html?projectId='+a
      });
  }
};

$("#print").click(function(){
    window.open("../../../Modal/task/myTask/print.html?loanApplyId="+args['id'])
});

  //借款人信息
comn.ajax({
  url: interUrl.loanDetail.getLoanCustomerInfo,
  data: {projectId:args['projectId']},
  success: function (res) {
    var housingStatus = res.data.housingStatus;
    var c = $("#mortgageRepayment");
    var a = "<span class='text-danger'>*</span>";
    //$('#loadCredit').getLoad();
    $("#getPos").data("callback",function(BMap, map){
      var pictureIcon = new BMap.Icon("./../../../images/picture_icon.png", new BMap.Size(30,30));
      function addMarker(point){
        var marker = new BMap.Marker(point, {icon: pictureIcon});
        map.addOverlay(marker);
      }
      $.each(res.data.realVisitAddressItudeList, function(i, o){
        var pointArr = o.split(",");
        addMarker(new BMap.Point(pointArr[0], pointArr[1]));
      });
    });

    //if (housingStatus == 2) {
    //  c.show().find("label").html(a + "月还款:");
    //} else if (housingStatus == 3) {
    //  c.show().find("label").html(a + "月租:");
    //} else if (housingStatus == 4) {
    //  c.show().find("label").html(a + "说明:");
    //} else if (housingStatus == 1) {
    //  c.hide();
    //}
    if (housingStatus == 5) {
      c.show().find("label").html(a + "租金:");
    } else if (housingStatus == 6) {
      c.show().find("label").html(a + "说明:");
    } else {
      c.hide();
    }
    if(res.data.maritalStatus==1){
      $("#spousePanel").show();
    }
    $("#approvalBaseInfoForm").values(res.data);
    $("#getPos").data("pos", res.data.visitAddressItude);
  }
});


table_contacter = function (params) {
	tableData(
		params,
		{
			projectId: args['projectId']
		},
		interUrl.loanDetail.getLoanCustomerContacter
	); 
};

//$("#table_contacter").bootstrapTable(comn.table);

//预算单
comn.ajax({
  url: interUrl.loanDetail.getLoanFeeInfoInfoQuery,
  data: {projectId:args['projectId']},
  success: function (res) {
      if ((res.data.cannelStatus === 3) || (res.data.cannelStatus === 2 && res.data.isDealerGroup === 1)) $("#isDealerGroup").removeClass("hide");
      //银行直销逻辑判断  businessTypeId
      if(res.data.businessTypeId==2){
          $("#yhzx-c1").hide();
          $("#collectedAmount").attr("disabled","disabled");
          $("#yhzx-c").text("应收金额");
          $("#receivableAmount").show();
          $("#payableAmount").hide();
          $("#paymentMethodBox").hide();
      }
      if(res.data.businessTypeId==4){
          $("#xzzDiscountAmount_se").removeClass('hide');
      }
    if(res.data.carType=="1" && res.data.businessTypeId=="1"){//是否贴息
      $("#isDiscount_se").show();
      if(res.data.isDiscount===1){
        $("#discountAmount_se,#isAdvanceDiscount_se").show();
      }
    }
    if(res.data.isDiscount===1){ //是贴息业务
      $(".discount_se").show();
    }
    if(res.data.viceSignerName=="" || res.data.viceSignerName==null){
      $("#viceSignerNameC").hide(); //若无副签单员则隐藏
    }
    if(res.data.carType==2){
      //如果是二手车
      $("#isSecondCar").show();
      $("#valuationFeeTip").removeClass('hide');
    }
    if(res.data.premiumType!=1){
      $("#insuranceBox").hide();
    }
    $("#approvalBudgetInfoForm").values(res.data);
  }
});

//反担保信息-抵/质押信息
comn.ajax({
  url: interUrl.loanDetail.getLoanAssetsInfo,
  data: {projectId:args['projectId']},
  success: function (res) {
    $("#approvalGuarantorForm").values(res.data);
  }
});

//保证人信息table
table_guarantor = function (params) {
	tableData(
		params,
		{
			projectId: args['projectId']
		},
		interUrl.loanDetail.getLoanGuarantorInfo
	); 
};

$("#table_guarantor").bootstrapTable(comn.table); 
  //汽车信息
  comn.ajax({
    url: interUrl.loanDetail.getLoanCarInfoAndLicensePlateInfo,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
      $("#carForm").values(res.data); //汽车信息
        if (res.data.carType == "2") {
            $("#tab13").removeClass("hide");
        }
      //贷中管理-上牌信息
      if(res.data.isRegistered==1){ //已上牌或没有上牌信息
        $("#switch").html($("#tpl_1").html());
        if(res.data.registerTarget==2){
          $("#companyNameS,#companyCodeS").hide();
        }
      }else if(!res.data.isRegistered){
        $("#switch").html($("#tpl_1").html());
      }
      else{
        $("#switch").html($("#tpl_2").html());
      }
      $("#licenseInfo").values(res.data);

    }
  });

////通用流程意见获取
var dataLoad_opinion, lowFeeDataLoad_opinion;
dataLoad_opinion = function (params) {
	tableData(
		params,
		{
			'boId': args['projectId']
		},
		interUrl.loanDetail.flowLoan
	);
};
lowFeeDataLoad_opinion = function (params) {
    tableData(
        params,
        {
            projectId: args['projectId']
        },
        interUrl.lowFee.flow
    );
};

var table_repaymentPlan;
  //合同信息-信用卡贷款登记
  comn.ajax({
    url: interUrl.loanDetail.infoQueryGetLoanContractInfo,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
      $("#contractForm").values(res.data);

        //还款计划 api=getPreLoanContractRepayPlanList
        table_repaymentPlan = function (params) {
          if (res.data.id) {
			tableData(
				params,
				{
					'contractId': res.data.id
				},
				interUrl.loanDetail.getLoanContractRepayPlanList
			); 
          }else{
            return params.complete();
          }
        };
      $("#table_repaymentPlan").bootstrapTable(comn.table);
    }
  });

  //贷中管理-抵押情况 plateInfoForm  api=getPledgeInfoInfo
  comn.ajax({
    url: interUrl.loanDetail.getPledgeInfoInfo,
    data: {
      projectId: args['projectId']
    },
    success: function (res) {
      if(res.data.pledgeStatus){
        if(res.data.pledgeStatus==1){
          $("#switch2").html($("#tpl_1_1").html());
        }else{
          $("#switch2").html($("#tpl_2_2").html());
        }
        $("#plateInfoForm").values(res.data);
      }else{
        //$("#plateInfo").hide();
      }
    }
  });

  //贷中管理-银行放款信息 recordInfo api=getBankRemittanceInfo
  comn.ajax({
    url: interUrl.loanDetail.getBankRemittanceInfo,
    data: {
      projectId: args['projectId']
    },
    success: function (res) {
        $("#recordInfo").values(res.data);
    }
  });

  //贷中管理-还款卡信息 repaymentInfo  api=getRepaymentCardInfo
  comn.ajax({
    url: interUrl.loanDetail.getRepaymentCardInfo,
    data: {
      projectId: args['projectId']
    },
    success: function (res) {
      if(res.data.deliverType){
        if(res.data.deliverType==1){
          $("#switch3").html($("#tpl_3_1").html());
        }else if(res.data.deliverType==2){
          $("#switch3").html($("#tpl_3_2").html());
        }else if(res.data.deliverType==3){
          $("#switch3").html($("#tpl_3_3").html());
        }
      }
      $("#repaymentInfo").values(res.data);
    }
  });

setStep = function(data, $el) {
var item, setArr;

setArr = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = data.length; i < len; i++) {
	item = data[i];
	results.push({
	  title: item.nodeName,
	  isSubmitted: item.isSubmitted,
	  content: item.submitDate
	});
  }
  return results;
})();

$el.loadStep({
  size: "small",
  color: "green",
  steps: setArr
});
};

function tabChange(id) {
	$("body")[0].scrollTop = 0;
	$('.nav-tabs a[href="#'+ id +'"]').tab('show');
}

var documentDeliverFlowCurrentNodeName = function(businessTypeCode, $el){
	comn.ajax({
		url: interUrl.gr.getFlowPath,
		data: {
			projectId: args['projectId'],
			businessTypeCode: businessTypeCode
		},
		success: function(res) {
			setStep(res.data, $el);
		}
	});
};

var loanFlowCurrentNodeName = function(flowType){
	comn.ajax({
		url: interUrl.gr.getFlowPath,
		data: {
			projectId: args['projectId'],
			businessTypeCode: flowType
		},
		success: function(res) {
			loanFlowCurrentNodeName = null;
			setStep(res.data, $(".ystep1"));
		}
	}); 
};

$(function () {
  if(args['loanFlag'] == '2'){
	$('#tab5 a[href="#detail"]').tab('show'); 
  }
  if(args['loanApplyId']){ $("#btn-print-budget").removeClass("hide"); }

  //总揽信息 
  comn.ajax({
    url: interUrl.gr.getLoanInfoOverview,
    data: {
      projectId: args['projectId']
    },
    success: function(res) {
      if (res.data.loanType == 2) {
        $(".flow-img").removeClass("hide");
      }
	  if(res.data.maritalStatus == 1){ $("#maritalStatusIsShow").removeClass("hide"); }
      $("#allInfo").nameValues(res.data);

	  $("a[data-name='loanFlowCurrentNodeName']").click(function(){
		  var cls = $(this).data("target");
		  if(typeof(loanFlowCurrentNodeName) == "function"){
			  loanFlowCurrentNodeName(res.data.flowType); 
		  }
		  $("." + cls).removeClass("hide").siblings().addClass("hide");
	  }); 
    }
  });

  var businessTimes = {documents: 0, senconds: 0};
  $("a[data-name='documentDeliverFlowCurrentNodeName'], a[data-name='secondCarFlowCurrentNodeName']").click(function(){
	  var cls = $(this).data("target"), dName = $(this).data("name");
	  if(dName == "documentDeliverFlowCurrentNodeName"){
		  if(businessTimes.documents == 0){
			  (function(){
				  businessTimes.documents++;
				  documentDeliverFlowCurrentNodeName("DOCUMENT_TRANSMIT_FLOW", $("." + cls)); 
			  })(); 
		  }
	  }else if(dName == "secondCarFlowCurrentNodeName"){
		  if(businessTimes.senconds == 0){
			  (function(){
				  businessTimes.senconds++;
				  documentDeliverFlowCurrentNodeName("SECOND_HAND_CAR_TRANSFER_FLOW", $("." + cls)); 
			  })(); 
		  }
	  }
	  $("." + cls).removeClass("hide").siblings().addClass("hide");
  }); 
});

