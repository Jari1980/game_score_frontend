<template>
  <div class="flex flex-col gap-14 p-10">
    <div class="flex flex-col gap-6 mx-auto items-center">
      <transition name="fade">
        <Toast v-if="toastMessage" :msg="toastMessage" />
      </transition>
      <Header />
    </div>
    <!-- Global popup for new matches -->
    <NewMatchPopup />
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted } from 'vue';
import Header from '@/views/Header.vue';
import Toast from '@/views/Toast.vue';
import Footer from '@/views/Footer.vue';
import { useWebSocket } from '@/composables/useWebSocket';
import NewMatchPopup from '@/components/NewMatchPopup.vue';

//connecting websocket when app loads
const { connect } = useWebSocket();
onMounted(() => {
  connect();
});

// Refs
const toastMessage = ref('');

// Methods
const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => (toastMessage.value = ''), 3000);
};

// Provide
provide('showToast', showToast);
</script>

<style scoped></style>
