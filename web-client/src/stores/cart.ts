import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<any[]>([]);

  const addToCart = (dish: any) => {
    const existingItem = cartItems.value.find(item => item.id === dish.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.value.push({ ...dish, quantity: 1 });
    }
  };

  const removeFromCart = (dishId: string) => {
    const index = cartItems.value.findIndex(item => item.id === dishId);
    if (index !== -1) {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity -= 1;
      } else {
        cartItems.value.splice(index, 1);
      }
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  return { cartItems, addToCart, removeFromCart, clearCart };
});
