<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 16 }
})

// Inline every SVG at build time so we can strip the fixed fill/size attrs
// and let CSS drive color (currentColor) and dimensions.
const sources = import.meta.glob('../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true
})

const lookup = Object.fromEntries(
  Object.entries(sources).map(([path, raw]) => {
    const file = path.split('/').pop().replace(/\.svg$/, '')
    const cleaned = raw
      .replace(/\sfill="[^"]*"/g, '')
      .replace(/\swidth="[^"]*"/g, '')
      .replace(/\sheight="[^"]*"/g, '')
    return [file, cleaned]
  })
)

const dim = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size
)
const svg = computed(() => lookup[props.name] || '')
</script>

<template>
  <span
    class="icon"
    aria-hidden="true"
    :style="{ width: dim, height: dim }"
    v-html="svg"
  />
</template>
