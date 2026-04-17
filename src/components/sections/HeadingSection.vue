<script setup>
import { computed } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import { HEADING_VARIANTS, renderHeading } from '../../templates/heading.js'

const items = computed(() =>
  HEADING_VARIANTS.map((v) => ({
    ...v,
    html: renderHeading({ variant: v.id })
  }))
)
</script>

<template>
  <section id="heading" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">01</span>
      <h3 class="tpl-section__title">Heading · 見出し</h3>
      <p class="tpl-section__desc">5 種類のスタイル、H2 タグ、個別にコピー可</p>
    </header>

    <TemplateCard
      v-for="item in items"
      :key="item.id"
      :name="item.label"
      badge="pd-heading"
      :html="item.html"
    />
  </section>
</template>
