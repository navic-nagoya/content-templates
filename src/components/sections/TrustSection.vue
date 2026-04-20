<script setup>
import { computed, reactive } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { defaultTrustItem, TRUST_VARIANTS, renderTrust } from '../../templates/trust.js'

const counts = reactive({
  band: 4,
  cards: 4
})
const items = reactive(Array.from({ length: 4 }, (_, i) => ({ ...defaultTrustItem(i) })))

function syncedItems() {
  const n = Math.max(1, counts.band, counts.cards)
  if (items.length < n) {
    for (let i = items.length; i < n; i++) items.push(defaultTrustItem(i))
  } else if (items.length > n) {
    items.splice(n)
  }
  return items
}

const cards = computed(() =>
  TRUST_VARIANTS.map((v) => ({
    ...v,
    html: renderTrust({
      count: counts[v.id],
      items: syncedItems(),
      variant: v.id
    })
  }))
)
</script>

<template>
  <section id="trust" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">12</span>
      <h3 class="tpl-section__title">Trust · 安心ポイント・認証</h3>
      <p class="tpl-section__desc">
        正規代理店・保証・送料・認証バッジ・受賞歴などの信頼情報を一覧表示します。Feature
        アイコン型より文字が短く、密度高めです。アイコンは 64×64 程度の画像 URL
        に置き換えてください。文言はプレビュー内を直接編集できます。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-trust"
      :html="card.html"
    >
      <template #controls>
        <NumberControl v-model="counts[card.id]" :min="1" :max="6" label="項目数" />
      </template>
    </TemplateCard>
  </section>
</template>
