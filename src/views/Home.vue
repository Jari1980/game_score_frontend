<script setup lang="ts">
defineProps<{ welcomeText: string; descriptionText: string }>();
</script>

<template>
  <h1>{{ welcomeText }}</h1>
  <p>{{ descriptionText }}</p>
</template>

<style scoped>
h1 {
  color: #c5c5c5;
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  margin: 1.5rem 0;
}

p {
  color: #a0a0a0;
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: center;
  margin: 0 auto 2rem;
  max-width: 600px;
}
</style>
