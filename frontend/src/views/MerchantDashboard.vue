<template>
  <div class="merchant-dashboard">
    <el-menu mode="horizontal" router default-active="/merchant">
      <el-menu-item index="/merchant">Orders</el-menu-item>
      <el-menu-item index="/menu">Student View (Preview)</el-menu-item>
      <el-menu-item @click="logout" index="">Logout</el-menu-item>
    </el-menu>

    <div class="content">
      <h2>Order Management</h2>
      <el-button @click="fetchOrders">Refresh Orders</el-button>
      
      <el-table :data="orders" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="Order ID" width="100" />
        <el-table-column prop="status" label="Status" width="120" />
        <el-table-column prop="total" label="Total" width="100" />
        <el-table-column label="Items">
          <template #default="scope">
            <div v-for="item in scope.row.items" :key="item.id">
              {{ item.dish.name }} x{{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button v-if="scope.row.status === 'PENDING'" size="small" type="primary" @click="updateStatus(scope.row.id, 'PREPARING')">Accept</el-button>
            <el-button v-if="scope.row.status === 'PREPARING'" size="small" type="success" @click="updateStatus(scope.row.id, 'COMPLETED')">Complete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-divider />

      <h2>Manage Dishes</h2>
      <el-button type="primary" @click="showDishDialog = true">Add Dish</el-button>
      
      <el-table :data="dishes" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="price" label="Price" />
        <el-table-column prop="stock" label="Stock" />
        <el-table-column label="Available">
             <template #default="scope">
                 <el-tag :type="scope.row.stock > 0 ? 'success' : 'danger'">{{ scope.row.stock > 0 ? 'Yes' : 'No' }}</el-tag>
             </template>
        </el-table-column>
        <el-table-column label="Actions">
             <template #default="scope">
                 <el-button size="small" type="danger" @click="deleteDish(scope.row.id)">Delete</el-button>
             </template>
        </el-table-column>
      </el-table>

       <!-- Add Dish Dialog -->
        <el-dialog v-model="showDishDialog" title="Add Dish">
            <el-form :model="newDish">
                <el-form-item label="Name">
                    <el-input v-model="newDish.name" />
                </el-form-item>
                <el-form-item label="Price">
                    <el-input-number v-model="newDish.price" :min="0" />
                </el-form-item>
                 <el-form-item label="Stock">
                    <el-input-number v-model="newDish.stock" :min="0" />
                </el-form-item>
                 <el-form-item label="Description">
                    <el-input v-model="newDish.description" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDishDialog = false">Cancel</el-button>
                <el-button type="primary" @click="addDish">Submit</el-button>
            </template>
        </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../api';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const orders = ref<any[]>([]);
const dishes = ref<any[]>([]);
const authStore = useAuthStore();
const router = useRouter();

const showDishDialog = ref(false);
const newDish = reactive({
    name: '',
    price: 0,
    stock: 10,
    description: '',
    merchantId: authStore.user?.sub
});

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders');
    orders.value = res.data;
    // Just fetch dishes too
    fetchDishes();
  } catch (error) {
    console.error(error);
  }
};

const fetchDishes = async () => {
    try {
        const res = await api.get('/dishes');
        // Filter by merchant if needed, but for now assuming backend returns all or simple logic
        dishes.value = res.data; // Ideally backend filters by merchant
    } catch(e) {
        console.error(e)
    }
}

const updateStatus = async (id: number, status: string) => {
  try {
    await api.patch(`/orders/${id}`, { status });
    ElMessage.success('Status updated');
    fetchOrders();
  } catch (error) {
    ElMessage.error('Failed to update status');
  }
};

const addDish = async () => {
    try {
        await api.post('/dishes', { ...newDish, merchantId: authStore.user.sub });
        ElMessage.success('Dish Added');
        showDishDialog.value = false;
        fetchDishes();
    } catch(e) {
        ElMessage.error('Failed to add dish')
    }
}

const deleteDish = async (id: number) => {
    try {
        await api.delete(`/dishes/${id}`);
        ElMessage.success('Dish Deleted');
        fetchDishes();
    } catch(e) {
         ElMessage.error('Failed to delete dish')
    }
}

const logout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(fetchOrders);
</script>

<style scoped>
.content {
  padding: 20px;
}
</style>
