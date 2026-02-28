<template>
  <div class="h-full">
    <n-card title="投诉与建议处理" class="h-full shadow-sm rounded-16px">
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
import { NButton, NSpace, NTag } from 'naive-ui';

defineOptions({ name: 'MonitorComplaint' });

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 10, itemCount: 0 });

const columns: DataTableColumns = [
  { title: '用户', key: 'student.username' },
  { title: '投诉内容', key: 'content' },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 'PROCESSED' ? 'success' : 'warning' },
        { default: () => row.status }
      );
    }
  },
  { title: '平台回复', key: 'reply' },
  { title: '提交时间', key: 'createdAt' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NButton,
        { size: 'small', type: 'primary', disabled: row.status === 'PROCESSED' },
        { default: () => '回复并完结' }
      );
    }
  }
];
</script>

<style scoped></style>
