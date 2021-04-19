import { reactive, computed, ref, effect } from "./final/index.js";

const product = reactive({ price: 10, quantity: 2 });
const salePrice = ref(0);
let total = 0;
// const salePrice = computed(() => product.price * 0.9);
// const total = computed(() => salePrice.value * product.quantity);

// console.log(
//   `Initially - salePrice: ${salePrice.value} (should be 9), total: ${total.value} (should be 18)`
// );

// product.price = 20;

// console.log(
//   `After price update - salePrice: ${salePrice.value} (should be 18), total ${total.value} (should be 36)`
// );

// product.quantity = 10;

// console.log(
//   `After quantity update - salePrice: ${salePrice.value} (should be 18), total ${total.value} (should be 180)`
// );

// testing if active effect is correctly caught when setter is called inside effect call
effect(() => {
  console.log('effect1');
  total = salePrice.value * product.quantity;
});

effect(() => {
  console.log('effect2');
  salePrice.value = product.price * 0.9
});

console.log(total, salePrice.value);

// testing for cyclic depenencies - are they cut when old and new value of setter is the same to stop triggering the registered effects

const a = ref(0);
const b = ref(0);

effect(() => {
  console.log(a.value);
  b.value = 1;
});

effect(() => {
  console.log(b.value);
  a.value = 1;
});