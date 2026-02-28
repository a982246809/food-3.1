<template>
  <div class="h-full">
    <n-card title="商户账户审核" class="h-full shadow-sm rounded-16px">
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

defineOptions({ name: 'UserMerchant' });

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 10, itemCount: 0 });

const columns: DataTableColumns = [
  { title: '用户名', key: 'username' },
  { title: '所属食堂', key: 'canteen.name' },
  { title: '所属档口', key: 'window.name' },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const type = row.status === 'ACTIVE' ? 'success' : row.status === 'PENDING' ? 'warning' : 'error';
      return h(NTag, { type }, { default: () => row.status });
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small', type: 'success', disabled: row.status === 'ACTIVE' }, { default: () => '通过' }),
          h(NButton, { size: 'small', type: 'error', disabled: row.status === 'REJECTED' }, { default: () => '拒绝' })
        ]
      });
    }
  }
];
</script>

<style scoped></style>
