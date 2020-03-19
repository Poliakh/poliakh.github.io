"use strict"
window.onload = function () {
	const main = document.querySelector('main');
	main.classList.add('ready');
}


class Popup {
	constructor(popupWrapID, popupActive, popupCloseElClNm, missed=true) {
		this.missed = missed;//if this value is "true" popup will close by click outside the area popup
		this.show = popupActive;
		this.popup = document.getElementById(popupWrapID);
		this.closePopup = popupCloseElClNm;
		document.querySelector("body").addEventListener("click", this.addEvent.bind(this));
	}
	addEvent(event) {
		if (event.target.matches(this.show) || event.target.closest(this.show)) {
			this.popUpShow(event.target.closest(this.show));
			this.popCloseButton(this.closePopup);
		}
	}
	popUpShow(target) {
		this.popup.classList.remove("popupHidden");
		const body = document.querySelector('body');
		body.classList.add('modal-open');
		body.style.overflow = "hidden";
	}
	popUpHide() {
		this.popup.classList.add("popupHidden");
		const body = document.querySelector('body');
		body.classList.remove('modal-open')
		body.style.overflow = "";

	}
	closeByKey(event) {
		if (event.keyCode === 27) {
			this.popUpHide();
		}
	}
	popCloseButton(el) {
		this.popup.addEventListener("click", event => {
			if (event.target.closest(el)||(this.missed && !event.target.closest(".popup"))) {
				this.popUpHide();
			}
		});
		document.addEventListener("keydown", this.closeByKey.bind(this));
	}
}

// if(window.location.href.indexOf('/expert')>=0){
	class PersonService {
		constructor(url) {
			this.url = url;
		}
		async getResource() {
			const res = await fetch(this.url);
			if (!res.ok) {
				throw new Error(`Could not fetch ${this.url}), received ${res.status}`);
			}
			return res.json();
		}
		async getPersonList() {
			const res = await this.getResource();
			
			return [res.persons, res.urlImages];
		}
		async getListFullName() {
			const [list,] = await this.getPersonList();
			return list.map(item => {
				return `${item.surename} ${item.name} ${item.patronymic}`
			})
		}
		async getPerson(key) {
			const [list, url] = await this.getPersonList();
			return [list.find(item => item.id === key), url]
		}
	}
	
		
		function createCard(obj, urlImage) {
			const CardPerson = document.getElementById("CardsDoc");
			const newCard = CardPerson.cloneNode(true);
	
			newCard.classList.remove("hidden");
			newCard.id = obj.id;
			newCard.specialization = obj.specialization;
			newCard.fullName = `${obj.surename} ${obj.name} ${obj.patronymic}`;
			newCard.experience = obj.experience;
			newCard.position = obj.position;
			newCard.linkImage = `${urlImage}${obj.imgFileName}`
			newCard.querySelector(".person__surename").innerText = `${obj.surename}`;
			newCard.querySelector(".person__name").innerText = `${obj.name} ${obj.patronymic}`;
			newCard.querySelector(".person__position").innerText = newCard.position;
			newCard.querySelector(".cardPerson__photo").src = newCard.linkImage;
			return newCard;
		}
	
		async function createCardList() {
			const [objList, url] = await persons.getPersonList();
			const fragmentList = document.createDocumentFragment();
			objList.forEach(obj => {
				if (!obj.display) return;
				fragmentList.appendChild(createCard(obj, url));
			});
			return fragmentList;
		}
	
		async function appendList() {
			const parent = document.querySelector(".personsList");
			const list = await createCardList();
			parent.appendChild(list);
		}
		const linkToJson = "./data/persons.json"
		const persons = new PersonService(linkToJson);
	
	if (window.location.href.indexOf('/expert') >= 0) {
	
		appendList();
	}
	
		async function createPopup(target) {
			const CardPerson = document.getElementById("popupDoc");
			CardPerson.querySelector(".desc__fullname").innerText = target.fullName;
			CardPerson.querySelector(".desc__position").innerText = target.position;
			CardPerson.querySelector(".desc__spec").innerText = target.specialization;
			CardPerson.querySelector(".desc__experience").innerText = target.experience;
			CardPerson.querySelector(".popup__photo").src = target.linkImage;
		}
	
		class doctorPopup extends Popup {
			popUpShow(popup) {
				super.popUpShow(popup);
				createPopup(popup)
			}
	
		}
		const myDoctor = new doctorPopup("doctorPopup", ".cardPerson", ".closeButton", "popupDoc");
// }
if(window.location.href.indexOf('/services')>=0){
	
	class AddTables {
		constructor(idWrapTables, wrapListCards) {
			this.finishCycle = false;
			this.wrap = document.getElementById(idWrapTables);
			this.count = 0;
			this.curAnch = 0;
			this.listTables = "";
			this.nameListCards = wrapListCards;
			this.header = this.wrap.querySelector('h1').innerText;
			this.cloneListCards = (this.nameListCards) ? document.querySelector(this.nameListCards).cloneNode(true) : null;
		}
	
		createLinkTable(url, numberList) {
			let link = url.slice(url.indexOf('/d/') + 3, url.lastIndexOf('/'));
			return `https://spreadsheets.google.com/feeds/list/${link}/${numberList}/public/values?alt=json`
		}
		
		async getJson(url) {
			let res = await fetch(url)
			if (res.ok) {
				return await res.json();
			} else {
				this.finishCycle = true;
				return
				// throw new Error(`Could not fetch ${this.url}), received ${res.status}`);
			}
		}
	
		async createPrice(obj) {
			let tbody = '';
			for (let index = 4; index < obj.length; index++) {
				tbody += `<tr>
							<td>${obj[index]['gsx$denomination']['$t']}</td>
							<td>${obj[index]['gsx$cost']['$t']}</td>
						</tr>`
			}
			const table = `<div class="tableWrap fade-up">
							<a name="anchor_${this.curAnch++}" class="anchor"></a>
							<table class="tableCons">
								<caption class="cap">
									<div class="cap__head">${obj[1]['gsx$denomination']['$t']}</div>
									<div class="cap__recom">
									<span class="cap__addhead">${obj[2]['gsx$denomination']['$t']}</span>
									<span class="cap__decor">${obj[2]['gsx$oldcost']['$t']}</span>
									<span class="cap__cost">${obj[2]['gsx$cost']['$t']}</span>
									</div>
								</caption>
								<thead>
									<th>${obj[3]['gsx$denomination']['$t']}</th>
									<th>${obj[3]['gsx$cost']['$t']}</th>
								</thead>
								<tbody>
									${tbody}
								</tbody>
							</table>
						</div>`;
			return table;
		}
	
		async appendTables(link) {
			let elem = document.createElement('div');
			elem.className = 'services__wrapper';
			let count = 0;
			while (!this.finishCycle && count < 50) {
				count++;
				this.url = this.createLinkTable(link, count);
				const json = await this.getJson(this.url);
				if (json) {
					const obj = json.feed.entry;
					const table = await this.createPrice(obj);
					if(count==1){
						this.changeHeader(obj[0].gsx$denomination.$t)
					}
					elem.insertAdjacentHTML('beforeEnd', table);
				} else { break }
			}
			const reaplceElem = document.querySelector(this.nameListCards);
			this.wrap.replaceChild(elem, reaplceElem);
			this.setHeightTablees();
			
			// count = 0;
			this.finishCycle = !this.finishCycle;
		}
		setHeightTablees(){
			const tableList = this.wrap.querySelectorAll('table');
			tableList.forEach((item)=>{
				this.toggleHeight(item.parentElement);
			})
		}
		toggleHeight(tableWrap, classVisible = 'visibleTable') {
			if (tableWrap.lastElementChild.matches(`.${classVisible}`)) {
				tableWrap.style.height = getMinMaxHeight(tableWrap)[1]+'px';
				const anchorName = tableWrap.querySelector('.anchor').getAttribute('name');
				setTimeout(() => {
					window.location.hash=anchorName
				}, 500);
			} else {
				tableWrap.style.height = getMinMaxHeight(tableWrap)[0]+'px';
	
			}
			function getMinMaxHeight(tabElem) {
				const heightmax = parseInt(getComputedStyle(tabElem.querySelector('table')).height);
				const heightmin = parseInt(getComputedStyle(tabElem.querySelector('caption')).height);
				return [heightmin, heightmax]
			}
		}
		changeHeader(text){
			if(text){
				this.wrap.querySelector('h1').innerText = text;
			}else{
				this.wrap.querySelector('h1').innerText = this.header;
			}
		}
	}
	
	const addPrises = new AddTables('priseWrap', '.serviceList');
	//hide price
	
	// function openPriceAction(){
	
	// append prices
	addPrises.wrap.addEventListener('click', (e) => {
		if (e.target.closest('.services__items')) {
			let urlTables = e.target.getAttribute('data-linkToTables');
			let serviceList = document.querySelector('.serviceList');
			hideCards(serviceList);
			addPrises.appendTables(urlTables);
		}
	})
	
	// hide cards servis items
	function hideCards(elem) {
		elem.classList.add('serviceList-opacity');
		setTimeout(() => {
			// addPrises.wrap.removeChild(elem);
			btnVisbleToggle();
		}, 800);
	}
	
	// toggle visible button to go  servise items cards (button to back)
	function btnVisbleToggle(state = 'visible') {
		let btn = document.querySelector('.service__btnBack');
		if (state == 'visible') {
			btn.classList.add('service__visible');
		} else if (state == 'hide') {
			btn.classList.remove('service__visible');
		}
	}
	
	// action button to back
	function backService() {
		const btn = document.querySelector('.service__btnBack');
		btn.addEventListener('click', (e) => {
			const childremove = document.querySelector('.services__wrapper');
			if (e.target.closest('.service__btnBack')) {
	
				(childremove) ? addPrises.wrap.removeChild(childremove) : null;
				addPrises.wrap.appendChild(addPrises.cloneListCards).classList.remove('serviceList-opacity');
				btnVisbleToggle('hide');
				addPrises.changeHeader();
			}
		})
	}
	backService();
	
	// open/close table of price on click
	addPrises.wrap.addEventListener('click', (e) => {
		const target = e.target.closest('.cap');
		if (target) {
			target.closest('table').classList.toggle('visibleTable');
			const children = target.closest('.services__wrapper').children;
			const thisTables = target.closest('.tableWrap');
	
			addPrises.toggleHeight(thisTables);
	
			for (let i = 0; i < children.length; i++) {
				if (children[i] !== thisTables) {
					children[i].querySelector('table').classList.remove('visibleTable');
					addPrises.toggleHeight(children[i]);
					
				}
			}
		}
	})
	
	
	// console.log(window.location.href.indexOf('/services2')>=0);
	
	 //window.location.hash="someId"; //Переход к якорю
}

let myDatePicker = $('.datepicker-here').datepicker({
	// autoClose: true,
	classes: "my-datepicker",
	inline: true,
	language: {
		days: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятница", 'Субота'],
		daysShort: ['Нед', 'Пон', 'Вів', 'Сер', 'Чет', "П'ят", 'Суб'],
		daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		months: ['Січень', 'Лютій', 'Березнь', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
		monthsShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
		today: 'Сьогодні',
		clear: 'Очистити',
		dateFormat: 'dd.mm.yyyy',
		timeFormat: 'hh:ii',
		firstDay: 1
	},
	
	clearButton: true,
	todayButton: true,
	todayButton: new Date(),
	disabledDays: [0, 6],
	onRenderCell: function (date, cellType) {
		if (cellType == 'day') {
			var day = date.getDay(),
				isDisabled = this.disabledDays.indexOf(day) != -1;
			return {
				disabled: isDisabled
			}
		}
	}
})

jQuery(function ($) {
	// $("#date").mask("99/99/9999");
	$("#user_phone").mask("+38(099) 999-99-99");
	// $("#tin").mask("99-9999999");
	// $("#ssn").mask("999-99-9999");
});


const selectExpert = (popupId, selectArea, selectItem) => {
	
	const popupForm = document.getElementById(popupId);
	let selectHead = document.querySelector(`.${selectArea}`);

	async function createSelectItem() {
		const item = popupForm.querySelector(`.${selectItem}`);
		const parent = item.parentElement;
		const cloneItem = item.cloneNode();
		item.remove();
		const list = await persons.getListFullName();
		for (let i = 0; i < list.length; i++) {
			const el = cloneItem.cloneNode();
			el.innerHTML = list[i];
			parent.appendChild(el);
		}
	}

	const selectItems = (e) => {
		let target = e.target;
		if (target.closest(`.${selectArea}`)) {
			selectHead.classList.add(`${selectArea}-active`)
		}
		if (target.closest(`.${selectItem}`)) {
			let list = selectHead.querySelectorAll(`.${selectItem}`);
			for (let i = 0; i < list.length; i++) {
				if (target == list[i]) {
					let select = selectHead.querySelector('select');
					let option = select.querySelector('option');
					option.innerHTML = list[i].innerHTML;
					option.selected = true;
					selectHead.firstElementChild.innerHTML = list[i].innerHTML;
				}
			}
			selectHead.classList.remove(`${selectArea}-active`);
			selectHead.blur();
			selectHead.parentElement.nextElementSibling.focus();
		}
	}
	createSelectItem();
	popupForm.addEventListener('click', selectItems)


}
selectExpert('popupForm', 'select__header', 'select__item');


const selectDate = (popupId, input, activeEl, autoCloseClassName) => {
	const popup = document.getElementById(popupId);
	const activeElement = popup.querySelector(`.${activeEl}`);

	popup.addEventListener('click', (e) => {
		const target = e.target;

		if (target.closest(`.${input}`)) {
			activeElement.classList.add(`${activeEl}-active`);
		};
		if (target.closest(`.${autoCloseClassName}`)) {
			activeElement.classList.remove(`${activeEl}-active`);
		}

		else if (activeElement.matches(`.${activeEl}-active`) && target.matches('.popup')) {
			activeElement.classList.remove(`${activeEl}-active`);
		}
	})
}

selectDate('popupForm', 'datepicker-here', 'my-datepicker', 'datepicker--cell-day');

const myForm = new Popup('formWrap', '.btnFormActiv', '.closeButton', false)

let burger = document.getElementById('btnNav');
burger.addEventListener('click', () => {
	burger.classList.toggle('active');
})