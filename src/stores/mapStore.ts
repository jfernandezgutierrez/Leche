import { defineStore } from 'pinia'
import { ref, watch, nextTick } from 'vue'
import { nanoid } from 'nanoid'
import { db } from '@/services/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export const useMapStore = defineStore('map', () => {
  const blocks = ref<any[]>([])
  const uid = ref<string>('')

  async function setUid(id: string) {
    uid.value = id
    await loadFromFirestore()
  }

  function addBlock() {
    blocks.value.push({
      id: nanoid(),
      label: `${blocks.value.length + 1}`,
      text: 'Nuevo bloque',
      color: '#888888',
      width: 100,
      height: 50,
      x: Math.random() * 300,
      y: Math.random() * 200,
    })
    debounceSave()
  }

  function updateBlock(id: string, data: Partial<any>) {
    const block = blocks.value.find((b) => b.id === id)
    if (block) Object.assign(block, data)
    debounceSave()
  }

  function deleteBlock(id: string) {
    blocks.value = blocks.value.filter((b) => b.id !== id)
    debounceSave()
  }

  // === Firestore ===
  async function saveToFirestore() {
    if (!uid.value) return
    const refDoc = doc(db, 'maps', uid.value)
    await setDoc(refDoc, { blocks: blocks.value, updated: serverTimestamp() })
  }

  async function loadFromFirestore() {
    if (!uid.value) return
    const refDoc = doc(db, 'maps', uid.value)
    const snap = await getDoc(refDoc)
    if (snap.exists()) blocks.value = snap.data().blocks || []
  }

  // === Debounce para no saturar Firebase ===
  let saveTimeout: any
  function debounceSave() {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => nextTick(saveToFirestore), 500)
  }

  return { blocks, addBlock, updateBlock, deleteBlock, setUid, loadFromFirestore }
})
