<template>
  <div class="h-full">
    <n-card title="商户账户审核" class="h-full shadow-sm rounded-16px">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NSpace, NTag, NPopconfirm, useMessage } from 'naive-ui';
import { fetchAdminUserList, updateAdminUserStatus } from '@/service/api/admin';

defineOptions({ name: 'UserMerchant' });

const message = useMessage();
const data = ref<any[]>([]);
const loading = ref(false);
const pagination = ref({ page: 1, pageSize: 10 });

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminUserList('MERCHANT');
    data.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function handleApprove(row: any) {
  try {
    await updateAdminUserStatus(row.id, 'ACTIVE');
    message.success('已通过审核');
    fetchData();
  } catch (e) {
    message.error('操作失败');
  }
}

async function handleReject(row: any) {
  try {
    await updateAdminUserStatus(row.id, 'REJECTED');
    message.success('已拒绝');
    fetchData();
  } catch (e) {
    message.error('操作失败');
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  { title: '用户名', key: 'username' },
  {
    title: '所属食堂',
    key: 'canteen',
    render(row: any) {
      return row.canteen?.name || '-';
    }
  },
  {
    title: '所属档口',
    key: 'window',
    render(row: any) {
      return row.window?.name || '-';
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const statusMap: Record<string, { type: 'success' | 'warning' | 'error'; label: string }> = {
        ACTIVE: { type: 'success', label: '已通过' },
        PENDING: { type: 'warning', label: '待审核' },
        REJECTED: { type: 'error', label: '已拒绝' }
      };
      const s = statusMap[row.status] || { type: 'warning', label: row.status };
      return h(NTag, { type: s.type, size: 'small' }, { default: () => s.label });
    }
  },
  {
    title: '注册时间',
    key: 'createdAt',
    render(row: any) {
      return new Date(row.createdAt).toLocaleString('zh-CN');
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(
            NPopconfirm,
            { onPositiveClick: () => handleApprove(row) },
            {
              trigger: () =>
                h(
                  NButton,
                  { size: 'small', type: 'success', disabled: row.status === 'ACTIVE' },
                  { default: () => '通过' }
                ),
              default: () => '确认通过该商户审核？'
            }
          ),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleReject(row) },
            {
              trigger: () =>
                h(
                  NButton,
                  { size: 'small', type: 'error', disabled: row.status === 'REJECTED' },
                  { default: () => '拒绝' }
                ),
              default: () => '确认拒绝该商户？'
            }
          )
        ]
      });
    }
  }
];
</script>

<style scoped></style>
