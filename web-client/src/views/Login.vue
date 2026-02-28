<template>
  <div class="login-container">
    <div class="header">
      <h1 class="title">校园食堂点餐系统</h1>
      <p class="subtitle">美味无需等待，即刻开启校园美食之旅</p>
    </div>

    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
          clearable
          left-icon="user-o"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          clearable
          left-icon="lock"
        />
      </van-cell-group>
      <div style="margin: 32px 16px 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loading" class="submit-btn">
          {{ isRegister ? '注 册' : '登 录' }}
        </van-button>
      </div>
      <div class="toggle-mode" @click="isRegister = !isRegister">
        {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast, showFailToast } from 'vant';
import request from '../api/request';

const router = useRouter();
const username = ref('');
const password = ref('');
const isRegister = ref(false);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    const endpoint = isRegister.value ? '/auth/register' : '/auth/login';
    const res: any = await request.post(endpoint, {
      username: username.value,
      password: password.value,
      role: 'STUDENT'
    });
    
    if (res.access_token) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
      showSuccessToast(isRegister.value ? '注册成功' : '登录成功');
      router.push('/');
    } else {
       showFailToast(res.message || '操作失败');
    }
  } catch (error) {
    console.error('Auth error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  display: flex;
  flex-direction: column;
}

.header {
  padding: 80px 30px 40px;
  text-align: center;
}

.title {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-form {
  padding: 0 10px;
}

:deep(.van-cell-group--inset) {
  margin: 0 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

:deep(.van-field__label) {
  color: #333;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(to right, #ff6b6b, #ee5253);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(238, 82, 83, 0.3);
}

.toggle-mode {
  text-align: center;
  color: #ee5253;
  font-size: 14px;
  margin-top: 20px;
  padding: 10px;
}
</style>
