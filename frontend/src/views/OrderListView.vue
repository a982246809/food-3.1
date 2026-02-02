<template>
  <div class="orders-page">
    <van-nav-bar title="My Orders" left-arrow @click-left="$router.push('/menu')" />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list>
            <van-cell-group v-for="order in orders" :key="order.id" :title="`Order #${order.id}`">
                <van-cell title="Status" :value="order.status" />
                <van-cell title="Total" :value="order.total" />
                <van-cell title="Items" :label="order.items.map((i:any) => `${i.dish.name} x${i.quantity}`).join(', ')" />
            </van-cell-group>
             <van-empty v-if="orders.length === 0" description="No orders found" />
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const orders = ref<any[]>([]);
const refreshing = ref(false);

const fetchOrders = async () => {
    try {
        const res = await api.get('/orders');
        orders.value = res.data;
    } catch (error) {
        console.error(error);
    }
};

const onRefresh = async () => {
    await fetchOrders();
    refreshing.value = false;
};

onMounted(fetchOrders);
</script>
