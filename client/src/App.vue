<script setup lang="ts">
import { RouterView } from 'vue-router';

const fetchSample = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  console.log(data);
}
</script>

<template>
  <div>
    <button @click="fetchSample">Fetch Sample</button>
  </div>
  <header>
    <nav>
      <RouterLink v-if="$route.path !== '/sign'" to="/sign">Login</RouterLink>
      <RouterLink v-if="$route.path !== '/'" to="/">Books</RouterLink>
      <RouterLink v-if="!['/checkout', '/sign'].includes($route.path)" to="/checkout">Checkout</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>

button {
  width: 160px;
  margin: 10px 0px 10px 10px;
  padding: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

</style>
  