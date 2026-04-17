<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  label: { type: String, default: 'コードをコピー' },
  variant: { type: String, default: 'primary' } // 'primary' | 'ghost'
})

const copied = ref(false)
let timer = null

async function copy() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.text)
    } else {
      // Fallback for non-secure contexts (e.g. http:// during local dev).
      const ta = document.createElement('textarea')
      ta.value = props.text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1400)
  } catch (err) {
    console.error('[CopyButton] copy failed', err)
    alert('コピーに失敗しました。コードを手動で選択してコピーしてください。')
  }
}
</script>

<template>
  <button
    type="button"
    class="btn"
    :class="[
      variant === 'primary' ? 'btn--primary' : 'btn--ghost',
      copied ? 'is-copied' : ''
    ]"
    @click="copy"
  >
    {{ copied ? 'コピー済み ✓' : label }}
  </button>
</template>
