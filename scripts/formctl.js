//

//每天9-21，12小时 - 弹性时间 3 小时  = 9小时
var creat_route = document.getElementById('creat-route');

creat_route.addEventListener('click',getFormInfromation);

var currentPlace = "";

//获取表单内容
function getFormInfromation(ev){

    var travel_province = document.getElementsByName('travel-province')[0];
    var travel_days = document.getElementsByName('travel-days')[0];
    var travel_hobby = document.getElementsByName('travel-hobby')[0];
    var travel_mode = document.getElementsByName('travel-mode')[0];

    var Information = {};
    Information.province = travel_province.options[travel_province.selectedIndex].value;
    Information.days = parseInt(travel_days.options[travel_days.selectedIndex].value);
    Information.hobby = travel_hobby.options[travel_hobby.selectedIndex].value;
    Information.mode = travel_mode.options[travel_mode.selectedIndex].value;
    Information.hotel = document.getElementById('hotel-input').value;
    currentPlace = Information.hotel;
    if(Information.hotel.length <= 0){
        alert("请填输入住酒店");
    }else{
        creatRoute(Information);
    }
    return false;
}

//生成路径
function creatRoute(infObject) {
    //存储路径的二维数组
    var routeArr = [];
    //按天数循环
    for(let j = 1;j<=infObject.days;j++){
        routeArr = creatDayRoute(routeArr,infObject);
    }

    console.log(routeArr);

    creatRouteOnDom(routeArr);
}

//生成一天的路径
function creatDayRoute(routeArr, infObject) {
    //当前的点
    // var currentPlace = infObject.hotel;
    var dayRouteArr = [currentPlace];
    // dayRouteArr.push()
    // routeArr.push(dayRouteArr);
    //当前的时间
    var currentTime = 9;
    while(currentTime<20){

        //权重最大的点
        var maxWeight = {
            name:null,
            weight:0,
            time:0,
        }
        //寻找权重最高的景点
        for(let i = 0;i<scenicGanSu.length;i++){
            //如果景点存在，跳过
            if(isExist(routeArr,dayRouteArr,scenicGanSu[i].name)){
                continue;
            }
            //由于异步问题，该信息暂时不做使用
            var points = [
                { keyword: currentPlace,city:'甘肃' },
                { keyword: scenicGanSu[i].name,city:'甘肃' }
            ];
            var weight = scenicWeight(scenicGanSu[i],infObject,currentPlace,currentTime);
            if(weight>maxWeight.weight){
                maxWeight.name = scenicGanSu[i].name;
                maxWeight.weight = weight;
                maxWeight.time = scenicGanSu[i].time;
            }
        }
        dayRouteArr.push(maxWeight.name);
        currentTime += maxWeight.time;
    }
    var dayLastPoint = dayRouteArr[dayRouteArr.length - 1];
    //todo ajax请求最后景点坐标
    $.ajax({
        url: `https://restapi.amap.com/v3/place/text?key=2c61b256dbe8b28d5c94534d569edcb2&keywords=${dayLastPoint}&types=110000&city=甘肃&children=1&offset=1&page=1&extensions=all`,
        context: document.body,
        async: false,
        success: function (res) {
            //todo ajax请求周边住宿地点
            $.ajax({
                url: `https://restapi.amap.com/v3/place/around?key=2c61b256dbe8b28d5c94534d569edcb2&location=${res.pois[0].entr_location}&keywords=&types=100000&radius=1000&offset=1&page=1&extensions=all`,
                context: document.body,
                async: false,
                success: function(res2){
                    console.log("res2:",res2);
                    currentPlace = res2.pois[0].name;
                    dayRouteArr.push(currentPlace);
                }
            })
        }
        
    });
    routeArr.push(dayRouteArr);
    return routeArr;
}

//检查当前景点是否已经被加入攻略
function isExist(routeArr,dayRouteArr,currentScenic){
    for(let j = 0;j<routeArr.length;j++){
        for(let i = 0;i < routeArr[j].length; i++){
            if(routeArr[j][i] == currentScenic){
                return true;
            }
        }
    }
    for(let i = 0;i<dayRouteArr.length;i++){
        if(dayRouteArr[i] == currentScenic){
            return true;
        }
    }
    return false;
}


//计算景点权重
function scenicWeight(scenicObj,infObject,currentPlace,currentTime){

    //暂时假定到达景点的时间为1小时
    var roadTime = 2;

    //计算权重,
    var weight = 0;

    //景点类型权重 权重20
    if(scenicObj.type == infObject.hobby){
        weight = weight + 20;
    }

    //时间段权重，权重10
    if(currentTime>18 && scenicObj.playtime == "night"){
        weight += 10;
    }
    //如果不是最佳游玩时间段，减去20权重
    if(currentTime<18 && scenicObj.playtime == "night"){
        weight -= 20;
    }

    //星级权重，权重20
    weight += scenicObj.score*4;

    //游玩时间占比权重（路上的时间与游玩时间的占比）权重10
    weight += (scenicObj.time/(scenicObj.time + roadTime)).toFixed(2)*10;

    //如果剩余时间不够游玩该景点，减去20权重
    if(currentTime + scenicObj.time > 22){
        weight -= 20;
    }

    return weight;
}
