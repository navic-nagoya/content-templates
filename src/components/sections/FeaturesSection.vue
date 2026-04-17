<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { defaultFeatureItem, renderFeatures } from '../../templates/features.js'

const count = ref(4)
const items = ref(Array.from({ length: 4 }, (_, i) => ({ ...defaultFeatureItem(i) })))

// Resize items array whenever count changes, preserving existing edits.
function sync() {
  if (items.value.length < count.value) {
    const add = Array.from({ length: count.value - items.value.length }, (_, i) =>
      defaultFeatureItem(items.value.length + i)
    )
    items.value = [...items.value, ...add]
  } else if (items.value.length > count.value) {
    items.value = items.value.slice(0, count.value)
  }
}

const html = computed(() => {
  sync()
  return renderFeatures({ count: count.value, items: items.value })
})
</script>

<template>
  <section id="features" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">06</span>
      <h3 class="tpl-section__title">Features · 特徴データ</h3>
      <p class="tpl-section__desc">
        角丸グリッド＋細い隙間のスタイル。640px 以上で 2 列、1024px 以上で最大 4 列。項目ごとに編集可
      </p>
    </header>

    <TemplateCard name="データカード" badge="pd-features" :html="html">
      <template #controls>
        <NumberControl v-model="count" :min="1" :max="8" label="項目数" />
      </template>
      <template #fields>
        <div class="tpl-fields">
          <h5>データ編集（変更は即座にプレビューとコードへ反映）</h5>
          <div class="tpl-field" v-for="(it, i) in items" :key="i">
            <label>{{ i + 1 }} 番目</label>
            <input v-model="it.value" placeholder="48H" />
            <input v-model="it.label" placeholder="超長時間バッテリー" />
          </div>
        </div>
      </template>
    </TemplateCard>
  </section>
</template>
