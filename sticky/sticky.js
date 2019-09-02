(function () {
  let root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this || {};

  function Sticky(element, options) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {...this.constructor.defaultOptions, ...options};
    this.init();
  }

  Sticky.defaultOptions = {
    offset: 0
  }

  let proto = Sticky.prototype;

  proto.init = function () {
    this.calcElement();
    this.bindScrollEvent();
  }

  proto.calcElement = function () {
    var rect = this.element.getBoundingClientRect();
    this.eLeft = rect.left + window.pageXOffset;
    this.eTop = rect.top + window.pageYOffset - this.options.offset;
    console.log(this.eTop)
  }

  proto.setSticky = function () {
    if (this.status === 'sticky') return;
    this.status = 'sticky';
    this.element.classList.add('aa');
    this.element.style.position = 'fixed';
    this.element.style.top = this.options.offset + 'px';
    this.element.style.left = this.eLeft + 'px';
  }

  proto.setNormal = function () {
    if (this.status !== 'sticky') return;
    this.status = 'normal';
    this.element.classList.remove('aa')
    this.element.style.removeProperty('position');
    this.element.style.removeProperty('top');
    this.element.style.removeProperty('left');
  }

  proto.bindScrollEvent = function () {
    let self = this;
    addEventListener('scroll', function () {
      if (this.window.pageYOffset > self.eTop) {
        self.setSticky();
      } else {
        self.setNormal();
      }
    })
  }


  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
      module = module.exports = Sticky;
    }
    exports.Sticky = Sticky;
  } else {
    root.Sticky = Sticky
  }
}());