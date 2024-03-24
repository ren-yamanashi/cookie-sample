<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <RouterLink v-if="$route.path !== '/'" to="/">Login</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>