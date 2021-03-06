var GlobaData = null, uId, args = comn.getArgs(), fontSize = window.parent.fontSize, uId = window.parent.uId, dataState = window.parent.dataState;
var titleSize=(args['type']==1)?fontSize*2:fontSize*3;
var paramsData = window.parent.paramsData;
dataState=0;
(function() {
	GlobaData = [{
		"Company": "沈阳",
		"ammountSum": 2042.17,
		"name": 2,
		"value": 299
	},
	{
		"Company": "台州",
		"ammountSum": 2223.42,
		"name": 522,
		"value": 252
	},
	{
		"Company": "温州",
		"ammountSum": 1937.87,
		"name": 478,
		"value": 250
	},
	{
		"Company": "重庆",
		"ammountSum": 1687.51,
		"name": 3,
		"value": 248
	},
	{
		"Company": "吉林",
		"ammountSum": 1628.98,
		"name": 4,
		"value": 226
	},
	{
		"Company": "黑龙江",
		"ammountSum": 1835.2,
		"name": 5,
		"value": 224
	},
	{
		"Company": "江西",
		"ammountSum": 1468.11,
		"name": 472,
		"value": 220
	},
	{
		"Company": "宁波",
		"ammountSum": 1822.42,
		"name": 538,
		"value": 215
	},
	{
		"Company": "山西",
		"ammountSum": 1213.54,
		"name": 6,
		"value": 214
	},
	{
		"Company": "成都",
		"ammountSum": 1484.59,
		"name": 7,
		"value": 211
	},
	{
		"Company": "贵州",
		"ammountSum": 1269.31,
		"name": 557,
		"value": 207
	},
	{
		"Company": "安徽",
		"ammountSum": 1441.48,
		"name": 8,
		"value": 201
	},
	{
		"Company": "广西",
		"ammountSum": 1130.18,
		"name": 9,
		"value": 196
	},
	{
		"Company": "云南",
		"ammountSum": 1852.87,
		"name": 10,
		"value": 195
	},
	{
		"Company": "福建",
		"ammountSum": 1333.66,
		"name": 11,
		"value": 185
	},
	{
		"Company": "山东",
		"ammountSum": 1426.98,
		"name": 12,
		"value": 176
	},
	{
		"Company": "西安",
		"ammountSum": 1206.60,
		"name": 13,
		"value": 173
	},
	{
		"Company": "广东",
		"ammountSum": 1317.88,
		"name": 14,
		"value": 168
	},
	{
		"Company": "湖南",
		"ammountSum": 1144.39,
		"name": 15,
		"value": 165
	},
	{
		"Company": "绍兴",
		"ammountSum": 1371.64,
		"name": 16,
		"value": 151
	},
	{
		"Company": "嘉兴",
		"ammountSum": 1221.72,
		"name": 17,
		"value": 150
	},
	{
		"Company": "湖北",
		"ammountSum": 1254.47,
		"name": 36,
		"value": 146
	},
	{
		"Company": "甘肃",
		"ammountSum": 1322.99,
		"name": 19,
		"value": 146
	},
	{
		"Company": "上海",
		"ammountSum": 1316.63,
		"name": 20,
		"value": 142
	},
	{
		"Company": "内蒙古",
		"ammountSum": 1344.32,
		"name": 21,
		"value": 141
	},
	{
		"Company": "内蒙古通辽",
		"ammountSum": 1078.45,
		"name": 22,
		"value": 141
	},
	{
		"Company": "丽水",
		"ammountSum": 927.4,
		"name": 23,
		"value": 140
	},
	{
		"Company": "义乌",
		"ammountSum": 1332.79,
		"name": 24,
		"value": 133
	},
	{
		"Company": "河北",
		"ammountSum": 838.87,
		"name": 25,
		"value": 131
	},
	{
		"Company": "湖州",
		"ammountSum": 1222.77,
		"name": 549,
		"value": 129
	},
	{
		"Company": "杭州",
		"ammountSum": 1155.78,
		"name": 26,
		"value": 127
	},
	{
		"Company": "河南",
		"ammountSum": 9004.96,
		"name": 27,
		"value": 125
	},
	{
		"Company": "海南",
		"ammountSum": 1271.60,
		"name": 28,
		"value": 122
	},
	{
		"Company": "青海",
		"ammountSum": 960.32,
		"name": 29,
		"value": 112
	},
	{
		"Company": "天津",
		"ammountSum": 870.94,
		"name": 30,
		"value": 110
	},
	{
		"Company": "衢州",
		"ammountSum": 706.80,
		"name": 31,
		"value": 107
	},
	{
		"Company": "南京",
		"ammountSum": 797.02,
		"name": 32,
		"value": 106
	},
	{
		"Company": "保定",
		"ammountSum": 854.46,
		"name": 33,
		"value": 94
	},
	{
		"Company": "宁夏",
		"ammountSum": 838.97,
		"name": 34,
		"value": 87
	},
	{
		"Company": "北京",
		"ammountSum": 587.35,
		"name": 35,
		"value": 85
	},
	{
		"Company": "新疆",
		"ammountSum": 224.35,
		"name": 479,
		"value": 25
	}];

})();

$(function() { (function() {
		require.config({
			paths: {
				echarts: '../../../common/plugs/echarts/doc/example/www/js'
			},
			packages: [{
				name: 'BMap',
				location: '../../../common/plugs/echarts/js/src',
				main: 'main'
			}]
		});

		require(['echarts', 'BMap', 'echarts/chart/map'], function(echarts, BMapExtension) {
			// 地图自定义样式 
			option = {
				backgroundColor: '#1b1b1b',
				color: ['rgba(255, 255, 255, 0.8)', 'rgba(14, 241, 242, 0.8)', 'rgba(37, 140, 249, 0.8)'],
				title: {
					text: '市场分布',
					x: 'center',
					y: '60',
					textStyle: {
						color: '#fff',
						//fontSize: titleSize
					}
				},
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						if(params.data.companyName){
                 return params.data.companyName+"签单量："+ params.data.value+'单，签单金额：' +params.data.loanAmount+"万元";
            }else{
                 return params.name;
            }
						/*if (!params.series.data) {
							//return '';
							return params.name;
						}
						var res = "";
						if (params.data.Company) {
							res = params.data.Company + "签单量：" + params.data.value + '单，签单金额：' + params.data.ammountSum + "万元";
						} else {
							res = params.name + "签单量：" + params.data.value + '单，签单金额：' + params.data.ammountSum;
						}
						return res;*/
					}
				},
				dataRange: {
					min: 0,
					max: 300,
					x: 'left',
					orient: 'vertical',
					calculable: true,
					color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
					textStyle: { color: '#fff' },
					seriesIndex: 1
				},
				series: [{
					name: '杭州市',
					type: 'map',
					mapType: 'china',
					selectedMode: 'single',
					itemStyle: {
						normal: {
							borderColor: 'rgba(100,149,237,1)',
							borderWidth: 1.5,
							areaStyle: { color: '#1b1b1b' }
						},
						emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                }
            }
					},
					data: [],
					geoCoord: {},
					markPoint: {
						symbol: 'emptyCircle',
						symbolSize: 7/*function(v) {
							return 1 + v / 25
						}*/,
						effect: {
							show: true,
							shadowBlur: 0
						},
						itemStyle: {
							normal: {
								label: {
									show: false
								}
							}
						},
						data: [
						// {name:'上海市',value:95},
						// {name:'常州市',value:10}
						]
					}
				},
				{
					name: '全国',
					type: 'map',
					roam: 'scale',
					//hoverable: false,
					mapType: 'china',
					data: [],
					markPoint: {
						symbolSize: 5,
						// 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
						itemStyle: {
							normal: {
								//color: 'orange',
								//borderColor: 'orange',
								borderWidth: 1,
								// 标注边线线宽，单位px，默认为1
								label: {
									show: false
								}
							},
							emphasis: {
								//color: '#1e90ff',
								//borderColor: '#1e90ff',
								borderWidth: 5,
								label: {
									show: false
								}
							}
						},
						data: [
						// {name:'上海市',value:95},
						// {name:'杭州市',value:10}
						]
					},
					geoCoord: {}
				}]
			};

			areaOption = {
				backgroundColor: '#1b1b1b',
				color: ['rgba(255, 255, 255, 0.8)', 'rgba(14, 241, 242, 0.8)', 'rgba(37, 140, 249, 0.8)'],
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						if (!params.series.data) {
							//return '';
							return params.name;
						}
						var res = "";
						if (params.data.Company) {
							res = params.data.Company + "签单量：" + params.data.value + '单，签单金额：' + params.data.ammountSum + "万元";
						} else {
							res = params.name + "签单量：" + params.data.value + '单，签单金额：' + params.data.ammountSum;
						}
						return res;
					}
				},
				dataRange: {
					show: false,
					min: 0,
					max: 300,
					x: 'right',
					orient: 'vertical',
					calculable: false,
					color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
					textStyle: { color: '#fff' },
					seriesIndex: 1
				},
				series: [{
					name: '杭州市',
					type: 'map',
					mapType: 'china',
					roam: 'scale',
					itemStyle: {
						normal: {
							borderColor: 'rgba(100,149,237,1)',
							borderWidth: 1.5,
							areaStyle: { color: '#1b1b1b' }
						},
						emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                }
            }
					},
					data: [],
					geoCoord: {},
					markPoint: {
						symbol: 'emptyCircle',
						symbolSize: function(v) {
							return 1 + v / 25
						},
						effect: {
							show: true,
							shadowBlur: 0
						},
						itemStyle: {
							normal: {
								label: {
									show: false
								}
							}
						},
						data: [
						// {name:'上海市',value:95},
						// {name:'常州市',value:10}
						]
					}
				},
				{
					name: '全国',
					type: 'map',
					roam: 'scale',
					hoverable: false,
					mapType: 'china',
					data: [],
					markPoint: {
						symbolSize: 5,
						// 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
						itemStyle: {
							normal: {
								//color: 'orange',
								//borderColor: 'orange',
								borderWidth: 1,
								// 标注边线线宽，单位px，默认为1
								label: {
									show: false
								}
							},
							emphasis: {
								//color: '#1e90ff',
								//borderColor: '#1e90ff',
								borderWidth: 5,
								label: {
									show: false
								}
							}
						},
						data: [
						// {name:'上海市',value:95},
						// {name:'杭州市',value:10}
						]
					},
					geoCoord: {}
				}]
			};

			var myChart = null;
			var areaMap = null;
			myChart = echarts.init($("#signMap")[0], "shine");
			areaMap = echarts.init($("#areaMap")[0], "shine");
			// console.log(geoCoord);
			option.series[0].geoCoord = geoCoord;
			option.series[1].geoCoord = geoCoord;
			areaOption.series[0].geoCoord = geoCoord;
			areaOption.series[1].geoCoord = geoCoord;
			//按城市查询
			switchDate_1 = function(date) {
				comn.ajax({
					url: interUrl.report.loanSignStatisticByArea,
					data: {
						yearMonth: date,
						uId: uId,
						type: 4
					},
					success: function(res) {
						myChart.clear();
						var key = "value";
						var _data = res.data;
						for (var i = 0; i < _data.length; i++) {
							var name=_data[i]["name"];
							_data[i]['name']=
							_data[i]['Company']=name;
							_data[i][key]=_data[i]["num"];
							delete _data[i]["num"];
						}
						option.series[1].markPoint.data = _data;
						return myChart.setOption(option);
					}

				});
			};
			//按省份查询
			switchDate_2 = function(date) {
				comn.ajax({
					url: interUrl.report.loanSignStatisticByArea,
					data: {
						yearMonth: date,
						uId: uId,
						type: 4
					},
					success: function(res) {
						myChart.clear();
						var key = "value";
						var _data = res.data;
						for (var i = 0; i < _data.length; i++) {
						  var name=_data[i]["name"];
						  _data[i]['name']=_data[i]["branchCompanyId"];
						  _data[i]['Company']=name;
						  _data[i][key]=_data[i]["num"];
						  delete _data[i]["num"];
						}
						option.series[0].data = _data;
						option.series[1].data = _data;
						// //动态坐标                  
						// var name = [];
						// for (var i = 0; i < res.data.length; i++) {
						//     name = res.data[i].name;
						//     // getCoord(name,res.data.length,callback1);
						// }
						return myChart.setOption(option);
					}

				});
			};
			//当有业务发起时闪20分钟
			switchDate_3 = function(recentPeriod) {
				comn.ajax({
					url: interUrl.report.loanSignStatisticWithRecentPeriodByArea,
					//url: interUrl.report.loanSignStatisticByArea,
					data: {
						uId: uId,
						type: 4,
						recentPeriod: recentPeriod
					},
					success: function(res) {
						myChart.clear();
						var key = "value";
						var _data = res.data;
						for (var i = 0; i < _data.length; i++) {
							var name = _data[i]["name"];
							_data[i]['name'] = _data[i]["branchCompanyId"];
							_data[i]['Company'] = name;
							_data[i][key] = _data[i]["num"];
							delete _data[i]["num"];
						}
						option.series[0].markPoint.data = _data;
						return myChart.setOption(option);
					}

				});
				// console.log(date.format("h m"));
			};

			// //top10内容假数据填充
			// if(dataState == 0){
			// 	var html = ""; 
			// 	for(var i=0; i<10; i++){
			// 		html += [
			// 			'<tr>',
			// 				'<td style="text-align:center;">'+(i+1)+'</td>',
			// 				'<td style="text-align:center;">'+(GlobaData[i].Company)+'</td>',
			// 				'<td style="text-align:center;">'+ GlobaData[i].value + '</td>',
			// 				'<td style="text-align:center;">' + GlobaData[i].ammountSum+'</td>',
			// 			'</tr>',
			// 		].join("");
			// 	}
			// 	$('#top10').html(html);
			// }
			
			//top10列表
			switchDate_4 = function(date) {
				comn.ajax({
					url: interUrl.report.loanSignStatisticByArea,
					//url: interUrl.report.loanSignStatisticByArea,
					data: {
						uId: uId,
						type: 4,
						yearMonth: date
					},
					success: function(res) {
						var str = [];
						if (res.data.length == 0) {
							str.push('<tr><td colspan="4">无数据</td><tr>');
							$('#top10').html(str.join(''));
						} else {
							for (var i = 0; i < res.data.length; i++) {
								var li = '<tr><td style="text-align:center;">' + (i + 1) + '</td><td style="text-align:center;">' + (res.data[i].name) + '</td><td style="text-align:center;">' + res.data[i].num + '</td><td style="text-align:center;">' + res.data[i].ammountSum + '</td></tr>';
								str.push(li);
							}
							$('#top10').html(str.join(''));
						}
					}

				});
			};

			//{name:'广西',selected:true}
			if(dataState == 0){
				comInfo('all');
				comn.ajax({
	         url: interUrl.dataView.companyinfoList,
	         success: function (res) {
	            var signData = res.data;
	            var dataLength = res.data.length;
	            var loanCountArr = [];
	            for(var i=0;i<dataLength;i++){
	                 signData[i].name=signData[i].cityName || signData[i].provinceName;
	                 signData[i].value=signData[i].loanCount;
	                 loanCountArr.push(signData[i].loanCount);
	            }
	            option.series[0].markPoint.data = signData;
	            option.series[1].markPoint.data = signData;
	            option.dataRange.max = Math.ceil(Math.max.apply(Math,loanCountArr)/1000)*1000;
	            myChart.setOption(option);
	         }
	       });
				//option.series[0].data = GlobaData;
				//option.series[1].data = GlobaData;
				// option.series[1].markPoint.data = GlobaData;
				// option.series[0].markPoint.data = GlobaData;
				// myChart.setOption(option);
				//areaMap.setOption(areaOption);
			}
			if(dataState == 1){
				switchDate_1(nowMonth);
				switchDate_2(nowMonth);
				switchDate_3("1200");
				switchDate_4(nowMonth);
				setInterval(function() { switchDate_3("1200") }, 60000); //定时调用闪20分钟
			}

      var infoTitle=$('#companyInfo h5');
			var ecConfig = require('echarts/config');
			myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
					var province = param.target;
					var selected = param.selected;
					var status = selected[province];
					if(status){
						infoTitle.html('分公司基本情况');
						$('#areaMap').parent().show();
						comInfo(province);
		        option.series[0].data = [{name:province,selected:true}];
		        paramsData.cityName = province;
		        areaOption.series[0].mapType = province;
		        areaOption.series[1].mapType = province;
		        /*areaOption.series[1].markPoint.data = [{
																										"Company": "黑龙江",
																										"ammountSum": 1835.2,
																										"name": 5,
																										"value": 224
																									}];
						areaOption.series[0].markPoint.data = [{
																										"Company": "黑龙江",
																										"ammountSum": 1835.2,
																										"name": 5,
																										"value": 224
																									}];*/
		        myChart.setOption(option, true);
		        areaMap.setOption(areaOption, true);
					}else{
						infoTitle.html('全国整体情况');
						comInfo('all');
						paramsData.cityName='all';
						$('#areaMap').parent().hide();
		        option.series[0].data = [];
		        myChart.setOption(option, true);
		        return;
					}
			});
		});
		
		function comInfo(province){
			var data=null;
			if(paramsData.companyInfo && province=='all'){
				data = paramsData.companyInfo;
				paramsData.passData = data;
     		$('#staffCount').html(data.staffCount);
        $('#childCompanyCount').html(data.childCompanyCount);
        $('#loanCount').html(data.loanCount);
        $('#loanAmount').html(data.loanAmount);
        $('#gpsCount').html(data.gpsCount);
        paramsData.reload();
			}else{
				comn.ajax({
	       url: interUrl.dataView.companyinfoGet,
	       data: {province: province},
	       success: function (res) {
	       	if(res.data.length>0){
	       		data = res.data[0]
	       		if(province == 'all'){
	       			paramsData.companyInfo = data;
	       		}
	       		paramsData.passData = data;
	       		$('#staffCount').html(data.staffCount);
	          $('#childCompanyCount').html(data.childCompanyCount);
	          $('#loanCount').html(data.loanCount);
	          $('#loanAmount').html(data.loanAmount);
	          $('#gpsCount').html(data.gpsCount);
	          paramsData.reload();
	       	}
	       }
	     });
			}
			
		}

	})(); 
});

