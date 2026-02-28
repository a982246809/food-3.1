<template>
  <div class="h-full">
    <n-card title="学生用户管理" class="h-full shadow-sm rounded-16px">
      <!-- 搜索表单 -->
      <n-form inline label-placement="left">
        <n-form-item label="用户名">
          <n-input v-model:value="searchName" placeholder="请输入用户名" clearable />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button class="ml-3" @click="handleReset">重置</n-button>
        </n-form-item>
      </n-form>
      <!-- 数据表格 -->
      <n-data-table
        :columns="columns"
        :data="filteredData"
        :pagination="pagination"
        :loading="loading"
        class="mt-4"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref, computed } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NTag, NSpace, NPopconfirm, useMessage } from 'naive-ui';
import { fetchAdminUserList, updateAdminUserStatus } from '@/service/api/admin';

defineOptions({ name: 'UserStudent' });

const message = useMessage();
const data = ref<any[]>([]);
const loading = ref(false);
const searchName = ref('');
const pagination = ref({ page: 1, pageSize: 10 });

const filteredData = computed(() => {
  if (!searchName.value) return data.value;
  return data.value.filter((item: any) =>
    item.username?.toLowerCase().includes(searchName.value.toLowerCase())
  );
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminUserList('STUDENT');
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
  searchName.value = '';
  pagination.value.page = 1;
}

async function handleDisable(row: any) {
  try {
    await updateAdminUserStatus(row.id, row.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED');
    message.success('操作成功');
    fetchData();
  } catch (e) {
    message.error('操作失败');
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  { title: 'ID', key: 'id', width: 80, ellipsis: { tooltip: true } },
  { title: '用户名', key: 'username' },
  {
    title: '余额',
    key: 'balance',
    render(row: any) {
      return `¥${Number(row.balance || 0).toFixed(2)}`;
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const statusMap: Record<string, { type: 'success' | 'warning' | 'error'; label: string }> = {
        ACTIVE: { type: 'success', label: '正常' },
        PENDING: { type: 'warning', label: '待审核' },
        DISABLED: { type: 'error', label: '已禁用' }
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
    width: 150,
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDisable(row) },
            {
              trigger: () =>
                h(
                  NButton,
                  { size: 'small', type: row.status === 'DISABLED' ? 'success' : 'warning' },
                  { default: () => (row.status === 'DISABLED' ? '启用' : '禁用') }
                ),
              default: () => `确认${row.status === 'DISABLED' ? '启用' : '禁用'}该用户？`
            }
          )
        ]
      });
    }
  }
];
</script>

<style scoped></style>
