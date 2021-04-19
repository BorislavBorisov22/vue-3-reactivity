const targetMap = new WeakMap();
let activeEffect = null;
let skipTrack = false;

export function effect(eff) {
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
}

export function track(target, key) {
  if (skipTrack || activeEffect == null) {
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

function runEffects(dep) {
  skipTrack = true;
  dep.forEach(eff => eff());
  skipTrack = false;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }

  runEffects(dep);
}