function browser_name() {
	var browser_id = navigator.userAgent;
	if (browser_id.search(/MSIE/) != -1 || browser_id.search(/Trident/) != -1) return 'IE';
}

function addPolifil() {
	if (browser_name() == 'IE') {
	//<script src="https://unpkg.com/element-closest"></script>
	
	!function (e) { var t = e.Element.prototype; "function" != typeof t.matches && (t.matches = t.msMatchesSelector || t.mozMatchesSelector || t.webkitMatchesSelector || function (e) { for (var t = (this.document || this.ownerDocument).querySelectorAll(e), o = 0; t[o] && t[o] !== this;)++o; return Boolean(t[o]) }), "function" != typeof t.closest && (t.closest = function (e) { for (var t = this; t && 1 === t.nodeType;) { if (t.matches(e)) return t; t = t.parentNode } return null }) }(window);
	}
}
addPolifil()

class Slider {
	constructor(slider, list, img, btn_l, btn_r, indicate, timeout) {
		this.slider = document.querySelector(`.${slider}`);
		this.firstList = list;
		this.list = document.querySelector(`.${list}`);
		this.img = img;
		this.listImg = this.list.querySelectorAll(`.${this.img}`);
		this.listCopy = [].slice.call(this.listImg);
		this.btn_l = btn_l;
		this.btn_r = btn_r;
		this.timeout = timeout;
		this.indicate = this.slider.querySelector(`.${indicate}`);
		this.addEvent();
		this.resize();
		this.indicateInit();
	}
	indicateInit() {
		if (this.indicate) {
			const clonElem = this.indicate.firstElementChild.cloneNode();
			this.classNameActive = clonElem.className + '-active';
			while (this.indicate.firstChild) {
				this.indicate.removeChild(this.indicate.firstChild);
			}
			const fragment = document.createDocumentFragment();
			for (let i = 0; i < this.listImg.length; i++) {
				fragment.appendChild(clonElem.cloneNode());
			}
			this.indicate.appendChild(fragment);
			this.indicate.firstElementChild.classList.add(this.classNameActive);
		}
	}
	indicateActive(action) {
		if (this.indicate) {
			if (action == 'next') {
				const elem = this.indicate.querySelector(`.${this.classNameActive}`);
				elem.classList.remove(this.classNameActive);
				if (elem.nextElementSibling) {
					elem.nextElementSibling.classList.add(`${this.classNameActive}`);
				} else {
					this.indicate.firstElementChild.classList.add(`${this.classNameActive}`);
				}
			} else if (action == 'prev') {
				const elem = this.indicate.querySelector(`.${this.classNameActive}`);
				elem.classList.remove(this.classNameActive);
				if (elem.previousElementSibling) {
					elem.previousElementSibling.classList.add(`${this.classNameActive}`);
				} else {
					this.indicate.lastElementChild.classList.add(`${this.classNameActive}`);
				}
			}
		}
	}

	getwidthImage() {
		const elem = this.list.querySelector(`.${this.img}`);
		const computedStyle = getComputedStyle(elem);
		return parseInt(computedStyle.marginRight) + elem.offsetWidth;
	}

	moveList(direction) {
		const offset = this.getwidthImage();
		const offsetLeft = (isNaN(parseInt(this.list.style.left))) ? 0 : parseInt(this.list.style.left);
		if (direction == 'left') {
			this.addAfter()
			this.list.style.left = offsetLeft - offset + 'px';
			setTimeout(() => {
				const offsetComp = -(offsetLeft - offset) + 'px';
				this.list.style.transform = 'translateX(' + offsetComp + ')';
				// this.addEvent();
			}, this.timeout);
			this.indicateActive('next');

		} else if (direction == 'right') {
			this.addBefore()
			const offsetComp = - (offsetLeft + offset) + 'px';
			this.list.style.transform = 'translateX(' + offsetComp + ')';
			this.list.style.left = offsetLeft + offset + 'px';
			this.removeEvent();
			setTimeout(() => {
				// this.addEvent();
			}, this.timeout);
			this.indicateActive('prev');
		}
	}

	addAfter() {
		const firstElem = this.list.firstElementChild;
		const cloneElem = firstElem.cloneNode();
		
		this.list.appendChild(cloneElem);
		this.removeEvent();
		setTimeout(() => {
			const firstElem = this.list.firstElementChild
			this.list.removeChild(firstElem);
		}, this.timeout);
	}
	addBefore() {
		const firstElem = this.list.firstElementChild;
		const cloneLastElem = this.list.lastElementChild.cloneNode();
		this.list.insertBefore(cloneLastElem, firstElem);
		setTimeout(() => {
			const lastElem = this.list.lastElementChild;
			this.list.removeChild(lastElem);
		}, this.timeout)
	}
	addEvent() {
		this.slider.addEventListener('mouseup', (e)=>{
			this.list = document.querySelector(`.${this.firstList}`);

			if (e.target.closest(`.${this.btn_l}`)) {
				this.moveList('left');
			} else if (e.target.closest(`.${this.btn_r}`)) {
				this.moveList('right');
			}
		});
	}
	removeEvent() {
		this.slider.removeEventListener('mouseup', this.removeEventListener);

	}
	resize() {
		window.addEventListener(`resize`, ev => {
			this.list.style.left = 0;
			this.list.style.transform = 'translateX(0)'
		}, false);
	}
}
class Popup {
	constructor(popupWrapID, popupActive, classHide, popupCloseElClNm,popupWin, missed=true) {
		this.missed = missed;//if this value is "true" popup will close by click outside the area popup
		this.show = popupActive;
		this.classHide = classHide;
		this.popupWin = popupWin;
		this.popup = document.getElementById(popupWrapID);
		this.closePopup = popupCloseElClNm;
		document.querySelector("body").addEventListener("mouseup", this.addEvent.bind(this));
	}
	addEvent(event) {
		if (event.target.matches(this.show) || event.target.closest(this.show)) {
			this.popUpShow(event.target.closest(this.show));
			this.popCloseButton(this.closePopup);
		}
	}
	popUpShow(target) {
		this.popup.classList.remove(this.classHide);
		const body = document.querySelector('body');

		body.classList.add('modal-open')
	}
	popUpHide() {
		this.popup.classList.add(this.classHide);
		const body = document.querySelector('body');
		body.classList.remove('modal-open')

	}
	closeByKey(event) {
		if (event.keyCode === 27) {
			this.popUpHide();
		}
	}
	popCloseButton(el) {
		this.popup.addEventListener("mouseup", event => {
			if (event.target.closest(el)||(this.missed && !event.target.closest(`.${this.popupWin}`))) {
				this.popUpHide();
			}
		});
		document.addEventListener("keydown", this.closeByKey.bind(this));
	}
}
class SelectShoe {
	constructor(wrapper, btn_l, btn_r, wrapShoeSelect, btnListDesc, color) {
		this.wrapper = document.querySelector(`.${wrapper}`);
		this.btn_l = btn_l;
		this.btn_r = btn_r;
		this.wrapShoe = this.wrapper.querySelector(`.${wrapShoeSelect}`);
		this.btnOrder = btnListDesc;
		this.color = color;
		this.addEventOrder();
		this.addEventSlide();
	}
	actionBG(dir) {
		const elem = this.wrapShoe.querySelector(".front");
		const color = elem.getAttribute('data-colorbg');
		const newColor = this.getColor(`${color}`, dir);
		const list = this.wrapShoe.querySelectorAll('[data-colorbg]');
		for (let i = 0; i < list.length; i++) {
			if (list[i].getAttribute('data-colorbg') == color) {
				list[i].classList.remove('front');
			} else if (list[i].getAttribute('data-colorbg') == newColor) {
				list[i].classList.add('front');
			}
		}
		this.actionElement('data-colorsl',color, newColor,'cardBy__slider-hide');
		this.actionElement('data-colorhd',color, newColor,'cardBy__header-hide');
		this.actionElementOutSlider('data-colorpsl',color, newColor,'popup__list-hide');
	}
	actionElement(data, color, newColor, toggleClass) {
		const list = this.wrapper.querySelectorAll(`[${data}]`)
		for (let i = 0; i < list.length; i++) {
			if (list[i].getAttribute(data) == color) {
				list[i].classList.add(toggleClass);
			} else if (list[i].getAttribute(data) == newColor) {
				list[i].classList.remove(toggleClass);
			}
		}
	}
	actionElementOutSlider(data, color, newColor, toggleClass) {
		const list = document.querySelectorAll(`[${data}]`);

		for (let i = 0; i < list.length; i++) {
			if (list[i].getAttribute(data) == color) {
				list[i].classList.add(toggleClass);
				list[i].classList.remove('popup__list-check');
			} else if (list[i].getAttribute(data) == newColor) {
				list[i].classList.remove(toggleClass);
				list[i].classList.add('popup__list-check');
			}
		}
	}
	addEventSlide() {
		this.wrapper.addEventListener('mouseup', (e) => {
			if (e.target.closest(`.${this.btn_l}`)) {
				this.actionBG('next');
			} else if (e.target.closest(`.${this.btn_r}`)) {
				this.actionBG('prev');
			}
		})
	}
	getColor(color, direct) {
		let res;
		this.color.forEach((element, i) => {
			if (color == element && direct == "next") {
				const index = ((i + 1) >= this.color.length) ? 0 : i + 1;
				res = this.color[index];
			}
			else if (color === element && direct === "prev") {
				const index = (i - 1 < 0) ? this.color.length - 1 : i - 1;
				res = this.color[index];
			}
		});
		return res;
	}

	addEventOrder() {
		this.wrapper.addEventListener('mouseup', (e) => {
			const changeCard = () => {
				const list = this.wrapper.querySelectorAll('.cardBy__wrapper');
				for (let i = 0; i < list.length; i++) {
					list[i].classList.toggle('hide')
				}
			}
			if (e.target.closest(`.${this.btnOrder}`) || e.target.closest('.cardBy__back')) {
				changeCard()
			}
		});
	}
	popupCheck(){

	}
}
class InfSlider {
	constructor(wrapBtn, classBtn, classCheckBtn, wrapSlidInf, classCheckSlidInf) {
		this.wrapBtn = document.querySelector(`.${wrapBtn}`);
		this.classCheckBtn = classCheckBtn;
		this.classBtn = classBtn;
		this.wrapSlidInf = document.querySelector(`.${wrapSlidInf}`);
		this.classCheckSlidInf = classCheckSlidInf;
		this.addEvent();
	}
	addEvent() {
		this.wrapBtn.addEventListener('mouseup', (e) => {
			const list = this.wrapBtn.children;
			let elem;
			if (elem = e.target.closest(`.${this.classBtn}`)) {
				for (let i = 0; i < list.length; i++) {
					if (elem == list[i]) {
						this.checkElem(this.wrapBtn, this.classCheckBtn, i);
						this.checkElem(this.wrapSlidInf, this.classCheckSlidInf, i)
						return
					}
				}
			}

		})
	}
	checkElem(wrapList, checkClass, n) {
		const list = wrapList.children;
		const unCheck = wrapList.querySelector(`.${checkClass}`);
		unCheck.classList.remove(checkClass);
		list[n].classList.add(checkClass);
	}
}


const slider = new Slider('slider', 'slider__list', 'slider__img', 'btnLeft', 'btnRight', 'slider__indicat', 300);

const sliderSpray = new Slider('purchase__cardSlide', 'sliderSpray__wrapper', 'sliderSpray__img', 'btnLeft', 'btnRight', null, 300);

const sliderPopup = new Slider('popup__slider', 'popup__list-check', 'popup__img', 'btnLeft', 'btnRight', null, 500);


const select = new SelectShoe('select', 'btnLeft', 'btnRight', 'select__cardSlide', 'cardBy__button-list', ['red', 'black']);

const myPopup = new Popup('popupRed', '.cardBy__img', 'popup-hide', 'cls', 'popup__slider', true);


const infSlider = new InfSlider('info__list', 'info__item', 'info__item-check', 'info__cont', 'slideInfo-vis');
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYnJvd3Nlcl9uYW1lKCkge1xyXG5cdHZhciBicm93c2VyX2lkID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuXHRpZiAoYnJvd3Nlcl9pZC5zZWFyY2goL01TSUUvKSAhPSAtMSB8fCBicm93c2VyX2lkLnNlYXJjaCgvVHJpZGVudC8pICE9IC0xKSByZXR1cm4gJ0lFJztcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkUG9saWZpbCgpIHtcclxuXHRpZiAoYnJvd3Nlcl9uYW1lKCkgPT0gJ0lFJykge1xyXG5cdC8vPSBtb2R1bGVzL3BvbGlmaWxfY2xvc2VzdC5qc1xyXG5cdH1cclxufVxyXG5hZGRQb2xpZmlsKClcclxuXHJcbi8vPSBtb2R1bGVzL3NsaWRlci5qc1xyXG4vLz0gbW9kdWxlcy9wb3B1cC5qc1xyXG4vLz0gbW9kdWxlcy9zZWxlY3QuanNcclxuLy89IG1vZHVsZXMvaW5mU2xpZGVyLmpzXHJcblxyXG5cclxuY29uc3Qgc2xpZGVyID0gbmV3IFNsaWRlcignc2xpZGVyJywgJ3NsaWRlcl9fbGlzdCcsICdzbGlkZXJfX2ltZycsICdidG5MZWZ0JywgJ2J0blJpZ2h0JywgJ3NsaWRlcl9faW5kaWNhdCcsIDMwMCk7XHJcblxyXG5jb25zdCBzbGlkZXJTcHJheSA9IG5ldyBTbGlkZXIoJ3B1cmNoYXNlX19jYXJkU2xpZGUnLCAnc2xpZGVyU3ByYXlfX3dyYXBwZXInLCAnc2xpZGVyU3ByYXlfX2ltZycsICdidG5MZWZ0JywgJ2J0blJpZ2h0JywgbnVsbCwgMzAwKTtcclxuXHJcbmNvbnN0IHNsaWRlclBvcHVwID0gbmV3IFNsaWRlcigncG9wdXBfX3NsaWRlcicsICdwb3B1cF9fbGlzdC1jaGVjaycsICdwb3B1cF9faW1nJywgJ2J0bkxlZnQnLCAnYnRuUmlnaHQnLCBudWxsLCA1MDApO1xyXG5cclxuXHJcbmNvbnN0IHNlbGVjdCA9IG5ldyBTZWxlY3RTaG9lKCdzZWxlY3QnLCAnYnRuTGVmdCcsICdidG5SaWdodCcsICdzZWxlY3RfX2NhcmRTbGlkZScsICdjYXJkQnlfX2J1dHRvbi1saXN0JywgWydyZWQnLCAnYmxhY2snXSk7XHJcblxyXG5jb25zdCBteVBvcHVwID0gbmV3IFBvcHVwKCdwb3B1cFJlZCcsICcuY2FyZEJ5X19pbWcnLCAncG9wdXAtaGlkZScsICdjbHMnLCAncG9wdXBfX3NsaWRlcicsIHRydWUpO1xyXG5cclxuXHJcbmNvbnN0IGluZlNsaWRlciA9IG5ldyBJbmZTbGlkZXIoJ2luZm9fX2xpc3QnLCAnaW5mb19faXRlbScsICdpbmZvX19pdGVtLWNoZWNrJywgJ2luZm9fX2NvbnQnLCAnc2xpZGVJbmZvLXZpcycpO1xyXG5cclxuIl0sImZpbGUiOiJzY3JpcHQuanMifQ==
