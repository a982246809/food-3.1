<template>
  <div class="h-full">
    <n-card title="全局公告系统" class="h-full shadow-sm rounded-16px">
      <div class="mb-4">
        <n-button type="primary" @click="handleAdd">发布新公告</n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>

    <!-- 发布公告弹窗 -->
    <n-modal v-model:show="showModal" preset="dialog" title="发布系统公告" :show-icon="false">
      <n-form :model="formData" label-placement="left" label-width="80">
        <n-form-item label="公告标题">
          <n-input v-model:value="formData.title" placeholder="请输入公告标题" />
        </n-form-item>
        <n-form-item label="公告内容">
          <n-input
            v-model:value="formData.content"
            type="textarea"
            placeholder="请输入公告内容（如「今日某窗口休息」）"
            :rows="4"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleSubmit">发布</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NPopconfirm, useMessage } from 'naive-ui';
import { fetchAdminAnnouncementList, createAdminAnnouncement, deleteAdminAnnouncement } from '@/service/api/admin';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({ name: 'MonitorAnnouncement' });

const message = useMessage();
const authStore = useAuthStore();
const data = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const pagination = ref({ page: 1, pageSize: 10 });
const formData = ref({ title: '', content: '' });

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminAnnouncementList();
    data.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  formData.value = { title: '', content: '' };
  showModal.value = true;
}

async function handleSubmit() {
  if (!formData.value.title || !formData.value.content) {
    message.warning('请填写完整信息');
    return;
  }
  submitting.value = true;
  try {
    const authorId = authStore.userInfo?.userId || '';
    await createAdminAnnouncement(formData.value.title, formData.value.content, authorId);
    message.success('公告发布成功');
    showModal.value = false;
    fetchData();
  } catch (e) {
    message.error('发布失败');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  try {
    await deleteAdminAnnouncement(id);
    message.success('公告已撤回');
    fetchData();
  } catch (e) {
    message.error('撤回失败');
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  { title: '公告标题', key: 'title' },
  { title: '公告内容', key: 'content', ellipsis: { tooltip: true } },
  {
    title: '发布者',
    key: 'author',
    render(row: any) {
      return row.author?.username || '-';
    }
  },
  {
    title: '发布时间',
    key: 'createdAt',
    render(row: any) {
      return new Date(row.createdAt).toLocaleString('zh-CN');
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row: any) {
      return h(
        NPopconfirm,
        { onPositiveClick: () => handleDelete(row.id) },
        {
          trigger: () => h(NButton, { size: 'small', type: 'error' }, { default: () => '撤回' }),
          default: () => '确认撤回该公告？'
        }
      );
    }
  }
];
</script>

<style scoped></style>
