<script setup>
import { computed, reactive } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { defaultFeatureItem, FEATURE_VARIANTS, renderFeature } from '../../templates/feature.js'

const counts = reactive({
  cards: 3,
  icons: 6,
  split: 4,
  heroSpecs: 6,
  specGrid: 6,
  stackedMedia: 3,
  heroAside: 4,
  panels: 4,
  detailGallery: 4
})
const items = reactive(Array.from({ length: 6 }, (_, i) => ({ ...defaultFeatureItem(i) })))

// Keep items long enough for whichever variant currently has the largest count.
function syncedItems() {
  const n = Math.max(
    1,
    counts.cards,
    counts.icons,
    counts.split,
    counts.heroSpecs,
    counts.specGrid,
    counts.stackedMedia,
    counts.heroAside,
    counts.panels,
    counts.detailGallery
  )
  if (items.length < n) {
    for (let i = items.length; i < n; i++) items.push(defaultFeatureItem(i))
  } else if (items.length > n) {
    items.splice(n)
  }
  return items
}

const cards = computed(() =>
  FEATURE_VARIANTS.map((v) => ({
    ...v,
    html: renderFeature({
      count: counts[v.id],
      items: syncedItems(),
      variant: v.id
    })
  }))
)
</script>

<template>
  <section id="feature" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">05</span>
      <h3 class="tpl-section__title">Feature · フィーチャー</h3>
      <p class="tpl-section__desc">
        商品の特性を伝える複数レイアウトを用意しています。画像カード・アイコングリッド・画像＋リストに加え、フル幅ヒーロー＋仕様表、文案と2×2画像の分割、大画像とテキストの積み重ね、半幅ヒーロー＋サイド仕様、カテゴリ見出し付きの縦並びブロック、メイン＋サムネ付きギャラリーなどがあります。参照元は
        Tailwind UI の Product feature 系パターンです（タブ UI は運用向けに縦並びの静的ブロックとして再構成）。アイコンは 64×64
        程度の正方形画像 URL に置き換えてください。文言はプレビュー内を直接編集できます。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-feature"
      :html="card.html"
    >
      <template #controls>
        <NumberControl v-model="counts[card.id]" :min="1" :max="8" label="項目数" />
      </template>
    </TemplateCard>
  </section>
</template>
