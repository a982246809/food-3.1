<template>
  <div class="h-full">
    <n-card title="学生用户管理" class="h-full shadow-sm rounded-16px">
      <!-- 搜索表单 -->
      <n-form inline label-placement="left">
        <n-form-item label="用户名">
          <n-input placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary">搜索</n-button>
        </n-form-item>
      </n-form>
      <!-- 数据表格 -->
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        class="mt-4"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NTag } from 'naive-ui';

defineOptions({ name: 'UserStudent' });

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 10, itemCount: 0 });

const columns: DataTableColumns = [
  { title: 'ID', key: 'id' },
  { title: '用户名', key: 'username' },
  { title: '余额', key: 'balance' },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 'ACTIVE' ? 'success' : 'warning' },
        { default: () => row.status }
      );
    }
  },
  { title: '注册时间', key: 'createdAt' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        { size: 'small', type: 'error' },
        { default: () => '删除' }
      );
    }
  }
];
</script>

<style scoped></style>
