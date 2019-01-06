(function() {
  'use strict';

  function SnapScroll(selector, options) {
    var settings = Object.assign({
      proximity: 100,
      duration: 200,
      easing: function(time) {
        return time;
      },
      onSnapWait: 50
    }, options);

    var items = document.querySelectorAll(selector);
    var positions = [];
    var snapTimeout;
    var isScrolling;

    function getPositions() {
      positions = [];

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items.item(i);

        positions.push({
          offset: item.offsetTop,
          element: item
        });
      }
    }

    function animatedScrollTo(scrollTargetY, callback) {
      scrollTargetY = scrollTargetY || 0;

      var scrollY = window.scrollY;
      var currentTime = 0;
      var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / settings.duration, 0.8));

      function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = settings.easing(p);

        if (p < 1) {
          requestAnimationFrame(tick);

          window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
          window.scrollTo(0, scrollTargetY);
          callback();
        }
      }
      tick();
    }

    function snapToElement() {
      var scrollY = window.scrollY;
      var snapElement = positions.filter(function(element) {
        return element.offset - settings.proximity <= scrollY && element.offset + settings.proximity >= scrollY;
      });

      clearTimeout(snapTimeout);

      if (snapElement.length && !isScrolling) {
        snapTimeout = setTimeout(function() {
          isScrolling = true;
          animatedScrollTo(snapElement[0].offset, function() {
            isScrolling = !isScrolling;
          });
        }, settings.onSnapWait);
      }
    }

    function bindEvents() {
      window.addEventListener('scroll', snapToElement);
    }

    getPositions();
    bindEvents();
  }

  if (typeof define === 'function') {
    define(SnapScroll);
  } else if (typeof module !== 'undefined') {
    module.exports = SnapScroll;
  } else {
    window.SnapScroll = SnapScroll;
  }
})();
