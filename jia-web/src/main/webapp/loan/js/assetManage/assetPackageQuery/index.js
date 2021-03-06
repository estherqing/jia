var dataLoad_1,dataLoad_2,dataLoad_3, handle, tableEvent;

dataLoad_1 = function(params) {
  tableData(params, $("#searchForm").values(), interUrl.mockList || interUrl.asset.loanAssetPackage,function(){
      $("#table").off("click-row.bs.table").on('click-row.bs.table', function (e, row, $element) {
          assetsPackageId=row.id;
          // $("#table2, #table3").bootstrapTable("destroy").bootstrapTable(comn.table);
          var activeTab = $(".tab-content").find(".tab-pane.active").attr("id");
          if (activeTab == "home") {
              $("#table2").bootstrapTable("destroy").bootstrapTable(comn.table);
          } else if (activeTab == "tab") {
              $("#table3").bootstrapTable("destroy").bootstrapTable(comn.table);
          }
          $("#tablebox").removeClass('hide');
      });
      $('a[data-toggle="tab"]').off("shown.bs.tab").on('shown.bs.tab', function (e) {
          var activeTab = $(".tab-content").find(".tab-pane.active").attr("id");
          if (activeTab == "home") {
              $("#table2").bootstrapTable("destroy").bootstrapTable(comn.table);
          } else if (activeTab == "tab") {
              $("#table3").bootstrapTable("destroy").bootstrapTable(comn.table);
          }
      });
  });
};
dataLoad_2 = function(params) {
  tableData(params, $.extend({assetsPackageStatus: "1", assetsPackageId: assetsPackageId}, $("#searchForm").values(),$('#listSearchForm').values()), interUrl.mockList || interUrl.asset.getInAssetsPackage);
};
dataLoad_3 = function(params) {
  tableData(params, $.extend({assetsPackageStatus: "2", assetsPackageId: assetsPackageId}, $("#searchForm").values(),$('#listSearchForm').values()), interUrl.mockList || interUrl.asset.getInAssetsPackage);
};

tableEvent = {
  "click .info": function(e, a, item, index) {
    return comn.addTab({
      title: "查看详情",
      href: "./Modal/assetManage/assetPackageQuery/assetDetail.html?projectId="+item.projectId+"&loanApplyId="+item.relativeApplyId1
    });
  }
};

handle = function(value, row, index) {
  return ["<button type='button' class='btn btn-primary btn-xs info'>查看详情</button>"].join("");
};

switchColor = function(value, row, index){
  var str="";
  if(row['assetBalanceAmount'] < row['assetPackageAmount']){
    str = "<span class='text-danger'>" + row['assetBalanceAmount'] + "</span>";
  }else{
    str = "<span class='text-navy'>" + row['assetBalanceAmount'] + "</span>";
  }
  return str;
}

orgName = function(value, row, index){
	var val = value;
	if(value.indexOf("中安金控资产管理有限公司") != -1){
		val = value.replace("中安金控资产管理有限公司", ""); 
	}
	return val;
}

assetComount = function(value, row, index){
	return value; 
};
//导出
$('#exportBtn').click(function(){
  var downLink = interUrl.basic + interUrl.asset.export + "?assetsPackageId=" + assetsPackageId;
  console.log(downLink);
  window.open(downLink, "_blank");
});
$("#btn-search").unbind("click");

$("#btnSearch").click(function(){
  var activeTab = $(".list").find(".tab-pane.active").attr("id");
  console.log(activeTab);
  if (activeTab == "home") {
    $("#table2").bootstrapTable('refresh',{url:'...'});
  } else if (activeTab == "tab") {
    $("#table3").bootstrapTable('refresh',{url:'...'});
  }
})