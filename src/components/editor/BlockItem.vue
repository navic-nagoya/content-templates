<script setup>
import RichTextEditor from './RichTextEditor.vue'
import {
  draftStore,
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockHtml
} from '../../store/draft.js'

const props = defineProps({
  block: { type: Object, required: true },
  index: { type: Number, required: true }
})

const isFirst = () => props.index === 0
const isLast = () => props.index === draftStore.blocks.length - 1

function onRichTextUpdate(html) {
  updateBlockHtml(props.block.id, html)
}

function confirmRemove() {
  if (window.confirm('このブロックを削除しますか？')) {
    removeBlock(props.block.id)
  }
}
</script>

<template>
  <div class="ed-block" :class="`ed-block--${block.kind}`">
    <div class="ed-block__bar">
      <span class="ed-block__index">#{{ index + 1 }}</span>
      <span class="ed-block__kind">{{ block.kind === 'richtext' ? '本文テキスト' : (block.label || 'セクション') }}</span>
      <span v-if="block.badge" class="ed-block__badge">{{ block.badge }}</span>
      <span class="ed-block__spacer" />
      <button type="button" class="ed-block__btn" :disabled="isFirst()" @click="moveBlock(block.id, -1)" title="上へ">↑</button>
      <button type="button" class="ed-block__btn" :disabled="isLast()" @click="moveBlock(block.id, 1)" title="下へ">↓</button>
      <button type="button" class="ed-block__btn" @click="duplicateBlock(block.id)" title="複製">⧉</button>
      <button type="button" class="ed-block__btn ed-block__btn--danger" @click="confirmRemove" title="削除">🗑</button>
    </div>

    <div v-if="block.kind === 'section'" class="ed-block__preview" v-html="block.html" />

    <RichTextEditor
      v-else
      :model-value="block.html"
      @update:model-value="onRichTextUpdate"
    />
  </div>
</template>
