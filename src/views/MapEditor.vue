<template>
  <div class="relative w-screen h-screen bg-gray-900 text-white overflow-hidden">
    <!-- 🔹 Barra fija arriba -->
    <div
      class="absolute top-0 left-0 w-full flex items-center gap-2 p-3 bg-gray-950 shadow-md z-20"
    >
      <button
        @click="store.addBlock"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
      >
        ➕ Añadir bloque
      </button>
      <button
        @click="store.loadFromFirestore"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
      >
        🔄 Recargar
      </button>
    </div>

    <!-- 🔹 Tablero principal ocupa toda la pantalla -->
    <div ref="mapContainer" class="absolute inset-0 map-background" style="top: 3.5rem">
      <MapBlock v-for="b in store.blocks" :key="b.id" :block="b" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ensureAnonAuth } from '@/services/firebase'
import { useMapStore } from '@/stores/mapStore'
import MapBlock from '@/components/MapBlock.vue'

const store = useMapStore()

onMounted(async () => {
  const uid = await ensureAnonAuth()
  await store.setUid(uid)
})
</script>

<style scoped>
.map-background {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, #222 0%, #111 100%);
  background-image:
    linear-gradient(
      0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-size: 60px 60px;
  border: 6px double #333;
  border-radius: 14px;
  box-shadow:
    inset 0 0 25px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(0, 255, 120, 0.15);
}
</style>
