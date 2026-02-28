<template>
  <div class="h-full">
    <n-card title="食堂楼宇与楼层管理" class="h-full shadow-sm rounded-16px">
      <div class="mb-4">
        <n-button type="primary">新增食堂 / 楼层</n-button>
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

defineOptions({ name: 'CanteenBuilding' });

const data = ref([]);
const pagination = ref({ page: 1, pageSize: 10, itemCount: 0 });

const columns: DataTableColumns = [
  { title: '食堂名称', key: 'name' },
  { title: '所在楼宇', key: 'building' },
  { title: '所在楼层', key: 'floor' },
  { title: '创建时间', key: 'createdAt' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small', type: 'primary' }, { default: () => '编辑' }),
          h(NButton, { size: 'small', type: 'error' }, { default: () => '删除' })
        ]
      });
    }
  }
];
</script>

<style scoped></style>
