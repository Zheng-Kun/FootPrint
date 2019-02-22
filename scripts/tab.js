(() => {
	binding();


	function binding{
		// 绑定导航栏点击事件
		$(".nav-itme").on("click", (ev) => {
			$(".nav-item").removeClass("selected");
			$(".nav-box").removeClass("selected");

			$(ev.target).addClass("selected");
			let selIndex = $(ev.target).attr("data-index");
			$($(".item-box")[selIndex]).addClass("selected");
		});
	}
})()