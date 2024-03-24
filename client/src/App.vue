<script setup lang="ts">
import { reactive, ref } from 'vue';
import { z } from 'zod';

const loginFormInput = reactive<{email:string; password:string}>({ email: '', password: '' });
const user = reactive<{id: number; email:string; password:string}>({ id:0, email: '', password: '' });
const books = ref<{id: number; title: string}[]>([]);

const login = async () => {
  const res = await fetch('http://localhost:3000/sign', {
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
  const userResponse = await res.json();
  
  const userData = z.object({
    id: z.number(),
    email: z.string(),
    password: z.string(),
  }).parse(userResponse);

  user.id = userData.id;
  user.email = userData.email;
  user.password = userData.password;
}

const getBook = async () => {
  console.log('cookie', document.cookie)
  const res = await fetch('http://localhost:3000/books', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const gotBooks = await res.json();
  const booksData = z.array(z.object({
    id: z.number(),
    title: z.string(),
  })).parse(gotBooks);

  books.value = booksData.map((book) => {
    return {
      id: book.id ?? 1,
      title: book.title ?? "1",
    }
  });
}
</script>

<template>
  <div v-if="!user.id">
    <div class="main">
      <textarea v-model="loginFormInput.email" placeholder="Email"></textarea>
      <textarea v-model="loginFormInput.password" placeholder="Password"></textarea>
    </div>
    <button class="button" @click="login">Login</button>
  </div>
  <div v-else>
    <template v-if="books.length">
      <div v-for="book in books" :key="book.id" class="text">
        {{ book.title }}
      </div>
    </template>
    <button v-else class="button" @click="getBook">Get Book</button>
  </div>
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
