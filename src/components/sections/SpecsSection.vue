<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import SegmentControl from '../SegmentControl.vue'
import StepControl from '../StepControl.vue'
import {
  defaultSpecsCompare,
  defaultSpecsCompareRow,
  defaultSpecsSingle,
  defaultSpecsSingleRow,
  renderSpecs
} from '../../templates/specs.js'

const variant = ref('single')
const VARIANTS = [
  { id: 'single', label: '単品仕様' },
  { id: 'compare', label: '複数比較' }
]

function cloneSingleRows() {
  return defaultSpecsSingle().rows.map((r) => ({ ...r }))
}

function cloneCompare(n) {
  const d = defaultSpecsCompare(n)
  return {
    products: [...d.products],
    rows: d.rows.map((r) => ({ key: r.key, values: [...r.values] }))
  }
}

const singleRows = ref(cloneSingleRows())
const singleRowCount = ref(singleRows.value.length)

const productCount = ref(3)
const compareData = ref(cloneCompare(productCount.value))
const compareRowCount = ref(compareData.value.rows.length)

function syncSingleRows() {
  const n = singleRowCount.value
  if (singleRows.value.length < n) {
    singleRows.value = [
      ...singleRows.value,
      ...Array.from({ length: n - singleRows.value.length }, (_, i) =>
        defaultSpecsSingleRow(singleRows.value.length + i)
      )
    ]
  } else if (singleRows.value.length > n) {
    singleRows.value = singleRows.value.slice(0, n)
  }
}

function syncCompareState() {
  const n = Math.max(2, Math.min(6, productCount.value))
  const rc = compareRowCount.value
  const d = compareData.value

  while (d.products.length < n) {
    d.products.push(`製品 ${String.fromCharCode(65 + d.products.length)}`)
  }
  d.products.splice(n)

  while (d.rows.length < rc) {
    d.rows.push(defaultSpecsCompareRow(n, d.rows.length))
  }
  d.rows.splice(rc)

  for (let ri = 0; ri < d.rows.length; ri++) {
    const r = d.rows[ri]
    while (r.values.length < n) {
      const def = defaultSpecsCompareRow(n, ri)
      r.values.push(def.values[r.values.length] ?? '')
    }
    r.values.splice(n)
  }
}

const html = computed(() => {
  if (variant.value === 'compare') {
    syncCompareState()
    return renderSpecs({ variant: 'compare', compare: compareData.value })
  }
  syncSingleRows()
  return renderSpecs({ variant: 'single', single: { rows: singleRows.value } })
})
</script>

<template>
  <section id="specs" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">07</span>
      <h3 class="tpl-section__title">Specs · 仕様</h3>
      <p class="tpl-section__desc">
        プレビュー内でセル文言を編集。上部の ± で表の行（tr）・比較列（td）を増減
      </p>
    </header>

    <TemplateCard
      :name="variant === 'single' ? '単品仕様表' : '複数商品比較仕様表'"
      badge="pd-specs"
      :html="html"
    >
      <template #controls>
        <SegmentControl v-model="variant" :options="VARIANTS" label="タイプ" />
        <StepControl
          v-if="variant === 'single'"
          v-model="singleRowCount"
          :min="1"
          :max="16"
          label="tbody の行（tr）"
        />
        <template v-if="variant === 'compare'">
          <StepControl
            v-model="productCount"
            :min="2"
            :max="6"
            label="商品列（thead th / tbody td）"
          />
          <StepControl
            v-model="compareRowCount"
            :min="1"
            :max="16"
            label="スペック行（tbody tr）"
          />
        </template>
      </template>
    </TemplateCard>
  </section>
</template>
