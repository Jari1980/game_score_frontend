<template>
  <nav class="nav flex gap-4">
    <template v-if="authenticated">
      <router-link to="/results">Games</router-link>
      <router-link to="/results/create">New Game</router-link>
      <router-link to="/logout">Logout</router-link>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { authenticated } from '@/data/mock/auth';
</script>

<style scoped>
nav .router-link-exact-active {
  @apply no-underline;
}

nav a {
  @apply underline;
}
</style>
