<script setup>
import { computed } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import { HGROUP_VARIANTS, renderHgroup } from '../../templates/hgroup.js'

const items = computed(() =>
  HGROUP_VARIANTS.map((v) => ({
    ...v,
    html: renderHgroup({ variant: v.id })
  }))
)
</script>

<template>
  <section id="hgroup" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">02</span>
      <h3 class="tpl-section__title">Hgroup · 見出しグループ</h3>
      <p class="tpl-section__desc">メインタイトル + サブタイトル + 説明文、2 種類のレイアウト</p>
    </header>

    <TemplateCard
      v-for="item in items"
      :key="item.id"
      :name="item.label"
      badge="pd-hgroup"
      :html="item.html"
    />
  </section>
</template>
