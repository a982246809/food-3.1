<template>
  <div class="h-full">
    <n-card title="食堂楼宇与楼层管理" class="h-full shadow-sm rounded-16px">
      <div class="mb-4">
        <n-button type="primary" @click="showAddModal = true">新增食堂</n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>

    <!-- 新增/编辑弹窗 -->
    <n-modal v-model:show="showAddModal" preset="dialog" :title="editingId ? '编辑食堂' : '新增食堂'" :show-icon="false">
      <n-form ref="formRef" :model="formData" label-placement="left" label-width="80">
        <n-form-item label="食堂名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入食堂名称" />
        </n-form-item>
        <n-form-item label="所在楼宇" path="building">
          <n-input v-model:value="formData.building" placeholder="请输入楼宇（选填）" />
        </n-form-item>
        <n-form-item label="所在楼层" path="floor">
          <n-input v-model:value="formData.floor" placeholder="请输入楼层（选填）" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showAddModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleSubmit">确定</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NSpace, NPopconfirm, useMessage } from 'naive-ui';
import { fetchAdminCanteenList } from '@/service/api/admin';
import { request } from '@/service/request';

defineOptions({ name: 'CanteenBuilding' });

const message = useMessage();
const data = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);
const showAddModal = ref(false);
const editingId = ref('');
const pagination = ref({ page: 1, pageSize: 10 });
const formData = ref({ name: '', building: '', floor: '' });

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminCanteenList();
    data.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleEdit(row: any) {
  editingId.value = row.id;
  formData.value = { name: row.name, building: row.building || '', floor: row.floor || '' };
  showAddModal.value = true;
}

async function handleDelete(id: string) {
  try {
    await request({ url: `/canteen/${id}`, method: 'delete' });
    message.success('删除成功');
    fetchData();
  } catch (e) {
    message.error('删除失败');
  }
}

async function handleSubmit() {
  if (!formData.value.name) {
    message.warning('请输入食堂名称');
    return;
  }
  submitting.value = true;
  try {
    if (editingId.value) {
      await request({ url: `/canteen/${editingId.value}`, method: 'patch', data: formData.value });
      message.success('编辑成功');
    } else {
      await request({ url: '/canteen', method: 'post', data: formData.value });
      message.success('新增成功');
    }
    showAddModal.value = false;
    editingId.value = '';
    formData.value = { name: '', building: '', floor: '' };
    fetchData();
  } catch (e) {
    message.error('操作失败');
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  { title: '食堂名称', key: 'name' },
  { title: '所在楼宇', key: 'building', render(row: any) { return row.building || '-'; } },
  { title: '所在楼层', key: 'floor', render(row: any) { return row.floor || '-'; } },
  {
    title: '档口数量',
    key: 'windowCount',
    render(row: any) {
      return row.windows?.length ?? 0;
    }
  },
  {
    title: '创建时间',
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
          h(NButton, { size: 'small', type: 'primary', onClick: () => handleEdit(row) }, { default: () => '编辑' }),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDelete(row.id) },
            {
              trigger: () => h(NButton, { size: 'small', type: 'error' }, { default: () => '删除' }),
              default: () => '确认删除该食堂？'
            }
          )
        ]
      });
    }
  }
];
</script>

<style scoped></style>
