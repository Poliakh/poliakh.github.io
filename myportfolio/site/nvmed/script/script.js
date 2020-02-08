class Popup {
	constructor(popupWrapID, popupActive, popupCloseElClNm, missed=true) {
		this.missed = missed;//if this value is "true" popup will close by click outside the area popup
		this.show = popupActive;
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
		this.popup.classList.remove("popupHidden");
		const body = document.querySelector('body');
		body.classList.add('modal-open');
	}
	popUpHide() {
		this.popup.classList.add("popupHidden");
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
			if (event.target.closest(el)||(this.missed && !event.target.closest(".popup"))) {
				this.popUpHide();
			}
		});
		document.addEventListener("keydown", this.closeByKey.bind(this));
	}
}
class PersonService {
	
	constructor(url) {
		this.url = url;
		this.getResource();
	}
	async getResource() {
		const res = await fetch(this.url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${this.url}), received ${res.status}`);
		}
		return await res.json();
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
	// console.log(obj);

	newCard.removeAttribute("hidden");
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

appendList();

async function createPopup(target) {
	const CardPerson = document.getElementById("popupDoc");
	CardPerson.querySelector(".desc__fullname").innerText = target.fullName;
	CardPerson.querySelector(".desc__position").innerText = target.position;
	CardPerson.querySelector(".desc__spec").innerText = target.specialization;
	CardPerson.querySelector(".desc__experience").innerText = target.experience;
	CardPerson.querySelector(".popup__photo").src = target.linkImage;
}

class doctorPopup extends Popup {
	popUpShow(target) {
		super.popUpShow(target);
		createPopup(target)
	}

}
const myDoctor = new doctorPopup("doctorPopup", ".cardPerson", ".closeButton", "popupDoc");
// document.addEventListener('click', (e) => {
// 	// console.log(e.target);
// })


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


jQuery(function($){
	// $("#date").mask("99/99/9999");
	$("#user_phone").mask("+38(999) 999-99-99");
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


const selectDate = (popupId, input, activeEl, autoCloseClassName)=>{
		const popup = document.getElementById(popupId);
		// const targetElem = popup.querySelector(`.${input}`);
		const activeElement = popup.querySelector(`.${activeEl}`);
		
		popup.addEventListener('click', (e) => {
			const target = e.target;
			
			if(target.closest(`.${input}`)){
				activeElement.classList.add(`${activeEl}-active`);
			};
			if(target.closest(`.${autoCloseClassName}`)){
				activeElement.classList.remove(`${activeEl}-active`);
			}
			// console.log(activeElement);
			// console.log(target);
			// console.log(target.closest(`.${activeEl}-active`));
			// console.log(target.closest(".datepicker--cell-day"));
		
			else if(activeElement.matches(`.${activeEl}-active`) && target.matches('.popup')){
				activeElement.classList.remove(`${activeEl}-active`);
			}
		})
}

selectDate('popupForm','datepicker-here','my-datepicker','datepicker--cell-day');

const myForm = new Popup('formWrap', '.nav__btn','.closeButton', missed=false)