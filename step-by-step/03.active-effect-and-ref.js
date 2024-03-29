function reactivity() {
  const targetMap = new WeakMap();
  let activeEffect = null;
  let activeSetter = false;

  function effect(eff) {
    activeEffect = eff;
    activeEffect();
    activeEffect = null;
  }

  function track(target, key) {
    if (!activeEffect || activeSetter) {
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

  function triggerEffects(target, key) {
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

  function trigger(target, key) {
    activeSetter = true;
    triggerEffects(target, key);
    activeSetter = false;
  }

  function reactive(target) {
    const handler = {
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

    return new Proxy(target, handler);
  }

  function ref(raw, name) {
    const r = {
      get value() {
        track(r, 'value');
        return raw;
      },
      set value(newValue) {
        const oldValue = raw;
        raw = newValue;
        if (newValue !== oldValue) {
          trigger(r, 'value');
        }
      }
    }

    return r;
  }

  function computed(computeFn) {
    let computedValue = ref(null);
    effect(() => {
      computedValue.value = computeFn();
    });

    return computedValue;
  }

  return { effect, reactive, ref, computed, targetMap, };
}

const { effect, reactive, ref } = reactivity();

const product = reactive({ price: 10, quantity: 2 });

effect(() => {
  console.log('effect1');
  total = salePrice.value * product.quantity;
});

effect(() => {
  console.log('effect2');
  salePrice.value = product.price * 0.9;
});

product.price = 20;
product.quantity = 3;
console.log(salePrice.value, total);
