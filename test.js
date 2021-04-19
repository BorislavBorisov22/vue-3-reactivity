import { reactive, computed, ref, effect } from "./final/index.js";

const product = reactive({ price: 10, quantity: 2 });
const salePrice = computed(() => product.price * 0.9);
const total = computed(() => salePrice.value * product.quantity);

console.log(
  `Initially - salePrice: ${salePrice.value} (should be 9), total: ${total.value} (should be 18)`
);

product.price = 20;

console.log(
  `After price update - salePrice: ${salePrice.value} (should be 18), total ${total.value} (should be 36)`
);

product.quantity = 10;

console.log(
  `After quantity update - salePrice: ${salePrice.value} (should be 18), total ${total.value} (should be 180)`
);
