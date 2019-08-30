(function(){
  var root = (typeof self == 'object' && self.self == self && self) ||
             (typeof global == 'object' && global.global == global && global) ||
             this ||
             {};

  function EventEmitter () {
    this.__events = Object.create(null);
  }

  EventEmitter.prototype.on = function(event, listener) {
    var listeners = this.__events[event] = this.__events[event] || [];
    listeners.push(listener);
    console.log(this.__events)
  }

  EventEmitter.prototype.emit = function(event, ages) {
    var listeners = this.__events[event];
    if (!listeners) return false;
    try {
      listeners.forEach((listener) => {
        listener.apply(this, ages);
      })
    } catch (error) {
      console.log(error);
    }
  }

  EventEmitter.prototype.once = function(event, listener) {
    
  }
  
  function ProgerssIndicator(options) {
    this.options = {...this.constructor.defaultOptions, ...options};
    this.init();
  }

  ProgerssIndicator.defaultOptions = {
    color: '#1890ff',
  }

  var proto = ProgerssIndicator.prototype = new EventEmitter();

  proto.init = function () {
    this.createIndicator();
    var widht = this.calcWidthPrecent();
    this.setWidth(widht);
    this.bindScrollEvent();
  }

  proto.calcWidthPrecent = function () {
    // 文档高度
    var docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
    // 视窗高度
    var viewHeight = document.innerHeight || document.documentElement.clientHeight;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.sHeight = Math.max(docHeight - viewHeight, 0);
    return scrollTop / this.sHeight;

  }


  proto.createIndicator = function () {
    var div = document.createElement('div');
    div.style.cssText = 'position: fixed; top: 0; left: 0; height: 6px;';
    div.style.backgroundColor = this.options.color;
    this.element = div;
    document.body.appendChild(div);
  }

  proto.setWidth = function (per) {
    this.element.style.width = `${per * 100}%`;
  }

  proto.bindScrollEvent = function () {
    var self = this;
    var prev;
    window.addEventListener('scroll', function() {
      requestAnimationFrame(function() {
        var per = window.pageYOffset / (window.document.documentElement.scrollHeight - window.innerHeight);
        if (per == prev) return;  
        if (prev && per == 1) {
          self.emit('end');
        }
        prev = per;
        self.setWidth(per);
      })
    })
  }
  

  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = ProgerssIndicator;
    }
    exports.ProgerssIndicator = ProgerssIndicator;
  } else {
    root.ProgerssIndicator = ProgerssIndicator;
  }
}())