<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string
  label: string
  minLength?: number
  storageKey: string
  placeholder?: string
}>()


const emit = defineEmits(['update:modelValue'])

const input = ref(props.modelValue || '')
const suggestions = ref<string[]>([])
const minLength = computed(() => props.minLength ?? 2);

watch(input, (val) => {
  emit('update:modelValue', val)

  if (input.value.length >= minLength.value) {
    const history = JSON.parse(localStorage.getItem(props.storageKey) || '[]')
    suggestions.value = history
      .filter((item: string) => item.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5)
  } else {
    suggestions.value = []
  }
})

function selectSuggestion(s: string) {
  input.value = s
  suggestions.value = []
}

function saveToLocalStorage() {
  const trimmed = input.value.trim()
  if (!trimmed) return

  let history = JSON.parse(localStorage.getItem(props.storageKey) || '[]')
  if (!history.includes(trimmed)) {
    history.unshift(trimmed)
    if (history.length > 20) history = history.slice(0, 20) // limite à 20 entrées
    localStorage.setItem(props.storageKey, JSON.stringify(history))
  }
}
</script>

<template>
  <div>
    <label>{{ label }}</label>
    <input
      type="text"
      v-model="input"
      @blur="saveToLocalStorage"
      :placeholder="props.placeholder ?? props.label"
      class="input"
    />

    <ul v-if="suggestions.length" class="suggestions">
      <li v-for="s in suggestions" :key="s" @click="selectSuggestion(s)">
        {{ s }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
.suggestions {
  border: 1px solid #ccc;
  border-top: none;
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  max-height: 150px;
  overflow-y: auto;
}
.suggestions li {
  padding: 0.5rem;
  cursor: pointer;
}
.suggestions li:hover {
  background: #eee;
}
</style>
