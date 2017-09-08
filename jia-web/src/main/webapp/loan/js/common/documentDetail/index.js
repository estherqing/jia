var args, base64, cureent_dir, freeObj, getDocumentList, getSelectImage, loadTree,treeObj, targetDir, treeTarget, zTreeOnClick, allImg,reviewLen, imgIds = {};

jQuery.browser = {};
var m = {}, args = args || comn.getArgs();
m.loanApplyId = args['id'] || args['loanApplyId'];
(function() {
  jQuery.browser.msie = false;
  jQuery.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    jQuery.browser.msie = true;
    return jQuery.browser.version = RegExp.$1;
  }


  freeObj = null;

  treeTarget = null;

  cureent_dir = null;

  getDocumentList = null;

  targetDir = null;

  imgType = null;

  var pictures = document.querySelector('#documentList');
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
    view:  function (e) {
      var _index = e.detail.index, item = $(viewer.images[_index]).parents(".file").data("file");
      if(item.hasRead == 1){
        if(!imgIds[item.dirId]){
          imgIds[item.dirId] = [];
        }
        if(imgIds[item.dirId].indexOf(item.id) == -1){
          imgIds[item.dirId].push(item.id);
        }
      }
    },
    viewed: function(e){},
    hide: function(e){
      window.parent.toggleTopNav();
    },
    hidden: function(e){
      for(item in imgIds){
        $.each(imgIds[item], function(index, item){
          $($("#documentList")).find(".file[data-id='"+ item +"']").find(".glyphicon").css("color", "#1ab394");
        });
        comn.ajax({
          url: interUrl.gr.recordDocQueryHistory,
          type: "post",
          data: {
            loanApplyId: m.loanApplyId,
            dirId: item,
            fileNamespace: args['space'] || "",
            releventFlow: args['releventFlow'] || "",
            releventFlowNode: args['releventFlowNode'] || "",
            docIds: imgIds[item].join(",")
          },
          success: function(res){ }
        });
      }
    }
  };

  base64 = function(file, index, callback) {
    return lrz(file).then(function(rst) {
      var imgRst;
      imgRst = rst.base64;
      return typeof callback === "function" ? callback(file, imgRst, index) : void 0;
    });
  };

  imgListHtml = function(o, list){
    $("#addressCompare").addClass('disabled');
    if(o.id==10205 || o.id==10203 || o.id==10201 || o.id==10307 || o.id==10304 || o.id==10305){
      $("#addressCompare").removeClass("hidden");
      if(list.length>0){
        $("#savePlace").removeClass('hidden');
          if(list[0].keepAddr && list[0].keepUserName){
              $('#savePlace').html("<p>保管地:&nbsp;"+list[0].keepAddr+"&nbsp;&nbsp;&nbsp;保管员:&nbsp;"+list[0].keepUserName+"</p>")
          }
      }else{
        $("#savePlace").addClass('hidden');
      }
    }else{
      $("#addressCompare").addClass("hidden");
      $("#savePlace").addClass('hidden');
    }
    results = [];
    for (j = 0, len = list.length; j < len; j++) {
      item = list[j];
      console.log(item);
      results.push([
        item.fileType== "1" ? "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" : "<div class='col-xs-8 col-sm-8 col-md-8 col-lg-8'>",
        "<div class='file' data-file='" + (JSON.stringify(item)) + "' data-id='"+ item.id +"'>",
        "<div class='image text-center' data-id='" + item.id + "' style='position: relative; height: auto;'>",
        item.fileType == "1" ?
        "<img data-original='"+ item.filePath +"' alt='"+ item.fileName +"' src='" + item.filePath + "' height='100' />" : ( item.fileType == "2" ? [
          "<video class='video-js vjs-default-skin' controls preload='none' data-setup='{}'>",
          "<source src='" + item.filePath + "' type='video/mp4' />",
          "</video>"
        ].join("") : ""),
        imgType == "deleted" ?
            ["<div style='position: absolute; top:0; left:0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.3); color: red;'> ",
              "<h5 class='text-center'>【" + item.modifyRealname + "】</h5>",
              "<h5 class='text-center'>" + item.modifyTime + "</h5>",
              "<h5 class='text-center'>已删除</h5>",
              "</div>"].join("") : "",
        "</div>",
        "<div class='file-name' style='text-overflow: ellipsis; overflow: hidden;'>",
        "<p style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap;' title='"+ item.fileName +"'>" + item.fileName + "</p>",
          item.userName ? "<p>上传人："+ item.userName +"</p>" : "",
        "<div>",
        "<i class='glyphicon glyphicon-eye-open' style='color: " + (item.hasRead === 1 ? "#CCD5D3" : "#1ab394") + ";'></i>",
        cureent_dir.canDelete === 1 || cureent_dir.canMove === 1 ? "<input type='checkbox' name='pic' class='pull-right' value='" + item.id + "' style='margin: 0;' />" : "<input type='checkbox' name='pic' class='pull-right' value='" + item.id + "' style='margin: 0;' />",
        "</div>",
        "</div>",
        "</div>",
        "</div>"
      ].join(""));
    }
    return [
      "<h4 class='section-title'>"+ o.title +"</h4>",
      "<div class='row'>",
      (results.join("") || "<div class='col-xs-24 col-sm-24 col-md-24 col-lg-24 text-center'><h2>暂无图片!</h2></div>"),
      "</div>"
    ].join("");
  }

  zTreeOnClick = function(event, treeId, treeNod) {
    var page;
    $("#fileList tbody").html("");
    //if (!treeNod.isParent) {
    if (true) {
      if (treeNod.docType === "1") {
        $("#upMovie").addClass("hide");
      } else if (treeNod.docType === "2") {
        $("#upMovie").removeClass("hide");
      }
      $("#upImage, #removed").removeClass("disabled");
      $("#moveImage, #delImage").addClass("disabled");
      $("#removed").html("<span>查看已删除影像</span>");
      cureent_dir = treeNod;
      console.log(cureent_dir);
      page = 0;
      imgType = null;
      $("#documentList").html("");
      getDocumentList = function(o) {
        page = (o && o.curPage) || ++page;
        if (page === 1) {
          $("#documentList").html("");
        }
        return comn.ajax({
          url: (o && o.url) || interUrl.gr.documentList,
          data: {
            loanApplyId: m.loanApplyId,
            dirId: cureent_dir['id'],
            fileNamespace: args['space'] || "",
            releventFlow: args['releventFlow'] || "",
            releventFlowNode: args['releventFlowNode'] || "",
            type: imgType,
            page: page || 1,
            pageSize: 1000000
          },
          success: function(res) {
            var item;
            if (cureent_dir.canUpload === 2) {
              $("#upImage, #upload, #upMovie").addClass("hide");
            } else {
              if(cureent_dir.docType == "1"){
                $("#upImage, #upload").removeClass("hide");
              }else if(cureent_dir.docType == "2"){
                $("#upImage, #upload").addClass("hide");
                $("#upMovie").removeClass("hide");
              }
            }
            if (cureent_dir.canDelete === 2) {
              $("#delImage, #removed").addClass("hidden");
            } else {
              $("#delImage, #removed").removeClass("hidden");
            }
            if (cureent_dir.canMove === 2) {
              $("#moveImage").hide();
            } else {
              $("#moveImage").show();
            }
            if (page === 1) {
              $("#moveImage, #delImage, #btnPrint, #sendContract").addClass("disabled");
            }
            if([301, 30, 105, 40101].indexOf(cureent_dir.id) != -1){
              $("#sendBanck, #sendContract, #signDatum").addClass("hidden");
              $("#delImage").html("<span>取消标识文件</span>");
              $("#delDocument").find(".modal-body h4").text("确定取消文件标识?");
              if(imgType != "deleted"){
                if(($.inArray(args['releventFlowNode'], ["LOAN_CAR_FINANCE"]) != -1) && args['releventFlow'] == "LOAN_APPLY_FLOW"){
                  $("#removed").html("<span>查看已取消资产方可见文件</span>");
                  $("#delImage").html("<span>取消资产分发可见</span>")
                  $("#delDocument").find(".modal-body h4").text("确定取消资产分发可见?");
                }else{
                  $("#removed").html("<span>查看已取消标识文件</span>");
                }
              }
            }else{
              if((args['releventFlowNode'] == "DOCUMENT_VERIFY" || args['releventFlowNode'] == "COPY_CONTRACT" || args['releventFlowNode'] == "DOCUMENT_REVIEW") && args['releventFlow'] == "DOCUMENT_TRANSMIT_FLOW"){
                $("#sendBanck").removeClass("hidden");
              }else if(args['releventFlow'] == "INSURANCE_DISPATCHN_FLOW" && args['releventFlowNode'] == "INSURANCE_DISPATCHN_LAUNCH"){ //保险分发流程第一个节点(保险发起)
                $("#signDatum").removeClass("hidden");
              }else if(($.inArray(args['releventFlowNode'], ["LOAN_CAR_FINANCE"]) != -1) && args['releventFlow'] == "LOAN_APPLY_FLOW"){
                $("#sendContract").removeClass("hidden");
              }

              $("#delImage").html("<span>删除文件</span>");
              $("#delDocument").find(".modal-body h4").text("确定删除当前文件？");
            }


            allImg = res.data;
            $("#documentList").html(function(){
              var html = "", list = res.data;
              if (!treeNod.isParent) {
                html += imgListHtml({title: cureent_dir.title,id:cureent_dir.id}, list);
              }else{
                for (var i = 0, len = list.length; i < len; i++) {
                  html += imgListHtml({title: list[i].directoryPath }, list[i].loanDocumentVoList);
                }
              }
              return html;
            });
            if(viewer){
              viewer.destroy();
            }
            viewer = new Viewer(pictures, options);
          }
        });
      };
      return getDocumentList();
    } else {
      return $("#upImage").addClass("disabled");
    }
  };

  getSelectImage = function() {
    var arr;
    arr = {
      id: [],
      item: []
    };
    $("#documentList .file-name").find("input[name='pic']:checked").each(function() {
      arr.id.push($(this).val());
      return arr.item.push($(this).parents(".col-md-6"));
    });
    return arr;
  };
  //$(document).on('click','.checkResult',function(){
  //  var val=$(this).find('input').val();
  //  if(val==3){
  //      $("#check").removeClass('hidden');
  //  }else{
  //    $("#check").addClass('hidden');
  //  }
  //});
  loadTree = function() {
    var url;
    $.fn.zTree.destroy();
    url = args['isFlow'] === "yes" ? interUrl.gr.documentDir : interUrl.gr.documentAllDir;
    return comn.ajax({
      url: url,
      data: {
        loanApplyId: m.loanApplyId,
        fileNamespace: args['space'] || "",
        releventFlow: args['releventFlow'] || "",
        releventFlowNode: args['releventFlowNode'] || "",
          assetsPackageId: args["assetsPackageId"] || ""
      },
      success: function(res) {
        if(args['loanFlag'] != '2'){
          $(".checkData").addClass("hidden");
        }else{
          comn.ajax({
            url: interUrl.gr.documentGetCheckStatus,
            data: {
              projectId: args['projectId']
            },
            success: function(res){
              //if(res.data.documentCheckStatus==3){
              //  $("#check").removeClass('hidden');
              //}
              $("input[name=documentCheckUserName]").val(window.parent.userName.innerHTML);
              $("#checkForm, #checkForm1").values(res.data);
              //$("#checkForm").values({
              //  documentCheckStatus: res.data.documentCheckStatus
              //  //documentKeepAddr:res.data.documentKeepAddr,
              //  //documentRmk:res.data.documentRmk,
              //  //documentCheckUserName:res.data.documentCheckUserName
              //});
            }
          })
        }
        treeObj = $.fn.zTree.init($("#tree"), {
          check: {
            enable: args['loanFlag']=='2',
            chkDisabledInherit: true,
            chkStyle: "checkbox"
          },
          data: {
            key: {
              checked: 'canTick'
            }
          },
          showLine: true,
          expand: true,
          callback: {
            onClick: zTreeOnClick
          }
        }, res.data);
        treeTarget = $.fn.zTree.init($("#targetTree"), {
          showLine: true,
          expand: true,
          callback: {
            onClick: function(event, treeId, treeNod) {
              if (!treeNod.isParent) {
                targetDir = treeNod;
                return $("#targetSure").removeClass("disabled");
              } else {
                return $("#targetSure").addClass("disabled");
              }
            }
          }
        }, res.data);
        treeTarget.expandAll(true);
        return treeObj.expandAll(true);
      }
    });
  };

  handle = function(o) {
    return comn.ajax({
      url: o.url || "",
      data: {
        loanApplyId: m.loanApplyId,
        dirId: o.dirId,
        documentIds: getSelectImage()['id'].join(","),
        fileNamespace: args['space'] || "",
        releventFlow: args['releventFlow'] || "",
        releventFlowNode: args['releventFlowNode'] || ""
      },
      success: function(res) {
        var i, j, len, ref;
        loadTree();
        ref = getSelectImage()['item'];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          $(i).remove();
        }
        $("#moveImage, #delImage").addClass("disabled");
        return typeof o.callback === "function" ? o.callback(res) : void 0;
      }
    });
  };
})();
$(function() {
  loadTree();
  $(".checkbox-inline").click(function(){
    $(this).children("input").prop("checked", true);
  });
  $("#subTree").click(function(){
      $("#result1 form").map(function(){
          $(this).next("#result-error").remove();
      });
      var nodes = treeObj.getCheckedNodes(true), nodeArr = [];
      for (var i = 0, len = nodes.length; i < len; i++) {
       if(!nodes[i].isParent){
         nodeArr.push(nodes[i].id);
       }
      }
      var documentCheckStatus = $("input[name='documentCheckStatus']:checked").val();
      //var documentKeepAddr = $("input[name='documentKeepAddr']:checked").val();
      var documentRmk = $("#documentRmk").val();
      var documentCheckUserName = $("input[name='documentCheckUserName']").val();
      var _a = {projectId: args['projectId'], documentCheckStatus: documentCheckStatus};
      var _b = {DocumentCheckItem: $("#documentCheckResultTable").bootstrapTable('getData')};
      var num = 0;
      $("#checkForm").validate();
      $("#result1 form").map(function(){
          $(this).validate();
          if($(this).valid() == true){
              num++
          }
      });
      var _data = JSON.stringify(_b);
      var _dataObj = JSON.parse(_data);
      var _len = _dataObj.DocumentCheckItem.length;
      if (num == _len){
          $("#documentCheckStatus1").prop("disabled", "disabled");
          if(documentCheckStatus == 2) return tip({content: '核实内容项已经勾选，核对结果不能选择“未核对”'})
          if($(".checkResultY:checked").length != _len && documentCheckStatus == 3) {
              return tip({content: "核实内容需全部选【是】才能勾选核对无误，请确认！"})
          } else {
              if($("#checkForm").valid()==true){
                  comn.ajax({
                      url: interUrl.gr.updateDocumentCheckItem,
                      data: {documentCheckItemString: JSON.stringify($.extend(_a, _b))},
                      success: function(res){
                          comn.ajax({
                              url: interUrl.gr.documentUpdateResult,
                              data: {
                                  documentCheckResult: nodeArr.join(","),
                                  projectId: args['projectId'],
                                  documentCheckStatus: documentCheckStatus,
                                  //documentKeepAddr:documentKeepAddr,
                                  documentRmk:documentRmk,
                                  documentCheckUserName:documentCheckUserName
                              },
                              success: function(res){
                                  tip({content: '保存成功! '});
                              }
                          })
                      }
                  })
              }
          }
      }

      //if(nodeArr.length != 0){
      //
      //}else{
      //    tip({content: '请选中后再进行提交! '});
      //}
  });

  $("#sendBanck").click(function(){
    if (!$(this).hasClass("disabled")) {
      comn.ajax({
        url: interUrl.gr.documentCopy,
        data: {
          destDirId: '301',
          documentIds: getSelectImage()['id'].join(",")
        },
        success: function(res){
          loadTree();
          tip({content: "文件标识成功！"});
        }
      });
    }
  });

  $("#sendContract, #signDatum").click(function(){
    var _this = this;
    if (!$(this).hasClass("disabled")) {
      comn.ajax({
        url: interUrl.gr.assetDistribution,
        data: {
          loanApplyId: m.loanApplyId,
          fileNamespace: _this.id == "sendContract" ? "ASSET_PACKAGE" : "INSURANCE_DISTRIBUTION",
          documentIds: getSelectImage()['id'].join(","),
          destDirId: _this.id == "signDatum" ? "40101" : null
        },
        success: function(res){
          loadTree();
          tip({content: _this.id == "signDatum" ?  "标识文件成功! " :  "资产分发可见成功！"});
        }
      });
    }
  });

  $("#removed").click(function() {
    if (imgType === "deleted") {
      if (!$(this).hasClass("disabled")) {
        return $("#replayFile").modal("show");
      }
    } else {
      imgType = "deleted";
      $(this).addClass("disabled").html("<span>恢复文件</span>");
      return getDocumentList({
        curPage: 1
      });
    }
  });

  //加载更多
  //$("#imgLoadMore").click(function() {
  //if (!$(this).hasClass("disabled")) {
  //return getDocumentList();
  //}
  //});
  $("#delImage").click(function() {
    if (!$(this).hasClass("disabled")) {
      return $("#delDocument").modal("show");
    }
  });
  $("#moveImage").click(function() {
    if (!$(this).hasClass("disabled")) {
      return $("#targetDir").modal("show");
    }
  });
  $("#upMovie").click(function() {
    return $("#upMovieInput").trigger("click");
  });
  $("#upImage").click(function() {
    if (!$(this).hasClass("disabled")) {
      return $("#upImageInput").trigger("click");
    }
  });
  $("#replay").click(function() {
    return handle({
      url: interUrl.gr.recoveryFile,
      dirId: cureent_dir['id'],
      callback: function(res) {
        return $("#replayFile").modal("hide");
      }
    });
  });
  $("#delSure").click(function() {
    if (!$(this).hasClass("disabled")) {
      return handle({
        url: interUrl.gr.delDocument,
        dirId: cureent_dir['id'],
        callback: function(res) {
          return $("#delDocument").modal("hide");
        }
      });
    }
  });
  $("#targetSure").click(function() {
    if (!$(this).hasClass("disabled")) {
      return handle({
        url: interUrl.gr.moveDocument,
        dirId: targetDir['id'],
        callback: function(res) {
          return $("#targetDir").modal("hide");
        }
      });
    }
  });
  $("#btnPrint").click(function() {
    var picArr;
    if (!$(this).hasClass("disabled")) {
      picArr = [];
      $.each(getSelectImage()['item'], function(index, item) {
        var url;
        url = item.find(".file").data("file")['filePath'];
        return picArr.push(url);
      });
      return window.open("../../../Modal/common/documentDetail/imagePrint.html?imgUrl=" + picArr.join(","));
    }
  });
  $("#documentList").on("click", ".file-name", function(e) {
    var $checkbox, $els;
    $els = $("#moveImage, #delImage, #btnPrint, #sendContract, #sendBanck, #signDatum");
    if (!$(e.target).is(":input")) {
      $checkbox = $(this).find("input:checkbox")[0];
      $checkbox.checked = !$checkbox.checked;
    }
    if(getSelectImage()['id'].length == 1){
      $("#addressCompare").removeClass('disabled');
    }else{
      $("#addressCompare").addClass('disabled');
    }
    if (getSelectImage()['item'].length > 0) {
      if (imgType === "deleted") {
        return $("#removed, #btnPrint").removeClass("disabled");
      } else {
        return $els.removeClass("disabled");
      }
    } else {
      if (imgType === "deleted") {
        return $("#moveImage, #delImage, #removed, #btnPrint").addClass("disabled");
      } else {
        return $els.addClass("disabled");
      }
    }
  });
  $("#upImageInput").change(function() {
    var fileArr, html, i, j, k, len, results;
    fileArr = this.files;
    results = [];
    for (k = j = 0, len = fileArr.length; j < len; k = ++j) {
      i = fileArr[k];
      html = "";
      results.push(base64(i, k, function(f, o, index) {
        html = ["<tr>",
          "<td>",
          "<img src='" + o + "' width='80' />",
          "<input name='LoanDocuments[0].fileName' class='hide' value='" + f.name + "' />",
          "</td>",
          "<td>" + f.name + "</td>",
          "<td>" + (((f.size * 0.5) / 1048576).toFixed(2)) + "M</td>",
          "<td data-name='imgHandle'>",
          "<button type='button' class='btn btn-danger btn-sm upCancle'><span>取消上传</span></button>",
          "</td>",
          "</tr>"].join("");
        return $("#fileList tbody").prepend(html);
      }));
    }
    return results;
  });

  $("#upMovieInput").change(function() {
    var file;
    file = this.files[0];
    return $.ajaxFileUpload({
      url: interUrl.basic + interUrl.gr.upFile,
      secureuri: false,
      fileElementId: 'upMovieInput',
      data: {
        loanApplyId: m.loanApplyId,
        dirId: cureent_dir['id'],
        fileName: file.name,
        fileNamespace: args['space'] || "",
        releventFlow: args['releventFlow'] || "",
        releventFlowNode: args['releventFlowNode'] || ""
      },
      dataType: "json",
      success: function(data, status) {
        tip({content: '上传视频成功！'});
        loadTree();
      },
      complete: function() {
      },
      error: function(data, status, e) {
        return console.log(e);
      }
    });
  });

  $("#downLoad").click(function() {
    return window.open(interUrl.basic + interUrl.gr.downLoad + ("?loanApplyId=" + m.loanApplyId + "&fileNamespace=" + (args['space'] || '') + "&releventFlow=" + (args['releventFlow'] || '') + "&releventFlowNode=" + (args['releventFlowNode'] || '')));
  });
  $("#fileList tbody").on("click", ".upCancle", function() {
    return $(this).parents("tr").remove();
  });
  return $("#upload").click(function() {
    var $tr, $trAll, maxImg, num, upImg;
    $tr = $("#fileList tbody").find("tr:not('.loaded')");
    $trAll = $("#fileList tbody").find("tr");
    num = $tr.index();
    if (num === -1) {
      return;
    }
    maxImg = $tr.length;
    return upImg = setInterval((function(_this) {
      return function() {
        var cur_tr;
        cur_tr = $trAll.get(num);
        if (!$(cur_tr).hasClass("loaded")) {
          comn.ajax({
            url: interUrl.gr.uploadImage,
            data: $.extend($(cur_tr).values(), {
              loanApplyId: m.loanApplyId,
              dirId: cureent_dir['id'],
              fileNamespace: args['space'] || "",
              releventFlow: args['releventFlow'] || "",
              releventFlowNode: args['releventFlowNode'] || "",
              "LoanDocuments[0].filePath": $(cur_tr).find("img").eq(0).attr("src")
            }),
            success: function(res) {
              $(cur_tr).addClass("loaded").nameValues({
                imgHandle: "<span class='text-success'>上传成功！</span>"
              });
              if (maxImg === 0) {
                getDocumentList({ curPage: 1 });
                return loadTree();
              }

            }
          });
        }
        num++;
        if (!(--maxImg)) {
          return clearInterval(upImg);
        }
      };
    })(this), 100);
  });
});
$("#addressCompare").click(function(){
  if(getSelectImage()['id'].length==1){
    comn.ajax({
      url:interUrl.gr.getDocumentCoordinate,
      data:{
        docId:getSelectImage()['id'][0]
      },
      success:function(res){
        comn.addTab({
          title:'上传地和保管地对比',
          href:'./Modal/common/documentDetail/compareAddress.html?' +
          'keepAddrLatitude='+res.data.keepAddrLatitude+'&keepAddrLongitude='+res.data.keepAddrLongitude+
          '&photographLatitude='+res.data.photographLatitude+'&photographLongitude='+res.data.photographLongitude
        })
      }
    })
  }
});

var tableConfig = $.extend(JSON.parse(JSON.stringify(comn.table)), {
    'pagination': false,
    'height': 'auto'
});
if(args["releventFlowNode"] === "LOAN_DOCUMENT_CHECK") {
    documentCheckResult = function(params) {
        tableData(params, {projectId: args["projectId"]}, interUrl.mockList || interUrl.gr.getDocumentCheckItem);
    };
}
if(args["projectId"]) {
    $("#documentCheckResultTable").bootstrapTable(tableConfig);
}
checkResult = function (value, item) {
    var value_0 = "<form><label><input type='radio' value='1' class='checkResult checkResultY required' name='result'/>是</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type='radio' class='checkResult checkResultNo required' value='0' name='result' checked/>否</label></form>"
    var value_1 = "<form><label><input type='radio' value='1' class='checkResult checkResultY required' name='result' checked/>是</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type='radio' class='checkResult checkResultNo required' value='0' name='result'/>否</label></form>";
    var value_2 = "<form><label><input type='radio' value='1' class='checkResult checkResultY required' name='result'/>是</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type='radio' class='checkResult checkResultNo required' value='0' name='result'/>否</label></form>";
    return [value_0, value_1, value_2][value] || value_2;
};

checkResultEvent = {
    "change .checkResult": function (e, value, row, index) {
        row.result = $(this).val();
        $(this).parents("form").next("#result-error").remove();
    }
}

var _type;
if (args["currentNodeKey"] === "COPY_CONTRACT") {
    _type = 1;
    $("#isFieldset").prop("disabled", "disabled");
    $("#reviewName").html("复核内勤复核线上发送银行文件的结果");
}
if (args["currentNodeKey"] === "DOCUMENT_REVIEW") {
    _type = 2;
    $("#saveReview").show();
    $("#reviewName").html("待复核线上发送银行影像文件内容项");
}
if (args["currentNodeKey"] === "COPY_CONTRACT" || args["currentNodeKey"] === "DOCUMENT_REVIEW"){
    comn.ajax({
        url: interUrl.common.getReviewItem,
        data: {
            deliverId : args['businessId'],
            type: _type
        },
        success: function(res){
            if (res.data && (args["currentNodeKey"] === "COPY_CONTRACT" || args["currentNodeKey"] === "DOCUMENT_REVIEW")) {
                $("#getReviewContForm").removeClass("hide");
                $("#isClick").val("wzBank"); //此val代表是温州银行
                getReviewContent(res.data);
                reviewLen = res.data.length;
            }
        }
    })
}

$(document).on('click', 'input[name=check]', function(){
    $(this).parents("form").next(".error").remove();
})
$(document).on('change', '.isCheckAll', function(){
    if($(this).prop("checked") === false){
        $(this).val("0").addClass("noCheck")
    } else {
        $(this).removeClass("noCheck").val("1")
    }
})
$(document).on("change", "#getReviewContForm input", function(){
    $("#isSave").val("firstSaveReview")
});
$(document).on("click", ".reviewContentForm input", function(){
    $("#isSave").val("firstSaveReview")
})
//保存复核内容
$("#saveReview").click(function (e) {
    $(".isClear").val("");
    $(".error").remove();
    var num = 0;
    isApprove();
    onlySaveReview()
});
function isApprove(){
    $(".reviewContentForm").map(function(){
        $(this).validate();
        if($(this).find("input[name='check']:checked").val() == '0'){
            $("#isCheck0").val("hasZeroCheck")
        }
    });
    if ($(".noCheck").length > 0) {
        $("#isCheckNo").val("hasCheckNo")
    }
}
function onlySaveReview(){
    var _a = {
        deliverId : args['businessId']
    }
    var _b=getReviewList();
    comn.ajax({
        url: interUrl.common.saveReviewItem,
        data: {reviewItemString:JSON.stringify($.extend(_a, _b))},
        success: function(res) {
            tip({content:'保存成功!'});
        }
    });
}
function  getReviewList() {
    var loanReviewFileVos=[],i,j;
    var list1=$(".review_temp").not('.hide');
    var len=list1.length;
    for(i=0;i<len;i++){
        var loanReviewItemList=[];
        var _a=list1.eq(i).find(".reviewContentForm").values();
        var list2=list1.eq(i).find('.otherReviewFiles .checkbox-inline');
        for(j=0;j<list2.length;j++){
            var _b=list2.eq(j).values();
            loanReviewItemList.push(_b);
        }
        loanReviewFileVos.push($.extend(_a,{subItems:loanReviewItemList}));
    }
    return {reviewItem:loanReviewFileVos};
}
//复核内容
function getReviewContent(list) {
    $("#putContent").html("");
    var temp=$(".review_temp");
    if(list.length){
        $.each(list,function (i,v) {
            var a=temp.clone(true);
            a.removeClass('hide').find('.reviewContentTitle').text(v.itemName);
            a.values(v);
            a.find('.otherReviewFiles').html(getCheckReviewList(v.subItems));
            $('#putContent').append(a);
        })
    }

    function getCheckReviewList(checkList) {  //isProvide
        var arr=[];
        if(checkList && checkList.length>0){
            $.each(checkList,function (i,v) {
                var t = '<label class="checkbox-inline"><input type="hidden" name="id" value="'+ v.id +'"><input type="hidden" name="itemName" value="'+ v.itemName +'"><input type="checkbox" class="isCheckAll '+ (v.check === '1' ? '' : 'noCheck')+'" name="check" '+ (v.check === '1' ? 'checked' : '')+' value="'+ (v.check === '1' ? '1' : '0') +'">'+v.itemName+'</label>'
                arr.push(t);
            })
            return arr.join("");
        }
    }
}