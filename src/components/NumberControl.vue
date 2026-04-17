<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 12 },
  label: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

function clamp(n) {
  if (Number.isNaN(n)) return props.min
  return Math.max(props.min, Math.min(props.max, n))
}

function set(n) {
  emit('update:modelValue', clamp(n))
}

function onInput(e) {
  const n = parseInt(e.target.value, 10)
  if (!Number.isNaN(n)) set(n)
}
</script>

<template>
  <span class="ctl">
    <span v-if="label" class="ctl__label">{{ label }}</span>
    <span class="ctl-number">
      <button
        type="button"
        :disabled="modelValue <= min"
        @click="set(modelValue - 1)"
        aria-label="減らす"
      >
        −
      </button>
      <input
        type="number"
        :min="min"
        :max="max"
        :value="modelValue"
        @input="onInput"
      />
      <button
        type="button"
        :disabled="modelValue >= max"
        @click="set(modelValue + 1)"
        aria-label="増やす"
      >
        +
      </button>
    </span>
  </span>
</template>
