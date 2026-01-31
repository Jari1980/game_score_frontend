<template>
  <div class="flex flex-col gap-14 p-10">
    <div class="flex flex-col gap-6 w-max mx-auto items-center">
      <router-link to="/results">
        <img
          src="/sportz-scores-logo.svg"
          class="w-[9rem]"
          alt="Sportz Scores Logo"
        />
      </router-link>
      <Header />
    </div>

    <router-view />

    <footer class="text-center text-sm text-light/50">
      Sportz Scores {{ new Date().getFullYear() }} &nbsp;|&nbsp;
      <a href="#" class="underline">Contact our team</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Header from './views/Header.vue';
</script>

<style scoped></style>
