<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import StepControl from '../StepControl.vue'
import {
  defaultCompareProduct,
  defaultCompareRow,
  renderCompare
} from '../../templates/compare.js'

const cols = ref(3)
const rowCount = ref(5)

const products = ref(
  Array.from({ length: cols.value }, (_, i) => ({ ...defaultCompareProduct(i) }))
)
const rows = ref(
  Array.from({ length: rowCount.value }, (_, i) => {
    const r = defaultCompareRow(i, cols.value)
    return { hint: r.hint, values: [...r.values] }
  })
)

// Keep arrays aligned with cols / rowCount while preserving edits.
function syncCompareState() {
  const n = cols.value
  const rc = rowCount.value

  if (products.value.length < n) {
    products.value = [
      ...products.value,
      ...Array.from({ length: n - products.value.length }, (_, i) =>
        defaultCompareProduct(products.value.length + i)
      )
    ]
  } else if (products.value.length > n) {
    products.value = products.value.slice(0, n)
  }

  if (rows.value.length < rc) {
    rows.value = [
      ...rows.value,
      ...Array.from({ length: rc - rows.value.length }, (_, i) => {
        const idx = rows.value.length + i
        const r = defaultCompareRow(idx, n)
        return { hint: r.hint, values: [...r.values] }
      })
    ]
  } else if (rows.value.length > rc) {
    rows.value = rows.value.slice(0, rc)
  }

  rows.value = rows.value.map((row, ri) => {
    const vals = [...row.values]
    if (vals.length < n) {
      const def = defaultCompareRow(ri, n)
      while (vals.length < n) vals.push(def.values[vals.length] ?? '')
    } else if (vals.length > n) {
      vals.length = n
    }
    return { hint: row.hint, values: vals }
  })
}

const html = computed(() => {
  syncCompareState()
  return renderCompare({
    cols: cols.value,
    products: products.value,
    rows: rows.value
  })
})
</script>

<template>
  <section id="compare" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">10</span>
      <h3 class="tpl-section__title">Compare · 商品比較</h3>
      <p class="tpl-section__desc">
        プレビュー内でテキスト編集。上部の ± でカード列・パラメータ行（tr / td）を増減
      </p>
    </header>

    <TemplateCard name="商品比較" badge="pd-compare" :html="html">
      <template #controls>
        <StepControl v-model="cols" :min="2" :max="4" label="比較列（カード列・td）" />
        <StepControl v-model="rowCount" :min="1" :max="16" label="パラメータ行（tr）" />
      </template>
    </TemplateCard>
  </section>
</template>
