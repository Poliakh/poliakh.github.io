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
		this.popup.addEventListener("mouseup", event => {
			if (event.target.closest(el)||(this.missed && !event.target.closest(".popup"))) {
				this.popUpHide();
			}
		});
		document.addEventListener("keydown", this.closeByKey.bind(this));
	}
}

if(window.location.href.indexOf('/expert')>=0){
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
	
	if (window.location.href.indexOf('/expert') >= 0) {
		console.log('ok expert');
		
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
	}
}
if(window.location.href.indexOf('/services')>=0){
	class AddTables {
		constructor(idWrapTables, wrapListCards) {
			this.finishCycle = false;
			this.wrap = document.getElementById(idWrapTables);
			this.count = 0;
			this.listTables = "";
			this.nameListCards = wrapListCards;
			this.cloneListCards = (this.nameListCards) ? document.querySelector(this.nameListCards).cloneNode(true): null;
			console.log(this.wrap);
			console.log(this.cloneListCards);
			
			
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
			const table =`<div class="tableWrap fade-up">
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
			elem.className='services__wrapper';
			let count = 0;
			while (!this.finishCycle && count < 50) {
				count++;
				
				this.url = this.createLinkTable(link, count);
				const json = await this.getJson(this.url);
				if (json) {
					const obj = json.feed.entry;
					const table = await this.createPrice(obj);
					elem.insertAdjacentHTML('beforeEnd', table);
				}else{break}
			}
			const reaplceElem = document.querySelector(this.nameListCards);
			this.wrap.replaceChild(elem, reaplceElem);
			// count = 0;
			this.finishCycle = !this.finishCycle;
		}
	}
	
	const addTables = new AddTables('priseWrap','.serviceList');
	
	//hide price
	addTables.wrap.addEventListener('click', (e) => {
		if (e.target.closest('.services__items')) {
			let urlTables = e.target.getAttribute('data-linkToTables');
			let serviceList = document.querySelector('.serviceList');
			hideCards(serviceList);
			addTables.appendTables(urlTables);
		}
	})
	
	
	function hideCards(elem){
		elem.classList.add('serviceList-opacity');
		setTimeout(() => {
			// addTables.wrap.removeChild(elem);
			btnVisbleToggle();
		}, 800);
	}
	
	function btnVisbleToggle(){
	
		let btn = document.querySelector('.service__btnBack');
		btn.classList.toggle('service__visible');
	}
	
	function backService(){
		const btn = document.querySelector('.service__btnBack');
		btn.addEventListener('click', (e)=>{
			const childremove = document.querySelector('.services__wrapper');
			if(e.target.closest('.service__btnBack')){
				
				(childremove) ? addTables.wrap.removeChild(childremove): null;
				addTables.wrap.appendChild(addTables.cloneListCards).classList.remove('serviceList-opacity');
				btnVisbleToggle();
			}
		})
	}
	backService();
	
	
	addTables.wrap.addEventListener('click', (e)=>{
		const target = e.target.closest('.cap');
		if(target){
			target.closest('table').classList.toggle('closeTable');
			const children = target.closest('.services__wrapper').children;
			const thisTables = target.closest('.tableWrap');
	
			for (let i = 0; i < children.length; i++) {
				if(children[i] !== thisTables){
					children[i].querySelector('table').classList.remove('closeTable');
				}
			}
		}
	})
	
	// console.log(window.location.href.indexOf('/services2')>=0);
	
	 //window.location.hash="someId"; //Переход к якорю
}
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

const myForm = new Popup('formWrap', '.btnFormActiv', '.closeButton', missed = false)

let burger = document.getElementById('btnNav');
burger.addEventListener('click', () => {
	burger.classList.toggle('active');
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xyXG5cdG1haW4uY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcclxufVxyXG5cclxuXHJcbi8vPSBtb2R1bGVzL3BvcHVwLmpzXHJcblxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcvZXhwZXJ0Jyk+PTApe1xyXG5cdC8vPSBtb2R1bGVzL3BlcnNvbmVTZXJ2aWNlcy5qc1xyXG59XHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9zZXJ2aWNlcycpPj0wKXtcclxuXHQvLz0gbW9kdWxlcy9wcmljZS5qc1xyXG59XHJcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuLy8gXHQvLyBjb25zb2xlLmxvZyhlLnRhcmdldCk7XHJcbi8vIH0pXHJcblxyXG5cclxuXHJcbmxldCBteURhdGVQaWNrZXIgPSAkKCcuZGF0ZXBpY2tlci1oZXJlJykuZGF0ZXBpY2tlcih7XHJcblx0Ly8gYXV0b0Nsb3NlOiB0cnVlLFxyXG5cdGNsYXNzZXM6IFwibXktZGF0ZXBpY2tlclwiLFxyXG5cdGlubGluZTogdHJ1ZSxcclxuXHRsYW5ndWFnZToge1xyXG5cdFx0ZGF5czogWyfQndC10LTRltC70Y8nLCAn0J/QvtC90LXQtNGW0LvQvtC6JywgJ9CS0ZbQstGC0L7RgNC+0LonLCAn0KHQtdGA0LXQtNCwJywgJ9Cn0LXRgtCy0LXRgCcsIFwi0J8n0Y/RgtC90LjRhtCwXCIsICfQodGD0LHQvtGC0LAnXSxcclxuXHRcdGRheXNTaG9ydDogWyfQndC10LQnLCAn0J/QvtC9JywgJ9CS0ZbQsicsICfQodC10YAnLCAn0KfQtdGCJywgXCLQnyfRj9GCXCIsICfQodGD0LEnXSxcclxuXHRcdGRheXNNaW46IFsn0J3QtCcsICfQn9C9JywgJ9CS0YInLCAn0KHRgCcsICfQp9GCJywgJ9Cf0YInLCAn0KHQsSddLFxyXG5cdFx0bW9udGhzOiBbJ9Ch0ZbRh9C10L3RjCcsICfQm9GO0YLRltC5JywgJ9CR0LXRgNC10LfQvdGMJywgJ9Ca0LLRltGC0LXQvdGMJywgJ9Ci0YDQsNCy0LXQvdGMJywgJ9Cn0LXRgNCy0LXQvdGMJywgJ9Cb0LjQv9C10L3RjCcsICfQodC10YDQv9C10L3RjCcsICfQktC10YDQtdGB0LXQvdGMJywgJ9CW0L7QstGC0LXQvdGMJywgJ9Cb0LjRgdGC0L7Qv9Cw0LQnLCAn0JPRgNGD0LTQtdC90YwnXSxcclxuXHRcdG1vbnRoc1Nob3J0OiBbJ9Ch0ZbRhycsICfQm9GO0YInLCAn0JHQtdGAJywgJ9Ca0LLRlicsICfQotGA0LAnLCAn0KfQtdGAJywgJ9Cb0LjQvycsICfQodC10YAnLCAn0JLQtdGAJywgJ9CW0L7QsicsICfQm9C40YEnLCAn0JPRgNGDJ10sXHJcblx0XHR0b2RheTogJ9Ch0YzQvtCz0L7QtNC90ZYnLFxyXG5cdFx0Y2xlYXI6ICfQntGH0LjRgdGC0LjRgtC4JyxcclxuXHRcdGRhdGVGb3JtYXQ6ICdkZC5tbS55eXl5JyxcclxuXHRcdHRpbWVGb3JtYXQ6ICdoaDppaScsXHJcblx0XHRmaXJzdERheTogMVxyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJCdXR0b246IHRydWUsXHJcblx0dG9kYXlCdXR0b246IHRydWUsXHJcblx0dG9kYXlCdXR0b246IG5ldyBEYXRlKCksXHJcblx0ZGlzYWJsZWREYXlzOiBbMCwgNl0sXHJcblx0b25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuXHRcdGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG5cdFx0XHR2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKSxcclxuXHRcdFx0XHRpc0Rpc2FibGVkID0gdGhpcy5kaXNhYmxlZERheXMuaW5kZXhPZihkYXkpICE9IC0xO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5cclxualF1ZXJ5KGZ1bmN0aW9uICgkKSB7XHJcblx0Ly8gJChcIiNkYXRlXCIpLm1hc2soXCI5OS85OS85OTk5XCIpO1xyXG5cdCQoXCIjdXNlcl9waG9uZVwiKS5tYXNrKFwiKzM4KDA5OSkgOTk5LTk5LTk5XCIpO1xyXG5cdC8vICQoXCIjdGluXCIpLm1hc2soXCI5OS05OTk5OTk5XCIpO1xyXG5cdC8vICQoXCIjc3NuXCIpLm1hc2soXCI5OTktOTktOTk5OVwiKTtcclxufSk7XHJcblxyXG5cclxuY29uc3Qgc2VsZWN0RXhwZXJ0ID0gKHBvcHVwSWQsIHNlbGVjdEFyZWEsIHNlbGVjdEl0ZW0pID0+IHtcclxuXHRjb25zdCBwb3B1cEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3B1cElkKTtcclxuXHRsZXQgc2VsZWN0SGVhZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke3NlbGVjdEFyZWF9YCk7XHJcblxyXG5cdGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNlbGVjdEl0ZW0oKSB7XHJcblx0XHRjb25zdCBpdGVtID0gcG9wdXBGb3JtLnF1ZXJ5U2VsZWN0b3IoYC4ke3NlbGVjdEl0ZW19YCk7XHJcblx0XHRjb25zdCBwYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRjb25zdCBjbG9uZUl0ZW0gPSBpdGVtLmNsb25lTm9kZSgpO1xyXG5cdFx0aXRlbS5yZW1vdmUoKTtcclxuXHRcdGNvbnN0IGxpc3QgPSBhd2FpdCBwZXJzb25zLmdldExpc3RGdWxsTmFtZSgpO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGVsID0gY2xvbmVJdGVtLmNsb25lTm9kZSgpO1xyXG5cdFx0XHRlbC5pbm5lckhUTUwgPSBsaXN0W2ldO1xyXG5cdFx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQoZWwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3Qgc2VsZWN0SXRlbXMgPSAoZSkgPT4ge1xyXG5cdFx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdFx0aWYgKHRhcmdldC5jbG9zZXN0KGAuJHtzZWxlY3RBcmVhfWApKSB7XHJcblx0XHRcdHNlbGVjdEhlYWQuY2xhc3NMaXN0LmFkZChgJHtzZWxlY3RBcmVhfS1hY3RpdmVgKVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRhcmdldC5jbG9zZXN0KGAuJHtzZWxlY3RJdGVtfWApKSB7XHJcblx0XHRcdGxldCBsaXN0ID0gc2VsZWN0SGVhZC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtzZWxlY3RJdGVtfWApO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09IGxpc3RbaV0pIHtcclxuXHRcdFx0XHRcdGxldCBzZWxlY3QgPSBzZWxlY3RIZWFkLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xyXG5cdFx0XHRcdFx0bGV0IG9wdGlvbiA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCdvcHRpb24nKTtcclxuXHRcdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSBsaXN0W2ldLmlubmVySFRNTDtcclxuXHRcdFx0XHRcdG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRzZWxlY3RIZWFkLmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGxpc3RbaV0uaW5uZXJIVE1MO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRzZWxlY3RIZWFkLmNsYXNzTGlzdC5yZW1vdmUoYCR7c2VsZWN0QXJlYX0tYWN0aXZlYCk7XHJcblx0XHRcdHNlbGVjdEhlYWQuYmx1cigpO1xyXG5cdFx0XHRzZWxlY3RIZWFkLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGNyZWF0ZVNlbGVjdEl0ZW0oKTtcclxuXHRwb3B1cEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3RJdGVtcylcclxuXHJcblxyXG59XHJcbnNlbGVjdEV4cGVydCgncG9wdXBGb3JtJywgJ3NlbGVjdF9faGVhZGVyJywgJ3NlbGVjdF9faXRlbScpO1xyXG5cclxuXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAocG9wdXBJZCwgaW5wdXQsIGFjdGl2ZUVsLCBhdXRvQ2xvc2VDbGFzc05hbWUpID0+IHtcclxuXHRjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwSWQpO1xyXG5cdGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKGAuJHthY3RpdmVFbH1gKTtcclxuXHJcblx0cG9wdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblxyXG5cdFx0aWYgKHRhcmdldC5jbG9zZXN0KGAuJHtpbnB1dH1gKSkge1xyXG5cdFx0XHRhY3RpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYCR7YWN0aXZlRWx9LWFjdGl2ZWApO1xyXG5cdFx0fTtcclxuXHRcdGlmICh0YXJnZXQuY2xvc2VzdChgLiR7YXV0b0Nsb3NlQ2xhc3NOYW1lfWApKSB7XHJcblx0XHRcdGFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHthY3RpdmVFbH0tYWN0aXZlYCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxzZSBpZiAoYWN0aXZlRWxlbWVudC5tYXRjaGVzKGAuJHthY3RpdmVFbH0tYWN0aXZlYCkgJiYgdGFyZ2V0Lm1hdGNoZXMoJy5wb3B1cCcpKSB7XHJcblx0XHRcdGFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHthY3RpdmVFbH0tYWN0aXZlYCk7XHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuc2VsZWN0RGF0ZSgncG9wdXBGb3JtJywgJ2RhdGVwaWNrZXItaGVyZScsICdteS1kYXRlcGlja2VyJywgJ2RhdGVwaWNrZXItLWNlbGwtZGF5Jyk7XHJcblxyXG5jb25zdCBteUZvcm0gPSBuZXcgUG9wdXAoJ2Zvcm1XcmFwJywgJy5idG5Gb3JtQWN0aXYnLCAnLmNsb3NlQnV0dG9uJywgbWlzc2VkID0gZmFsc2UpXHJcblxyXG5sZXQgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bk5hdicpO1xyXG5idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0YnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG59KVxyXG5cclxuXHJcblxyXG4iXSwiZmlsZSI6InNjcmlwdC5qcyJ9
