<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Role:</label>
        <select v-model="role">
          <option value="STUDENT">Student</option>
          <option value="MERCHANT">Merchant</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const role = ref('STUDENT');
const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await authStore.register(username.value, password.value, role.value);
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (error) {
    alert('Registration failed');
  }
};
</script>

<style scoped>
.register-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input, select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
