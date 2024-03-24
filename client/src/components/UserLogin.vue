<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter();
const loginFormInput = reactive<{email:string; password:string}>({ email: '', password: '' });

const login = async () => {
  await fetch('http://localhost:3000/sign', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: loginFormInput.email,
      password: loginFormInput.password,
    }),
  })
  router.push('/books');
}

onMounted(() => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
})
</script>

<template>
  <div class="main">
    <textarea v-model="loginFormInput.email" placeholder="Email"></textarea>
    <textarea v-model="loginFormInput.password" placeholder="Password"></textarea>
  </div>
  <button class="button" @click="login">Login</button>

  <RouterView />
</template>

<style scoped>

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  color: black;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  height: 40px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
</style>