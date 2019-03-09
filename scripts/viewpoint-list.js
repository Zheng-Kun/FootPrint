(() => {

	let $viewpointList = $(".all-points-box .viewpoint-list");
	$viewpointList.html(createCardList(scenicGanSu));

	function createCardList(data){
		let dom = "";
		// 优先渲染有图片的节点
		data.forEach(el => {
			if(el.photo){
				dom += createOneDom(el);
			}
		});
		// 优先渲染有图片的节点
		data.forEach(el => {
			if(!el.photo){
				dom += createOneDom(el);
			}
		});
		return dom;
	}

	function createOneDom(obj){
		let time = obj.time ? obj.time + "小时" : "未知",
		// ticket =  obj.ticket ? obj.ticket + "元" : "未知";
		ticket = obj.ticket + "元" ;
		dom = `<li class="viewpoint-card" style="background:url(${obj.photo || "images/no-photo.png"})">`
			+ `<p class="point-name">${obj.name}</p>`
			+ `<div class="detail-card">`
				+ `<ul>`
					+ `<li class="viewpoint-name">${obj.name}</li>`
					+ `<li class="viewpoint-time small-line"><span class="title">花费时间：</span><span class="content">${time}</span></li>`
					+ `<li class="viewpoint-ticket small-line"><span class="title">票价：</span><span class="content">${ticket}</span></li>`
					+ `<li class="viewpoint-score small-line"><span class="title">评分：</span><span class="content">${obj.score}/5</span></li>`
					+ `<li class="viewpoint-introduce small-line"><span class="content" title="${obj.introduce}">${obj.introduce}</span></li>`
				+`</ul>`
			+`</div>`
		+`</li>`;

		return dom;
	}
})();