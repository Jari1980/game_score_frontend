<script setup lang="ts">
import { ref, onMounted } from "vue";

import { fetchWithFallback } from "../data/fetch";
import { matches as mockMatches } from "../data/mock/matches";
import type { GetMatch } from "../data/matchModels";
import { API_ENDPOINT } from "../data/consts";

const matches = ref<GetMatch[]>([]);
const endpoint = API_ENDPOINT + "/match";

onMounted(async () => {
  matches.value = await fetchWithFallback<GetMatch[]>(endpoint, mockMatches);
});
</script>

<template>
  <div class="results">
    <h1>Match Results</h1>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Home</th>
          <th>Away</th>
          <th>Score</th>
        </tr>
      </thead>

      <!-- highlight winning team -->
      <tbody>
        <tr v-for="match in matches" :key="match.matchId">
          <td>{{ match.matchDate }}</td>
          <td :class="{ winner: match.homeTeamScore > match.awayTeamScore }">
            {{ match.homeTeam }}
          </td>
          <td :class="{ winner: match.awayTeamScore > match.homeTeamScore }">
            {{ match.awayTeam }}
          </td>
          <td>{{ match.homeTeamScore }} - {{ match.awayTeamScore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.results {
  max-width: 800px;
  margin: 2rem auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  color: gray;
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: center;
}

th {
  background: #ffcfcf;
}

.winner {
  font-weight: bold;
  color: green;
}
</style>
