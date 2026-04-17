<script setup>
// Like NumberControl but structure is changed only via +/- (no typing).
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
</script>

<template>
  <span class="ctl">
    <span v-if="label" class="ctl__label">{{ label }}</span>
    <span class="ctl-number">
      <button
        type="button"
        :disabled="modelValue <= min"
        aria-label="減らす"
        @click="set(modelValue - 1)"
      >
        −
      </button>
      <span class="ctl-number__value">{{ modelValue }}</span>
      <button
        type="button"
        :disabled="modelValue >= max"
        aria-label="増やす"
        @click="set(modelValue + 1)"
      >
        +
      </button>
    </span>
  </span>
</template>
