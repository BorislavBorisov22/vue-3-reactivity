function reactivity() {
  const targetMap = new WeakMap();
  let activeEffect = null;

  function effect(eff) {
    if (typeof eff !== 'function') {
      throw new Error('Invalid effect type, must be a callback function!');
    }

    activeEffect = eff;
    activeEffect();
    activeEffect = null;
  }

  function track(target, key) {
    if (!activeEffect) {
      return;
    }

    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }

    dep.add(activeEffect);
  }

  function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }

    const dep = depsMap.get(key);
    if (!dep) {
      return;
    }

    dep.forEach(eff => {
      eff();
    });
  }

  function reactive(target) {
    const proxyHandler = {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        track(target, key);
        return result;
      },
      set(target, key, value, receiver) {
        const oldValue = target[key];
        const setResult = Reflect.set(target, key, value, receiver);
        if (setResult && value != oldValue) {
          trigger(target, key);
        }

        return setResult;
      }
    };

    return new Proxy(target, proxyHandler);
  }

  function ref(raw) {
    // const r = {
    //   get value() {
    //     track(r, 'value');
    //     return raw;
    //   },
    //   set value(newValue) {
    //     raw = newValue;
    //     trigger(r, 'value');
    //   }
    // };

    // return r;
    return reactive({ value: raw });
  }

  return {
    track,
    trigger,
    reactive,
    effect,
    ref,
    targetMap
  };
}

const { effect, track, trigger, reactive, ref, targetMap, } = reactivity();

const rawProduct = { price: 10, quantity: 2 };
const product = reactive(rawProduct);
let salePrice = ref(0);
let total = 0;

effect(() => {
  total = salePrice.value * product.quantity;
});

effect(() => {
  salePrice.value = product.price * 0.9;
});

function a() {
  salePrice;
  product;
}

// product.price = 33;
// salePrice.value = 13;