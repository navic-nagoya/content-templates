<script setup>
import { computed } from 'vue'
import BlockItem from '../components/editor/BlockItem.vue'
import InsertBar from '../components/editor/InsertBar.vue'
import CopyButton from '../components/CopyButton.vue'
import Icon from '../components/Icon.vue'
import { draftStore, clearDraft, combinedHtml, addRichTextBlock } from '../store/draft.js'

defineEmits(['close-drawer'])

const html = computed(() => combinedHtml())
const blockCount = computed(() => draftStore.blocks.length)

function confirmClear() {
  if (window.confirm('下書きを全て削除しますか？この操作は元に戻せません。')) {
    clearDraft()
  }
}

function startWithText() {
  addRichTextBlock(0)
}
</script>

<template>
  <div class="ed-shell">
    <header class="ed-toolbar">
      <div class="ed-toolbar__title">
        <h2>エディター · 商品説明の組み立て</h2>
        <p class="ed-toolbar__hint">
          ライブラリで集めたセクションを並び替え、間に本文テキストを挿入できます。
          完成したら「全 HTML をコピー」して Shopify の HTML モードに貼り付けてください。
        </p>
      </div>
      <div class="ed-toolbar__actions">
        <span class="ed-toolbar__count">{{ blockCount }} ブロック</span>
        <button
          type="button"
          class="btn btn--ghost"
          :disabled="!blockCount"
          @click="confirmClear"
        >
          全削除
        </button>
        <CopyButton
          :text="html"
          label="全 HTML をコピー"
          variant="primary"
        />
      </div>
    </header>

    <div v-if="!blockCount" class="ed-empty">
      <h3>下書きはまだ空です</h3>
      <p>ライブラリからセクションを追加するか、本文テキストブロックから始めましょう。</p>
      <div class="ed-empty__actions">
        <button type="button" class="btn btn--primary" @click="$emit('close-drawer')">
          ライブラリへ戻る
        </button>
        <button type="button" class="btn btn--ghost" @click="startWithText">
          <Icon name="plus" :size="14" />
          <span>テキストブロックを追加</span>
        </button>
      </div>
    </div>

    <div v-else class="ed-list">
      <InsertBar :position="0" @go-library="$emit('close-drawer')" />
      <template v-for="(b, i) in draftStore.blocks" :key="b.id">
        <BlockItem :block="b" :index="i" />
        <InsertBar :position="i + 1" @go-library="$emit('close-drawer')" />
      </template>
    </div>
  </div>
</template>
