<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { z } from 'zod';
import { useRouter } from 'vue-router';
import { useUserBooks } from '@/composables/useUserBooks';

const router = useRouter();
const { usersBooks, getBooks } = useUserBooks();
const msg = ref('');

const checkout = async () => {
  const res = await fetch('http://localhost:3000/checkout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resJson = await res.json();
  const message = z.object({
    message: z.string(),
  }).parse(resJson).message;
  if(message.includes("Redirect to sign page")) {
    router.push('/sign');
  } else {
    msg.value = message;
  }
}

onMounted(async () => {
  await getBooks();
})
</script>

<template>
  <p v-if="msg">{{ msg }}</p>
  <template v-else>
    <section>
      <h4>User Books</h4>
      <template v-if="usersBooks.length">
        <div v-for="book in usersBooks" :key="book.id" class="book">
          {{ book.title }}
        </div>
      </template>
      <p v-else>
        No books
      </p>
    </section>
    <button @click="checkout">Checkout</button>
  </template>
</template>


<style scoped>
h4 {
  margin-top: 30px;
  color: rgb(111, 111, 111);
  font-weight: bold;
}

p {
  color: black;
}

.book {
  color: black;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

button {
  width: 200px;
  margin: 10px 0px 10px 10px;
  padding: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>