<template>
  <div class="h-full">
    <n-card title="投诉与建议处理" class="h-full shadow-sm rounded-16px">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :loading="loading"
      />
    </n-card>

    <!-- 回复弹窗 -->
    <n-modal v-model:show="showReplyModal" preset="dialog" title="回复投诉" :show-icon="false">
      <n-form :model="replyForm" label-placement="left" label-width="80">
        <n-form-item label="投诉内容">
          <n-text>{{ replyForm.content }}</n-text>
        </n-form-item>
        <n-form-item label="回复内容">
          <n-input
            v-model:value="replyForm.reply"
            type="textarea"
            placeholder="请输入回复内容"
            :rows="4"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showReplyModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleSubmitReply">回复并完结</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NTag, NText, useMessage } from 'naive-ui';
import { fetchAdminComplaintList, replyAdminComplaint } from '@/service/api/admin';

defineOptions({ name: 'MonitorComplaint' });

const message = useMessage();
const data = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);
const showReplyModal = ref(false);
const pagination = ref({ page: 1, pageSize: 10 });
const replyForm = ref({ id: '', content: '', reply: '' });

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetchAdminComplaintList();
    data.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleReply(row: any) {
  replyForm.value = { id: row.id, content: row.content, reply: '' };
  showReplyModal.value = true;
}

async function handleSubmitReply() {
  if (!replyForm.value.reply) {
    message.warning('请输入回复内容');
    return;
  }
  submitting.value = true;
  try {
    await replyAdminComplaint(replyForm.value.id, replyForm.value.reply);
    message.success('回复成功');
    showReplyModal.value = false;
    fetchData();
  } catch (e) {
    message.error('回复失败');
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchData);

const columns: DataTableColumns = [
  {
    title: '用户',
    key: 'student',
    render(row: any) {
      return row.student?.username || '-';
    }
  },
  {
    title: '投诉内容',
    key: 'content',
    ellipsis: { tooltip: true }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 'PROCESSED' ? 'success' : 'warning', size: 'small' },
        { default: () => (row.status === 'PROCESSED' ? '已处理' : '待处理') }
      );
    }
  },
  {
    title: '平台回复',
    key: 'reply',
    ellipsis: { tooltip: true },
    render(row: any) {
      return row.reply || '-';
    }
  },
  {
    title: '提交时间',
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
        NButton,
        {
          size: 'small',
          type: 'primary',
          disabled: row.status === 'PROCESSED',
          onClick: () => handleReply(row)
        },
        { default: () => '回复并完结' }
      );
    }
  }
];
</script>

<style scoped></style>
