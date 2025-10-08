<template>
  <div
    class="map-block absolute rounded shadow-md flex flex-col items-center justify-center text-white select-none"
    :style="{
      color: '#000',
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
    <v-dialog v-model="showDialog" max-width="420" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Editar bloque {{ block.label }}
        </v-card-title>

        <v-card-text>
          <v-text-field label="Etiqueta" v-model="localBlock.label" density="comfortable" />
          <v-text-field label="Texto" v-model="localBlock.text" density="comfortable" />
          <v-textarea label="Anotaciones" v-model="localBlock.notes" rows="3" auto-grow />
          <div class="mt-3">
            <label class="text-sm font-semibold">Color:</label>
            <input type="color" v-model="localBlock.color" class="ml-2 h-8 w-16 rounded border" />
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="showDialog = false">Cancelar</v-btn>
          <v-btn color="green" variant="flat" @click="applyChanges">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
