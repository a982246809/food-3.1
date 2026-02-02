<template>
  <div class="menu-page">
    <van-nav-bar title="Campus Canteen" />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="No more dishes"
        @load="onLoad"
      >
        <van-card
          v-for="dish in dishes"
          :key="dish.id"
          :price="dish.price"
          :desc="dish.description"
          :title="dish.name"
          :thumb="dish.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
        >
          <template #tags>
            <van-tag plain type="primary">Stock: {{ dish.stock }}</van-tag>
          </template>
          <template #footer>
            <van-button size="mini" @click="cartStore.addToCart(dish)">Add to Cart</van-button>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>

    <van-action-bar>
      <van-action-bar-icon icon="cart-o" text="Cart" :badge="cartStore.totalCount" to="/cart" />
      <van-action-bar-button type="danger" text="Checkout" to="/cart" />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import api from '../api';

const dishes = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const cartStore = useCartStore();

const onLoad = async () => {
    try {
        const res = await api.get('/dishes');
        dishes.value = res.data;
        finished.value = true; // For simplicity, assume all loaded at once
    } catch (e) {
        console.error(e);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
  refreshing.value = false;
};
</script>

<style scoped>
.menu-page {
  padding-bottom: 50px; /* Space for action bar */
}
</style>
