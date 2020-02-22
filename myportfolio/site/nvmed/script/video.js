function resize(){
	let widthBrows = document.documentElement.clientWidth ;
	let heightBrows = document.documentElement.clientHeight;
	let heightVideo = Math.floor(widthBrows / 1.777778) ;
	document.getElementById('widthVideo').style.height = heightVideo +'px';
};
resize();
window.onresize = resize;