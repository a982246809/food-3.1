<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NSpace,
  NSwitch,
  useMessage
} from 'naive-ui';
import { request } from '../../service/request';

const message = useMessage();
const loading = ref(false);
const dishes = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const formValue = ref<any>({
  name: '',
  price: 0,
  stock: 100,
  isSpecial: false,
  isOnSale: true,
  imageUrl: ''
});

const fetchDishes = async () => {
  loading.value = true;
  try {
    const res: any = await request<any>({ url: '/dish', method: 'GET' });
    if (!res.error) {
      dishes.value = res.data || res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  isEdit.value = false;
  formValue.value = { name: '', price: 0, stock: 100, isSpecial: false, isOnSale: true, imageUrl: '' };
  showModal.value = true;
};

const handleEdit = (row: any) => {
  isEdit.value = true;
  formValue.value = { ...row };
  showModal.value = true;
};

const handleDelete = async (id: string) => {
  try {
    await request<any>({ url: `/dish/${id}`, method: 'DELETE' });
    message.success('删除成功');
    fetchDishes();
  } catch (error) {
    console.error(error);
    message.error('删除失败');
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await request<any>({ url: `/dish/${formValue.value.id}`, method: 'PATCH', data: formValue.value });
      message.success('更新成功');
    } else {
      await request<any>({ url: '/dish', method: 'POST', data: formValue.value });
      message.success('添加成功');
    }
    showModal.value = false;
    fetchDishes();
  } catch (error) {
    console.error(error);
    message.error('保存失败');
  }
};

const columns = [
  { title: '菜品名称', key: 'name' },
  {
    title: '价格',
    key: 'price',
    render(row: any) {
      return `¥${row.price}`;
    }
  },
  { title: '库存', key: 'stock' },
  {
    title: '特价',
    key: 'isSpecial',
    render(row: any) {
      return h(NSwitch, {
        value: row.isSpecial,
        'onUpdate:value': async (val: boolean) => {
          await request<any>({ url: `/dish/${row.id}`, method: 'PATCH', data: { isSpecial: val } });
          row.isSpecial = val;
          message.success(val ? '已设为特价' : '已取消特价');
        }
      });
    }
  },
  {
    title: '上架状态',
    key: 'isOnSale',
    render(row: any) {
      return h(NSwitch, {
        value: row.isOnSale,
        'onUpdate:value': async (val: boolean) => {
          await request<any>({ url: `/dish/${row.id}`, method: 'PATCH', data: { isOnSale: val } });
          row.isOnSale = val;
          message.success(val ? '已上架' : '已下架');
        }
      });
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small', type: 'primary', onClick: () => handleEdit(row) }, { default: () => '编辑' }),
          h(NButton, { size: 'small', type: 'error', onClick: () => handleDelete(row.id) }, { default: () => '删除' })
        ]
      });
    }
  }
];

onMounted(() => {
  fetchDishes();
});
</script>

<template>
  <NCard title="菜品管理" class="round-16px h-full shadow-sm" :bordered="false">
    <template #header-extra>
      <NButton type="primary" @click="handleAdd">添加菜品</NButton>
    </template>
    <NDataTable :columns="columns" :data="dishes" :loading="loading" />

    <NModal v-model:show="showModal" :title="isEdit ? '编辑菜品' : '添加菜品'" preset="card" style="width: 600px">
      <NForm :model="formValue">
        <NFormItem label="菜品名称" path="name">
          <NInput v-model:value="formValue.name" />
        </NFormItem>
        <NFormItem label="价格" path="price">
          <NInputNumber v-model:value="formValue.price" :min="0" />
        </NFormItem>
        <NFormItem label="库存" path="stock">
          <NInputNumber v-model:value="formValue.stock" :min="0" />
        </NFormItem>
        <NFormItem label="是否特价" path="isSpecial">
          <NSwitch v-model:value="formValue.isSpecial" />
        </NFormItem>
        <NFormItem label="上架状态" path="isOnSale">
          <NSwitch v-model:value="formValue.isOnSale" />
        </NFormItem>
        <NFormItem label="图片 URL" path="imageUrl">
          <NInput v-model:value="formValue.imageUrl" placeholder="请输入图片链接 (如使用图床)" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" @click="handleSubmit">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </NCard>
</template>

<style scoped></style>
