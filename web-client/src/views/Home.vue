<template>
  <div class="home">
    <van-nav-bar title="校园食堂点餐" fixed placeholder />
    <van-search v-model="searchValue" placeholder="搜索你想吃的菜品" shape="round" />

    <van-dropdown-menu>
      <van-dropdown-item v-model="selectedCanteen" :options="canteenOptions" @change="onCanteenChange" />
    </van-dropdown-menu>

    <div class="window-list">
      <van-empty v-if="filteredWindows.length === 0" description="暂无窗口" />

      <div v-for="win in filteredWindows" :key="win.id" class="window-section">
        <!-- 窗口标题卡片 -->
        <div class="window-header">
          <div class="window-header-left">
            <van-icon name="shop-o" size="20" color="#1989fa" />
            <span class="window-name">{{ win.name }}</span>
          </div>
          <div class="window-header-right">
            <van-tag v-if="win.merchants?.length" type="primary" plain size="medium">
              {{ win.merchants.map((m: any) => m.username).join('、') }}
            </van-tag>
            <van-tag v-if="win.canteen" type="success" plain size="medium">
              {{ win.canteen.name }}
            </van-tag>
          </div>
        </div>

        <!-- 菜品列表 -->
        <div class="dish-grid">
          <van-empty v-if="getWindowDishes(win).length === 0" description="暂无在售菜品" image="search" :image-size="60" />
          <van-card
            v-for="dish in getWindowDishes(win)"
            :key="dish.id"
            :num="getCartQuantity(dish.id)"
            :price="dish.price"
            :title="dish.name"
            :thumb="dish.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
          >
            <template #tags>
              <van-tag v-if="dish.isSpecial" plain type="danger">特价</van-tag>
              <van-tag v-if="dish.stock < 10 && dish.stock > 0" plain type="warning">紧张</van-tag>
            </template>
            <template #footer>
              <van-stepper
                v-if="getCartQuantity(dish.id) > 0"
                :model-value="getCartQuantity(dish.id)"
                @plus="addToCart(dish, win)"
                @minus="removeFromCart(dish.id)"
                theme="round"
                button-size="22"
                disable-input />
              <van-button v-else size="small" type="primary" round icon="plus" @click="addToCart(dish, win)">加入</van-button>
            </template>
          </van-card>
        </div>
      </div>
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
import { getCanteens, getWindows } from '../api/canteen';
import { useCartStore } from '../stores/cart';
import { storeToRefs } from 'pinia';

const searchValue = ref('');
const selectedCanteen = ref('all');

const canteenOptions = ref([{ text: '全部食堂', value: 'all' }]);

const windows = ref<any[]>([]);

const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const totalCartItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const getCartQuantity = (id: string) => {
  const item = cartItems.value.find(i => i.id === id);
  return item ? item.quantity : 0;
};

const addToCart = (dish: any, win: any) => {
  cartStore.addToCart({
    ...dish,
    window: { id: win.id, name: win.name, canteenId: win.canteenId },
  });
};

const removeFromCart = (id: string) => {
  cartStore.removeFromCart(id);
};

// 获取窗口内搜索过滤后的菜品
const getWindowDishes = (win: any) => {
  if (!win.dishes) return [];
  if (!searchValue.value) return win.dishes;
  return win.dishes.filter((d: any) => d.name.includes(searchValue.value));
};

// 过滤掉没有匹配菜品的窗口（搜索时）
const filteredWindows = computed(() => {
  if (!searchValue.value) return windows.value;
  return windows.value.filter(win => {
    return win.dishes?.some((d: any) => d.name.includes(searchValue.value));
  });
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

const onCanteenChange = async () => {
  fetchWindows();
};

const fetchWindows = async () => {
  try {
    const canteenId = selectedCanteen.value !== 'all' ? selectedCanteen.value : undefined;
    const res: any = await getWindows(canteenId);
    windows.value = res;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCanteens();
  fetchWindows();
});
</script>

<style scoped>
.home {
  background-color: #f5f6fa;
  min-height: 100vh;
}

.window-list {
  padding: 10px;
}

.window-section {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
  border-bottom: 1px solid #eef3f8;
}

.window-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.window-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.window-header-right {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dish-grid {
  padding: 8px;
}

.van-card {
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 8px;
  box-shadow: none;
}

:deep(.van-card__title) {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 4px;
}
:deep(.van-card__price) {
  color: #ee0a24;
  font-size: 16px;
  font-weight: bold;
}
</style>
