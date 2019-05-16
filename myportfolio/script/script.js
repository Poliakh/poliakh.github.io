// --Burger--
(function(){
	let treeLine = document.querySelector('.bline')
	document.querySelector('body').addEventListener('mouseup', menuHover)
	function menuHover(event){
		if(event.target.closest('.burger') || event.target.closest('.menu') ){
			document.querySelector('.burger').classList.toggle('burgerHover');
			document.querySelector('.bline').classList.toggle('burgerLineAnimate');
			document.querySelector('.menu').classList.toggle('menuHover');
		}
		if(!event.target.closest('.burger')){
			document.querySelector('.burger').classList.remove('burgerHover');
			document.querySelector('.bline').classList.remove('burgerLineAnimate');
			document.querySelector('.menu').classList.remove('menuHover');
		}
	}
})()
// --burger end--

function AjaxSelect(wrapElem,card){
	let myCards = document.createDocumentFragment();
	let parentCards = document.querySelector(wrapElem);
	let elemCard = parentCards.querySelector(card);

	let showLoading = (on)=>{
		let loader = document.querySelector('.loader');
		(on)? loader.classList.remove('loaderHide'):loader.classList.add('loaderHide')
	}
	let checkStatus = (response)=>{
		if (response.ok) {
			return response.json()
		}else{
			showLoading(false);
			let error = new Error("Ошибка " + response.statusText);
			error.response = response;
			throw error;
		}
	}
	let createCard = (obj)=>{
		let newCard = elemCard.cloneNode(true);
		newCard.hidden = false;
		newCard.querySelector('.card__page').href = obj.gitpage;
		newCard.querySelector('.card__hub').href = obj.github;
		newCard.style.backgroundImage = `url("${obj.preview}")`;
		return newCard;
	}
	let parseJSON = (obj)=>{
		for (let key in obj){
			myCards.appendChild(createCard(obj[key]));
		}
			showLoading(false);
			parentCards.appendChild(myCards);	
	}
/* 	this.load = (url)=>{
		showLoading(true);
		while(parentCards.querySelector(card)){
			parentCards.removeChild(parentCards.querySelector(card))
		}
		fetch(url)
		.then(checkStatus)
		.then(parseJSON)
		.catch((error)=>{
			showLoading(false);
			alert('request failed', error)
		})
	} */

	this.load = (url)=>{
		showLoading(true);
		while(parentCards.querySelector(card)){
			parentCards.removeChild(parentCards.querySelector(card))
		}
		asyncFetch = async()=>{
			let response = await fetch(url);
			let obj = await checkStatus(response)
			await parseJSON(obj);
			await addDelayAnimation('.cardWrap','.card',0.2,0.5);

		}

		asyncFetch();
	}

}

let ajaxSelect = new AjaxSelect('.cardWrap', '.card')
ajaxSelect.load('data.json');

//--wow--
new WOW().init();
function addDelayAnimation(parentCLass,targetClass,incremdelay,delay){

	let listIcon = document.querySelector(parentCLass).querySelectorAll(targetClass);
	// console.log(listIcon);
	
	listIcon.forEach(element => {
		delay+= incremdelay;
		element.getAttribute('data-wow-delay');
			element.dataset.wowDelay = delay + 's';
		});
}
addDelayAnimation('.social','.fadeInUp',0.2, 0);
addDelayAnimation('.contactlist','.fadeInRight',0.2,0.8);
addDelayAnimation('.menu','.wow',0.2,0.5);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gLS1CdXJnZXItLVxyXG4oZnVuY3Rpb24oKXtcclxuXHRsZXQgdHJlZUxpbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmxpbmUnKVxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbWVudUhvdmVyKVxyXG5cdGZ1bmN0aW9uIG1lbnVIb3ZlcihldmVudCl7XHJcblx0XHRpZihldmVudC50YXJnZXQuY2xvc2VzdCgnLmJ1cmdlcicpIHx8IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubWVudScpICl7XHJcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdidXJnZXJIb3ZlcicpO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmxpbmUnKS5jbGFzc0xpc3QudG9nZ2xlKCdidXJnZXJMaW5lQW5pbWF0ZScpO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudScpLmNsYXNzTGlzdC50b2dnbGUoJ21lbnVIb3ZlcicpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIWV2ZW50LnRhcmdldC5jbG9zZXN0KCcuYnVyZ2VyJykpe1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VySG92ZXInKTtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsaW5lJykuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyTGluZUFuaW1hdGUnKTtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdtZW51SG92ZXInKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pKClcclxuLy8gLS1idXJnZXIgZW5kLS1cclxuXHJcbmZ1bmN0aW9uIEFqYXhTZWxlY3Qod3JhcEVsZW0sY2FyZCl7XHJcblx0bGV0IG15Q2FyZHMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblx0bGV0IHBhcmVudENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih3cmFwRWxlbSk7XHJcblx0bGV0IGVsZW1DYXJkID0gcGFyZW50Q2FyZHMucXVlcnlTZWxlY3RvcihjYXJkKTtcclxuXHJcblx0bGV0IHNob3dMb2FkaW5nID0gKG9uKT0+e1xyXG5cdFx0bGV0IGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKTtcclxuXHRcdChvbik/IGxvYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXJIaWRlJyk6bG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2xvYWRlckhpZGUnKVxyXG5cdH1cclxuXHRsZXQgY2hlY2tTdGF0dXMgPSAocmVzcG9uc2UpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uub2spIHtcclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHNob3dMb2FkaW5nKGZhbHNlKTtcclxuXHRcdFx0bGV0IGVycm9yID0gbmV3IEVycm9yKFwi0J7RiNC40LHQutCwIFwiICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcblx0XHRcdGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcblx0XHRcdHRocm93IGVycm9yO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRsZXQgY3JlYXRlQ2FyZCA9IChvYmopPT57XHJcblx0XHRsZXQgbmV3Q2FyZCA9IGVsZW1DYXJkLmNsb25lTm9kZSh0cnVlKTtcclxuXHRcdG5ld0NhcmQuaGlkZGVuID0gZmFsc2U7XHJcblx0XHRuZXdDYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19wYWdlJykuaHJlZiA9IG9iai5naXRwYWdlO1xyXG5cdFx0bmV3Q2FyZC5xdWVyeVNlbGVjdG9yKCcuY2FyZF9faHViJykuaHJlZiA9IG9iai5naXRodWI7XHJcblx0XHRuZXdDYXJkLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoXCIke29iai5wcmV2aWV3fVwiKWA7XHJcblx0XHRyZXR1cm4gbmV3Q2FyZDtcclxuXHR9XHJcblx0bGV0IHBhcnNlSlNPTiA9IChvYmopPT57XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gb2JqKXtcclxuXHRcdFx0bXlDYXJkcy5hcHBlbmRDaGlsZChjcmVhdGVDYXJkKG9ialtrZXldKSk7XHJcblx0XHR9XHJcblx0XHRcdHNob3dMb2FkaW5nKGZhbHNlKTtcclxuXHRcdFx0cGFyZW50Q2FyZHMuYXBwZW5kQ2hpbGQobXlDYXJkcyk7XHRcclxuXHR9XHJcbi8qIFx0dGhpcy5sb2FkID0gKHVybCk9PntcclxuXHRcdHNob3dMb2FkaW5nKHRydWUpO1xyXG5cdFx0d2hpbGUocGFyZW50Q2FyZHMucXVlcnlTZWxlY3RvcihjYXJkKSl7XHJcblx0XHRcdHBhcmVudENhcmRzLnJlbW92ZUNoaWxkKHBhcmVudENhcmRzLnF1ZXJ5U2VsZWN0b3IoY2FyZCkpXHJcblx0XHR9XHJcblx0XHRmZXRjaCh1cmwpXHJcblx0XHQudGhlbihjaGVja1N0YXR1cylcclxuXHRcdC50aGVuKHBhcnNlSlNPTilcclxuXHRcdC5jYXRjaCgoZXJyb3IpPT57XHJcblx0XHRcdHNob3dMb2FkaW5nKGZhbHNlKTtcclxuXHRcdFx0YWxlcnQoJ3JlcXVlc3QgZmFpbGVkJywgZXJyb3IpXHJcblx0XHR9KVxyXG5cdH0gKi9cclxuXHJcblx0dGhpcy5sb2FkID0gKHVybCk9PntcclxuXHRcdHNob3dMb2FkaW5nKHRydWUpO1xyXG5cdFx0d2hpbGUocGFyZW50Q2FyZHMucXVlcnlTZWxlY3RvcihjYXJkKSl7XHJcblx0XHRcdHBhcmVudENhcmRzLnJlbW92ZUNoaWxkKHBhcmVudENhcmRzLnF1ZXJ5U2VsZWN0b3IoY2FyZCkpXHJcblx0XHR9XHJcblx0XHRhc3luY0ZldGNoID0gYXN5bmMoKT0+e1xyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG5cdFx0XHRsZXQgb2JqID0gYXdhaXQgY2hlY2tTdGF0dXMocmVzcG9uc2UpXHJcblx0XHRcdGF3YWl0IHBhcnNlSlNPTihvYmopO1xyXG5cdFx0XHRhd2FpdCBhZGREZWxheUFuaW1hdGlvbignLmNhcmRXcmFwJywnLmNhcmQnLDAuMiwwLjUpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRhc3luY0ZldGNoKCk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubGV0IGFqYXhTZWxlY3QgPSBuZXcgQWpheFNlbGVjdCgnLmNhcmRXcmFwJywgJy5jYXJkJylcclxuYWpheFNlbGVjdC5sb2FkKCdkYXRhLmpzb24nKTtcclxuXHJcbi8vLS13b3ctLVxyXG5uZXcgV09XKCkuaW5pdCgpO1xyXG5mdW5jdGlvbiBhZGREZWxheUFuaW1hdGlvbihwYXJlbnRDTGFzcyx0YXJnZXRDbGFzcyxpbmNyZW1kZWxheSxkZWxheSl7XHJcblxyXG5cdGxldCBsaXN0SWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyZW50Q0xhc3MpLnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0Q2xhc3MpO1xyXG5cdC8vIGNvbnNvbGUubG9nKGxpc3RJY29uKTtcclxuXHRcclxuXHRsaXN0SWNvbi5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0ZGVsYXkrPSBpbmNyZW1kZWxheTtcclxuXHRcdGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdvdy1kZWxheScpO1xyXG5cdFx0XHRlbGVtZW50LmRhdGFzZXQud293RGVsYXkgPSBkZWxheSArICdzJztcclxuXHRcdH0pO1xyXG59XHJcbmFkZERlbGF5QW5pbWF0aW9uKCcuc29jaWFsJywnLmZhZGVJblVwJywwLjIsIDApO1xyXG5hZGREZWxheUFuaW1hdGlvbignLmNvbnRhY3RsaXN0JywnLmZhZGVJblJpZ2h0JywwLjIsMC44KTtcclxuYWRkRGVsYXlBbmltYXRpb24oJy5tZW51JywnLndvdycsMC4yLDAuNSk7XHJcbiJdLCJmaWxlIjoic2NyaXB0LmpzIn0=
