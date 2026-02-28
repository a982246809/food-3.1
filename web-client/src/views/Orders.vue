<template>
  <div class="orders-container">
    <van-nav-bar title="我的订单" fixed placeholder />

    <van-tabs v-model:active="activeTab" sticky offset-top="46">
      <van-tab title="全部" name="ALL"></van-tab>
      <van-tab title="进行中" name="ACTIVE"></van-tab>
      <van-tab title="待取餐" name="READY"></van-tab>
      <van-tab title="已完成" name="COMPLETED"></van-tab>
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="order-list">
          <van-cell-group v-for="order in displayOrders" :key="order.id" class="order-card" inset>
            <van-cell :title="order.window?.canteen?.name + ' - ' + order.window?.name" :value="getStatusText(order.status)" :value-class="'status-' + order.status.toLowerCase()" />
            <div class="order-items">
              <div v-for="(item, index) in order.items" :key="index" class="order-item">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">x{{ item.quantity }}</span>
              </div>
            </div>
            <van-cell title="总价" :value="`¥${order.totalPrice}`" class="order-total" />
            <div class="order-actions" v-if="order.status === 'READY'">
                <van-button size="small" type="primary" plain round class="action-btn">确认取餐</van-button>
            </div>
          </van-cell-group>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- Bottom Padding -->
    <div style="height: 50px;"></div>

    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="shop-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item replace to="/orders" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import request from '../api/request';

const activeTab = ref('ALL');
const orders = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const displayOrders = computed(() => {
  if (activeTab.value === 'ALL') return orders.value;
  if (activeTab.value === 'ACTIVE') return orders.value.filter(o => o.status === 'PENDING' || o.status === 'PREPARING');
  return orders.value.filter(o => o.status === activeTab.value);
});

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: '待接单',
    PREPARING: '制作中',
    READY: '待取餐',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  };
  return map[status] || status;
};

const fetchOrders = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const res: any = await request.get(`/order`);
        orders.value = res.filter((o:any) => o.studentId === user.id);
    } catch(err) {
        console.error(err);
    }
};

const onLoad = async () => {
  if (refreshing.value) {
    orders.value = [];
    refreshing.value = false;
  }
  
  await fetchOrders();
  loading.value = false;
  finished.value = true;
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};
</script>

<style scoped>
.orders-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.order-list {
  padding: 12px 0;
}

.order-card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.order-items {
  padding: 12px 16px;
  background-color: #fdfdfd;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.item-qty {
  color: #999;
}

.order-total {
  font-weight: bold;
}

.order-actions {
  padding: 10px 16px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  padding: 0 20px;
}

/* Status colors */
:deep(.status-pending) { color: #f29c1f; }
:deep(.status-preparing) { color: #1989fa; }
:deep(.status-ready) { color: #07c160; }
:deep(.status-completed) { color: #999; }
:deep(.status-cancelled) { color: #ebedf0; }
</style>
