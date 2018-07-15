//输入提示
AMap.plugin(['AMap.Autocomplete'],autoComplete);
function autoComplete(){
    var autoCom = new AMap.Autocomplete({
        city:"重庆",
        dataType:"all",
        citylimit:true,
        input:"hotel-input",

    });
    // autoCom.search("喜来登酒店",searchAuto);
}

var timeArr = [];

function getTimeDistence(points){
/*

    var map = new AMap.Map("myMap", {
        resizeEnable: true,
    });
*/
    // console.log("Amap插件加载完成！");
    var driving = new AMap.Driving({
        // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        // map:map,
        policy: AMap.DrivingPolicy.LEAST_TIME,
        //是否显示路况
        showTraffic:true,
        //显示结果列表的容器Id或元素
        // panel:'MyRoute',
        //自动调整路径显示位置及大小
        autoFitView:true,
    });

        //根据起终点（途经点最多六个）实现驾车路线规划
    driving.search(points,getResult);
    function getResult(status, result){
        //未出错时，result即是对应的路线规划方案
        return timeDistence = (result.routes[0].time/3600).toFixed(2);
    }
}

function creatRouteOnDom(routeArr){
    var result_box = document.getElementById("result");
    result_box.innerHTML = "";

    creatTextRoute(routeArr);

    creatAMapRoute(routeArr);
}

function creatTextRoute(routeArr){
    var result_box = document.getElementById("result");
    var text_route = document.createElement("div");
    text_route.id = "text-route";
    var text_ul = document.createElement("ul");
    for(let i = 0;i <routeArr.length;i++){
        var text_li = document.createElement("li");
        var routetext = "第" + (i+1) + "天：";
        for(let j = 0 ;j <routeArr[i].length;j++){
            routetext  = routetext + routeArr[i][j] + "->" ;
        }
        routetext = routetext + routeArr[i][0];
        text_li.innerText = routetext;
        text_ul.appendChild(text_li);
    }
    text_route.appendChild(text_ul);
    result_box.appendChild(text_route);
}

function creatAMapRoute(routeArr){
    var result_box = document.getElementById("result");
    for(let i = 0;i <routeArr.length;i++){
        var AmapResult = document.createElement("div");
        AmapResult.classList.add("AmapResult");

        //文字信息
        var AmapResultH = document.createElement("h2");
        AmapResultH.classList.add("AmapResultH");
        var routetext = "第" + (i+1) + "天：";
        for(let j = 0 ;j <routeArr[i].length;j++){
            routetext  = routetext + routeArr[i][j] + "->" ;
        }
        routetext = routetext + routeArr[i][0];
        AmapResultH.innerText = routetext;

        //aMap生成的文字路径规划
        var AmapTextRoute = document.createElement("div");
        AmapTextRoute.id = "Amap-text-route" + i;
        AmapTextRoute.classList.add("Amap-text-route");
        var AmapMapRoute = document.createElement("div");
        AmapMapRoute.id = "Amap-map-route" + i;
        AmapMapRoute.classList.add("Amap-map-route");

        //aMap生成的地图路径规划
        result_box.appendChild(AmapResultH);
        AmapResult.appendChild(AmapTextRoute);
        AmapResult.appendChild(AmapMapRoute);

        var map = new AMap.Map(AmapMapRoute, {
            resizeEnable: false,
            // mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
            isHotspot:true,//是否开启地图热点和标注的hover效果
            zoomEnable:true,//地图是否可缩放
            scrollWheel:false,//地图是否可通过鼠标滚轮缩放浏览
        });

        var driving = new AMap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            map:map,
            policy: AMap.DrivingPolicy.LEAST_TIME,
            //是否显示路况
            showTraffic:true,
            //显示结果列表的容器Id或元素
            panel:AmapTextRoute.id,
            //自动调整路径显示位置及大小
            autoFitView:true,
        });
        //生成路径对象
        var points = [];
        for(let j = 0;j<routeArr[i].length; j++){
            points.push({keyword:routeArr[i][j],city:'重庆'});
        }
        points.push({keyword:routeArr[i][0],city:'重庆'});

        //根据起终点（途经点最多六个）实现驾车路线规划
        driving.search(points,getResult);
        function getResult(status, result){
            //未出错时，result即是对应的路线规划方案
        }
        result_box.appendChild(AmapResult);
    }
}
