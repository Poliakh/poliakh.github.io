function scrollMagic() { // wait for document ready
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
			let scrollH = scrollElem.scrollHeight;
			let windowH = window.innerHeight;
			let offset = scrollH - windowH;
			if (offset >= 0) {
				scene.setPin(scrollElem)
				// let x = (scrollElem.offsetTop>0)? 90:0;
				let scroll = scrollElem.offsetTop * (scrollH /windowH)*1.3;////scrolling begins with 90 px, I do not know why
				if (scroll < offset) {
					scrollElem.style.top = -scroll + 'px';

				} else {
					scrollElem.style.top = -offset + 'px'
				}
			}
		})
		.addTo(controller);
};
scrollMagic();

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
		this.withWrap();
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
	withWrap() {
		// const withList = this.list
		// const wrap = document.querySelector
	}
	resize() {
		window.addEventListener(`resize`, ev => {
			this.list.style.left = 0;
			this.list.style.transform = 'translateX(0)'
		}, false);
	}
}
(function cursorAction() {
	const cur = document.getElementById('cur');

	window.addEventListener('mousemove', ({ clientY, clientX }) => {
		cur.style.top = clientY + 'px';
		cur.style.left = clientX + 'px';
	});
	window.addEventListener('mouseover', ({ target }) => {
		if (target.closest(".curPointer")) {
			cur.firstElementChild.classList.add('pointer');
			target.addEventListener('mouseout', () => {
				cur.firstElementChild.classList.remove('pointer');
			})
		};
	});
})();
function randomMove() {
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
	// window.addEventListener('load', () => {
		randomMove('.moveFront', 15, 20);
		randomMove('.moveMid', 8, 10);
		randomMove('.moveR', 15, 10);
		randomMove('.move', 15, 10);
	// });
};
const parallax = (e) => {
	document.querySelectorAll('.layer').forEach(layer => {
		const speed = layer.getAttribute('data-speed');
		layer.style.transform = `translateX(-${e.clientX*speed/1500}px) translateY(-${e.clientY*speed/1000}px`;
	});
	
}
// document.addEventListener("mousemove", parallax);
function cardParallax(){
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
}
// const update = (e) => {
// 	let x = e.clientX || e.touches[0].clientX,
// 		y = e.clientY || e.touches[0].clientY

// 	document.documentElement.style.setProperty('--cursorX', `${x}px`);
// 	document.documentElement.style.setProperty('--cursorY', `${y}px`);
// }

// document.addEventListener('mousemove', update)
// document.addEventListener('touchmove', update)

// let r = document.querySelector('html');
// console.dir(r)
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
			target.addEventListener('mouseout', () => {
				figure.classList.remove('figur__bgBack-btnHover');
			})
		}
	});
	wrapDo.addEventListener('click', ({ target }) => {
		if (target.classList.contains('btnPanel__btn')) {
			figure.classList.add('figur__bgBack-btnActive');
			setTimeout(() => {
				figure.classList.remove('figur__bgBack-btnActive');
				figure.classList.remove('figur__bgBack-btnHover');
			}, 200);
		}
	})
}());

document.addEventListener('DOMContentLoaded', function () {
	const slider = new Slider('slider', 'slider__list', 'slider__item', 'slider__btnLeft', 'slider__btnRight', 'slider__indicat', 300);
});




// build tiles on page clients
const elem = document.querySelector('.content__tiles');
const msnry = new Masonry(elem, {
	// options
	itemSelector: '.tile',
	columnWidth: 215,
	stagger: 30,
	// gutter: 10,
	// containerStyle: null,
	horizontalOrder: true	
});
msnry.layout();


window.addEventListener('load', () => {
	cardParallax();
	randomMove();

});

window.addEventListener('resize', () => {
	cardParallax();
	randomMove();
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2Nyb2xsTWFnaWMoKSB7IC8vIHdhaXQgZm9yIGRvY3VtZW50IHJlYWR5XHJcblx0Ly8gaW5pdFxyXG5cdGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgU2Nyb2xsTWFnaWMuQ29udHJvbGxlcih7XHJcblx0XHRnbG9iYWxTY2VuZU9wdGlvbnM6IHtcclxuXHRcdFx0dHJpZ2dlckhvb2s6ICdvbkxlYXZlJyxcclxuXHRcdFx0ZHVyYXRpb246IFwiMjAwJVwiXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIGdldCBhbGwgc2xpZGVzXHJcblx0Y29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wYW5lbFwiKTtcclxuXHJcblx0Ly8gY3JlYXRlIHNjZW5lIGZvciBldmVyeSBzbGlkZVxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG5cdFx0XHR0cmlnZ2VyRWxlbWVudDogc2xpZGVzW2ldXHJcblx0XHR9KVxyXG5cdFx0XHQuc2V0UGluKHNsaWRlc1tpXSwgeyBwdXNoRm9sbG93ZXJzOiBmYWxzZSB9KVxyXG5cdFx0XHQvLyAuYWRkSW5kaWNhdG9ycygpIC8vIGFkZCBpbmRpY2F0b3JzIChyZXF1aXJlcyBwbHVnaW4pXHJcblx0XHRcdC5hZGRUbyhjb250cm9sbGVyKTtcclxuXHJcblx0fVxyXG5cclxuXHRjb25zdCBzY3JvbGxFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbGVzJyk7XHJcblxyXG5cdGNvbnN0IHNjZW5lID0gbmV3IFNjcm9sbE1hZ2ljLlNjZW5lKHtcclxuXHRcdHRyaWdnZXJFbGVtZW50OiAnI2NsaWVudCcsXHJcblx0XHRvZmZzZXQ6IDEwMCxcclxuXHRcdHRyaWdnZXJIb29rOiAwLFxyXG5cdFx0ZHVyYXRpb246IDEwMFxyXG5cdH0pXHJcblx0XHQub24oXCJwcm9ncmVzc1wiLCAoZSkgPT4ge1xyXG5cdFx0XHRsZXQgc2Nyb2xsSCA9IHNjcm9sbEVsZW0uc2Nyb2xsSGVpZ2h0O1xyXG5cdFx0XHRsZXQgd2luZG93SCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRcdFx0bGV0IG9mZnNldCA9IHNjcm9sbEggLSB3aW5kb3dIO1xyXG5cdFx0XHRpZiAob2Zmc2V0ID49IDApIHtcclxuXHRcdFx0XHRzY2VuZS5zZXRQaW4oc2Nyb2xsRWxlbSlcclxuXHRcdFx0XHQvLyBsZXQgeCA9IChzY3JvbGxFbGVtLm9mZnNldFRvcD4wKT8gOTA6MDtcclxuXHRcdFx0XHRsZXQgc2Nyb2xsID0gc2Nyb2xsRWxlbS5vZmZzZXRUb3AgKiAoc2Nyb2xsSCAvd2luZG93SCkqMS4zOy8vLy9zY3JvbGxpbmcgYmVnaW5zIHdpdGggOTAgcHgsIEkgZG8gbm90IGtub3cgd2h5XHJcblx0XHRcdFx0aWYgKHNjcm9sbCA8IG9mZnNldCkge1xyXG5cdFx0XHRcdFx0c2Nyb2xsRWxlbS5zdHlsZS50b3AgPSAtc2Nyb2xsICsgJ3B4JztcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNjcm9sbEVsZW0uc3R5bGUudG9wID0gLW9mZnNldCArICdweCdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuYWRkVG8oY29udHJvbGxlcik7XHJcbn07XHJcbnNjcm9sbE1hZ2ljKCk7XHJcblxyXG4vLz0gbW9kdWxlcy9zbGlkZXIuanNcclxuLy89IG1vZHVsZXMvY3Vyc29yLmpzXHJcbi8vPSBtb2R1bGVzL3JhbmRvbU1vdmUuanNcclxuLy89IG1vZHVsZXMvcGFyYWxsYXguanNcclxuLy89IG1vZHVsZXMvcm90YXRlM2QuanNcclxuLy89IG1vZHVsZXMvbGlnaHRPZkN1cnNvci5qc1xyXG4vLz0gbW9kdWxlcy93ZWRvLmpzXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IHNsaWRlciA9IG5ldyBTbGlkZXIoJ3NsaWRlcicsICdzbGlkZXJfX2xpc3QnLCAnc2xpZGVyX19pdGVtJywgJ3NsaWRlcl9fYnRuTGVmdCcsICdzbGlkZXJfX2J0blJpZ2h0JywgJ3NsaWRlcl9faW5kaWNhdCcsIDMwMCk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuLy8gYnVpbGQgdGlsZXMgb24gcGFnZSBjbGllbnRzXHJcbmNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGlsZXMnKTtcclxuY29uc3QgbXNucnkgPSBuZXcgTWFzb25yeShlbGVtLCB7XHJcblx0Ly8gb3B0aW9uc1xyXG5cdGl0ZW1TZWxlY3RvcjogJy50aWxlJyxcclxuXHRjb2x1bW5XaWR0aDogMjE1LFxyXG5cdHN0YWdnZXI6IDMwLFxyXG5cdC8vIGd1dHRlcjogMTAsXHJcblx0Ly8gY29udGFpbmVyU3R5bGU6IG51bGwsXHJcblx0aG9yaXpvbnRhbE9yZGVyOiB0cnVlXHRcclxufSk7XHJcbm1zbnJ5LmxheW91dCgpO1xyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdGNhcmRQYXJhbGxheCgpO1xyXG5cdHJhbmRvbU1vdmUoKTtcclxuXHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuXHRjYXJkUGFyYWxsYXgoKTtcclxuXHRyYW5kb21Nb3ZlKCk7XHJcbn0pIl0sImZpbGUiOiJzY3JpcHQuanMifQ==
