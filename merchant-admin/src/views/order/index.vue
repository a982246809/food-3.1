<script setup lang="ts">
import { h, onMounted, onUnmounted, ref } from 'vue';
import { NButton, NCard, NDataTable, NSpace, NTag, NModal, NDescriptions, NDescriptionsItem, useMessage } from 'naive-ui';
import { request } from '../../service/request';

const message = useMessage();
const loading = ref(false);
const orders = ref([]);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res: any = await request<any>({ url: '/order', method: 'GET' });
    if (!res.error) {
      orders.value = res.data || res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleAccept = async (id: string) => {
  try {
    await request<any>({ url: `/order/${id}`, method: 'PATCH', data: { status: 'PREPARING' } });
    message.success('已接单，制作中');
    fetchOrders();
  } catch (error) {
    console.error(error);
    message.error('接单失败');
  }
};

const handleReady = async (id: string) => {
  try {
    await request<any>({ url: `/order/${id}`, method: 'PATCH', data: { status: 'READY' } });
    message.success('已准备好，待取餐');
    fetchOrders();
  } catch (error) {
    console.error(error);
    message.error('操作失败');
  }
};

const handleComplete = async (id: string) => {
  try {
    await request<any>({ url: `/order/${id}`, method: 'PATCH', data: { status: 'COMPLETED' } });
    message.success('订单已完成');
    fetchOrders();
  } catch (error) {
    console.error(error);
    message.error('操作失败');
  }
};

const handleRefund = async (id: string) => {
  try {
    await request<any>({ url: `/order/${id}/refund`, method: 'POST' });
    message.success('退款成功');
    fetchOrders();
  } catch (error) {
    console.error(error);
    message.error('退款失败');
  }
};

const printModalVisible = ref(false);
const currentPrintOrder = ref<any>(null);

const handlePrint = (row: any) => {
  currentPrintOrder.value = row;
  printModalVisible.value = true;
};

const doPrint = () => {
  window.print();
};

const columns = [
  { title: '订单号', key: 'id' },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const typeMap: Record<string, 'default' | 'info' | 'primary' | 'success' | 'warning' | 'error'> = {
        PENDING: 'warning',
        PREPARING: 'info',
        READY: 'primary',
        COMPLETED: 'success',
        CANCELLED: 'error'
      };
      const textMap: Record<string, string> = {
        PENDING: '待接单',
        PREPARING: '制作中',
        READY: '待取餐',
        COMPLETED: '已完成',
        CANCELLED: '已取消'
      };
      return h(NTag, { type: typeMap[row.status] }, { default: () => textMap[row.status] || row.status });
    }
  },
  {
    title: '总价',
    key: 'totalPrice',
    render(row: any) {
      return `¥${row.totalPrice}`;
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      const buttons: any[] = [];
      if (row.status === 'PENDING') {
        buttons.push(
          h(NButton, { size: 'small', type: 'primary', onClick: () => handleAccept(row.id) }, { default: () => '接单' })
        );
        buttons.push(
          h(NButton, { size: 'small', type: 'error', onClick: () => handleRefund(row.id) }, { default: () => '退款' })
        );
      }
      if (row.status === 'PREPARING') {
        buttons.push(
          h(NButton, { size: 'small', type: 'info', onClick: () => handleReady(row.id) }, { default: () => '出餐' })
        );
        buttons.push(
          h(NButton, { size: 'small', type: 'error', onClick: () => handleRefund(row.id) }, { default: () => '退款' })
        );
      }
      if (row.status === 'READY') {
        buttons.push(
          h(NButton, { size: 'small', type: 'success', onClick: () => handleComplete(row.id) }, { default: () => '完成' })
        );
      }
      if (row.status === 'PREPARING' || row.status === 'READY') {
        buttons.push(
          h(NButton, { size: 'small', type: 'default', onClick: () => handlePrint(row) }, { default: () => '打印小票' })
        );
      }
      return h(NSpace, null, { default: () => buttons });
    }
  }
];

let pollInterval: any;

onMounted(() => {
  fetchOrders();
  pollInterval = setInterval(fetchOrders, 10000); // 10s 轮询
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<template>
  <NCard title="订单管理" class="round-16px h-full shadow-sm" :bordered="false">
    <NDataTable :columns="columns" :data="orders" :loading="loading" />
    
    <NModal v-model:show="printModalVisible" preset="card" title="打印小票" style="max-width: 400px">
      <div v-if="currentPrintOrder" class="print-area">
        <h2 style="text-align: center; margin-bottom: 20px;">档口点餐小票</h2>
        <NDescriptions column="1" label-placement="left">
          <NDescriptionsItem label="订单号">{{ currentPrintOrder.id.slice(-8) }}</NDescriptionsItem>
          <NDescriptionsItem label="时间">{{ new Date(currentPrintOrder.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="用户">{{ currentPrintOrder.student?.username || '未知' }}</NDescriptionsItem>
        </NDescriptions>
        <div style="border-top: 1px dashed #ccc; margin: 15px 0;"></div>
        <div v-for="item in currentPrintOrder.items" :key="item.id" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>¥{{ Number(item.price) * item.quantity }}</span>
        </div>
        <div style="border-top: 1px dashed #ccc; margin: 15px 0;"></div>
        <div style="text-align: right; font-size: 1.2em; font-weight: bold;">
          总价: ¥{{ currentPrintOrder.totalPrice }}
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">谢谢惠顾，请凭票取餐</p>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <NButton type="primary" @click="doPrint">执行打印</NButton>
        </div>
      </template>
    </NModal>
  </NCard>
</template>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .print-area, .print-area * {
    visibility: visible;
  }
  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
