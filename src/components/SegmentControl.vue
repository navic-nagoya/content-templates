<script setup>
defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true }, // [{id, label}]
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <span class="ctl">
    <span v-if="label" class="ctl__label">{{ label }}</span>
    <span class="ctl-segment">
      <button
        v-for="opt in options"
        :key="opt.id"
        type="button"
        :class="{ 'is-active': modelValue === opt.id }"
        @click="$emit('update:modelValue', opt.id)"
      >
        {{ opt.label }}
      </button>
    </span>
  </span>
</template>
