(() => {
	binding();

	function binding(){
		// 绑定导航栏点击事件
		$(".nav-item").on("click", ev => {
			$(".nav-item").removeClass("selected");
			$(".nav-box").removeClass("selected");
			if($(ev.target).hasClass("nav-item")){
				$(ev.target).addClass("selected");
			}else{
				$(ev.target).parents(".nav-item").addClass("selected");
			}
			
			let selIndex = $(ev.target).attr("data-index") || $(ev.target).parents(".nav-item").attr("data-index");
			$(".item-box").removeClass("selected");
			$($(".item-box")[selIndex]).addClass("selected");
		});
	}
})()