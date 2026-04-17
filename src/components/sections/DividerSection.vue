<script setup>
import { computed } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import { DIVIDER_VARIANTS, renderDivider } from '../../templates/divider.js'

const cards = computed(() =>
  DIVIDER_VARIANTS.map((v) => ({
    ...v,
    html: renderDivider({ variant: v.id })
  }))
)
</script>

<template>
  <section id="divider" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">12</span>
      <h3 class="tpl-section__title">Divider · 区切り線</h3>
      <p class="tpl-section__desc">
        セクション間に入れる区切り線です。中央テキスト・中央アイコン・左揃えテキストの 3 種類。プレビュー内でラベル文言を直接編集できます。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-divider"
      :html="card.html"
    />
  </section>
</template>
