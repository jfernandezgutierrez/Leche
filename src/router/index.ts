import { createRouter, createWebHistory } from 'vue-router'
import MapEditor from '@/views/MapEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', component: MapEditor }],
})

export default router
