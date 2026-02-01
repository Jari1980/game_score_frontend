<template>
  <div class="outer-scroll overflow-x-auto">
    <div
      class="games-list main-border modal-static modal-overflow w-max public-league"
    >
      <h1 class="text-3xl">Public League</h1>

      <section class="info" v-if="info">
        <h2>Info</h2>
        <pre>{{ info }}</pre>
      </section>

      <section class="filter mt-4">
        <h2>Filter by teams</h2>

        <form @submit.prevent="applyFilter">
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
          <select
            v-model="selectedTeams"
            class="team-select"
            multiple
            size="4"
            @change="onTeamsChange"
          >
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
            <option value="Team C">Team C</option>
            <option value="Team D">Team D</option>
          </select>

          <button type="submit" class="button primary">Apply filter</button>
        </form>

        <p v-if="!allSelected && selectedTeams.length" class="mt-2">
          Showing matches for {{ selectedTeams.join(', ') }}.
        </p>

        <p
          v-if="
            !allSelected &&
            selectedTeams.length &&
            !visibleMatches.length &&
            !filterError
          "
          class="mt-2"
        >
          No matches found for the selected teams.
        </p>

        <p v-if="filterError" class="error">
          {{ filterError }}
        </p>
      </section>

      <!-- Single table: shows either all matches or filtered ones.
           Hidden when filter is active and returns empty. -->
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

const info = ref<unknown | null>(null);
const matches = ref<any[]>([]);
const filteredMatches = ref<any[]>([]);
const selectedTeams = ref<string[]>([]);
const allSelected = ref(true);
const filterError = ref<string | null>(null);

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

<style scoped>
.public-league {
  padding: 1.5rem;
}
.info,
.teams,
.filter {
  margin-top: 1.5rem;
}

.filter form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.all-toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* dropdown styling */
.team-select {
  background-color: #000;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.25rem 0.5rem;
  min-width: 8rem;
}

.team-select option {
  background-color: #000;
  color: #fff;
}

.error {
  color: #c00;
  margin-top: 0.5rem;
}
</style>
