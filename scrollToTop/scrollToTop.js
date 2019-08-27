(function(){
  var root = (typeof self == 'object' && self.self == self && self) ||
             (typeof global == 'object' && global.global == global && global) ||
             this ||
             {};

  var util = {
    setOpacity: function(ele, opacity) {
      if (ele.style.opacity != undefined) {
        ele.style.opacity = opacity / 100;
      } else {
        ele.style.filter = `alpha(opacity=${opacity})`;
      }
    },
    fadeIn: function(ele, speed) {
      var opacity = 0;
      var timer;
      function step() {
        util.setOpacity(ele, opacity += speed);
        if (opacity < 100) {
          timer = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(timer);
        }
      }
      requestAnimationFrame(step);
    },
    fadeOut: function(ele, speed) {
      var opacity = 100;
      var timer;
      function step() {
        util.setOpacity(ele, opacity -= speed);
        if (opacity > 0) {
          timer = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(timer);
        }
      }
      requestAnimationFrame(step);
    }
  }
             
  function ScrollToTop (element, options) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {...this.constructor.defaultOptions, options};
    this.init();
  }

  ScrollToTop.VERSION = '1.0.0';

  ScrollToTop.defaultOptions = {
    showWhen: 100,
    speed: 100,
    fadeSpeed: 10,
  }

  var proto = ScrollToTop.prototype;

  proto.init = function() {
    this.hideElement();
    this.bindScrollEvent();
    this.bindToTopEvent();
  }

  proto.hideElement = function() {
    util.setOpacity(this.element, 0);
    this.status = 'hide';
  }

  proto.bindScrollEvent = function() {
    var self = this;
    window.addEventListener('scroll', function() {
      if (this.pageYOffset > self.options.showWhen) {
        if (self.status === 'hide') {
          util.fadeIn(self.element, self.options.fadeSpeed);
          self.status = 'show';
        }
      } else {
        if (self.status === 'show') {
          util.fadeOut(self.element, self.options.fadeSpeed);
          self.status = 'hide';
        }
      }
    });
  }

  proto.handleBack = function() {
    var timer, self = this;
    timer = requestAnimationFrame(function fn() {
      var oTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (oTop > 0) {
        document.body.scrollTop = document.documentElement.scrollTop = oTop - self.options.speed;
        requestAnimationFrame(fn);
      } else {
        cancelAnimationFrame(timer)
      }
    })
  }

  proto.bindToTopEvent = function() {
    var self = this;
    self.element.addEventListener('click', self.handleBack.bind(self));
  }

  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = ScrollToTop;
    }
    exports.ScrollToTop = ScrollToTop;
  } else {
    root.ScrollToTop = ScrollToTop;
  }
}());