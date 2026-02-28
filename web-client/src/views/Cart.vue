<template>
  <div class="cart-container">
    <van-nav-bar title="购物车" fixed placeholder />
    
    <div v-if="cartItems.length > 0" class="cart-content">
      <van-swipe-cell v-for="item in cartItems" :key="item.id">
        <van-card
          :price="item.price"
          :desc="item.window?.name || '食堂窗口'"
          :title="item.name"
          class="goods-card"
          :thumb="item.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
        >
          <template #footer>
            <van-stepper 
              :model-value="item.quantity" 
              theme="round" 
              button-size="22" 
              disable-input
              @plus="cartStore.addToCart(item)"
              @minus="cartStore.removeFromCart(item.id)"
            />
          </template>
        </van-card>
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" @click="removeItem(item.id)" />
        </template>
      </van-swipe-cell>
      
      <van-field
        v-model="remark"
        rows="2"
        autosize
        label="备注"
        type="textarea"
        maxlength="50"
        placeholder="请输入口味备注等"
        show-word-limit
        class="remark-field"
      />
      
      <van-cell title="取餐时间" is-link :value="pickupTimeText" @click="showTimePicker = true" />
      <van-popup v-model:show="showTimePicker" position="bottom">
        <van-picker
          :columns="timeColumns"
          @confirm="onTimeConfirm"
          @cancel="showTimePicker = false"
        />
      </van-popup>
    </div>
    
    <van-empty v-else description="购物车还是空的" />

    <van-submit-bar 
      v-if="cartItems.length > 0"
      :price="totalPrice * 100" 
      button-text="提交订单" 
      @submit="onSubmit" 
      :loading="isSubmitting"
      class="submit-bar"
    />

    <!-- Padding for bottom tabbar -->
    <div style="height: 50px;"></div>

    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="shop-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/cart" icon="cart-o" :badge="totalCartItems || ''">购物车</van-tabbar-item>
      <van-tabbar-item replace to="/orders" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { storeToRefs } from 'pinia';
import { showToast, showSuccessToast } from 'vant';
import request from '../api/request';

const router = useRouter();
const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const remark = ref('');
const showTimePicker = ref(false);
const pickupTimeText = ref('立即取餐');
const isSubmitting = ref(false);

const timeColumns = [
  { text: '立即取餐', value: 'now' },
  { text: '10分钟后', value: '10' },
  { text: '20分钟后', value: '20' },
  { text: '30分钟后', value: '30' }
];

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const totalCartItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const removeItem = (id: string) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    for (let i = 0; i < item.quantity; i++) {
        cartStore.removeFromCart(id);
    }
  }
};

const onTimeConfirm = ({ selectedOptions }: any) => {
  pickupTimeText.value = selectedOptions[0].text;
  showTimePicker.value = false;
};

const onSubmit = async () => {
  if (cartItems.value.length === 0) {
    showToast('购物车为空');
    return;
  }
  
  // Create an order for the first window implementation 
  // (assuming all items from same window for now to simplify mvp)
  const windowId = cartItems.value[0].windowId || 'dummy-window-id';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  isSubmitting.value = true;
  try {
    await request.post('/order', {
      studentId: user.id,
      windowId: windowId,
      items: cartItems.value,
      totalPrice: totalPrice.value,
      remark: remark.value,
      pickupTime: pickupTimeText.value === '立即取餐' ? new Date() : new Date(Date.now() + 10 * 60000)
    });
    
    showSuccessToast('下单成功');
    cartStore.clearCart();
    router.push('/orders');
  } catch (error) {
    console.error('Order creation failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 100px;
}
.cart-content {
  padding-top: 10px;
}
.goods-card {
  margin: 0 16px 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.delete-button {
  height: 100%;
}
.remark-field {
  margin-top: 12px;
}
.submit-bar {
  bottom: 50px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
</style>
