import { ref } from "vue";
import type { Book } from "../../../db/book";
import { z } from 'zod';

export const useUserBooks = () => {
  const usersBooks = ref<Book[]>([]);

  const getBooks = async () => {
      const res = await fetch('http://localhost:3000/books', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
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

  return {
    usersBooks,
    getBooks,
  }
}