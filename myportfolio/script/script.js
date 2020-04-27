"use strict";

const burger = () => {
	const wrapMenuNavigation = document.querySelector('.navbar');
	document.querySelector('body').addEventListener('click', toggleMenu);

	function toggleMenu(event) {
		if (event.target.closest('.burger') || event.target.closest('.menu')) {
			wrapMenuNavigation.classList.toggle('navbar-active');
		}
		if (!event.target.closest('.burger')) {
			wrapMenuNavigation.classList.remove('navbar-active');
		}
	}
}

//turn off animated navigation for items menu  if burger visible
(function () {
	const burger = document.querySelector(".burger")
	if (getComputedStyle(burger).visibility == 'visible') {
		const navItemList = document.querySelectorAll(".menu .wow");
		navItemList.forEach(elem => {
			elem.classList.remove('wow');
		})
	}
})(); 

burger();
class CardListCreator {
	constructor(wrapElem, card){
		this.card = card;
		this.myCards = document.createDocumentFragment();
		this.parentCards = document.querySelector(wrapElem);
		this.elemCard = this.parentCards.querySelector(card);
		console.log('creator');
		
	};

	_showLoading = (state = true) => {
		let loader = document.querySelector('.loader');
		(state) ? loader.classList.remove('loaderHide') : loader.classList.add('loaderHide');
	};
	
	createLinkToGoogleSheet = (shareLink = '', listNumber = 1) => {
		const idRegex = /\/d\/(.*)\//;
		try {
			const idSheet = shareLink.match(idRegex)[1];
			return `https://spreadsheets.google.com/feeds/list/${idSheet}/${listNumber}/public/values?alt=json`
		} catch (error) {
			console.error('link for sheet must be "https:/*/d/*');
		};
	};

	createListIconStackTechnology = (obj, newCard) => {
		const listStack = obj.stack;
		const listIcon = newCard.querySelectorAll('[data-id-svg]');
		//Mark the necessary SVG elements in the map tree
		for (let i = 0; i < listStack.length; i++) {
			for (let index = 0; index < listIcon.length; index++) {
				if (listStack[i] == listIcon[index].dataset.idSvg) {
					listIcon[index].dataset.idSvg = 'is';
				}
			}
		}
		const parent = newCard.querySelector('.card__stack');
		//Remove unnecessary items
		for (let index = 0; index < listIcon.length; index++) {
			if (listIcon[index].dataset.idSvg != 'is') {
				parent.removeChild(listIcon[index]);
			}
		}
		return newCard;
	};

	_createCard = (obj) => {
		const newCard = this.elemCard.cloneNode(true);
		newCard.hidden = false;
		newCard.querySelector('.descript__page').href = obj.gitpage;
		newCard.querySelector('.descript__hub').href = obj.github;
		newCard.querySelector('.descript__head').innerText = obj.header;
		newCard.querySelector('.descript__text').innerHTML = obj.descript;
		newCard.style.backgroundImage = `url("${obj.preview}")`;
		
		this.createListIconStackTechnology(obj,newCard)

		return newCard;
	};

	_getObject = async (response) => {
		if (response.ok) {
			const data = (await response.json()).feed.entry[0].gsx$myjson.$t;
			return JSON.parse(data);
		} else {
			showLoading(false);
			const error = new Error("Ошибка " + response.statusText);
			error.response = response;
			throw error;
		};
	};

	_parseJSON = (obj) => {
		for (let key in obj) {
			if(obj[key].display){
				this.myCards.appendChild(this._createCard(obj[key]));
			};
	
		};
		this._showLoading(false);
		this.parentCards.appendChild(this.myCards);
	};

	load = (url) => {
		this._showLoading(true);
		//remove all children
		while (this.parentCards.querySelector(this.card)) {
			this.parentCards.removeChild(this.parentCards.querySelector(this.card));
		};

		const link = this.createLinkToGoogleSheet(url);
			try {
				fetch(link)
				.then((data) => {
					return this._getObject(data)
				})
				.then((obj) => {
					this._parseJSON(obj);
					console.log('obj: ', obj);
					addDelayAnimation('.cardWrap', '.card', 0.2, 0.5);
				})
				
			} catch (error) {
				this._showLoading(false);
				console.error('request failed ', error);
				//вывести текст ошибки
			};
	};
};
//Copy by click
document.querySelector('body').addEventListener('click', function (event) {
	copyText('.details__icon', '.details__cont');
});

// function copyText (even, '.iconSprite', '.nameId')
function copyText(clickElem, classTargetCopyText) {
	let target = event.target.closest(clickElem);
	if (target && target.matches(clickElem)) {
		let copyText = target.parentElement.querySelector(classTargetCopyText);
		if (document.selection) {
			let range = document.createTextRange();
			range.moveToElementText(copyText);
			range.select().createTextRange();
			document.execCommand("copy");
		} else if (window.getSelection) {
			let range = document.createRange();
			range.selectNode(copyText);
			console.log(range.startContainer.innerText);
			window.getSelection().removeAllRanges(); // clear current selection
			window.getSelection().addRange(range); // to select text
			document.execCommand("copy");
			window.getSelection().removeAllRanges(); // clear current selection
		}
	}
}
//+38(063)420-60-46
const createLinkToGoogleSheet = (shareLink = '', listNumber = 1) => {
	const idRegex = /\/d\/(.*)\//;
	try {
		const idSheet = shareLink.match(idRegex)[1];
		return `https://spreadsheets.google.com/feeds/list/${idSheet}/${listNumber}/public/values?alt=json`
	} catch (error) {
		console.error('link for sheet must be "https:/*/d/*');
	};
};

// const url = createLinkToGoogleSheet(urlOriginal);

const createList = new CardListCreator('.cardWrap', '.card')
createList.load('https://docs.google.com/spreadsheets/d/1ki0LZ0At_vauhtubYrQP64AvXBv7Li-qcHzFz9wR0fs/edit?usp=sharing')

new WOW().init();

function addDelayAnimation(parentCLass, targetClass, incrementdelay, delay) {
	const listIcon = document.querySelector(parentCLass).querySelectorAll(targetClass);
	listIcon.forEach(element => {
		delay += incrementdelay;
		element.getAttribute('data-wow-delay');
		element.dataset.wowDelay = delay + 's';
	});
}
addDelayAnimation('.social', '.fadeInUp', 0.2, 0);
addDelayAnimation('.contactlist', '.fadeInRight', 0.2, 0.8);
addDelayAnimation('.menu', '.wow', 0.2, 0.5);
addDelayAnimation('.cardWrap', '.card', 0.2, 0.5);