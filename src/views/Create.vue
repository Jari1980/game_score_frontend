<script setup lang="ts">
import { ref } from "vue";
import type { CreateMatch } from "../data/matchModels";
import { createMatch } from "../data/create";

const form = ref<CreateMatch>({
  matchDate: "",
  homeTeam: "",
  awayTeam: "",
  homeTeamScore: 0,
  awayTeamScore: 0,
});

const submitting = ref(false);
const error = ref<string | null>(null);
const statusCode = ref<number | null>(null);

const submit = async () => {
  try {
    submitting.value = true;
    error.value = null;
    statusCode.value = null;

    const status = await createMatch("/api/matches", form.value);
    statusCode.value = status;
  } catch (e: any) {
    error.value = e?.message ?? "Unknown error";
  } finally {
    submitting.value = false;
  }
};
</script>

<!-- wrote my own form, replace with something like shadcn -->
<!-- TODO: remove extra padding above input form -->
<template>
  <div class="page">
    <form class="match-form" @submit.prevent="submit">
      <label>
        Date
        <input v-model="form.matchDate" type="date" />
      </label>

      <label>
        Home team
        <input v-model="form.homeTeam" type="text" />
      </label>

      <label>
        Away team
        <input v-model="form.awayTeam" type="text" />
      </label>

      <label>
        Home score
        <input v-model.number="form.homeTeamScore" type="number" />
      </label>

      <label>
        Away score
        <input v-model.number="form.awayTeamScore" type="number" />
      </label>

      <button type="submit" :disabled="submitting">
        {{ submitting ? "Creating..." : "Create match" }}
      </button>

      <p v-if="statusCode !== null" class="status">Status: {{ statusCode }}</p>
      <p v-if="error" class="error">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.match-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: #111;
  border-radius: 8px;
  border: 1px solid #333;
  width: 100%;
  max-width: 500px;
}

.match-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.match-form input {
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #000;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
}

.match-form input:focus {
  outline: none;
  border-color: #888;
}

/* make calendar picker not hidden by black background */
.match-form input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.9);
  cursor: pointer;
}

button[type="submit"] {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #fff;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  color: #9acd32;
}

.error {
  color: #ff6b6b;
}
</style>
