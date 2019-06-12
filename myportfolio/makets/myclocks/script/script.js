console.log("Hello World");

const audio = new Audio('./audio/audio_alarm.ogg');
let alarmFlag;

function addNull(params) {
	if (params < 10) params = '0' + params;
	return params;
}

function timeNow (key) {
	const myTime = new Date();
	switch (key) {
		case 'hh':
			return addNull(myTime.getHours());
		case 'mm':
			return addNull(myTime.getMinutes());
		case 'ss':
			return addNull(myTime.getSeconds());
		case 'dd':
			return myTime.getDate();
		case 'mon':
			return myTime.getMonth();
		case 'ww':
			return myTime.getDay();
		default:
			break;
	}
}

function time() {
	myClock.querySelector('.time__hh').innerHTML = timeNow('hh');
	myClock.querySelector('.time__mm').innerHTML = timeNow('mm');
	myClock.querySelector('.time__ss').innerHTML = timeNow('ss');
}

function blink() {
	myClock.querySelectorAll('.time__point').forEach(element => {
		(timeNow('ss') % 2) ? element.style.opacity = '1': element.style.opacity = '0.1';
	});
}

function showDate() {
	const arrMonth = ["янв", "фев", "мар", "апр", "май", "июнь", "июль", "авг", "сент", "окт", "нояб", "декаб"];
	const week = ["Вс", "Пн", "Вт", "Ср","Чт","Пт","Сб"]
	myClock.querySelector('.bar__date').innerHTML = timeNow('dd');
	myClock.querySelector('.bar__month').innerHTML = arrMonth[timeNow('mon')];
	myClock.querySelector('.bar__week').innerHTML = week[timeNow('ww')];
}

function replaceDate() {//запуск часов
	time();
	showDate();
	blink();
	(alarm('state'))? alarm(): null;
}
replaceDate();
setInterval('replaceDate()', 1000)


function alarm(flag) { //проверка срабатывания будильника
	if (flag == 'on') alarmFlag = true;
	if (flag == 'off') alarmFlag = false;
	if (flag == 'state') return alarmFlag ;
	if (flag == "idAlarm") return idAlarm;
	if (alarmFlag && timeNow('hh') == alarm_1.getHours()
		&& timeNow('mm') == alarm_1.getMinutes()
		&& timeNow('ss') == alarm_1.getSeconds())
		 {
			audio.volume = 0.4;
			audio.play();
			idAlarm = setInterval(() => {
				myClock.classList.toggle('clock-active');
				myClock.querySelector(".shutUp").classList.toggle('shutUp-active');
			},500)
			myClock.querySelector(".shutUp").style.display = "block";
			myClock.addEventListener('click',shutUp);
		}
	return alarmFlag;
}

const valueInput = () => {
	alarm_1 = new Date();
	const inp = myClock.querySelector('.inputAlarm').querySelectorAll('input');
	let hh = inp[0].value || "00";
	let mm = inp[1].value || "00";
	let ss = inp[2].value || "00";
	alarm_1.setHours(hh,mm,ss);

	//добавляем строку с временем будильника
	const timer = myClock.querySelector(".inst__al");
	timer.innerHTML = hh + ":" + mm;
	timer.style.display = "block";

	//убираем кнопки и поля ввода
	barHidden()
	alarm('on');
}

myClock.addEventListener('input', (event) => {
	if(event.target.classList.contains('inputAlarm__hh')) isTime (event.target, 24);
	if(event.target.classList.contains('inputAlarm__mm')) isTime (event.target, 60 );
	if(event.target.classList.contains('inputAlarm__ss')) isTime (event.target, 60 );
},true);

function isTime (target, max) {
	if (isNaN(target.value) || target.value > max) {
		target.value = "";
		target.focus();
	}

	if(target.value.length >= 2) {
		target = target.nextElementSibling;
		if(target){
				target.nextElementSibling.focus();
			}else{
				myClock.querySelector('.quest__but').focus();
			}
		;
	}
}

myClock.addEventListener('dblclick', (event) => {
	if (event.target.classList.contains('inst__al')) {
		barHidden();
		myClock.querySelector(".inst__al").innerHTML = "";
		myClock.querySelector('.icon_alr').classList.remove('icon_alr-active');
		myClock.querySelector('.inputAlarm').querySelectorAll('input')
		.forEach(elem => {//  очистка input
			elem.value = "";
		});
	}
});


const eventButtonBar = (event) => {
	if(event.target.classList.contains('quest__but') && !!+event.target.value) {
		valueInput();
	} else {
		barHidden();
		if(!myClock.querySelector(".inst__al").innerHTML) {
			myClock.querySelector('.icon_alr').classList.remove('icon_alr-active');
		}
	}
}


function barHidden() {
	myClock.querySelector('.time').style.display = "";
	myClock.querySelector('.inputAlarm').style.display = "";
	myClock.querySelector('.quest').style.display = "";
}


function shutUp(event) {
	if(event.target.classList.contains('bar__shutUp') ) {
		clearInterval(alarm('idAlarm'));
		myClock.classList.remove('clock-active');
		myClock.querySelector(".shutUp").classList.remove('shutUp-active');
		myClock.querySelector(".shutUp").style.display = "";
		myClock.querySelector(".inst__al").innerHTML = "";
		myClock.querySelector(".inst__al").style.display = "";
		myClock.querySelector('.icon_alr').classList.remove('icon_alr-active');
		audio.pause();
		alarm('off');
	}
}

const questOn = () => {
	const elem = myClock.querySelector('.quest');elem.style.display = 'block';
	elem.addEventListener('click',eventButtonBar);
	
}

const addAlarm = () => {
	myClock.querySelector('.time').style.display = "none";
	myClock.querySelector('.inputAlarm').style.display = "flex";
	myClock.querySelector('.icon_alr').classList.add('icon_alr-active');
	myClock.querySelector('.inputAlarm__hh').focus();
	questOn();
}

myClock.querySelector('.icon_alr').addEventListener('click', addAlarm );

myClock.addEventListener('keypress', (event) => {
	if( event.keyCode == 13 && event.target.tagName == "INPUT") valueInput();
})

