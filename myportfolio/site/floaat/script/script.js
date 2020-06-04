'use strict'

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
//ourteam page

console.dir(slider);



function sliderWidth(id, childClassName) {
	const widthBody = document.body.clientWidth;
	// console.log(widthBody);

	const slider = document.getElementById(id),
		sliderWrap = slider.querySelector('.sliderWrap'),
		offsetWidth = slider.clientWidth,
		child = slider.querySelectorAll(`.${childClassName}`);
	console.log("offsetWidth :", offsetWidth);

	let resultWidth = 0

	child.forEach((item , i ) => {
		
		const getprop = parseInt(window.getComputedStyle(item, null).getPropertyValue('margin-right')),
			widthItem = item.clientWidth,
			fullWidthItem = getprop + widthItem;
			
		if (resultWidth + fullWidthItem > widthBody*0.7) {
			return
		} else {
			resultWidth += fullWidthItem;
		}
	});
	slider.style.width = resultWidth +"px";
};

window.addEventListener('load', () => {

	sliderWidth('slider', 'slider__item');
	const sliderOne = new Slider('slider', 'slider__list', 'slider__item', 'slider__btnLeft', 'slider__btnRight', 'slider__indicat', 300);

});
window.addEventListener('resize', () => {
	sliderWidth('slider', 'slider__item');

})


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5mdW5jdGlvbiBzY3JvbGxNYWdpYygpIHsgLy8gd2FpdCBmb3IgZG9jdW1lbnQgcmVhZHlcclxuXHQvLyBpbml0XHJcblx0Y29uc3QgY29udHJvbGxlciA9IG5ldyBTY3JvbGxNYWdpYy5Db250cm9sbGVyKHtcclxuXHRcdGdsb2JhbFNjZW5lT3B0aW9uczoge1xyXG5cdFx0XHR0cmlnZ2VySG9vazogJ29uTGVhdmUnLFxyXG5cdFx0XHRkdXJhdGlvbjogXCIyMDAlXCJcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gZ2V0IGFsbCBzbGlkZXNcclxuXHRjb25zdCBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhbmVsXCIpO1xyXG5cclxuXHQvLyBjcmVhdGUgc2NlbmUgZm9yIGV2ZXJ5IHNsaWRlXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdG5ldyBTY3JvbGxNYWdpYy5TY2VuZSh7XHJcblx0XHRcdHRyaWdnZXJFbGVtZW50OiBzbGlkZXNbaV1cclxuXHRcdH0pXHJcblx0XHRcdC5zZXRQaW4oc2xpZGVzW2ldLCB7IHB1c2hGb2xsb3dlcnM6IGZhbHNlIH0pXHJcblx0XHRcdC8vIC5hZGRJbmRpY2F0b3JzKCkgLy8gYWRkIGluZGljYXRvcnMgKHJlcXVpcmVzIHBsdWdpbilcclxuXHRcdFx0LmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cclxuXHR9XHJcblxyXG5cdGNvbnN0IHNjcm9sbEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGlsZXMnKTtcclxuXHJcblx0Y29uc3Qgc2NlbmUgPSBuZXcgU2Nyb2xsTWFnaWMuU2NlbmUoe1xyXG5cdFx0dHJpZ2dlckVsZW1lbnQ6ICcjY2xpZW50JyxcclxuXHRcdG9mZnNldDogMTAwLFxyXG5cdFx0dHJpZ2dlckhvb2s6IDAsXHJcblx0XHRkdXJhdGlvbjogMTAwXHJcblx0fSlcclxuXHRcdC5vbihcInByb2dyZXNzXCIsIChlKSA9PiB7XHJcblx0XHRcdGxldCBzY3JvbGxIID0gc2Nyb2xsRWxlbS5zY3JvbGxIZWlnaHQ7XHJcblx0XHRcdGxldCB3aW5kb3dIID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID0gc2Nyb2xsSCAtIHdpbmRvd0g7XHJcblx0XHRcdGlmIChvZmZzZXQgPj0gMCkge1xyXG5cdFx0XHRcdHNjZW5lLnNldFBpbihzY3JvbGxFbGVtKVxyXG5cdFx0XHRcdC8vIGxldCB4ID0gKHNjcm9sbEVsZW0ub2Zmc2V0VG9wPjApPyA5MDowO1xyXG5cdFx0XHRcdGxldCBzY3JvbGwgPSBzY3JvbGxFbGVtLm9mZnNldFRvcCAqIChzY3JvbGxIIC93aW5kb3dIKSoxLjM7Ly8vL3Njcm9sbGluZyBiZWdpbnMgd2l0aCA5MCBweCwgSSBkbyBub3Qga25vdyB3aHlcclxuXHRcdFx0XHRpZiAoc2Nyb2xsIDwgb2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzY3JvbGxFbGVtLnN0eWxlLnRvcCA9IC1zY3JvbGwgKyAncHgnO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2Nyb2xsRWxlbS5zdHlsZS50b3AgPSAtb2Zmc2V0ICsgJ3B4J1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5hZGRUbyhjb250cm9sbGVyKTtcclxufTtcclxuc2Nyb2xsTWFnaWMoKTtcclxuXHJcbi8vPSBtb2R1bGVzL3NsaWRlci5qc1xyXG4vLz0gbW9kdWxlcy9jdXJzb3IuanNcclxuLy89IG1vZHVsZXMvcmFuZG9tTW92ZS5qc1xyXG4vLz0gbW9kdWxlcy9wYXJhbGxheC5qc1xyXG4vLz0gbW9kdWxlcy9yb3RhdGUzZC5qc1xyXG4vLz0gbW9kdWxlcy9saWdodE9mQ3Vyc29yLmpzXHJcbi8vPSBtb2R1bGVzL3dlZG8uanNcclxuLy89IG1vZHVsZXMvb3VydGVhbS5qc1xyXG5cclxuXHJcbi8vIGJ1aWxkIHRpbGVzIG9uIHBhZ2UgY2xpZW50c1xyXG5jb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RpbGVzJyk7XHJcbmNvbnN0IG1zbnJ5ID0gbmV3IE1hc29ucnkoZWxlbSwge1xyXG5cdC8vIG9wdGlvbnNcclxuXHRpdGVtU2VsZWN0b3I6ICcudGlsZScsXHJcblx0Y29sdW1uV2lkdGg6IDIxNSxcclxuXHRzdGFnZ2VyOiAzMCxcclxuXHQvLyBndXR0ZXI6IDEwLFxyXG5cdC8vIGNvbnRhaW5lclN0eWxlOiBudWxsLFxyXG5cdGhvcml6b250YWxPcmRlcjogdHJ1ZVx0XHJcbn0pO1xyXG5tc25yeS5sYXlvdXQoKTtcclxuXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuXHRjYXJkUGFyYWxsYXgoKTtcclxuXHRyYW5kb21Nb3ZlKCk7XHJcblxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcblx0Y2FyZFBhcmFsbGF4KCk7XHJcblx0cmFuZG9tTW92ZSgpO1xyXG59KSJdLCJmaWxlIjoic2NyaXB0LmpzIn0=
