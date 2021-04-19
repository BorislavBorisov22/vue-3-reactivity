import { track, trigger } from './effects.js';

export function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (result && oldValue !== value) {
        trigger(target, key);
      }

      return result;
    }
  }

  return new Proxy(target, handlers);
}