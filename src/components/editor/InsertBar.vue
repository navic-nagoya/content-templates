<script setup>
import Icon from '../Icon.vue'
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
    <button type="button" class="ed-insert__btn" @click="insertText">
      <Icon name="plus" :size="12" />
      <span>テキスト挿入</span>
    </button>
    <button type="button" class="ed-insert__btn ed-insert__btn--ghost" @click="$emit('go-library')">
      <Icon name="plus" :size="12" />
      <span>ライブラリから追加</span>
    </button>
    <span class="ed-insert__line" />
  </div>
</template>
