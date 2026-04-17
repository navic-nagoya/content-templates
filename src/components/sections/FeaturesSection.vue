<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import {
  defaultFeatureItem,
  FEATURE_VARIANTS,
  renderFeatures
} from '../../templates/features.js'

const countTiles = ref(4)
const countRail = ref(4)
const items = ref(Array.from({ length: 4 }, (_, i) => ({ ...defaultFeatureItem(i) })))

// Keep items long enough for both variants; trim when both counts shrink.
function sync() {
  const n = Math.max(1, countTiles.value, countRail.value)
  if (items.value.length < n) {
    const add = Array.from({ length: n - items.value.length }, (_, i) =>
      defaultFeatureItem(items.value.length + i)
    )
    items.value = [...items.value, ...add]
  } else if (items.value.length > n) {
    items.value = items.value.slice(0, n)
  }
}

const cards = computed(() => {
  sync()
  return FEATURE_VARIANTS.map((v) => ({
    ...v,
    html: renderFeatures({
      count: v.id === 'rail' ? countRail.value : countTiles.value,
      items: items.value,
      variant: v.id
    })
  }))
})
</script>

<template>
  <section id="features" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">06</span>
      <h3 class="tpl-section__title">Features · 特徴データ</h3>
      <p class="tpl-section__desc">
        タイルは角丸の密グリッド、左ボーダー列は左線＋ flex
        逆順で数値を上に表示。いずれも 640px / 1024px
        で列数が変わります。各スタイルごとに項目数とコードを個別に調整できます。文言はプレビュー内を直接編集してください
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-features"
      :html="card.html"
    >
      <template #controls>
        <NumberControl
          v-if="card.id === 'tiles'"
          v-model="countTiles"
          :min="1"
          :max="8"
          label="項目数"
        />
        <NumberControl
          v-else-if="card.id === 'rail'"
          v-model="countRail"
          :min="1"
          :max="8"
          label="項目数"
        />
      </template>
    </TemplateCard>
  </section>
</template>
