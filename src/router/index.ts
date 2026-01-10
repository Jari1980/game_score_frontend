import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import HomeView from "../views/Home.vue";
import ResultsView from "../views/GameResults.vue";
import CreateView from "../views/Create.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    props: {
      welcomeText: "Hello, World!",
      descriptionText: "Create and view game scores",
    },
  },
  { path: "/results", name: "Results", component: ResultsView },
  { path: "/create", name: "Create", component: CreateView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
