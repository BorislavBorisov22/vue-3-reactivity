import { track, trigger } from './effects.js';

export function ref(raw) {
  const r = {
    get value() {
      track(r, 'value');
      return raw;
    },
    set value(newValue) {
      const oldValue = raw;
      raw = newValue;
      if (oldValue !== raw) {
        trigger(r, 'value');
      }
    }
  };

  return r;
}