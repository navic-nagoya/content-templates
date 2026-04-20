<script setup>
import { computed, reactive } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { defaultPackageItem, PACKAGE_VARIANTS, renderPackage } from '../../templates/package.js'

const counts = reactive({
  grid: 4,
  list: 5
})
const items = reactive(Array.from({ length: 5 }, (_, i) => ({ ...defaultPackageItem(i) })))

// Keep items long enough for whichever variant currently has the largest count.
function syncedItems() {
  const n = Math.max(1, counts.grid, counts.list)
  if (items.length < n) {
    for (let i = items.length; i < n; i++) items.push(defaultPackageItem(i))
  } else if (items.length > n) {
    items.splice(n)
  }
  return items
}

const cards = computed(() =>
  PACKAGE_VARIANTS.map((v) => ({
    ...v,
    html: renderPackage({
      count: counts[v.id],
      items: syncedItems(),
      variant: v.id
    })
  }))
)
</script>

<template>
  <section id="package" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">11</span>
      <h3 class="tpl-section__title">Package · 同梱物・セット内容</h3>
      <p class="tpl-section__desc">
        商品パッケージに含まれる内容を一覧表示します。グリッドは画像重視の展示向け、横並びリストは付属品が多い商品向け。文言と数量はプレビュー内を直接編集してください。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-package"
      :html="card.html"
    >
      <template #controls>
        <NumberControl v-model="counts[card.id]" :min="1" :max="10" label="アイテム数" />
      </template>
    </TemplateCard>
  </section>
</template>
