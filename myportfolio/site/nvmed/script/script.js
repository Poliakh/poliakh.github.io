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

const myForm = new Popup('formWrap', '.btnFormActiv','.closeButton', missed=false)

let burger = document.getElementById('btnNav');
burger.addEventListener('click', ()=>{
	burger.classList.toggle('active');
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy89IG1vZHVsZXMvcG9wdXAuanNcclxuLy89IG1vZHVsZXMvcGVyc29uZVNlcnZpY2VzLmpzXHJcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuLy8gXHQvLyBjb25zb2xlLmxvZyhlLnRhcmdldCk7XHJcbi8vIH0pXHJcblxyXG5cclxubGV0IG15RGF0ZVBpY2tlciA9ICQoJy5kYXRlcGlja2VyLWhlcmUnKS5kYXRlcGlja2VyKHtcclxuXHQvLyBhdXRvQ2xvc2U6IHRydWUsXHJcblx0Y2xhc3NlczogXCJteS1kYXRlcGlja2VyXCIsXHJcblx0aW5saW5lOiB0cnVlLFxyXG5cdGxhbmd1YWdlOiB7XHJcblx0XHRkYXlzOiBbJ9Cd0LXQtNGW0LvRjycsICfQn9C+0L3QtdC00ZbQu9C+0LonLCAn0JLRltCy0YLQvtGA0L7QuicsICfQodC10YDQtdC00LAnLCAn0KfQtdGC0LLQtdGAJywgXCLQnyfRj9GC0L3QuNGG0LBcIiwgJ9Ch0YPQsdC+0YLQsCddLFxyXG5cdFx0ZGF5c1Nob3J0OiBbJ9Cd0LXQtCcsICfQn9C+0L0nLCAn0JLRltCyJywgJ9Ch0LXRgCcsICfQp9C10YInLCBcItCfJ9GP0YJcIiwgJ9Ch0YPQsSddLFxyXG5cdFx0ZGF5c01pbjogWyfQndC0JywgJ9Cf0L0nLCAn0JLRgicsICfQodGAJywgJ9Cn0YInLCAn0J/RgicsICfQodCxJ10sXHJcblx0XHRtb250aHM6IFsn0KHRltGH0LXQvdGMJywgJ9Cb0Y7RgtGW0LknLCAn0JHQtdGA0LXQt9C90YwnLCAn0JrQstGW0YLQtdC90YwnLCAn0KLRgNCw0LLQtdC90YwnLCAn0KfQtdGA0LLQtdC90YwnLCAn0JvQuNC/0LXQvdGMJywgJ9Ch0LXRgNC/0LXQvdGMJywgJ9CS0LXRgNC10YHQtdC90YwnLCAn0JbQvtCy0YLQtdC90YwnLCAn0JvQuNGB0YLQvtC/0LDQtCcsICfQk9GA0YPQtNC10L3RjCddLFxyXG5cdFx0bW9udGhzU2hvcnQ6IFsn0KHRltGHJywgJ9Cb0Y7RgicsICfQkdC10YAnLCAn0JrQstGWJywgJ9Ci0YDQsCcsICfQp9C10YAnLCAn0JvQuNC/JywgJ9Ch0LXRgCcsICfQktC10YAnLCAn0JbQvtCyJywgJ9Cb0LjRgScsICfQk9GA0YMnXSxcclxuXHRcdHRvZGF5OiAn0KHRjNC+0LPQvtC00L3RlicsXHJcblx0XHRjbGVhcjogJ9Ce0YfQuNGB0YLQuNGC0LgnLFxyXG5cdFx0ZGF0ZUZvcm1hdDogJ2RkLm1tLnl5eXknLFxyXG5cdFx0dGltZUZvcm1hdDogJ2hoOmlpJyxcclxuXHRcdGZpcnN0RGF5OiAxXHJcblxyXG5cdH0sXHJcblx0Y2xlYXJCdXR0b246IHRydWUsXHJcblx0dG9kYXlCdXR0b246IHRydWUsXHJcblx0dG9kYXlCdXR0b246IG5ldyBEYXRlKCksXHJcblx0ZGlzYWJsZWREYXlzOiBbMCwgNl0sXHJcblx0b25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuXHRcdGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG5cdFx0XHR2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKSxcclxuXHRcdFx0XHRpc0Rpc2FibGVkID0gdGhpcy5kaXNhYmxlZERheXMuaW5kZXhPZihkYXkpICE9IC0xO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5cclxualF1ZXJ5KGZ1bmN0aW9uKCQpe1xyXG5cdC8vICQoXCIjZGF0ZVwiKS5tYXNrKFwiOTkvOTkvOTk5OVwiKTtcclxuXHQkKFwiI3VzZXJfcGhvbmVcIikubWFzayhcIiszOCgwOTkpIDk5OS05OS05OVwiKTtcclxuXHQvLyAkKFwiI3RpblwiKS5tYXNrKFwiOTktOTk5OTk5OVwiKTtcclxuXHQvLyAkKFwiI3NzblwiKS5tYXNrKFwiOTk5LTk5LTk5OTlcIik7XHJcbiB9KTtcclxuXHJcblxyXG5jb25zdCBzZWxlY3RFeHBlcnQgPSAocG9wdXBJZCwgc2VsZWN0QXJlYSwgc2VsZWN0SXRlbSkgPT4ge1xyXG5cdGNvbnN0IHBvcHVwRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwSWQpO1xyXG5cdGxldCBzZWxlY3RIZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7c2VsZWN0QXJlYX1gKTtcclxuXHJcblx0YXN5bmMgZnVuY3Rpb24gY3JlYXRlU2VsZWN0SXRlbSgpIHtcclxuXHRcdGNvbnN0IGl0ZW0gPSBwb3B1cEZvcm0ucXVlcnlTZWxlY3RvcihgLiR7c2VsZWN0SXRlbX1gKTtcclxuXHRcdGNvbnN0IHBhcmVudCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcclxuXHRcdGNvbnN0IGNsb25lSXRlbSA9IGl0ZW0uY2xvbmVOb2RlKCk7XHJcblx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0Y29uc3QgbGlzdCA9IGF3YWl0IHBlcnNvbnMuZ2V0TGlzdEZ1bGxOYW1lKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZWwgPSBjbG9uZUl0ZW0uY2xvbmVOb2RlKCk7XHJcblx0XHRcdGVsLmlubmVySFRNTCA9IGxpc3RbaV07XHJcblx0XHRcdHBhcmVudC5hcHBlbmRDaGlsZChlbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBzZWxlY3RJdGVtcyA9IChlKSA9PiB7XHJcblx0XHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0XHRpZiAodGFyZ2V0LmNsb3Nlc3QoYC4ke3NlbGVjdEFyZWF9YCkpIHtcclxuXHRcdFx0c2VsZWN0SGVhZC5jbGFzc0xpc3QuYWRkKGAke3NlbGVjdEFyZWF9LWFjdGl2ZWApXHJcblx0XHR9XHJcblx0XHRpZiAodGFyZ2V0LmNsb3Nlc3QoYC4ke3NlbGVjdEl0ZW19YCkpIHtcclxuXHRcdFx0bGV0IGxpc3QgPSBzZWxlY3RIZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3NlbGVjdEl0ZW19YCk7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT0gbGlzdFtpXSkge1xyXG5cdFx0XHRcdFx0bGV0IHNlbGVjdCA9IHNlbGVjdEhlYWQucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XHJcblx0XHRcdFx0XHRsZXQgb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJ29wdGlvbicpO1xyXG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IGxpc3RbaV0uaW5uZXJIVE1MO1xyXG5cdFx0XHRcdFx0b3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHNlbGVjdEhlYWQuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gbGlzdFtpXS5pbm5lckhUTUw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHNlbGVjdEhlYWQuY2xhc3NMaXN0LnJlbW92ZShgJHtzZWxlY3RBcmVhfS1hY3RpdmVgKTtcclxuXHRcdFx0c2VsZWN0SGVhZC5ibHVyKCk7XHJcblx0XHRcdHNlbGVjdEhlYWQucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuZm9jdXMoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0Y3JlYXRlU2VsZWN0SXRlbSgpO1xyXG5cdHBvcHVwRm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdEl0ZW1zKVxyXG5cclxuXHJcbn1cclxuc2VsZWN0RXhwZXJ0KCdwb3B1cEZvcm0nLCAnc2VsZWN0X19oZWFkZXInLCAnc2VsZWN0X19pdGVtJyk7XHJcblxyXG5cclxuY29uc3Qgc2VsZWN0RGF0ZSA9IChwb3B1cElkLCBpbnB1dCwgYWN0aXZlRWwsIGF1dG9DbG9zZUNsYXNzTmFtZSk9PntcclxuXHRcdGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wdXBJZCk7XHJcblx0XHQvLyBjb25zdCB0YXJnZXRFbGVtID0gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7aW5wdXR9YCk7XHJcblx0XHRjb25zdCBhY3RpdmVFbGVtZW50ID0gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7YWN0aXZlRWx9YCk7XHJcblx0XHRcclxuXHRcdHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZih0YXJnZXQuY2xvc2VzdChgLiR7aW5wdXR9YCkpe1xyXG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgJHthY3RpdmVFbH0tYWN0aXZlYCk7XHJcblx0XHRcdH07XHJcblx0XHRcdGlmKHRhcmdldC5jbG9zZXN0KGAuJHthdXRvQ2xvc2VDbGFzc05hbWV9YCkpe1xyXG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHthY3RpdmVFbH0tYWN0aXZlYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coYWN0aXZlRWxlbWVudCk7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHRhcmdldCk7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHRhcmdldC5jbG9zZXN0KGAuJHthY3RpdmVFbH0tYWN0aXZlYCkpO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0YXJnZXQuY2xvc2VzdChcIi5kYXRlcGlja2VyLS1jZWxsLWRheVwiKSk7XHJcblx0XHRcclxuXHRcdFx0ZWxzZSBpZihhY3RpdmVFbGVtZW50Lm1hdGNoZXMoYC4ke2FjdGl2ZUVsfS1hY3RpdmVgKSAmJiB0YXJnZXQubWF0Y2hlcygnLnBvcHVwJykpe1xyXG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHthY3RpdmVFbH0tYWN0aXZlYCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcbn1cclxuXHJcbnNlbGVjdERhdGUoJ3BvcHVwRm9ybScsJ2RhdGVwaWNrZXItaGVyZScsJ215LWRhdGVwaWNrZXInLCdkYXRlcGlja2VyLS1jZWxsLWRheScpO1xyXG5cclxuY29uc3QgbXlGb3JtID0gbmV3IFBvcHVwKCdmb3JtV3JhcCcsICcuYnRuRm9ybUFjdGl2JywnLmNsb3NlQnV0dG9uJywgbWlzc2VkPWZhbHNlKVxyXG5cclxubGV0IGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5OYXYnKTtcclxuYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuXHRidXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbn0pIl0sImZpbGUiOiJzY3JpcHQuanMifQ==
