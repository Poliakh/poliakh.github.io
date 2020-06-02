

const scrollMagic = () => { // wait for document ready
	// init
	const controller = new ScrollMagic.Controller({
		globalSceneOptions: {
			triggerHook: 'onLeave',
			duration: "200%"
		}
	});

	// get all slides
	const slides = document.querySelectorAll(".panel");

	// create scene for every slide
	for (let i = 0; i < slides.length; i++) {
		new ScrollMagic.Scene({
			triggerElement: slides[i]
		})
			.setPin(slides[i], { pushFollowers: false })
			// .addIndicators() // add indicators (requires plugin)
			.addTo(controller);

	}

	const scrollElem = document.getElementById('tiles');

	const scene = new ScrollMagic.Scene({
		triggerElement: '#client',
		offset: 100,
		triggerHook: 0,
		duration: 100
	})
		.on("progress", (e) => {
			let offset = scrollElem.scrollHeight - window.innerHeight;
			if (offset >= 0) {
				scene.setPin(scrollElem)
				// let x = (scrollElem.offsetTop>0)? 90:0;
				let scroll = scrollElem.offsetTop * 1.5//scrolling begins with 90 px, I do not know why
				if (scroll < offset) {
						scrollElem.style.top = -scroll + 'px';

				} else {
					scrollElem.style.top = -offset + 'px'
				}
			}
		})
		.addTo(controller);
};

window.addEventListener('load', scrollMagic);

// build tiles
var elem = document.querySelector('.content__tiles');
var msnry = new Masonry(elem, {
	// options
	itemSelector: '.tile',
	columnWidth: 225,
	horizontalOrder: true
});

// element argument can be a selector string
//   for an individual element
// var msnry = new Masonry('.tile', {
// 	// options
// });

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
		const cloneElem = firstElem.cloneNode(true);
		
		this.list.appendChild(cloneElem);
		this.removeEvent();
		setTimeout(() => {
			const firstElem = this.list.firstElementChild
			this.list.removeChild(firstElem);
		}, this.timeout);
	}
	addBefore() {
		const firstElem = this.list.firstElementChild;
		const cloneLastElem = this.list.lastElementChild.cloneNode(true);
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


document.addEventListener('DOMContentLoaded', function () {
	const slider = new Slider('slider', 'slider__list', 'slider__item', 'slider__btnLeft', 'slider__btnRight', 'slider__indicat', 300);
});


	
	window.addEventListener('resize', () => {
	})
	
	// exeple - randomMove('.move', 15, 30);
	const randomMove = (classElemetns, percenField, rotateAngel) => {
		const field = percenField / 100;
		const withDisp = document.documentElement.clientWidth;
		const heightDisp = document.documentElement.clientHeight;
		const listElem = document.querySelectorAll(classElemetns);
	
		const setOffset = (elem) => {
			let offsetX = Math.floor(Math.random() * field * withDisp - field * .5 * withDisp);
			let offsetY = Math.floor(Math.random() * field * heightDisp - field * .5 * heightDisp);
			let rotate = Math.floor(Math.random() * rotateAngel) - rotateAngel * .5;
			let offset = `rotate(${rotate}deg) translateX(${offsetX}px) translateY(${offsetY}px)`;
			elem.style.transform = offset;
		}
		const moveRandomOneElem = (elem) => {
			window.addEventListener('load', () => {
				randomMove('.move', 15, 30);
			});
	
			setOffset(elem)
			
			setInterval(() => {
				setOffset(elem)
			}, Math.floor(Math.random() * 3000 + 7000));
	
		};
	
		listElem.forEach(moveRandomOneElem);
	}
	window.addEventListener('load', () => {
		randomMove('.moveFront', 15, 20);
		randomMove('.moveMid', 8, 10);
		randomMove('.moveR', 15, 10);
		randomMove('.move', 15, 10);
	});
	const parallax = (e) => {
		document.querySelectorAll('.layer').forEach(layer => {
			const speed = layer.getAttribute('data-speed');
			layer.style.transform = `translateX(-${e.clientX*speed/1500}px) translateY(-${e.clientY*speed/1000}px`;
		});
		
	}
	// document.addEventListener("mousemove", parallax);
	const card = document.getElementById('card'),
		layer = document.querySelectorAll('.card__layer')
	w = document.documentElement.clientWidth,
		h = document.documentElement.clientHeight;
	
	document.addEventListener('mousemove', (e) => {
		const offsetX = 0.5 - e.clientX / w,
			offsetY = 0.5 - e.clientY / h,
			dy = e.clientY - h / 2,
			dx = e.clientX - w / 2,
			theta = Math.atan2(dy, dx),
	
			offsetPoster = card.getAttribute('data-offset'),// rotateY((${offsetX * (offsetPoster * 2)})deg)
			transformPoster = 'translateY(' + -offsetX * offsetPoster + 'px) rotateX(' + (offsetY * offsetPoster) + 'deg) rotateY(' + (-offsetX * (offsetPoster * 2)) + 'deg)';
		// console.log('transformPoster :',transformPoster);
		card.style.transform = transformPoster;
		// console.dir(card.style.transform);
		
		
		// console.log("offsetX :", offsetX," offsetY: ",offsetY );
		
		layer.forEach(item => {
			// console.log("item :", item);
	
			const offsetLayer = item.getAttribute('data-offset') || 0,
				transformLayer = `translateX(${offsetX * offsetLayer}px) translateY(${offsetY * offsetLayer}px)`;
			// console.log(transformLayer);
	
			item.style.transform = transformLayer;
		});
	});
	const update = (e) => {
		let x = e.clientX || e.touches[0].clientX,
			y = e.clientY || e.touches[0].clientY
	
		document.documentElement.style.setProperty('--cursorX', `${x}px`);
		document.documentElement.style.setProperty('--cursorY', `${y}px`);
	}
	
	document.addEventListener('mousemove', update)
	document.addEventListener('touchmove', update)
	
	let r = document.querySelector('html');
	console.dir(r)
	(function () {
		const wrapDo = document.querySelector('.wrapDo');
	
		wrapDo.addEventListener('click', ({ target }) => {
			if (target.hasAttribute('data-serv')) {
				const figure = document.querySelector('.figure');
				const attr = target.getAttribute('data-serv')
				const listBtn = wrapDo.querySelectorAll('.btnPanel__btn');
				figure.setAttribute('data-serv', attr);
	
				listBtn.forEach(item => {
					if (item.getAttribute('data-serv') === attr) {
						item.classList.add('active')
					};
	
					if (item.getAttribute('data-serv') !== attr
						&& item.classList.contains('active')) {
						item.classList.remove('active')
					};
				});
			};
		});
		let figure = wrapDo.querySelector('.figure__bgBack');
	
		wrapDo.addEventListener('mouseover', ({ target }) => {
			if (target.classList.contains('btnPanel__btn')) {
				figure.classList.add('figur__bgBack-btnHover');
			} else if (!target.classList.contains('btnPanel__btn')
				&& figure.classList.contains('figur__bgBack-btnHover')) {
				figure.classList.remove('figur__bgBack-btnHover');
			}
		});
		wrapDo.addEventListener('click', ({target}) => {
			if(target.classList.contains('btnPanel__btn')){
				figure.classList.add('figur__bgBack-btnActive');
				setTimeout(() => {
					figure.classList.remove('figur__bgBack-btnActive');
					figure.classList.remove('figur__bgBack-btnHover');
				}, 200);
			}
		})
	}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5jb25zdCBzY3JvbGxNYWdpYyA9ICgpID0+IHsgLy8gd2FpdCBmb3IgZG9jdW1lbnQgcmVhZHlcclxuXHQvLyBpbml0XHJcblx0Y29uc3QgY29udHJvbGxlciA9IG5ldyBTY3JvbGxNYWdpYy5Db250cm9sbGVyKHtcclxuXHRcdGdsb2JhbFNjZW5lT3B0aW9uczoge1xyXG5cdFx0XHR0cmlnZ2VySG9vazogJ29uTGVhdmUnLFxyXG5cdFx0XHRkdXJhdGlvbjogXCIyMDAlXCJcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gZ2V0IGFsbCBzbGlkZXNcclxuXHRjb25zdCBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhbmVsXCIpO1xyXG5cclxuXHQvLyBjcmVhdGUgc2NlbmUgZm9yIGV2ZXJ5IHNsaWRlXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdG5ldyBTY3JvbGxNYWdpYy5TY2VuZSh7XHJcblx0XHRcdHRyaWdnZXJFbGVtZW50OiBzbGlkZXNbaV1cclxuXHRcdH0pXHJcblx0XHRcdC5zZXRQaW4oc2xpZGVzW2ldLCB7IHB1c2hGb2xsb3dlcnM6IGZhbHNlIH0pXHJcblx0XHRcdC8vIC5hZGRJbmRpY2F0b3JzKCkgLy8gYWRkIGluZGljYXRvcnMgKHJlcXVpcmVzIHBsdWdpbilcclxuXHRcdFx0LmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cclxuXHR9XHJcblxyXG5cdGNvbnN0IHNjcm9sbEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGlsZXMnKTtcclxuXHJcblx0Y29uc3Qgc2NlbmUgPSBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG5cdFx0dHJpZ2dlckVsZW1lbnQ6ICcjY2xpZW50JyxcclxuXHRcdG9mZnNldDogMTAwLFxyXG5cdFx0dHJpZ2dlckhvb2s6IDAsXHJcblx0XHRkdXJhdGlvbjogMTAwXHJcblx0fSlcclxuXHRcdC5vbihcInByb2dyZXNzXCIsIChlKSA9PiB7XHJcblx0XHRcdGxldCBvZmZzZXQgPSBzY3JvbGxFbGVtLnNjcm9sbEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRcdFx0aWYgKG9mZnNldCA+PSAwKSB7XHJcblx0XHRcdFx0c2NlbmUuc2V0UGluKHNjcm9sbEVsZW0pXHJcblx0XHRcdFx0Ly8gbGV0IHggPSAoc2Nyb2xsRWxlbS5vZmZzZXRUb3A+MCk/IDkwOjA7XHJcblx0XHRcdFx0bGV0IHNjcm9sbCA9IHNjcm9sbEVsZW0ub2Zmc2V0VG9wICogMS41Ly9zY3JvbGxpbmcgYmVnaW5zIHdpdGggOTAgcHgsIEkgZG8gbm90IGtub3cgd2h5XHJcblx0XHRcdFx0aWYgKHNjcm9sbCA8IG9mZnNldCkge1xyXG5cdFx0XHRcdFx0XHRzY3JvbGxFbGVtLnN0eWxlLnRvcCA9IC1zY3JvbGwgKyAncHgnO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2Nyb2xsRWxlbS5zdHlsZS50b3AgPSAtb2Zmc2V0ICsgJ3B4J1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRUbyhjb250cm9sbGVyKTtcclxufTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2Nyb2xsTWFnaWMpO1xyXG5cclxuLy8gYnVpbGQgdGlsZXNcclxudmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGlsZXMnKTtcclxudmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoZWxlbSwge1xyXG5cdC8vIG9wdGlvbnNcclxuXHRpdGVtU2VsZWN0b3I6ICcudGlsZScsXHJcblx0Y29sdW1uV2lkdGg6IDIyNSxcclxuXHRob3Jpem9udGFsT3JkZXI6IHRydWVcclxufSk7XHJcblxyXG4vLyBlbGVtZW50IGFyZ3VtZW50IGNhbiBiZSBhIHNlbGVjdG9yIHN0cmluZ1xyXG4vLyAgIGZvciBhbiBpbmRpdmlkdWFsIGVsZW1lbnRcclxuLy8gdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoJy50aWxlJywge1xyXG4vLyBcdC8vIG9wdGlvbnNcclxuLy8gfSk7XHJcblxyXG4vLz0gbW9kdWxlcy9zbGlkZXIuanNcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IHNsaWRlciA9IG5ldyBTbGlkZXIoJ3NsaWRlcicsICdzbGlkZXJfX2xpc3QnLCAnc2xpZGVyX19pdGVtJywgJ3NsaWRlcl9fYnRuTGVmdCcsICdzbGlkZXJfX2J0blJpZ2h0JywgJ3NsaWRlcl9faW5kaWNhdCcsIDMwMCk7XHJcbn0pO1xyXG5cclxuXHJcblx0XHJcblx0Ly89IG1vZHVsZXMvcmFuZG9tTW92ZS5qc1xyXG5cdC8vPSBtb2R1bGVzL3BhcmFsbGF4LmpzXHJcblx0Ly89IG1vZHVsZXMvcm90YXRlM2QuanNcclxuXHQvLz0gbW9kdWxlcy9saWdodE9mQ3Vyc29yLmpzXHJcblx0Ly89IG1vZHVsZXMvd2Vkby5qc1xyXG4iXSwiZmlsZSI6InNjcmlwdC5qcyJ9
