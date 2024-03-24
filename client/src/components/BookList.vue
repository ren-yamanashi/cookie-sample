<script setup lang="ts">
import { onMounted } from 'vue';
import { z } from 'zod';
import { books } from '../../../db/book'
import { useUserBooks} from '../composables/useUserBooks'

const { usersBooks, getBooks } = useUserBooks()

const addBook = async ( title: string ) => {
  const res = await fetch('http://localhost:3000/books', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title
    }),
  })

  const resJson = await res.json();
  const booksData = z.object({
    isAuthenticated: z.boolean(),
    books: z.array(z.object({
      id: z.number(),
      title: z.string(),
    })),
  }).parse(resJson);
  
  usersBooks.value = booksData.books;
}

onMounted(async () => {
  await getBooks();
})
</script>

<template>
  <!-- book item -->
  <section>
    <template v-if="books.length">
      <div v-for="book in books" :key="book.id" class="book">
        {{ book.title }}
        <button @click="() => addBook(book.title)">+</button>
      </div>
    </template>
    <p v-else>
      No books
    </p>
  </section>
  <!-- user books -->
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
</template>


<style scoped>
p {
  color: black;
}

h4 {
  margin-top: 30px;
  color: rgb(100, 100, 100);
  font-weight: bold;
}

.book {
  color: black;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

button {
  width: 60px;
  margin: 10px 0px 10px 10px;
  padding: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>