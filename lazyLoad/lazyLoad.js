(function() {
    let root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};

    function Lazy(options) {
        this.options = Object.assign({}, options);
        this.init();
    }

    let proto = Lazy.prototype;

    proto.init = function() {
        this.calcView();
        this.bindScrollEvent();
    }

    proto.calcView = function() {
        this.view = {
            top: 0,
            right: (root.innerWidth || document.documentElement.clientWidth),
            bottom: (root.innerHeight || document.documentElement.clientHeight),
            left: 0,
        }
    }

    let timer = null;
    proto.bindScrollEvent = function() {
        let self = this;
        let scrollEvent = root.addEventListener('scroll', this.handleLazyLoad.bind(this));

        this.event = {
            scrollEvent: scrollEvent,
        }
    }

    proto.handleLazyLoad = function() {
        let self = this;
        timer = setTimeout(function() {
            self.render();
        }, 250)
    }

    proto.checkInView = function(element) {
        let rect = element.getBoundingClientRect();

        // 元素在视图中
        return (rect.top <= this.view.bottom && rect.right >= this.view.left && rect.bottom >= this.view.top && rect.left <= this.view.right);
    }

    proto.render = function () {
        let nodes = document.querySelectorAll('[data-lazy-src], [data-lazy-background]');
        let len = nodes.length;
        let elem;
        for (let i = 0; i < len; i++){
            elem = nodes[i];
            if (this.checkInView(elem)){
                if(elem.getAttribute('data-lazy-background') !== null) {
                    elem.style.backgroundImage = `url(${elem.getAttribute('data-lazy-background')})`;
                } else if (elem.src !== (src = elem.getAttribute('data-lazy-src'))) {
                    elem.src = src;
                }

                elem.removeAttribute('data-lazy-src');
                elem.removeAttribute('data-layz-background');


            }
        }

        if (!len) {
            removeEventListener('scroll', this.event.handleLazyLoad)
        }
    }

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Lazy;
        }
        exports.Lazy = Lazy;
    } else {
        root.Lazy = Lazy;
    }
}());