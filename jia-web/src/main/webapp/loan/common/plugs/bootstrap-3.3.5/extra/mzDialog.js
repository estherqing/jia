(function($){$.fn.mzDialog=function(){var defaults={id:"modal",title:"信息提示",content:"确定这么操作？",backdrop:true,modalCls:"",keyboard:true,remote:"",openEvent:null,closeEvent:null,okEvent:null};var creatDialog={init:function(opts){var _self=this;var d=_self.dHtml(opts);var modal;if($("#"+opts.id).length==0){$("body").append(d);modal=$("#"+opts.id)}else{modal=$("#"+opts.id);$oTitle=modal.find(".modal-title");$oContent=modal.find(".modal-body > p");if(opts.title!=$oTitle){$oTitle.text(opts.title)}if(opts.content!=$oContent){$oContent.text(opts.content)}}modal.modal(opts);modal.modal("show").on("hidden.bs.modal",function(){$(".modal-backdrop").remove();if(opts.closeEvent){eval(opts.closeEvent)}}).on("shown.bs.modal",function(){if(opts.openEvent){eval(opts.openEvent)}$(this).find(".ok").unbind("click").click(function(){if(opts.okEvent){var ret=eval(opts.okEvent);if(ret){modal.modal("hide")}}})})},dHtml:function(o){return['<div id="'+o.id+'" class="modal fade" role="dialog" aria-hidden="true">','<div class="modal-dialog '+o.modalCls+'">','<div class="modal-content">','<div class="modal-header">','<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>','<h4 class="modal-title">'+o.title+"</h4>","</div>",'<div class="modal-body">',"<p>"+o.content+"</p>","</div>",'<div class="modal-footer">','<button class="btn btn-primary ok">确定</button>','<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>',"</div>","</div>","</div>","</div>"].join("")}};return this.each(function(){$(this).click(function(){var opts=$.extend({},defaults,{id:$(this).attr("data-id"),title:$(this).attr("data-mtitle"),content:$(this).attr("data-mcontent"),modalCls:$(this).attr("data-modalCls"),backdrop:$(this).attr("data-backdrop"),keyboard:$(this).attr("data-keyboard"),remote:$(this).attr("data-remote"),openEvent:$(this).attr("data-openEvent"),closeEvent:$(this).attr("data-closeEvent"),okEvent:$(this).attr("data-okEvent")});creatDialog.init(opts)})})}})(jQuery);$(function(){$(".dialog").mzDialog()});