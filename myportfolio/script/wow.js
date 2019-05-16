(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.WOW = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _class, _temp;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function isIn(needle, haystack) {
    return haystack.indexOf(needle) >= 0;
  }

  function extend(custom, defaults) {
    for (var key in defaults) {
      if (custom[key] == null) {
        var value = defaults[key];
        custom[key] = value;
      }
    }
    return custom;
  }

  function isMobile(agent) {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent)
    );
  }

  function createEvent(event) {
    var bubble = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var cancel = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var detail = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    var customEvent = void 0;
    if (document.createEvent != null) {
      // W3C DOM
      customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(event, bubble, cancel, detail);
    } else if (document.createEventObject != null) {
      // IE DOM < 9
      customEvent = document.createEventObject();
      customEvent.eventType = event;
    } else {
      customEvent.eventName = event;
    }

    return customEvent;
  }

  function emitEvent(elem, event) {
    if (elem.dispatchEvent != null) {
      // W3C DOM
      elem.dispatchEvent(event);
    } else if (event in (elem != null)) {
      elem[event]();
    } else if ('on' + event in (elem != null)) {
      elem['on' + event]();
    }
  }

  function addEvent(elem, event, fn) {
    if (elem.addEventListener != null) {
      // W3C DOM
      elem.addEventListener(event, fn, false);
    } else if (elem.attachEvent != null) {
      // IE DOM
      elem.attachEvent('on' + event, fn);
    } else {
      // fallback
      elem[event] = fn;
    }
  }

  function removeEvent(elem, event, fn) {
    if (elem.removeEventListener != null) {
      // W3C DOM
      elem.removeEventListener(event, fn, false);
    } else if (elem.detachEvent != null) {
      // IE DOM
      elem.detachEvent('on' + event, fn);
    } else {
      // fallback
      delete elem[event];
    }
  }

  function getInnerHeight() {
    if ('innerHeight' in window) {
      return window.innerHeight;
    }

    return document.documentElement.clientHeight;
  }

  // Minimalistic WeakMap shim, just in case.
  var WeakMap = window.WeakMap || window.MozWeakMap || function () {
    function WeakMap() {
      _classCallCheck(this, WeakMap);

      this.keys = [];
      this.values = [];
    }

    _createClass(WeakMap, [{
      key: 'get',
      value: function get(key) {
        for (var i = 0; i < this.keys.length; i++) {
          var item = this.keys[i];
          if (item === key) {
            return this.values[i];
          }
        }
        return undefined;
      }
    }, {
      key: 'set',
      value: function set(key, value) {
        for (var i = 0; i < this.keys.length; i++) {
          var item = this.keys[i];
          if (item === key) {
            this.values[i] = value;
            return this;
          }
        }
        this.keys.push(key);
        this.values.push(value);
        return this;
      }
    }]);

    return WeakMap;
  }();

  // Dummy MutationObserver, to avoid raising exceptions.
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver || (_temp = _class = function () {
    function MutationObserver() {
      _classCallCheck(this, MutationObserver);

      if (typeof console !== 'undefined' && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    _createClass(MutationObserver, [{
      key: 'observe',
      value: function observe() {}
    }]);

    return MutationObserver;
  }(), _class.notSupported = true, _temp);

  // getComputedStyle shim, from http://stackoverflow.com/a/21797294
  var getComputedStyle = window.getComputedStyle || function getComputedStyle(el) {
    var getComputedStyleRX = /(\-([a-z]){1})/g;
    return {
      getPropertyValue: function getPropertyValue(prop) {
        if (prop === 'float') {
          prop = 'styleFloat';
        }
        if (getComputedStyleRX.test(prop)) {
          prop.replace(getComputedStyleRX, function (_, _char) {
            return _char.toUpperCase();
          });
        }
        var currentStyle = el.currentStyle;

        return (currentStyle != null ? currentStyle[prop] : void 0) || null;
      }
    };
  };

  var WOW = function () {
    function WOW() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, WOW);

      this.defaults = {
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true,
        callback: null,
        scrollContainer: null,
        resetAnimation: true
      };

      this.animate = function animateFactory() {
        if ('requestAnimationFrame' in window) {
          return function (callback) {
            return window.requestAnimationFrame(callback);
          };
        }
        return function (callback) {
          return callback();
        };
      }();

      this.vendors = ['moz', 'webkit'];

      this.start = this.start.bind(this);
      this.resetAnimation = this.resetAnimation.bind(this);
      this.scrollHandler = this.scrollHandler.bind(this);
      this.scrollCallback = this.scrollCallback.bind(this);
      this.scrolled = true;
      this.config = extend(options, this.defaults);
      if (options.scrollContainer != null) {
        this.config.scrollContainer = document.querySelector(options.scrollContainer);
      }
      // Map of elements to animation names:
      this.animationNameCache = new WeakMap();
      this.wowEvent = createEvent(this.config.boxClass);
    }

    _createClass(WOW, [{
      key: 'init',
      value: function init() {
        this.element = window.document.documentElement;
        if (isIn(document.readyState, ['interactive', 'complete'])) {
          this.start();
        } else {
          addEvent(document, 'DOMContentLoaded', this.start);
        }
        this.finished = [];
      }
    }, {
      key: 'start',
      value: function start() {
        var _this = this;

        this.stopped = false;
        this.boxes = [].slice.call(this.element.querySelectorAll('.' + this.config.boxClass));
        this.all = this.boxes.slice(0);
        if (this.boxes.length) {
          if (this.disabled()) {
            this.resetStyle();
          } else {
            for (var i = 0; i < this.boxes.length; i++) {
              var box = this.boxes[i];
              this.applyStyle(box, true);
            }
          }
        }
        if (!this.disabled()) {
          addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
          addEvent(window, 'resize', this.scrollHandler);
          this.interval = setInterval(this.scrollCallback, 50);
        }
        if (this.config.live) {
          var mut = new MutationObserver(function (records) {
            for (var j = 0; j < records.length; j++) {
              var record = records[j];
              for (var k = 0; k < record.addedNodes.length; k++) {
                var node = record.addedNodes[k];
                _this.doSync(node);
              }
            }
            return undefined;
          });
          mut.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.stopped = true;
        removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
        removeEvent(window, 'resize', this.scrollHandler);
        if (this.interval != null) {
          clearInterval(this.interval);
        }
      }
    }, {
      key: 'sync',
      value: function sync() {
        if (MutationObserver.notSupported) {
          this.doSync(this.element);
        }
      }
    }, {
      key: 'doSync',
      value: function doSync(element) {
        if (typeof element === 'undefined' || element === null) {
          element = this.element;
        }
        if (element.nodeType !== 1) {
          return;
        }
        element = element.parentNode || element;
        var iterable = element.querySelectorAll('.' + this.config.boxClass);
        for (var i = 0; i < iterable.length; i++) {
          var box = iterable[i];
          if (!isIn(box, this.all)) {
            this.boxes.push(box);
            this.all.push(box);
            if (this.stopped || this.disabled()) {
              this.resetStyle();
            } else {
              this.applyStyle(box, true);
            }
            this.scrolled = true;
          }
        }
      }
    }, {
      key: 'show',
      value: function show(box) {
        this.applyStyle(box);
        box.className = box.className + ' ' + this.config.animateClass;
        if (this.config.callback != null) {
          this.config.callback(box);
        }
        emitEvent(box, this.wowEvent);

        if (this.config.resetAnimation) {
          addEvent(box, 'animationend', this.resetAnimation);
          addEvent(box, 'oanimationend', this.resetAnimation);
          addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
          addEvent(box, 'MSAnimationEnd', this.resetAnimation);
        }

        return box;
      }
    }, {
      key: 'applyStyle',
      value: function applyStyle(box, hidden) {
        var _this2 = this;

        var duration = box.getAttribute('data-wow-duration');
        var delay = box.getAttribute('data-wow-delay');
        var iteration = box.getAttribute('data-wow-iteration');

        return this.animate(function () {
          return _this2.customStyle(box, hidden, duration, delay, iteration);
        });
      }
    }, {
      key: 'resetStyle',
      value: function resetStyle() {
        for (var i = 0; i < this.boxes.length; i++) {
          var box = this.boxes[i];
          box.style.visibility = 'visible';
        }
        return undefined;
      }
    }, {
      key: 'resetAnimation',
      value: function resetAnimation(event) {
        if (event.type.toLowerCase().indexOf('animationend') >= 0) {
          var target = event.target || event.srcElement;
          target.className = target.className.replace(this.config.animateClass, '').trim();
        }
      }
    }, {
      key: 'customStyle',
      value: function customStyle(box, hidden, duration, delay, iteration) {
        if (hidden) {
          this.cacheAnimationName(box);
        }
        box.style.visibility = hidden ? 'hidden' : 'visible';

        if (duration) {
          this.vendorSet(box.style, { animationDuration: duration });
        }
        if (delay) {
          this.vendorSet(box.style, { animationDelay: delay });
        }
        if (iteration) {
          this.vendorSet(box.style, { animationIterationCount: iteration });
        }
        this.vendorSet(box.style, { animationName: hidden ? 'none' : this.cachedAnimationName(box) });

        return box;
      }
    }, {
      key: 'vendorSet',
      value: function vendorSet(elem, properties) {
        for (var name in properties) {
          if (properties.hasOwnProperty(name)) {
            var value = properties[name];
            elem['' + name] = value;
            for (var i = 0; i < this.vendors.length; i++) {
              var vendor = this.vendors[i];
              elem['' + vendor + name.charAt(0).toUpperCase() + name.substr(1)] = value;
            }
          }
        }
      }
    }, {
      key: 'vendorCSS',
      value: function vendorCSS(elem, property) {
        var style = getComputedStyle(elem);
        var result = style.getPropertyCSSValue(property);
        for (var i = 0; i < this.vendors.length; i++) {
          var vendor = this.vendors[i];
          result = result || style.getPropertyCSSValue('-' + vendor + '-' + property);
        }
        return result;
      }
    }, {
      key: 'animationName',
      value: function animationName(box) {
        var aName = void 0;
        try {
          aName = this.vendorCSS(box, 'animation-name').cssText;
        } catch (error) {
          // Opera, fall back to plain property value
          aName = getComputedStyle(box).getPropertyValue('animation-name');
        }

        if (aName === 'none') {
          return ''; // SVG/Firefox, unable to get animation name?
        }

        return aName;
      }
    }, {
      key: 'cacheAnimationName',
      value: function cacheAnimationName(box) {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=921834
        // box.dataset is not supported for SVG elements in Firefox
        return this.animationNameCache.set(box, this.animationName(box));
      }
    }, {
      key: 'cachedAnimationName',
      value: function cachedAnimationName(box) {
        return this.animationNameCache.get(box);
      }
    }, {
      key: 'scrollHandler',
      value: function scrollHandler() {
        this.scrolled = true;
      }
    }, {
      key: 'scrollCallback',
      value: function scrollCallback() {
        if (this.scrolled) {
          this.scrolled = false;
          var results = [];
          for (var i = 0; i < this.boxes.length; i++) {
            var box = this.boxes[i];
            if (box) {
              if (this.isVisible(box)) {
                this.show(box);
                continue;
              }
              results.push(box);
            }
          }
          this.boxes = results;
          if (!this.boxes.length && !this.config.live) {
            this.stop();
          }
        }
      }
    }, {
      key: 'offsetTop',
      value: function offsetTop(element) {
        // SVG elements don't have an offsetTop in Firefox.
        // This will use their nearest parent that has an offsetTop.
        // Also, using ('offsetTop' of element) causes an exception in Firefox.
        while (element.offsetTop === undefined) {
          element = element.parentNode;
        }
        var top = element.offsetTop;
        while (element.offsetParent) {
          element = element.offsetParent;
          top += element.offsetTop;
        }
        return top;
      }
    }, {
      key: 'isVisible',
      value: function isVisible(box) {
        var offset = box.getAttribute('data-wow-offset') || this.config.offset;
        var viewTop = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset;
        var viewBottom = viewTop + Math.min(this.element.clientHeight, getInnerHeight()) - offset;
        var top = this.offsetTop(box);
        var bottom = top + box.clientHeight;

        return top <= viewBottom && bottom >= viewTop;
      }
    }, {
      key: 'disabled',
      value: function disabled() {
        return !this.config.mobile && isMobile(navigator.userAgent);
      }
    }]);

    return WOW;
  }();

  exports.default = WOW;
  module.exports = exports['default'];
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ3b3cuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcclxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbJ21vZHVsZScsICdleHBvcnRzJ10sIGZhY3RvcnkpO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIGZhY3RvcnkobW9kdWxlLCBleHBvcnRzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIG1vZCA9IHtcclxuICAgICAgZXhwb3J0czoge31cclxuICAgIH07XHJcbiAgICBmYWN0b3J5KG1vZCwgbW9kLmV4cG9ydHMpO1xyXG4gICAgZ2xvYmFsLldPVyA9IG1vZC5leHBvcnRzO1xyXG4gIH1cclxufSkodGhpcywgZnVuY3Rpb24gKG1vZHVsZSwgZXhwb3J0cykge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XHJcbiAgICB2YWx1ZTogdHJ1ZVxyXG4gIH0pO1xyXG5cclxuICB2YXIgX2NsYXNzLCBfdGVtcDtcclxuXHJcbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xyXG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XHJcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XHJcbiAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgICByZXR1cm4gQ29uc3RydWN0b3I7XHJcbiAgICB9O1xyXG4gIH0oKTtcclxuXHJcbiAgZnVuY3Rpb24gaXNJbihuZWVkbGUsIGhheXN0YWNrKSB7XHJcbiAgICByZXR1cm4gaGF5c3RhY2suaW5kZXhPZihuZWVkbGUpID49IDA7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBleHRlbmQoY3VzdG9tLCBkZWZhdWx0cykge1xyXG4gICAgZm9yICh2YXIga2V5IGluIGRlZmF1bHRzKSB7XHJcbiAgICAgIGlmIChjdXN0b21ba2V5XSA9PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gZGVmYXVsdHNba2V5XTtcclxuICAgICAgICBjdXN0b21ba2V5XSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY3VzdG9tO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNNb2JpbGUoYWdlbnQpIHtcclxuICAgIHJldHVybiAoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KGFnZW50KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KGV2ZW50KSB7XHJcbiAgICB2YXIgYnViYmxlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XHJcbiAgICB2YXIgY2FuY2VsID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMl07XHJcbiAgICB2YXIgZGV0YWlsID0gYXJndW1lbnRzLmxlbmd0aCA8PSAzIHx8IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1szXTtcclxuXHJcbiAgICB2YXIgY3VzdG9tRXZlbnQgPSB2b2lkIDA7XHJcbiAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xyXG4gICAgICAvLyBXM0MgRE9NXHJcbiAgICAgIGN1c3RvbUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XHJcbiAgICAgIGN1c3RvbUV2ZW50LmluaXRDdXN0b21FdmVudChldmVudCwgYnViYmxlLCBjYW5jZWwsIGRldGFpbCk7XHJcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0ICE9IG51bGwpIHtcclxuICAgICAgLy8gSUUgRE9NIDwgOVxyXG4gICAgICBjdXN0b21FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XHJcbiAgICAgIGN1c3RvbUV2ZW50LmV2ZW50VHlwZSA9IGV2ZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VzdG9tRXZlbnQuZXZlbnROYW1lID0gZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGN1c3RvbUV2ZW50O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZW1pdEV2ZW50KGVsZW0sIGV2ZW50KSB7XHJcbiAgICBpZiAoZWxlbS5kaXNwYXRjaEV2ZW50ICE9IG51bGwpIHtcclxuICAgICAgLy8gVzNDIERPTVxyXG4gICAgICBlbGVtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChldmVudCBpbiAoZWxlbSAhPSBudWxsKSkge1xyXG4gICAgICBlbGVtW2V2ZW50XSgpO1xyXG4gICAgfSBlbHNlIGlmICgnb24nICsgZXZlbnQgaW4gKGVsZW0gIT0gbnVsbCkpIHtcclxuICAgICAgZWxlbVsnb24nICsgZXZlbnRdKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRFdmVudChlbGVtLCBldmVudCwgZm4pIHtcclxuICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIgIT0gbnVsbCkge1xyXG4gICAgICAvLyBXM0MgRE9NXHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIGZhbHNlKTtcclxuICAgIH0gZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudCAhPSBudWxsKSB7XHJcbiAgICAgIC8vIElFIERPTVxyXG4gICAgICBlbGVtLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgZm4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gZmFsbGJhY2tcclxuICAgICAgZWxlbVtldmVudF0gPSBmbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGVsZW0sIGV2ZW50LCBmbikge1xyXG4gICAgaWYgKGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgIC8vIFczQyBET01cclxuICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGlmIChlbGVtLmRldGFjaEV2ZW50ICE9IG51bGwpIHtcclxuICAgICAgLy8gSUUgRE9NXHJcbiAgICAgIGVsZW0uZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBmbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBmYWxsYmFja1xyXG4gICAgICBkZWxldGUgZWxlbVtldmVudF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRJbm5lckhlaWdodCgpIHtcclxuICAgIGlmICgnaW5uZXJIZWlnaHQnIGluIHdpbmRvdykge1xyXG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgLy8gTWluaW1hbGlzdGljIFdlYWtNYXAgc2hpbSwganVzdCBpbiBjYXNlLlxyXG4gIHZhciBXZWFrTWFwID0gd2luZG93LldlYWtNYXAgfHwgd2luZG93Lk1veldlYWtNYXAgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gV2Vha01hcCgpIHtcclxuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdlYWtNYXApO1xyXG5cclxuICAgICAgdGhpcy5rZXlzID0gW107XHJcbiAgICAgIHRoaXMudmFsdWVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKFdlYWtNYXAsIFt7XHJcbiAgICAgIGtleTogJ2dldCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQoa2V5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rZXlzW2ldO1xyXG4gICAgICAgICAgaWYgKGl0ZW0gPT09IGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc2V0JyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rZXlzW2ldO1xyXG4gICAgICAgICAgaWYgKGl0ZW0gPT09IGtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG5cclxuICAgIHJldHVybiBXZWFrTWFwO1xyXG4gIH0oKTtcclxuXHJcbiAgLy8gRHVtbXkgTXV0YXRpb25PYnNlcnZlciwgdG8gYXZvaWQgcmFpc2luZyBleGNlcHRpb25zLlxyXG4gIHZhciBNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYmtpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIgfHwgKF90ZW1wID0gX2NsYXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTXV0YXRpb25PYnNlcnZlcigpIHtcclxuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE11dGF0aW9uT2JzZXJ2ZXIpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlICE9PSBudWxsKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdNdXRhdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyLicpO1xyXG4gICAgICAgIGNvbnNvbGUud2FybignV09XLmpzIGNhbm5vdCBkZXRlY3QgZG9tIG11dGF0aW9ucywgcGxlYXNlIGNhbGwgLnN5bmMoKSBhZnRlciBsb2FkaW5nIG5ldyBjb250ZW50LicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKE11dGF0aW9uT2JzZXJ2ZXIsIFt7XHJcbiAgICAgIGtleTogJ29ic2VydmUnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb2JzZXJ2ZSgpIHt9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgfSgpLCBfY2xhc3Mubm90U3VwcG9ydGVkID0gdHJ1ZSwgX3RlbXApO1xyXG5cclxuICAvLyBnZXRDb21wdXRlZFN0eWxlIHNoaW0sIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjE3OTcyOTRcclxuICB2YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlIHx8IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWwpIHtcclxuICAgIHZhciBnZXRDb21wdXRlZFN0eWxlUlggPSAvKFxcLShbYS16XSl7MX0pL2c7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcclxuICAgICAgICBpZiAocHJvcCA9PT0gJ2Zsb2F0Jykge1xyXG4gICAgICAgICAgcHJvcCA9ICdzdHlsZUZsb2F0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGVSWC50ZXN0KHByb3ApKSB7XHJcbiAgICAgICAgICBwcm9wLnJlcGxhY2UoZ2V0Q29tcHV0ZWRTdHlsZVJYLCBmdW5jdGlvbiAoXywgX2NoYXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jaGFyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGN1cnJlbnRTdHlsZSA9IGVsLmN1cnJlbnRTdHlsZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChjdXJyZW50U3R5bGUgIT0gbnVsbCA/IGN1cnJlbnRTdHlsZVtwcm9wXSA6IHZvaWQgMCkgfHwgbnVsbDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICB2YXIgV09XID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gV09XKCkge1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xyXG5cclxuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdPVyk7XHJcblxyXG4gICAgICB0aGlzLmRlZmF1bHRzID0ge1xyXG4gICAgICAgIGJveENsYXNzOiAnd293JyxcclxuICAgICAgICBhbmltYXRlQ2xhc3M6ICdhbmltYXRlZCcsXHJcbiAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgIG1vYmlsZTogdHJ1ZSxcclxuICAgICAgICBsaXZlOiB0cnVlLFxyXG4gICAgICAgIGNhbGxiYWNrOiBudWxsLFxyXG4gICAgICAgIHNjcm9sbENvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICByZXNldEFuaW1hdGlvbjogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZUZhY3RvcnkoKSB7XHJcbiAgICAgICAgaWYgKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIGluIHdpbmRvdykge1xyXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9KCk7XHJcblxyXG4gICAgICB0aGlzLnZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXTtcclxuXHJcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLnN0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMucmVzZXRBbmltYXRpb24gPSB0aGlzLnJlc2V0QW5pbWF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnNjcm9sbENhbGxiYWNrID0gdGhpcy5zY3JvbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnNjcm9sbGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jb25maWcgPSBleHRlbmQob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XHJcbiAgICAgIGlmIChvcHRpb25zLnNjcm9sbENvbnRhaW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuc2Nyb2xsQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnNjcm9sbENvbnRhaW5lcik7XHJcbiAgICAgIH1cclxuICAgICAgLy8gTWFwIG9mIGVsZW1lbnRzIHRvIGFuaW1hdGlvbiBuYW1lczpcclxuICAgICAgdGhpcy5hbmltYXRpb25OYW1lQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xyXG4gICAgICB0aGlzLndvd0V2ZW50ID0gY3JlYXRlRXZlbnQodGhpcy5jb25maWcuYm94Q2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIF9jcmVhdGVDbGFzcyhXT1csIFt7XHJcbiAgICAgIGtleTogJ2luaXQnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIGlmIChpc0luKGRvY3VtZW50LnJlYWR5U3RhdGUsIFsnaW50ZXJhY3RpdmUnLCAnY29tcGxldGUnXSkpIHtcclxuICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRkRXZlbnQoZG9jdW1lbnQsICdET01Db250ZW50TG9hZGVkJywgdGhpcy5zdGFydCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluaXNoZWQgPSBbXTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdzdGFydCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJveGVzID0gW10uc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLmNvbmZpZy5ib3hDbGFzcykpO1xyXG4gICAgICAgIHRoaXMuYWxsID0gdGhpcy5ib3hlcy5zbGljZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5ib3hlcy5sZW5ndGgpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldFN0eWxlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm94ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgYm94ID0gdGhpcy5ib3hlc1tpXTtcclxuICAgICAgICAgICAgICB0aGlzLmFwcGx5U3R5bGUoYm94LCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQoKSkge1xyXG4gICAgICAgICAgYWRkRXZlbnQodGhpcy5jb25maWcuc2Nyb2xsQ29udGFpbmVyIHx8IHdpbmRvdywgJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XHJcbiAgICAgICAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCB0aGlzLnNjcm9sbEhhbmRsZXIpO1xyXG4gICAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMuc2Nyb2xsQ2FsbGJhY2ssIDUwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxpdmUpIHtcclxuICAgICAgICAgIHZhciBtdXQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAocmVjb3Jkcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlY29yZHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gcmVjb3Jkc1tqXTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHJlY29yZC5hZGRlZE5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZG9TeW5jKG5vZGUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBtdXQub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3N0b3AnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIHJlbW92ZUV2ZW50KHRoaXMuY29uZmlnLnNjcm9sbENvbnRhaW5lciB8fCB3aW5kb3csICdzY3JvbGwnLCB0aGlzLnNjcm9sbEhhbmRsZXIpO1xyXG4gICAgICAgIHJlbW92ZUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc3luYycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jKCkge1xyXG4gICAgICAgIGlmIChNdXRhdGlvbk9ic2VydmVyLm5vdFN1cHBvcnRlZCkge1xyXG4gICAgICAgICAgdGhpcy5kb1N5bmModGhpcy5lbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnZG9TeW5jJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRvU3luYyhlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCBlbGVtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlIHx8IGVsZW1lbnQ7XHJcbiAgICAgICAgdmFyIGl0ZXJhYmxlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuY29uZmlnLmJveENsYXNzKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgYm94ID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICBpZiAoIWlzSW4oYm94LCB0aGlzLmFsbCkpIHtcclxuICAgICAgICAgICAgdGhpcy5ib3hlcy5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWxsLnB1c2goYm94KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcHBlZCB8fCB0aGlzLmRpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlc2V0U3R5bGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLmFwcGx5U3R5bGUoYm94LCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVkID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc2hvdycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KGJveCkge1xyXG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZShib3gpO1xyXG4gICAgICAgIGJveC5jbGFzc05hbWUgPSBib3guY2xhc3NOYW1lICsgJyAnICsgdGhpcy5jb25maWcuYW5pbWF0ZUNsYXNzO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jYWxsYmFjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhib3gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbWl0RXZlbnQoYm94LCB0aGlzLndvd0V2ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJlc2V0QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICBhZGRFdmVudChib3gsICdhbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcclxuICAgICAgICAgIGFkZEV2ZW50KGJveCwgJ29hbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcclxuICAgICAgICAgIGFkZEV2ZW50KGJveCwgJ3dlYmtpdEFuaW1hdGlvbkVuZCcsIHRoaXMucmVzZXRBbmltYXRpb24pO1xyXG4gICAgICAgICAgYWRkRXZlbnQoYm94LCAnTVNBbmltYXRpb25FbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnYXBwbHlTdHlsZScsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseVN0eWxlKGJveCwgaGlkZGVuKSB7XHJcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGJveC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd293LWR1cmF0aW9uJyk7XHJcbiAgICAgICAgdmFyIGRlbGF5ID0gYm94LmdldEF0dHJpYnV0ZSgnZGF0YS13b3ctZGVsYXknKTtcclxuICAgICAgICB2YXIgaXRlcmF0aW9uID0gYm94LmdldEF0dHJpYnV0ZSgnZGF0YS13b3ctaXRlcmF0aW9uJyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5jdXN0b21TdHlsZShib3gsIGhpZGRlbiwgZHVyYXRpb24sIGRlbGF5LCBpdGVyYXRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Jlc2V0U3R5bGUnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXRTdHlsZSgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm94ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBib3ggPSB0aGlzLmJveGVzW2ldO1xyXG4gICAgICAgICAgYm94LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAncmVzZXRBbmltYXRpb24nLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXRBbmltYXRpb24oZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2FuaW1hdGlvbmVuZCcpID49IDApIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcclxuICAgICAgICAgIHRhcmdldC5jbGFzc05hbWUgPSB0YXJnZXQuY2xhc3NOYW1lLnJlcGxhY2UodGhpcy5jb25maWcuYW5pbWF0ZUNsYXNzLCAnJykudHJpbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdjdXN0b21TdHlsZScsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjdXN0b21TdHlsZShib3gsIGhpZGRlbiwgZHVyYXRpb24sIGRlbGF5LCBpdGVyYXRpb24pIHtcclxuICAgICAgICBpZiAoaGlkZGVuKSB7XHJcbiAgICAgICAgICB0aGlzLmNhY2hlQW5pbWF0aW9uTmFtZShib3gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBib3guc3R5bGUudmlzaWJpbGl0eSA9IGhpZGRlbiA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xyXG5cclxuICAgICAgICBpZiAoZHVyYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwgeyBhbmltYXRpb25EdXJhdGlvbjogZHVyYXRpb24gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWxheSkge1xyXG4gICAgICAgICAgdGhpcy52ZW5kb3JTZXQoYm94LnN0eWxlLCB7IGFuaW1hdGlvbkRlbGF5OiBkZWxheSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZXJhdGlvbikge1xyXG4gICAgICAgICAgdGhpcy52ZW5kb3JTZXQoYm94LnN0eWxlLCB7IGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiBpdGVyYXRpb24gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwgeyBhbmltYXRpb25OYW1lOiBoaWRkZW4gPyAnbm9uZScgOiB0aGlzLmNhY2hlZEFuaW1hdGlvbk5hbWUoYm94KSB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICd2ZW5kb3JTZXQnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdmVuZG9yU2V0KGVsZW0sIHByb3BlcnRpZXMpIHtcclxuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHByb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGVsZW1bJycgKyBuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmVuZG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciB2ZW5kb3IgPSB0aGlzLnZlbmRvcnNbaV07XHJcbiAgICAgICAgICAgICAgZWxlbVsnJyArIHZlbmRvciArIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICd2ZW5kb3JDU1MnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdmVuZG9yQ1NTKGVsZW0sIHByb3BlcnR5KSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc3R5bGUuZ2V0UHJvcGVydHlDU1NWYWx1ZShwcm9wZXJ0eSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZlbmRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciB2ZW5kb3IgPSB0aGlzLnZlbmRvcnNbaV07XHJcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwgc3R5bGUuZ2V0UHJvcGVydHlDU1NWYWx1ZSgnLScgKyB2ZW5kb3IgKyAnLScgKyBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnYW5pbWF0aW9uTmFtZScsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhbmltYXRpb25OYW1lKGJveCkge1xyXG4gICAgICAgIHZhciBhTmFtZSA9IHZvaWQgMDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgYU5hbWUgPSB0aGlzLnZlbmRvckNTUyhib3gsICdhbmltYXRpb24tbmFtZScpLmNzc1RleHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIC8vIE9wZXJhLCBmYWxsIGJhY2sgdG8gcGxhaW4gcHJvcGVydHkgdmFsdWVcclxuICAgICAgICAgIGFOYW1lID0gZ2V0Q29tcHV0ZWRTdHlsZShib3gpLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1uYW1lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYU5hbWUgPT09ICdub25lJykge1xyXG4gICAgICAgICAgcmV0dXJuICcnOyAvLyBTVkcvRmlyZWZveCwgdW5hYmxlIHRvIGdldCBhbmltYXRpb24gbmFtZT9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhTmFtZTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdjYWNoZUFuaW1hdGlvbk5hbWUnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2FjaGVBbmltYXRpb25OYW1lKGJveCkge1xyXG4gICAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTkyMTgzNFxyXG4gICAgICAgIC8vIGJveC5kYXRhc2V0IGlzIG5vdCBzdXBwb3J0ZWQgZm9yIFNWRyBlbGVtZW50cyBpbiBGaXJlZm94XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uTmFtZUNhY2hlLnNldChib3gsIHRoaXMuYW5pbWF0aW9uTmFtZShib3gpKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdjYWNoZWRBbmltYXRpb25OYW1lJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhY2hlZEFuaW1hdGlvbk5hbWUoYm94KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uTmFtZUNhY2hlLmdldChib3gpO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Njcm9sbEhhbmRsZXInLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2Nyb2xsSGFuZGxlcigpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdzY3JvbGxDYWxsYmFjaycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzY3JvbGxDYWxsYmFjaygpIHtcclxuICAgICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ib3hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYm94ID0gdGhpcy5ib3hlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGJveCkge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZShib3gpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coYm94KTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXN1bHRzLnB1c2goYm94KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5ib3hlcyA9IHJlc3VsdHM7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuYm94ZXMubGVuZ3RoICYmICF0aGlzLmNvbmZpZy5saXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdvZmZzZXRUb3AnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb2Zmc2V0VG9wKGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBTVkcgZWxlbWVudHMgZG9uJ3QgaGF2ZSBhbiBvZmZzZXRUb3AgaW4gRmlyZWZveC5cclxuICAgICAgICAvLyBUaGlzIHdpbGwgdXNlIHRoZWlyIG5lYXJlc3QgcGFyZW50IHRoYXQgaGFzIGFuIG9mZnNldFRvcC5cclxuICAgICAgICAvLyBBbHNvLCB1c2luZyAoJ29mZnNldFRvcCcgb2YgZWxlbWVudCkgY2F1c2VzIGFuIGV4Y2VwdGlvbiBpbiBGaXJlZm94LlxyXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdG9wID0gZWxlbWVudC5vZmZzZXRUb3A7XHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XHJcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3A7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnaXNWaXNpYmxlJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzVmlzaWJsZShib3gpIHtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gYm94LmdldEF0dHJpYnV0ZSgnZGF0YS13b3ctb2Zmc2V0JykgfHwgdGhpcy5jb25maWcub2Zmc2V0O1xyXG4gICAgICAgIHZhciB2aWV3VG9wID0gdGhpcy5jb25maWcuc2Nyb2xsQ29udGFpbmVyICYmIHRoaXMuY29uZmlnLnNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3AgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gICAgICAgIHZhciB2aWV3Qm90dG9tID0gdmlld1RvcCArIE1hdGgubWluKHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHQsIGdldElubmVySGVpZ2h0KCkpIC0gb2Zmc2V0O1xyXG4gICAgICAgIHZhciB0b3AgPSB0aGlzLm9mZnNldFRvcChib3gpO1xyXG4gICAgICAgIHZhciBib3R0b20gPSB0b3AgKyBib3guY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gdG9wIDw9IHZpZXdCb3R0b20gJiYgYm90dG9tID49IHZpZXdUb3A7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnZGlzYWJsZWQnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmNvbmZpZy5tb2JpbGUgJiYgaXNNb2JpbGUobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuXHJcbiAgICByZXR1cm4gV09XO1xyXG4gIH0oKTtcclxuXHJcbiAgZXhwb3J0cy5kZWZhdWx0ID0gV09XO1xyXG4gIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xyXG59KTtcclxuIl0sImZpbGUiOiJ3b3cuanMifQ==
