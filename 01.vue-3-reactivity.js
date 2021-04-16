let product = {
  price: 5,
  quantity: 2,
};

let total = 0;

let effect = () => {
  total = product.price * product.quantity;
};

let targetMap = new WeakMap();

function track(object, key, eff) {
  let depsMap = targetMap.get(object);
  if (!depsMap) {
    targetMap.set(object, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  dep.add(eff);
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

  dep.forEach(eff => eff());
}

// track(product, 'price', effect);
// product.price = 102;
// trigger(product, 'price', effect);
// product.quantity = 55;
// trigger(product, 'price', effect);
// console.log(total);