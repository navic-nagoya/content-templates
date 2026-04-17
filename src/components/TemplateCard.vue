<script setup>
import { ref } from 'vue'
import CopyButton from './CopyButton.vue'

defineProps({
  name: { type: String, required: true },
  badge: { type: String, default: '' },
  html: { type: String, required: true }
})

// Tab state: 'preview' (default) renders the live HTML, 'code' shows the raw
// HTML string that operators paste into Shopify. Inspired by Tailwind UI's
// block gallery pattern (tailwindcss.com/plus/ui-blocks).
const tab = ref('preview')
</script>

<template>
  <div class="tpl-card">
    <div class="tpl-card__head">
      <h4 class="tpl-card__name">{{ name }}</h4>
      <span v-if="badge" class="tpl-card__badge">{{ badge }}</span>

      <div class="tpl-card__controls">
        <slot name="controls" />
      </div>

      <div class="tpl-card__tabs" role="tablist" aria-label="表示切替">
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'preview'"
          :class="{ 'is-active': tab === 'preview' }"
          @click="tab = 'preview'"
        >
          プレビュー
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'code'"
          :class="{ 'is-active': tab === 'code' }"
          @click="tab = 'code'"
        >
          コード
        </button>
      </div>

      <CopyButton :text="html" label="コードをコピー" />
    </div>

    <!-- Live preview renders the exact HTML operators will paste into Shopify. -->
    <div
      v-show="tab === 'preview'"
      class="tpl-card__preview"
      v-html="html"
    ></div>

    <div v-show="tab === 'code'" class="tpl-card__code">
      <pre><code>{{ html }}</code></pre>
    </div>

    <slot name="fields" />
  </div>
</template>
