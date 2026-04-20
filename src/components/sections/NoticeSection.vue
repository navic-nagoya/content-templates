<script setup>
import { computed, reactive } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { NOTICE_TONES, renderNotice } from '../../templates/notice.js'

const counts = reactive({
  info: 3,
  warn: 3,
  caution: 3
})

const cards = computed(() =>
  NOTICE_TONES.map((t) => ({
    ...t,
    html: renderNotice({ tone: t.id, count: counts[t.id] })
  }))
)
</script>

<template>
  <section id="notice" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">13</span>
      <h3 class="tpl-section__title">Notice · 注意事項</h3>
      <p class="tpl-section__desc">
        商品の注意事項・法的表示・ご案内などを色分けで表示します。タイトルと各行の文言はプレビュー内を直接編集してください。トーンに合わせて自動的に色が変わります。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-notice"
      :html="card.html"
    >
      <template #controls>
        <NumberControl v-model="counts[card.id]" :min="1" :max="8" label="行数" />
      </template>
    </TemplateCard>
  </section>
</template>
