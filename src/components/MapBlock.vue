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
    @dblclick="editing = !editing"
  >
    <template v-if="!editing">
      <div class="text-center text-sm p-1">
        <strong>{{ block.label }}</strong
        ><br />
        <span>{{ block.text }}</span>
      </div>
      <button
        class="absolute top-0 right-0 bg-red-600 text-xs rounded-bl text-white px-1"
        @click.stop="store.deleteBlock(block.id)"
      >
        ✖
      </button>
    </template>

    <div v-else class="bg-white text-black p-2 rounded shadow-lg flex flex-col gap-1 items-center">
      <input v-model="localBlock.label" placeholder="Etiqueta" class="border w-20 p-1" />
      <input v-model="localBlock.text" placeholder="Texto" class="border w-32 p-1" />
      <input type="color" v-model="localBlock.color" />
      <button class="text-xs bg-blue-600 text-white px-2 py-1 rounded" @click="applyChanges">
        OK
      </button>
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
const editing = ref(false)
const localBlock = ref({ ...props.block })

watch(
  () => props.block,
  (val) => (localBlock.value = { ...val }),
  { deep: true },
)

function applyChanges() {
  store.updateBlock(props.block.id, { ...localBlock.value })
  editing.value = false
}

onMounted(async () => {
  await nextTick()
  if (!blockEl.value) return

  interact(blockEl.value).draggable({
    inertia: false,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent', // no salir del tablero
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
