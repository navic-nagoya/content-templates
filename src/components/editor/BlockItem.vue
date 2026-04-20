<script setup>
import { onMounted, ref, watch } from 'vue'
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

// Section blocks: contenteditable preview, mirrors TemplateCard's pattern.
// DOM is initialized once via innerHTML so contenteditable + Vue stay in sync,
// then user edits get pushed back into the store via input events.
const previewRoot = ref(null)
let suppressNextWatch = false

function setDomFromBlock() {
  const el = previewRoot.value
  if (!el) return
  if (el.innerHTML !== props.block.html) {
    el.innerHTML = props.block.html
  }
}

function onPreviewInput() {
  if (!previewRoot.value) return
  suppressNextWatch = true
  updateBlockHtml(props.block.id, previewRoot.value.innerHTML)
}

// Click handlers for media inside a section block. Operators supply URLs from
// Shopify (CDN images, YouTube embed URLs) — uploading is done in Shopify, so
// in-place edits collapse to a couple of prompt() calls.
//
// Iframes swallow pointer events, so the wrapper is what catches the click;
// CSS sets `pointer-events: none` on the iframe inside the editable preview.
function onPreviewClick(e) {
  const root = previewRoot.value
  if (!root) return
  const el = e.target
  if (!el) return

  if (el.tagName === 'IMG') {
    e.preventDefault()
    const nextSrc = window.prompt('画像 URL（Shopify CDN 推奨）', el.getAttribute('src') || '')
    if (nextSrc === null) return
    const nextAlt = window.prompt('alt テキスト（SEO 用、空欄可）', el.getAttribute('alt') || '')
    if (nextAlt === null) return
    el.setAttribute('src', nextSrc)
    el.setAttribute('alt', nextAlt)
    onPreviewInput()
    return
  }

  const videoWrap = el.closest?.('.pd-video__ratio')
  if (videoWrap && root.contains(videoWrap)) {
    e.preventDefault()
    const iframe = videoWrap.querySelector('iframe')
    if (!iframe) return
    const nextSrc = window.prompt(
      '埋め込み URL（例: https://www.youtube.com/embed/XXXX）',
      iframe.getAttribute('src') || ''
    )
    if (nextSrc === null) return
    iframe.setAttribute('src', nextSrc)
    onPreviewInput()
  }
}

onMounted(() => {
  if (props.block.kind === 'section') setDomFromBlock()
})

// React to external html changes (e.g., after duplicate / store load) but
// ignore the round-trip from our own input events.
watch(
  () => props.block.html,
  () => {
    if (suppressNextWatch) {
      suppressNextWatch = false
      return
    }
    if (props.block.kind === 'section') setDomFromBlock()
  }
)
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

    <div
      v-if="block.kind === 'section'"
      ref="previewRoot"
      class="ed-block__preview ed-block__preview--editable"
      contenteditable="true"
      spellcheck="false"
      tabindex="0"
      @input="onPreviewInput"
      @click="onPreviewClick"
    />

    <RichTextEditor
      v-else
      :model-value="block.html"
      @update:model-value="onRichTextUpdate"
    />
  </div>
</template>
