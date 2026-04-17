<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="ctl-switch">
    <span v-if="label" class="ctl__label">{{ label }}</span>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="ctl-switch__track" aria-hidden="true"></span>
  </label>
</template>
