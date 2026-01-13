<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { fetchWithFallback } from '../data/fetch';
import { matches as mockMatches } from '../data/mock/matches';
import { formatDate } from '../utils/general.ts';
import type { GetMatch } from '../data/matchModels';
import { API_ENDPOINT } from '../data/consts';
import Modal from '../components/Modal.vue';

// Constants
const endpoint = API_ENDPOINT + '/match';

// Refs
const matches = ref<GetMatch[]>([]);

// Composables
const router = useRouter();
const route = useRoute();

// Computed
const isModalOpen = computed(() => route.name === 'Create');

// Watchers
watch(isModalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

// Lifecycle
onMounted(async () => {
  matches.value = await fetchWithFallback<GetMatch[]>(endpoint, mockMatches);
});
</script>

<template>
  <div class="outer-scroll overflow-x-auto">
    <div
      class="inner main-border bg-darker/60 p-10 games-list flex flex-col gap-6 flex-1 w-max min-w-[600px] mx-auto"
    >
      <h1 class="text-xl">My Games</h1>
      <div class="the-table">
        <table class="w-full md:min-w-[600px]">
          <thead>
            <tr>
              <th>Date</th>
              <th>Home</th>
              <th>Away</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="match in matches" :key="match.matchId">
              <td>{{ formatDate(match.matchDate) }}</td>
              <td
                :class="{
                  'text-success font-bold':
                    match.homeTeamScore > match.awayTeamScore,
                  'text-primary font-bold':
                    match.homeTeamScore < match.awayTeamScore,
                  'text-secondary': match.homeTeamScore === match.awayTeamScore,
                }"
              >
                {{ match.homeTeam }}
              </td>
              <td
                :class="{
                  'text-success font-bold':
                    match.awayTeamScore > match.homeTeamScore,
                  'text-primary font-bold':
                    match.awayTeamScore < match.homeTeamScore,
                  'text-secondary': match.awayTeamScore === match.homeTeamScore,
                }"
              >
                {{ match.awayTeam }}
              </td>
              <td>{{ match.homeTeamScore }} - {{ match.awayTeamScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions">
        <router-link to="/create" class="button primary">New Game</router-link>
        <Modal :open="isModalOpen" @close="router.push('/results')">
          <!-- This renders the child route (CreateView) inside the modal -->
          <router-view v-if="isModalOpen" />
        </Modal>
      </div>
    </div>
  </div>
</template>
