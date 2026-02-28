<template>
  <div class="h-full">
    <n-card title="全局订单监控" class="h-full shadow-sm rounded-16px">
      <!-- 搜索表单 -->
      <n-form inline label-placement="left">
        <n-form-item label="订单号">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="状态">
          <n-select :options="statusOptions" class="w-120px" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary">查询</n-button>
        </n-form-item>
      </n-form>
      <!-- 数据表格 -->
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NTag } from 'naive-ui';

defineOptions({ name: 'MonitorOrder' });

const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '准备中', value: 'PREPARING' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
];

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 15, itemCount: 0 });

const columns: DataTableColumns = [
  { title: '订单号', key: 'id' },
  { title: '学生ID', key: 'studentId' },
  { title: '档口', key: 'window.name' },
  { title: '金额', key: 'totalPrice' },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(NTag, { type: 'info' }, { default: () => row.status });
    }
  },
  { title: '创建时间', key: 'createdAt' }
];
</script>

<style scoped></style>
