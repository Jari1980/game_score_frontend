<template>
  <div class="outer-scroll overflow-x-auto">
    <div
      class="public-league main-border modal-static modal-overflow w-max min-h-100"
    >
      <h1 class="text-3xl">Public League</h1>
      <section v-if="info" class="info">
        <h2>Info</h2>
        <pre>{{ info }}</pre>
      </section>
      <section
        class="filter flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between"
      >
        <h2 class="font-bold">Filter by teams</h2>

        <form
          @submit.prevent="applyFilter"
          class="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <!-- All: query all public-league matches, unselects Team A–D -->
          <label class="all-toggle">
            <input
              type="checkbox"
              v-model="allSelected"
              @change="onAllToggle"
            />
            All
          </label>

          <!-- Team A–D multiselect, shift click to select >=1 -->
          <Select type="select">
            <template #header="{ isOpen }">
              <span :class="{ underline: !isOpen }">{{
                selectedTeams.length
                  ? `${selectedTeams.length} team(s) selected`
                  : 'Select teams'
              }}</span>
            </template>
            <template #body="{ toggleDropdown }">
              <div class="flex flex-col gap-2">
                <label
                  v-for="team in availableTeams"
                  :key="team"
                  class="flex items-center gap-2 whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    :value="team"
                    v-model="selectedTeams"
                    @change="onTeamsChange"
                  />
                  {{ team }}
                </label>
              </div>
            </template>
          </Select>

          <button type="submit" class="button primary">Apply filter</button>
        </form>
      </section>
      <hr />
      <!-- Single table: shows either all matches or filtered ones.
           Hidden when filter is active and returns empty. -->
      <p v-if="!allSelected && selectedTeams.length">
        Showing matches for {{ selectedTeams.join(', ') }}.
      </p>

      <p
        v-if="
          !allSelected &&
          selectedTeams.length &&
          !visibleMatches.length &&
          !filterError
        "
        class="text-error"
      >
        No matches found for the selected teams.
      </p>

      <p v-if="filterError" class="text-error">
        {{ filterError }}
      </p>
      <div class="the-table" v-if="visibleMatches.length">
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
            <tr
              v-for="match in visibleMatches"
              :key="match.createdAt + match.homeTeam + match.awayTeam"
            >
              <td>{{ formatDate(match.matchDate) }}</td>

              <td
                :class="{
                  'text-success font-bold': match.homeScore > match.awayScore,
                  'text-primary font-bold': match.homeScore < match.awayScore,
                  'text-secondary': match.homeScore === match.awayScore,
                }"
              >
                {{ match.homeTeam }}
              </td>

              <td
                :class="{
                  'text-success font-bold': match.awayScore > match.homeScore,
                  'text-primary font-bold': match.awayScore < match.homeScore,
                  'text-secondary': match.awayScore === match.homeScore,
                }"
              >
                {{ match.awayTeam }}
              </td>

              <td>{{ match.homeScore }} - {{ match.awayScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { API_ENDPOINT } from '@/data/consts';
import { formatDate } from '@/utils/general';
import { matches as mockMatches } from '@/data/mock/matches';
import Select from '@/components/Select.vue';

// Constants
const availableTeams = ['Team A', 'Team B', 'Team C', 'Team D'];

// Refs
const info = ref<unknown | null>(null);
//const matches = ref<any[]>([]);
const matches = ref<any[]>(mockMatches);
const filteredMatches = ref<any[]>([]);
const selectedTeams = ref<string[]>([]);
const allSelected = ref(true);
const filterError = ref<string | null>(null);

// Methods

async function loadInfo() {
  const res = await fetch(API_ENDPOINT);
  if (!res.ok) return;
  info.value = await res.json();
}

async function loadMatches() {
  const res = await fetch(`${API_ENDPOINT}/public-league/matches`);
  if (!res.ok) return;
  matches.value = await res.json();
}

// clear Team A–D when All is toggled on
function onAllToggle() {
  if (allSelected.value) {
    selectedTeams.value = [];
    filteredMatches.value = [];
  }
}

// opposite of onAllToggle: turn off All when teams selected
function onTeamsChange() {
  if (selectedTeams.value.length > 0) {
    allSelected.value = false;
  }
}

// decide which list table should show
const visibleMatches = computed(() => {
  // Filtering mode: if All is off
  if (!allSelected.value) {
    //filter returns no results
    if (filteredMatches.value.length === 0) {
      return [];
    }
    return filteredMatches.value;
  }

  // "All" mode: show all matches
  return matches.value;
});

async function applyFilter() {
  filterError.value = null;
  filteredMatches.value = [];

  // query all
  if (allSelected.value || selectedTeams.value.length === 0) {
    await loadMatches();
    return;
  }

  // query Teams A–D
  const body = { teams: selectedTeams.value };

  const res = await fetch(`${API_ENDPOINT}/public-league/matches/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    filterError.value = 'Invalid team filter or server error.';
    return;
  }

  filteredMatches.value = await res.json();
}

onMounted(async () => {
  await Promise.all([loadInfo(), loadMatches()]);
});
</script>
