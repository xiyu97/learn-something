function initLazyImg(defaultSrc){
	var imgs = document.querySelectorAll('[data-src]');

	imgs = Array.from(imgs); 
	setDefault();

	loadImgs();

	var timer = null;
	window.addEventListener("scroll", function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			loadImgs();
		},300);
	});

	function setDefault(){
		let len = imgs.length;
		for(var i=0; i<len; i++){
			imgs[i].src = defaultSrc;
		}
	}

	function loadImgs(){
		for(var i=0;i<imgs.length;i++){
			var img = imgs[i];
			if(loadImg(img)){
				imgs.splice(i, 1);
				i--;
			}
		}
	}

	function isInSight(el) {
		const bound = el.getBoundingClientRect();
		const clientHeight = window.innerHeight;
		return bound.bottom > 0 && bound.top < clientHeight;
	}

	function loadImg(img){
		if(isInSight(img)){
			img.src = img.dataset.src;
			return true;
		}
		return false;
	}
}