(() => {
	function createCardList(data){
		let dom = "";
		data.forEach(el => {
			// 邮箱渲染有图片的节点
			if(el.photo){
				dom += createOneDom(el);
			}
		});
		return dom;
	}

	function createOneDome(obj){
		dom = `<li class="viewpoint-card" style="background:url(${obj.photo || "../images/no-photo.png"})">`
			+ `<p class="point-name">${obj.name}</p>`
			+ `<div class="detail-card">`
				+ `<ol>`
					+ `<li class="viewpoint-name"></li>`
					+ `<li class="viewpoint-time"><span class="title">花费时间：</span><span class="content">${obj.time ？ obj.time + "小时" ： "未知"}</span></li>`
					+ `<li class="viewpoint-ticket"><span class="title">票价：</span><span class="content">${obj.ticket ？ obj.ticket + "元" ： "未知"}</span></li>`
					+ `<li class="viewpoint-score"><span class="title">评分：</span><span class="content">${obj.score}/5</span></li>`
					+ `<li class="viewpoint-introduce"><span class="title">简介：</span><span class="content">${obj.introduce}</span></li>`
				+`</ol>`
			+`</div>`
		+`</li>`；

		return dom;
	}
})();