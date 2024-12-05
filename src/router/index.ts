import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/home/index.vue';
import Layout from '../layout/index.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
