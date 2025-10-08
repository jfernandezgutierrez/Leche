<template>
  <div
    class="map-block absolute rounded shadow-md flex flex-col items-center justify-center text-white select-none"
    :style="{
      left: block.x + 'px',
      top: block.y + 'px',
      width: block.width + 'px',
      height: block.height + 'px',
      background: block.color || '#4b4b4b',
      position: 'absolute',
    }"
    ref="blockEl"
    @mousedown.stop
  >
    <!-- 🔸 Contenido principal -->
    <div class="text-center text-sm p-1">
      <strong>{{ block.label }}</strong
      ><br />
      <span>{{ block.text }}</span>
    </div>

    <!-- 🔸 Botones -->
    <div class="absolute top-0 right-0 flex">
      <button
        class="bg-blue-600 hover:bg-blue-700 text-xs text-white px-1 rounded-bl"
        @click.stop="openDialog"
      >
        ✏️
      </button>
      <button
        class="bg-red-600 hover:bg-red-700 text-xs text-white px-1 rounded-bl"
        @click.stop="store.deleteBlock(block.id)"
      >
        ✖
      </button>
    </div>

    <!-- 🔹 Modal -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white text-gray-900 rounded-lg p-6 w-96 shadow-2xl relative">
        <h2 class="text-lg font-bold mb-4 text-center">Editar bloque {{ block.label }}</h2>

        <div class="flex flex-col gap-3">
          <label class="text-sm font-semibold">Etiqueta:</label>
          <input v-model="localBlock.label" class="border rounded p-2" />

          <label class="text-sm font-semibold">Texto:</label>
          <input v-model="localBlock.text" class="border rounded p-2" />

          <label class="text-sm font-semibold">Anotaciones:</label>
          <textarea
            v-model="localBlock.notes"
            rows="3"
            class="border rounded p-2 resize-none"
            placeholder="Notas adicionales sobre este bloque..."
          ></textarea>

          <label class="text-sm font-semibold">Color:</label>
          <input type="color" v-model="localBlock.color" class="w-20 h-8 border rounded" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="closeDialog"
            class="px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancelar
          </button>
          <button
            @click="applyChanges"
            class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import interact from 'interactjs'
import { useMapStore } from '@/stores/mapStore'

const props = defineProps<{ block: any }>()
const store = useMapStore()

const blockEl = ref<HTMLElement | null>(null)
const showDialog = ref(false)
const localBlock = ref({ ...props.block })

watch(
  () => props.block,
  (val) => (localBlock.value = { ...val }),
  { deep: true },
)

function openDialog() {
  showDialog.value = true
}
function closeDialog() {
  showDialog.value = false
}
function applyChanges() {
  store.updateBlock(props.block.id, { ...localBlock.value })
  showDialog.value = false
}

onMounted(async () => {
  await nextTick()
  if (!blockEl.value) return

  interact(blockEl.value).draggable({
    inertia: false,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true,
      }),
    ],
    listeners: {
      move(event) {
        const x = props.block.x + event.dx
        const y = props.block.y + event.dy
        store.updateBlock(props.block.id, { x, y })
      },
    },
  })
})
</script>
