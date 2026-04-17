<script setup>
import CopyButton from './CopyButton.vue'

defineProps({
  name: { type: String, required: true },
  badge: { type: String, default: '' },
  html: { type: String, required: true }
})
</script>

<template>
  <div class="tpl-card">
    <div class="tpl-card__head">
      <h4 class="tpl-card__name">{{ name }}</h4>
      <span v-if="badge" class="tpl-card__badge">{{ badge }}</span>
      <div class="tpl-card__controls">
        <slot name="controls" />
      </div>
    </div>

    <!-- Live preview renders the exact HTML operators will paste into Shopify. -->
    <div class="tpl-card__preview" v-html="html"></div>

    <slot name="fields" />

    <div class="tpl-card__code">
      <div class="tpl-card__code-head">
        <span class="tpl-card__code-title">HTML · Shopify 商品説明に貼り付け</span>
        <div class="tpl-card__code-actions">
          <CopyButton :text="html" label="コードをコピー" />
        </div>
      </div>
      <pre><code>{{ html }}</code></pre>
    </div>
  </div>
</template>
