<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <RouterLink v-if="$route.path !== '/sign'" to="/sign">Login</RouterLink>
      <RouterLink v-if="$route.path !== '/'" to="/">Books</RouterLink>
      <RouterLink v-if="!['/checkout', '/sign'].includes($route.path)" to="/checkout">Checkout</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>