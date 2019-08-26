 export default class EventEmitter {
   
  /**
   * 监听器数组
   * @var Array
   */
  private  listeners: {
    [propName: string]: [{
      listener: () => void;
      once: boolean
    }?];
  }

  /**
   * 最大监听器数量
   */
  private MaxListeners: number;
  constructor() {
    this.listeners = Object.create(null);
    this.MaxListeners = 10;
  }

  on(event: string, listener: any) {
    const isValidListener = (listener: any): boolean => {
      if (typeof listener === 'function') {
        return true
      } else if (typeof listener === 'object') {
        return isValidListener(listener.listener)
      } else {
        return false
      }
    }

    if (!isValidListener(listener)) {
      throw new TypeError('listener 必须是函数');
    }

    const listeners = this.listeners[event] = this.listeners[event] || [];
    const listenerIsWrapped = typeof listener === 'object';
    

    listeners.push(listenerIsWrapped ? listener : {
      listener: listener,
      once: false
    });

    if (this.listeners[event].length > this.MaxListeners) {
      console.warn('MaxListeners');
    }
    return this;
  }

  addListener(event: string, listener: any) {
    this.on(event, listener);
  }

  once(event: string, listener: () => void){
    this.on(event, {
      listener,
      once: true
    })
  }

  removeListener(event: string, listener: any) {
    const listeners = this.listeners[event];
    if (!listeners) return this;
    let removeIndex = -1;
    for (let i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].listener === listener) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex < 0) return this;

    listeners.splice(removeIndex, 1);
    return this;
  }

  removeAllListeners(event?: string | Array<string>){
    const listeners = this.listeners;
    if (!event) {
      this.listeners = Object.create(null);
    } else if (typeof event === 'string') {
      listeners[event] = [];
    } else if (Array.isArray(event)) {
      listeners[event[0]] = [];
    }
    return this;
  }

  emit(event: string, args?: Array<any>) {
    const listeners = this.listeners[event];
    if (!listeners) return false;
    try {
      listeners.forEach((listener, i) => {
        listener.listener.apply(this, args);
        if (listener.once) {
          this.removeListener(event, listener.listener)
        }
      });
      return true;
    } catch (error) {
      throw new TypeError (error);
    }
  }

  listenersShow (event?: string) {
    const listeners = this.listeners;
    if (!event) {
      return [] as [];
    } else {
      return listeners[event];
    }
  }

  setMaxListeners(n: number) {
    this.MaxListeners = n;
  }
}