(function () {
  let root = (typeof self === 'object' && self.self == self && self) ||
    (typeof global === 'object' && global.global == global && global) ||
    this || {};


  function PullToRefresh(options) {
    this.options = Object.assign({}, this.constructor.defaultOptions, options);
    this.init();
  }

  PullToRefresh.defaultOptions = {
    // 下拉时的文字
    pullText: "下拉以刷新页面",
    // 下拉时的图标
    pullIcon: "&#8675;",
    // 释放前的文字
    relaseText: "释放以刷新页面",
    // 释放后的文字
    refreshText: "刷新",
    // 释放后的图标
    refreshIcon: "&hellip;",
    // 当大于 60px 的时候才会触发 relase 事件
    threshold: 60,
    // 最大可以拉到 80px 的高度
    max: 80,
    // 释放后，高度回到 50px
    reloadHeight: 50
  }

   // 记录当前状态 pending/pulling/releasing/refreshing
  let _state = 'pending';
  let pullStartY = null;
  let pullMoveY = null;
  // 手指移动的距离
  let dist = 0;
  // refresh-element 要移动的距离，跟手指距离的值不同，因为要有阻尼效果
  let distResisted = 0;

  let proto = PullToRefresh.prototype;

  proto.init = function () {
    this.createRefreshElement();
    this.setRefreshStyle();
    this.refreshElem = document.getElementById('refresh-element');
    this.bindEvent();
  }

  proto.createRefreshElement = function () {
    let elem = document.createElement('div');
    document.body.insertBefore(elem, document.body.firstChild);
    elem.className = 'refresh-element';
    elem.id = 'refresh-element';
    elem.innerHTML = '<div class="refresh-box"><div class="refresh-content"><div class="refresh-icon"></div><div class="refresh-text"></div></div></div>';
  }

  proto.setRefreshStyle = function () {
    let styleElem = document.createElement('style');
    styleElem.setAttribute('id', 'refresh-element-style');
    document.head.appendChild(styleElem);
    styleElem.textContent = '.refresh-element {pointer-events: none; font-size: 0.85em; top: 0; height: 0; transition: height 0.3s, min-height 0.3s; text-align: center; width: 100%; overflow: hidden; color: #fff; } .refresh-box {padding: 10px; } .pull {transition: none; } .refresh-text {margin-top: .33em; } .refresh-icon {transition: transform .3s; } .release .refresh-icon {transform: rotate(180deg); }';

  };

  proto.bindEvent = function() {
    window.addEventListener('touchstart', this);
    window.addEventListener('touchmove', this, { passive: false });
    window.addEventListener('touchend', this);
  }

  proto.handleEvent = function(event) {
    let method = 'on' + event.type;
    if (this[method]) {
        this[method](event);
    }
  };

  proto.update = function() {
    let iconEl = this.refreshElem.querySelector('.refresh-icon');
    let textEl = this.refreshElem.querySelector('.refresh-text');

    if (_state === 'refreshing') {
      iconEl.innerHTML = this.options.refreshIcon;
      textEl.innerHTML = this.options.refreshText;
    } else {
      iconEl.innerHTML = this.options.pullIcon;
    }

    // 释放以刷新
    if (_state === 'releasing') {
      textEl.innerHTML = this.options.relaseText;
    }

    if (_state === 'pulling' || _state === 'pending') {
      textEl.innerHTML = this.options.pullText;
    }
  }

  proto.resistanceFunction = function(t) {
    return Math.min(1, t / 2.5);
  };

  proto.ontouchstart = function(e){
    if (!window.scrollY) {
      pullStartY = e.touches[0].screenY;
    }
    this._state = 'pending'
    this.update();
  }

  proto.ontouchmove = function(e) {
    pullMoveY = e.touches[0].screenY;

    if (_state === 'pending') {
      this.refreshElem.classList.add('pull');
      _state = 'pulling';
      this.update();
    }
    
    if (pullStartY && pullMoveY) {
      dist = pullMoveY - pullStartY;
    }

    if (dist > 0) {
      
      e.preventDefault();
      this.refreshElem.style.minHeight = distResisted + "px";

      distResisted = this.resistanceFunction(dist / this.options.threshold) * Math.min(this.options.max, dist); //最大是80

      if (_state === 'pulling' && distResisted > this.options.threshold) {
        this.refreshElem.classList.add('release');
        _state = 'releasing';
        this.update();
      }

      if (_state === 'releasing' && distResisted < this.options.threshold) {
        this.refreshElem.classList.remove('release');
        _state = 'pulling';
        this.update();
      }
    }
  }

  proto.ontouchend = function(e) {
    if (_state === 'releasing') {
      _state = 'refreshing';

      this.refreshElem.style.minHeight = this.options.reloadHeight + 'px';
      this.refreshElem.classList.add('refresh');
      if (typeof this.options.onRefresh === 'function') {
        this.options.onRefresh(this.onReset.bind(this));
      }  
    } else {
      this.refreshElem.style.minHeight = '0px';
      _state = 'pending'
    }

    this.update();
    this.refreshElem.classList.remove('release');
    this.refreshElem.classList.remove('pull');

    pullStartY = pullMoveY = null;
    dist = distResisted = 0;
  }

  proto.onReset = function(){
    this.refreshElem.classList.remove('refresh');
    this.refreshElem.style.minHeight = '0px';
    _state = 'pending';
  }


  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module && module.exports) {
      exports = module.exports = PullToRefresh;
    }
    exports.PullToRefresh = PullToRefresh;
  } else {
    root.PullToRefresh = PullToRefresh;
  }
}())