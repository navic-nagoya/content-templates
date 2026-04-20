<script setup>
import { addRichTextBlock } from '../../store/draft.js'

const props = defineProps({
  position: { type: Number, required: true }
})

defineEmits(['go-library'])

function insertText() {
  addRichTextBlock(props.position)
}
</script>

<template>
  <div class="ed-insert">
    <span class="ed-insert__line" />
    <button type="button" class="ed-insert__btn" @click="insertText">＋ テキスト挿入</button>
    <button type="button" class="ed-insert__btn ed-insert__btn--ghost" @click="$emit('go-library')">
      ＋ ライブラリから追加
    </button>
    <span class="ed-insert__line" />
  </div>
</template>
