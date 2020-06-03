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




// build tiles
var elem = document.querySelector('.content__tiles');
var msnry = new Masonry(elem, {
	// options
	itemSelector: '.tile',
	columnWidth: 225,
	horizontalOrder: true
	
});


window.addEventListener('load', () => {
	cardParallax();
	randomMove();

});

window.addEventListener('resize', () => {
	// cardParallax();
	// randomMove();
})