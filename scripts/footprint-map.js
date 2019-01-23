//定义并初始化省份代码对应数组以判断从服务器接收的位置代码
var position = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  41: "台湾",
  81: "香港",
  82: "澳门"
}

var userPositionArr = new Array(); //存储用户脚印位置

//用户修改用户表单数据时触发此函数修改地图
function sendMapRequest() {

  //创建XMLHttpRequest请求，通过username字段请求该用户的脚印
  // xmlhttp = new XMLHttpRequest();
  // xmlhttp.onreadystatechange = state_change; //当对象状态发生改变是
  // xmlhttp.open("POST", 'http://footprint.zhengkun-byyourside.com/PHP/myprint.php', true); //初始化请求参数
  //获取被选择的用户名，并加入表单对象
  var userselect = document.getElementById("getuser"); //select元素id
  var formData = new FormData();
  formData.append("username", userselect.value);
  xmlhttp.send(formData); //发送请求
  function state_change() {
    if (xmlhttp.readyState == 4) { //loaded
      if (xmlhttp.status == 200) { //200=ok
        var responseObj = eval("(" + xmlhttp.responseText + ")"); //将服务返回的json解析为对象
        console.log(responseObj);
        if (responseObj.code == 200 || responseObj.code == 402) { //接口返回200，查询成功
          if (responseObj.code == 402) {
            userPositionArr.splice(0, userPositionArr.length); //清空数组
            alert("还没有脚印，快去踩一个吧");
          } else {
            for (var i = 0; i < responseObj.data.length; i++) {
              var positionId = responseObj.data[i].position_id;
              for (var key in position) {
                if (positionId == key) {
                  userPositionArr[i] = new Object;
                  userPositionArr[i].name = position[key];
                  userPositionArr[i].value = parseInt(responseObj.data[i].print_done);
                }
              }
            }
          }
          console.log(userPositionArr);
          startmap(userPositionArr);
          userPositionArr.splice(0, userPositionArr.length);
        }
      } else {
        alert(xmlhttp.status);
      }
    }
  }
}

//此函数生成地图，参数为用户脚印列表
function startmap(userPositionList) {
  // 路径配置
  require.config({
    paths: {
      echarts: 'http://echarts.baidu.com/build/dist'
    }
  });

  // 使用
  require(
    [
      'echarts',
      'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
      // 基于准备好的dom，初始化echarts图表
      var myChart = ec.init(document.getElementById('main'));

      option = {
        tooltip: {
          trigger: 'item',
          show: false //禁用鼠标滑过显示提示
          //			        formatter: '{b}'
        },
        title: {
          text: '我的脚印',
          subtext: '请在下方选择用户',
          left: 'center'
        },
        /*			    legend: {
        			        orient: 'vertical',
        			        left: 'center',
        			        selectedMode:false,
        			        data:['去过','没去过','想去']
        			    },*/
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {
              readOnly: false
            },
            restore: {},
            saveAsImage: {}
          }
        },
        //			    selectedMode:'single',
        /*		        itemStyle:{
        		        	normal:{
        		            	   label:{show:true},
        		            	   borderWidth:2,//省份的边框宽度
        		                   borderColor:'#FFC0CB',//省份的边框颜色
        		                   color:'#FFF0F5'//地图背景颜色
        		        	},
        		        	mphasis:{label:{show:true}}
        		           },*/
        dataRange: {
          x: 'left',
          y: 'bottom',
          splitList: [{
              start: 1,
              end: 1,
              label: '踩过脚印',
              color: '#1ec0ff'
            },
            {
              start: 2,
              end: 2,
              label: '我想去看看',
              color: '#A593E0'
            }
          ]
        },
        series: [{
          name: '中国',
          type: 'map',
          mapType: 'china',
          //			            selectedMode : 'multiple',
          //			            clickable:false,
          roam: false,
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          data: userPositionList
          /*			            	[
          			                {name:'浙江',value:1},
          			                {name:'重庆',value:1},
          			                {name:'四川',value:2},
          			                {name:'海南',value:2},
          			            ]*/
        }]
      };
      myChart.setOption(option);
    }
  );
}
startmap(userPositionArr);
userPositionArr.splice(0, userPositionArr.length);

//添加足迹，用户点击添加时触发此函数，上传数据并修改地图
function changeMap() {
  //创建XMLHttpRequest请求，通过username字段请求该用户的脚印
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = state_change; //当对象状态发生改变是
  xhr.open("POST", 'http://footprint.zhengkun-byyourside.com/PHP/addprintlist.php', true); //初始化请求参数
  //获取被表单数据，并加入表单对象
  var username = document.getElementById("addname"); //用户名input
  var position = document.getElementById("selectposition"); //地址选择select
  var doneOrWant = document.getElementsByName("doneorwant"); //脚印类型radio元素
  for (var i = 0; i < doneOrWant.length; i++) {
    if (doneOrWant[i].checked)
      doneOrWantvalue = doneOrWant[i].value;
  }
  var addDate = document.getElementById("adddate"); //日期设置
  var addTitle = document.getElementById("addtitle"); //足迹地图
  var formData = new FormData();
  formData.append("add", "addprint");
  formData.append("username", username.value);
  formData.append("position", position.value);
  formData.append("printdate", addDate.value);
  formData.append("content", addTitle.value);
  formData.append("doneorwant", doneOrWantvalue);
  console.log(username.value + "," + position.value + "," + addDate.value + "," + addTitle.value + "," + doneOrWantvalue);
  xhr.send(formData); //发送请求
  function state_change() {
    if (xhr.readyState == 4) { //loaded
      if (xhr.status == 200) { //200=ok
        var responseObj = eval("(" + xhr.responseText + ")"); //将服务返回的json解析为对象
        console.log(responseObj);
        if (responseObj.code == 407) {
          alert("标记过啦，认真看看地图吧");
        } else if (responseObj.code == 406) {
          alert("修改为踩过脚印失败，请检查填入数据");
        } else if (responseObj.code == 405) {
          alert("标记过啦，去地图看看你的脚印吧");
        } else if (responseObj.code == 402) {
          alert("数据不能留空呀");
        } else if (responseObj.code == 403) {
          alert("添加失败，请联系zheng-kun@foxmail.com解决");
        } else if (responseObj.code == 401) {
          alert("提交数据失败，请联系zheng-kun@foxmail.com解决");
        } else if (responseObj.code == 200 || 201) {
          if (responseObj.code == 200) {
            alert("添加成功，你的脚印已经更新到地图啦，去看看吧");
          } else {
            alert("修改成功，你的脚印已经更新到地图啦，去看看吧");
          }
          //运行函数
          sendMapChange(username.value);
        }
      } else {
        alert(xhr.status);
      }
    }
  }
}

//通过选择用户名改变地图
function sendMapChange(username) {
  console.log("进入sendchangmap函数");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = state_change; //当对象状态发生改变是
  xmlhttp.open("POST", 'http://footprint.zhengkun-byyourside.com/PHP/myprint.php', true); //初始化请求参数
  //获取被选择的用户名，并加入表单对象
  var formData = new FormData();
  formData.append("username", username);
  xmlhttp.send(formData); //发送请求
  // function state_change() {
  //   if (xmlhttp.readyState == 4) { //loaded
  //     if (xmlhttp.status == 200) { //200=ok
  //       var responseObj = eval("(" + xmlhttp.responseText + ")"); //将服务返回的json解析为对象
  //       console.log(responseObj);
  //       if (responseObj.code == 200 || responseObj.code == 402) { //接口返回200，查询成功
  //         if (responseObj.code == 402) {
  //           userPositionArr.splice(0, userPositionArr.length); //清空数组
  //           alert("还没有脚印，快去踩一个吧");
  //         } else {
  //           for (var i = 0; i < responseObj.data.length; i++) {
  //             var positionId = responseObj.data[i].position_id;
  //             for (var key in position) {
  //               if (positionId == key) {
  //                 userPositionArr[i] = new Object;
  //                 userPositionArr[i].name = position[key];
  //                 userPositionArr[i].value = parseInt(responseObj.data[i].print_done);
  //               }
  //             }
  //           }
  //         }
  //         console.log(userPositionArr);
  //         startmap(userPositionArr);
  //         userPositionArr.splice(0, userPositionArr.length);
  //       }
  //     } else {
  //       alert(xmlhttp.status);
  //     }
  //   }
  // }
}
