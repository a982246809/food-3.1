<template>
  <div class="home">
    <van-nav-bar title="校园食堂点餐" fixed placeholder />
    <van-search v-model="searchValue" placeholder="搜索你想吃的菜品" shape="round" />

    <van-dropdown-menu>
      <van-dropdown-item v-model="selectedCanteen" :options="canteenOptions" @change="onCanteenChange" />
      <van-dropdown-item v-model="selectedWindow" :options="windowOptions" @change="fetchDishes" />
      <van-dropdown-item v-model="selectedType" :options="typeOptions" />
    </van-dropdown-menu>

    <div class="dish-list">
      <van-empty v-if="filteredDishes.length === 0" description="暂无菜品" />
      
      <van-card
        v-for="dish in filteredDishes"
        :key="dish.id"
        :num="getCartQuantity(dish.id)"
        :price="dish.price"
        :desc="dish.window?.name"
        :title="dish.name"
        :thumb="dish.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
      >
        <template #tags>
          <van-tag v-if="dish.isSpecial" plain type="danger">特价</van-tag>
          <van-tag v-if="dish.stock < 10 && dish.stock > 0" plain type="warning">紧张</van-tag>
          <van-tag plain type="primary">销量 {{ Math.floor(Math.random() * 100) + 10 }}</van-tag>
        </template>
        <template #footer>
          <van-stepper 
            v-if="getCartQuantity(dish.id) > 0" 
            :model-value="getCartQuantity(dish.id)" 
            @plus="addToCart(dish)" 
            @minus="removeFromCart(dish.id)" 
            theme="round" 
            button-size="22" 
            disable-input />
          <van-button v-else size="small" type="primary" round icon="plus" @click="addToCart(dish)">加入</van-button>
        </template>
      </van-card>
    </div>

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
import { ref, onMounted, computed } from 'vue';
import { getCanteens, getWindows, getDishes } from '../api/canteen';
import { useCartStore } from '../stores/cart';
import { storeToRefs } from 'pinia';

const searchValue = ref('');
const selectedCanteen = ref('all');
const selectedWindow = ref('all');
const selectedType = ref('all');

const canteenOptions = ref([{ text: '全部食堂', value: 'all' }]);
const windowOptions = ref([{ text: '全部窗口', value: 'all' }]);
const typeOptions = ref([
  { text: '全部分类', value: 'all' },
  { text: '荤菜', value: 'meat' },
  { text: '素菜', value: 'veg' },
]);

const dishes = ref<any[]>([]);

const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const totalCartItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const getCartQuantity = (id: string) => {
  const item = cartItems.value.find(i => i.id === id);
  return item ? item.quantity : 0;
};

const addToCart = (dish: any) => {
  cartStore.addToCart(dish);
};

const removeFromCart = (id: string) => {
  cartStore.removeFromCart(id);
};

const filteredDishes = computed(() => {
  let result = dishes.value;
  if (searchValue.value) {
    result = result.filter(d => d.name.includes(searchValue.value));
  }
  return result;
});

const fetchCanteens = async () => {
  try {
    const res: any = await getCanteens();
    const opts = res.map((c: any) => ({ text: c.name, value: c.id }));
    canteenOptions.value = [{ text: '全部食堂', value: 'all' }, ...opts];
  } catch (error) {
    console.error(error);
  }
};

const onCanteenChange = async (value: string) => {
  selectedWindow.value = 'all';
  if (value === 'all') {
    windowOptions.value = [{ text: '全部窗口', value: 'all' }];
  } else {
    try {
      const res: any = await getWindows(value);
      const opts = res.map((w: any) => ({ text: w.name, value: w.id }));
      windowOptions.value = [{ text: '全部窗口', value: 'all' }, ...opts];
    } catch (error) {
      console.error(error);
    }
  }
  fetchDishes();
};

const fetchDishes = async () => {
  try {
    const windowId = selectedWindow.value !== 'all' ? selectedWindow.value : undefined;
    const res: any = await getDishes(windowId);
    
    // Filter by canteen if a specific canteen is selected but no specific window
    if (selectedCanteen.value !== 'all' && selectedWindow.value === 'all') {
      dishes.value = res.filter((d: any) => d.window?.canteenId === selectedCanteen.value);
    } else {
      dishes.value = res;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCanteens();
  fetchDishes();
});
</script>

<style scoped>
.home {
  background-color: #f7f8fa;
  min-height: 100vh;
}
.dish-list {
  padding: 10px;
}
.van-card {
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
:deep(.van-card__title) {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}
:deep(.van-card__price) {
  color: #ee0a24;
  font-size: 16px;
  font-weight: bold;
}
</style>
