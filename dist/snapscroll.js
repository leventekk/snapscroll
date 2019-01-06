(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SnapScroll = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var SnapScroll = function SnapScroll(selector, options) {
    var defaults = _objectSpread({
      proximity: 100,
      duration: 200,
      easing: function easing(time) {
        return time;
      },
      onSnapWait: 50
    }, options);

    var items = _toConsumableArray(document.querySelectorAll(selector));

    var positions = [];
    var snapTimeout;
    var isScrolling;

    var getPositions = function getPositions() {
      positions = items.map(function (item) {
        return {
          offset: item.offsetTop,
          element: item
        };
      });
    };

    var animatedScrollTo = function animatedScrollTo() {
      var scrollTargetY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      var _window = window,
          scrollY = _window.scrollY;
      var currentTime = 0;
      var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / defaults.duration, 0.8));

      var tick = function tick() {
        currentTime += 1 / 60;
        var p = currentTime / time;
        var t = defaults.easing(p);

        if (p < 1) {
          requestAnimationFrame(tick);
          window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
        } else {
          window.scrollTo(0, scrollTargetY);
          callback();
        }
      };

      tick();
    };

    var snapToElement = function snapToElement() {
      var _window2 = window,
          scrollY = _window2.scrollY;
      var snapElement = positions.find(function (element) {
        return element.offset - defaults.proximity <= scrollY && element.offset + defaults.proximity >= scrollY;
      });
      clearTimeout(snapTimeout);

      if (snapElement && !isScrolling) {
        snapTimeout = setTimeout(function () {
          isScrolling = true;
          animatedScrollTo(snapElement.offset, function () {
            isScrolling = !isScrolling;
          });
        }, defaults.onSnapWait);
      }
    };

    var recalculateLayout = function recalculateLayout() {
      getPositions();
      snapToElement();
    };

    var bindEvents = function bindEvents() {
      window.addEventListener('resize', recalculateLayout);
      window.addEventListener('scroll', snapToElement);
    };

    var destroy = function destroy() {
      window.removeEventListener('resize', recalculateLayout);
      window.removeEventListener('scroll', snapToElement);
    };

    var init = function init() {
      getPositions();
      bindEvents();
    };

    init();
    return {
      init: init,
      destroy: destroy,
      recalculateLayout: recalculateLayout
    };
  };

  return SnapScroll;

}));
