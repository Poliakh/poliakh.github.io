"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function browser_name() {
  var browser_id = navigator.userAgent;
  if (browser_id.search(/MSIE/) != -1 || browser_id.search(/Trident/) != -1) return 'IE';
}

function addPolifil() {
  if (browser_name() == 'IE') {
    //<script src="https://unpkg.com/element-closest"></script>
    !function (e) {
      var t = e.Element.prototype;
      "function" != typeof t.matches && (t.matches = t.msMatchesSelector || t.mozMatchesSelector || t.webkitMatchesSelector || function (e) {
        for (var t = (this.document || this.ownerDocument).querySelectorAll(e), o = 0; t[o] && t[o] !== this;) {
          ++o;
        }

        return Boolean(t[o]);
      }), "function" != typeof t.closest && (t.closest = function (e) {
        for (var t = this; t && 1 === t.nodeType;) {
          if (t.matches(e)) return t;
          t = t.parentNode;
        }

        return null;
      });
    }(window);
  }
}

addPolifil();

var Slider =
/*#__PURE__*/
function () {
  function Slider(slider, list, img, btn_l, btn_r, indicate, timeout) {
    _classCallCheck(this, Slider);

    this.slider = document.querySelector(".".concat(slider));
    this.firstList = list;
    this.list = document.querySelector(".".concat(list));
    this.img = img;
    this.listImg = this.list.querySelectorAll(".".concat(this.img));
    this.listCopy = [].slice.call(this.listImg);
    this.btn_l = btn_l;
    this.btn_r = btn_r;
    this.timeout = timeout;
    this.indicate = this.slider.querySelector(".".concat(indicate));
    this.addEvent();
    this.resize();
    this.indicateInit();
  }

  _createClass(Slider, [{
    key: "indicateInit",
    value: function indicateInit() {
      if (this.indicate) {
        var clonElem = this.indicate.firstElementChild.cloneNode();
        this.classNameActive = clonElem.className + '-active';

        while (this.indicate.firstChild) {
          this.indicate.removeChild(this.indicate.firstChild);
        }

        var fragment = document.createDocumentFragment();

        for (var i = 0; i < this.listImg.length; i++) {
          fragment.appendChild(clonElem.cloneNode());
        }

        this.indicate.appendChild(fragment);
        this.indicate.firstElementChild.classList.add(this.classNameActive);
      }
    }
  }, {
    key: "indicateActive",
    value: function indicateActive(action) {
      if (this.indicate) {
        if (action == 'next') {
          var elem = this.indicate.querySelector(".".concat(this.classNameActive));
          elem.classList.remove(this.classNameActive);

          if (elem.nextElementSibling) {
            elem.nextElementSibling.classList.add("".concat(this.classNameActive));
          } else {
            this.indicate.firstElementChild.classList.add("".concat(this.classNameActive));
          }
        } else if (action == 'prev') {
          var _elem = this.indicate.querySelector(".".concat(this.classNameActive));

          _elem.classList.remove(this.classNameActive);

          if (_elem.previousElementSibling) {
            _elem.previousElementSibling.classList.add("".concat(this.classNameActive));
          } else {
            this.indicate.lastElementChild.classList.add("".concat(this.classNameActive));
          }
        }
      }
    }
  }, {
    key: "getwidthImage",
    value: function getwidthImage() {
      var elem = this.list.querySelector(".".concat(this.img));
      var computedStyle = getComputedStyle(elem);
      return parseInt(computedStyle.marginRight) + elem.offsetWidth;
    }
  }, {
    key: "moveList",
    value: function moveList(direction) {
      var _this = this;

      var offset = this.getwidthImage();
      var offsetLeft = isNaN(parseInt(this.list.style.left)) ? 0 : parseInt(this.list.style.left);

      if (direction == 'left') {
        this.addAfter();
        this.list.style.left = offsetLeft - offset + 'px';
        setTimeout(function () {
          var offsetComp = -(offsetLeft - offset) + 'px';
          _this.list.style.transform = 'translateX(' + offsetComp + ')'; // this.addEvent();
        }, this.timeout);
        this.indicateActive('next');
      } else if (direction == 'right') {
        this.addBefore();
        var offsetComp = -(offsetLeft + offset) + 'px';
        this.list.style.transform = 'translateX(' + offsetComp + ')';
        this.list.style.left = offsetLeft + offset + 'px';
        this.removeEvent();
        setTimeout(function () {// this.addEvent();
        }, this.timeout);
        this.indicateActive('prev');
      }
    }
  }, {
    key: "addAfter",
    value: function addAfter() {
      var _this2 = this;

      var firstElem = this.list.firstElementChild;
      var cloneElem = firstElem.cloneNode();
      this.list.appendChild(cloneElem);
      this.removeEvent();
      setTimeout(function () {
        var firstElem = _this2.list.firstElementChild;

        _this2.list.removeChild(firstElem);
      }, this.timeout);
    }
  }, {
    key: "addBefore",
    value: function addBefore() {
      var _this3 = this;

      var firstElem = this.list.firstElementChild;
      var cloneLastElem = this.list.lastElementChild.cloneNode();
      this.list.insertBefore(cloneLastElem, firstElem);
      setTimeout(function () {
        var lastElem = _this3.list.lastElementChild;

        _this3.list.removeChild(lastElem);
      }, this.timeout);
    }
  }, {
    key: "addEvent",
    value: function addEvent() {
      var _this4 = this;

      this.slider.addEventListener('mouseup', function (e) {
        _this4.list = document.querySelector(".".concat(_this4.firstList));

        if (e.target.closest(".".concat(_this4.btn_l))) {
          _this4.moveList('left');
        } else if (e.target.closest(".".concat(_this4.btn_r))) {
          _this4.moveList('right');
        }
      });
    }
  }, {
    key: "removeEvent",
    value: function removeEvent() {
      this.slider.removeEventListener('mouseup', this.removeEventListener);
    }
  }, {
    key: "resize",
    value: function resize() {
      var _this5 = this;

      window.addEventListener("resize", function (ev) {
        _this5.list.style.left = 0;
        _this5.list.style.transform = 'translateX(0)';
      }, false);
    }
  }]);

  return Slider;
}();

var Popup =
/*#__PURE__*/
function () {
  function Popup(popupWrapID, popupActive, classHide, popupCloseElClNm, popupWin) {
    var missed = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    _classCallCheck(this, Popup);

    this.missed = missed; //if this value is "true" popup will close by click outside the area popup

    this.show = popupActive;
    this.classHide = classHide;
    this.popupWin = popupWin;
    this.popup = document.getElementById(popupWrapID);
    this.closePopup = popupCloseElClNm;
    document.querySelector("body").addEventListener("mouseup", this.addEvent.bind(this));
  }

  _createClass(Popup, [{
    key: "addEvent",
    value: function addEvent(event) {
      if (event.target.matches(this.show) || event.target.closest(this.show)) {
        this.popUpShow(event.target.closest(this.show));
        this.popCloseButton(this.closePopup);
      }
    }
  }, {
    key: "popUpShow",
    value: function popUpShow(target) {
      this.popup.classList.remove(this.classHide);
      var body = document.querySelector('body');
      body.classList.add('modal-open');
    }
  }, {
    key: "popUpHide",
    value: function popUpHide() {
      this.popup.classList.add(this.classHide);
      var body = document.querySelector('body');
      body.classList.remove('modal-open');
    }
  }, {
    key: "closeByKey",
    value: function closeByKey(event) {
      if (event.keyCode === 27) {
        this.popUpHide();
      }
    }
  }, {
    key: "popCloseButton",
    value: function popCloseButton(el) {
      var _this6 = this;

      this.popup.addEventListener("mouseup", function (event) {
        if (event.target.closest(el) || _this6.missed && !event.target.closest(".".concat(_this6.popupWin))) {
          _this6.popUpHide();
        }
      });
      document.addEventListener("keydown", this.closeByKey.bind(this));
    }
  }]);

  return Popup;
}();

var SelectShoe =
/*#__PURE__*/
function () {
  function SelectShoe(wrapper, btn_l, btn_r, wrapShoeSelect, btnListDesc, color) {
    _classCallCheck(this, SelectShoe);

    this.wrapper = document.querySelector(".".concat(wrapper));
    this.btn_l = btn_l;
    this.btn_r = btn_r;
    this.wrapShoe = this.wrapper.querySelector(".".concat(wrapShoeSelect));
    this.btnOrder = btnListDesc;
    this.color = color;
    this.addEventOrder();
    this.addEventSlide();
  }

  _createClass(SelectShoe, [{
    key: "actionBG",
    value: function actionBG(dir) {
      var elem = this.wrapShoe.querySelector(".front");
      var color = elem.getAttribute('data-colorbg');
      var newColor = this.getColor("".concat(color), dir);
      var list = this.wrapShoe.querySelectorAll('[data-colorbg]');

      for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute('data-colorbg') == color) {
          list[i].classList.remove('front');
        } else if (list[i].getAttribute('data-colorbg') == newColor) {
          list[i].classList.add('front');
        }
      }

      this.actionElement('data-colorsl', color, newColor, 'cardBy__slider-hide');
      this.actionElement('data-colorhd', color, newColor, 'cardBy__header-hide');
      this.actionElementOutSlider('data-colorpsl', color, newColor, 'popup__list-hide');
    }
  }, {
    key: "actionElement",
    value: function actionElement(data, color, newColor, toggleClass) {
      var list = this.wrapper.querySelectorAll("[".concat(data, "]"));

      for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute(data) == color) {
          list[i].classList.add(toggleClass);
        } else if (list[i].getAttribute(data) == newColor) {
          list[i].classList.remove(toggleClass);
        }
      }
    }
  }, {
    key: "actionElementOutSlider",
    value: function actionElementOutSlider(data, color, newColor, toggleClass) {
      var list = document.querySelectorAll("[".concat(data, "]"));

      for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute(data) == color) {
          list[i].classList.add(toggleClass);
          list[i].classList.remove('popup__list-check');
        } else if (list[i].getAttribute(data) == newColor) {
          list[i].classList.remove(toggleClass);
          list[i].classList.add('popup__list-check');
        }
      }
    }
  }, {
    key: "addEventSlide",
    value: function addEventSlide() {
      var _this7 = this;

      this.wrapper.addEventListener('mouseup', function (e) {
        if (e.target.closest(".".concat(_this7.btn_l))) {
          _this7.actionBG('next');
        } else if (e.target.closest(".".concat(_this7.btn_r))) {
          _this7.actionBG('prev');
        }
      });
    }
  }, {
    key: "getColor",
    value: function getColor(color, direct) {
      var _this8 = this;

      var res;
      this.color.forEach(function (element, i) {
        if (color == element && direct == "next") {
          var index = i + 1 >= _this8.color.length ? 0 : i + 1;
          res = _this8.color[index];
        } else if (color === element && direct === "prev") {
          var _index = i - 1 < 0 ? _this8.color.length - 1 : i - 1;

          res = _this8.color[_index];
        }
      });
      return res;
    }
  }, {
    key: "addEventOrder",
    value: function addEventOrder() {
      var _this9 = this;

      this.wrapper.addEventListener('mouseup', function (e) {
        var changeCard = function changeCard() {
          var list = _this9.wrapper.querySelectorAll('.cardBy__wrapper');

          for (var i = 0; i < list.length; i++) {
            list[i].classList.toggle('hide');
          }
        };

        if (e.target.closest(".".concat(_this9.btnOrder)) || e.target.closest('.cardBy__back')) {
          changeCard();
        }
      });
    }
  }, {
    key: "popupCheck",
    value: function popupCheck() {}
  }]);

  return SelectShoe;
}();

var InfSlider =
/*#__PURE__*/
function () {
  function InfSlider(wrapBtn, classBtn, classCheckBtn, wrapSlidInf, classCheckSlidInf) {
    _classCallCheck(this, InfSlider);

    this.wrapBtn = document.querySelector(".".concat(wrapBtn));
    this.classCheckBtn = classCheckBtn;
    this.classBtn = classBtn;
    this.wrapSlidInf = document.querySelector(".".concat(wrapSlidInf));
    this.classCheckSlidInf = classCheckSlidInf;
    this.addEvent();
  }

  _createClass(InfSlider, [{
    key: "addEvent",
    value: function addEvent() {
      var _this10 = this;

      this.wrapBtn.addEventListener('mouseup', function (e) {
        var list = _this10.wrapBtn.children;
        var elem;

        if (elem = e.target.closest(".".concat(_this10.classBtn))) {
          for (var i = 0; i < list.length; i++) {
            if (elem == list[i]) {
              _this10.checkElem(_this10.wrapBtn, _this10.classCheckBtn, i);

              _this10.checkElem(_this10.wrapSlidInf, _this10.classCheckSlidInf, i);

              return;
            }
          }
        }
      });
    }
  }, {
    key: "checkElem",
    value: function checkElem(wrapList, checkClass, n) {
      var list = wrapList.children;
      var unCheck = wrapList.querySelector(".".concat(checkClass));
      unCheck.classList.remove(checkClass);
      list[n].classList.add(checkClass);
    }
  }]);

  return InfSlider;
}();

var slider = new Slider('slider', 'slider__list', 'slider__img', 'btnLeft', 'btnRight', 'slider__indicat', 300);
var sliderSpray = new Slider('purchase__cardSlide', 'sliderSpray__wrapper', 'sliderSpray__img', 'btnLeft', 'btnRight', null, 300);
var sliderPopup = new Slider('popup__slider', 'popup__list-check', 'popup__img', 'btnLeft', 'btnRight', null, 500);
var select = new SelectShoe('select', 'btnLeft', 'btnRight', 'select__cardSlide', 'cardBy__button-list', ['red', 'black']);
var myPopup = new Popup('popupRed', '.cardBy__img', 'popup-hide', 'cls', 'popup__slider', true);
var infSlider = new InfSlider('info__list', 'info__item', 'info__item-check', 'info__cont', 'slideInfo-vis');