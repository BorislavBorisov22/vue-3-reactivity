let total = 0;
function effect() {
  total = product.price * product.quantity;
};

let targetMap = new WeakMap();

function track(object, key) {
  let depsMap = targetMap.get(object);
  if (!depsMap) {
    targetMap.set(object, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  dep.add(effect);
}

function trigger(object, key) {
  const depsMap = targetMap.get(object);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }

  dep.forEach((eff) => eff());
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (result && oldValue != value) {
        trigger(target, key);
      }
    },
  };

  return new Proxy(target, handler);
}

const product = reactive({ quantity: 2, price: 30 });
effect();

console.log(total);

product.price = 120;

console.log(total);

