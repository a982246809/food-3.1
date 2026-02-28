<template>
  <div class="profile-container">
    <div class="header-bg">
      <div class="user-info">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="info-text">
          <div class="username">{{ user.username || '学生用户' }}</div>
          <div class="user-id">ID: {{ user.id?.substring(0,8) || 'xxxx' }}</div>
        </div>
      </div>
    </div>
    
    <van-cell-group inset class="balance-card">
      <div class="balance-content">
        <div class="balance-item">
          <div class="balance-label">余额 (元)</div>
          <div class="balance-value">{{ user.balance || '0.00' }}</div>
        </div>
        <van-button type="primary" size="small" round class="recharge-btn">去充值</van-button>
      </div>
    </van-cell-group>
    
    <van-cell-group inset class="menu-list">
      <van-cell title="我的订单" icon="orders-o" is-link to="/orders" />
      <van-cell title="常用地址" icon="location-o" is-link />
      <van-cell title="联系客服" icon="service-o" is-link />
      <van-cell title="设置" icon="setting-o" is-link />
    </van-cell-group>
    
    <div style="margin: 30px 16px;">
      <van-button block round type="danger" plain @click="logout">退出登录</van-button>
    </div>

    <!-- Bottom Padding -->
    <div style="height: 50px;"></div>

    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="shop-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item replace to="/orders" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog } from 'vant';

const router = useRouter();
const user = ref<any>({});

onMounted(() => {
  const localUser = localStorage.getItem('user');
  if (localUser) {
    user.value = JSON.parse(localUser);
  }
});

const logout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
  }).then(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  }).catch(() => {});
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header-bg {
  background: linear-gradient(135deg, #ff6b6b, #ee5253);
  padding: 40px 20px 60px;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
}

.info-text {
  margin-left: 16px;
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-id {
  font-size: 13px;
  opacity: 0.8;
}

.balance-card {
  margin-top: -30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
}

.balance-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.balance-value {
  font-size: 28px;
  font-weight: bold;
  color: #ee0a24;
}

.recharge-btn {
  padding: 0 20px;
  height: 32px;
  background: linear-gradient(to right, #ff6b6b, #ee5253);
  border: none;
}

.menu-list {
  margin-top: 20px;
}
</style>
