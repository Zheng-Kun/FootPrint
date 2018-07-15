//

//每天9-21，12小时 - 弹性时间 3 小时  = 9小时
var creat_route = document.getElementById('creat-route');

creat_route.addEventListener('click',getFormInfromation);

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
function creatDayRoute(routeArr,infObject){
    //当前的点
    var currentPlace = infObject.hotel;
    var dayRouteArr = [infObject.hotel];
    dayRouteArr.push()
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
        for(let i = 0;i<scenicChongQing.length;i++){
            //如果景点存在，跳过
            if(isExist(routeArr,dayRouteArr,scenicChongQing[i].name)){
                continue;
            }
            //由于异步问题，该信息暂时不做使用
            var points = [
                { keyword: currentPlace,city:'重庆' },
                { keyword: scenicChongQing[i].name,city:'重庆' }
            ];
            var weight = scenicWeight(scenicChongQing[i],infObject,currentPlace,currentTime);
            if(weight>maxWeight.weight){
                maxWeight.name = scenicChongQing[i].name;
                maxWeight.weight = weight;
                maxWeight.time = scenicChongQing[i].time;
            }
        }
        dayRouteArr.push(maxWeight.name);
        currentTime += maxWeight.time;
    }
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
    var roadTime = 1;

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
