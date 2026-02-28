<template>
  <div class="h-full">
    <n-card title="全局订单监控" class="h-full shadow-sm rounded-16px">
      <!-- 搜索表单 -->
      <n-form inline label-placement="left">
        <n-form-item label="订单号">
          <n-input v-model:value="searchId" placeholder="请输入" clearable />
        </n-form-item>
        <n-form-item label="状态">
          <n-select v-model:value="searchStatus" :options="statusOptions" clearable class="w-120px" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">查询</n-button>
          <n-button class="ml-3" @click="handleReset">重置</n-button>
        </n-form-item>
      </n-form>
      <!-- 数据表格 -->
      <n-data-table
        :columns="columns"
        :data="filteredData"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref, computed } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NTag } from 'naive-ui';
import { fetchAdminOrderList } from '@/service/api/admin';

defineOptions({ name: 'MonitorOrder' });

const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '制作中', value: 'PREPARING' },
  { label: '待取餐', value: 'READY' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
];

const data = ref<any[]>([]);
const loading = ref(false);
const searchId = ref('');
const searchStatus = ref<string | null>(null);
const pagination = ref({ page: 1, pageSize: 15 });

const filteredData = computed(() => {
  let result = data.value;
  if (searchId.value) {
    result = result.filter((item: any) => item.id?.includes(searchId.value));
  }
  if (searchStatus.value) {
    result = result.filter((item: any) => item.status === searchStatus.value);
  }
  return result;
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminOrderList();
    data.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.value.page = 1;
}

function handleReset() {
  searchId.value = '';
  searchStatus.value = null;
  pagination.value.page = 1;
}

onMounted(fetchData);

const statusMap: Record<string, { type: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
  PENDING: { type: 'warning', label: '待处理' },
  PREPARING: { type: 'info', label: '制作中' },
  READY: { type: 'success', label: '待取餐' },
  COMPLETED: { type: 'default', label: '已完成' },
  CANCELLED: { type: 'error', label: '已取消' }
};

const columns: DataTableColumns = [
  { title: '订单号', key: 'id', width: 120, ellipsis: { tooltip: true } },
  {
    title: '学生',
    key: 'student',
    render(row: any) {
      return row.student?.username || row.studentId;
    }
  },
  {
    title: '档口',
    key: 'window',
    render(row: any) {
      return row.window?.name || row.windowId;
    }
  },
  {
    title: '金额',
    key: 'totalPrice',
    render(row: any) {
      return `¥${Number(row.totalPrice || 0).toFixed(2)}`;
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const s = statusMap[row.status] || { type: 'info', label: row.status };
      return h(NTag, { type: s.type, size: 'small' }, { default: () => s.label });
    }
  },
  {
    title: '备注',
    key: 'remark',
    render(row: any) {
      return row.remark || '-';
    }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    render(row: any) {
      return new Date(row.createdAt).toLocaleString('zh-CN');
    }
  }
];
</script>

<style scoped></style>
