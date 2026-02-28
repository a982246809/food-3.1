<template>
  <div class="h-full">
    <n-card title="档口配置与管理" class="h-full shadow-sm rounded-16px">
      <div class="mb-4">
        <n-button type="primary" @click="handleAdd">新增档口</n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>

    <!-- 新增/编辑弹窗 -->
    <n-modal v-model:show="showModal" preset="dialog" :title="editingId ? '编辑档口' : '新增档口'" :show-icon="false">
      <n-form :model="formData" label-placement="left" label-width="80">
        <n-form-item label="档口名称">
          <n-input v-model:value="formData.name" placeholder="请输入档口名称" />
        </n-form-item>
        <n-form-item label="所属食堂">
          <n-select
            v-model:value="formData.canteenId"
            :options="canteenOptions"
            placeholder="请选择食堂"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showModal = false">取消</n-button>
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

defineOptions({ name: 'CanteenWindow' });

const message = useMessage();
const data = ref<any[]>([]);
const canteenOptions = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const editingId = ref('');
const pagination = ref({ page: 1, pageSize: 10 });
const formData = ref({ name: '', canteenId: '' });

async function fetchData() {
  loading.value = true;
  try {
    // 获取全部窗口数据
    const res = await request({ url: '/window', method: 'get' });
    data.value = Array.isArray(res.data) ? res.data : [];

    // 获取食堂列表做下拉选项
    const canteenRes = await fetchAdminCanteenList();
    const canteens = Array.isArray(canteenRes.data) ? canteenRes.data : [];
    canteenOptions.value = canteens.map((c: any) => ({ label: c.name, value: c.id }));
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  editingId.value = '';
  formData.value = { name: '', canteenId: '' };
  showModal.value = true;
}

function handleEdit(row: any) {
  editingId.value = row.id;
  formData.value = { name: row.name, canteenId: row.canteenId };
  showModal.value = true;
}

async function handleDelete(id: string) {
  try {
    await request({ url: `/window/${id}`, method: 'delete' });
    message.success('删除成功');
    fetchData();
  } catch (e) {
    message.error('删除失败');
  }
}

async function handleSubmit() {
  if (!formData.value.name || !formData.value.canteenId) {
    message.warning('请填写完整信息');
    return;
  }
  submitting.value = true;
  try {
    if (editingId.value) {
      await request({ url: `/window/${editingId.value}`, method: 'patch', data: formData.value });
      message.success('编辑成功');
    } else {
      await request({ url: '/window', method: 'post', data: formData.value });
      message.success('新增成功');
    }
    showModal.value = false;
    fetchData();
  } catch (e) {
    message.error('操作失败');
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  { title: '档口名称', key: 'name' },
  {
    title: '所属食堂',
    key: 'canteen',
    render(row: any) {
      return row.canteen?.name || '-';
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
              default: () => '确认删除该档口？'
            }
          )
        ]
      });
    }
  }
];
</script>

<style scoped></style>
