import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
  merchantId: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

  function addToCart(dish: any) {
    const existing = items.value.find((i) => i.dishId === dish.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({
        dishId: dish.id,
        name: dish.name,
        price: Number(dish.price),
        quantity: 1,
        merchantId: dish.merchantId,
      });
    }
  }

  function removeFromCart(dishId: number) {
    const index = items.value.findIndex((i) => i.dishId === dishId);
    if (index > -1) {
      if (items.value[index].quantity > 1) {
        items.value[index].quantity--;
      } else {
        items.value.splice(index, 1);
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return { items, totalCount, totalPrice, addToCart, removeFromCart, clearCart };
});
