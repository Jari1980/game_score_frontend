<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 modal-static main-border modal-small text-center"
    >
      <h2 class="text-success font-bold">New Match Added</h2>

      <p v-if="match" class="flex items-center justify-center gap-2">
        <span>{{ match.home_team }}</span>

        <span class="font-bold text-lg">
          {{ match.home_team_score }} - {{ match.away_team_score }}
        </span>

        <span>{{ match.away_team }}</span>
      </p>

      <p v-if="match.winning_team" class="text-success text-sm mt-1">
        Winner: {{ match.winning_team }}
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { latestMatch } = useWebSocket();

const visible = ref(false);
const match = ref<any | null>(null);

const POPUP_DURATION = 10000;

watch(latestMatch, (newMatch) => {
  if (!newMatch) return;

  match.value = newMatch;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, POPUP_DURATION);
});
</script>
