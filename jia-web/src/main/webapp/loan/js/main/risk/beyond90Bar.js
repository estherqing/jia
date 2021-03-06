var args = comn.getArgs(), fontSize = window.parent.fontSize, uId = window.parent.uId, dataState = window.parent.dataState;
var myChart = echarts.init($("#beyond90Bar")[0], "shine"); //初始化地图 
option = {
  /*title : {
      text: '服务效率',
			x: 'center',
			textStyle: {
				color: '#FFF',
				fontSize: fontSize
			}
  },*/
  tooltip : {
      trigger: 'axis',
      textStyle: {
				fontSize: fontSize
			},
			formatter: function(params){
				return params[0].seriesName+'<br/>'+params[0].name+': '+params[0].data+'笔';
			}
  },
  /*legend: {
		y: 'bottom',
	  data:['上期', '当期'],
		textStyle: {
			color: '#FFF',
			fontSize: fontSize
		}
  },*/
  toolbox: {
      show : false,
      feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
      }
  },
  calculable : true,
  grid: {//配置图形距离边框的距离
  	y2:80,
  	x: 60,
  	x2:10
  },
	xAxis : [{
		type : 'category',
		axisLabel: {
			interval: 0,
			rotate:45,
			textStyle: {
				color: '#fff',
				fontSize: fontSize*0.8
			}
		}, 
		data: ['江苏','浙江','山东','江西','黑龙江','安徽','辽宁','湖北','吉林','湖南','四川','上海','山西','重庆','贵州','陕西','云南','广西','河南','内蒙古','广东','海南','青海','甘肃','福建','河北','天津']
	}],
	yAxis : [{
		name: '笔',
		nameTextStyle: {
			fontSize:fontSize * 0.8
		},
		type : 'value',
		//max: 9000,
		splitNumber:9,
		axisLabel: {
			textStyle: {
				color: '#fff',
				fontSize: fontSize
			},
			formatter: '{value}'
		}, 
	}],
	series : [{
      name:'超期60~90天未抵押笔数',
      type:'bar',
      data:[2000, 8500, 3000, 4300, 2800, 7400, 3700, 4600, 2900, 5200, 2700, 6300, 3700, 2900, 4700, 3700, 5200, 3900, 4000, 5100, 3900, 2900, 3500, 1900, 6200, 3800, 4200]
  }]
};
                    
comn.ajax({
   url: interUrl.dataView.pledgeGetAll,
   // data: {province: 'all'},
   success: function (res) {
    var data = res.data;
    var cityArr=[],cntRange3Arr=[];
    for(var i=0;i<data.length;i++){
    	cityArr.push(data[i].provinceName);
    	cntRange3Arr.push(data[i].cntRange3);
    }
    option.xAxis[0].data = cityArr;
    option.series[0].data = cntRange3Arr;
    myChart.setOption(option,true);
   }
});
