<template>
  <div class="h-full">
    <n-card title="全局公告系统" class="h-full shadow-sm rounded-16px">
      <div class="mb-4">
        <n-button type="primary">发布新公告</n-button>
      </div>
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
import { NButton, NSpace } from 'naive-ui';

defineOptions({ name: 'MonitorAnnouncement' });

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 10, itemCount: 0 });

const columns: DataTableColumns = [
  { title: '公告标题', key: 'title' },
  { title: '发布者', key: 'author.username' },
  { title: '发布时间', key: 'createdAt' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small', type: 'error' }, { default: () => '撤回' })
        ]
      });
    }
  }
];
</script>

<style scoped></style>
