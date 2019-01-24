/**
 * 用来异步获取景点之间的驾车时间
 * @author zhengkun
 * @date 2019-1-23 12:32
 */
(function(){
  
  function getOneTime(start, end){
    console.log("loading-time-on-road");
    let points = [{
      keyword: start,
      city: "重庆"
    },{
      keyword: end,
      city: "重庆"
    }]
    setTimeDistence(points);
  }


  function getAllTime(){
    scenicChongQing.forEach((el,index) => {
      scenicChongQing.forEach((el2,index2) => {
        if(! index === index2){
          getOneTime(el.name,el2.name);
        }
      })
    })
  }

})()