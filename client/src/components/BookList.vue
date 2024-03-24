<script setup lang="ts">
import {useRouter} from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { z } from 'zod';

const router = useRouter();
const books = ref<{id: number; title: string}[]>([]);
const isLogin = computed(() => document.cookie.includes('token'));

const getBook = async () => {
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

onMounted(() => {
  if(!isLogin.value) router.push('/');
  else getBook();
})
</script>

<template>
    <template v-if="books.length">
      <div v-for="book in books" :key="book.id" class="text">
        {{ book.title }}
      </div>
    </template>
    <p v-else>
      No books
    </p>
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