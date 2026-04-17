<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import SegmentControl from '../SegmentControl.vue'
import NumberControl from '../NumberControl.vue'
import {
  defaultSpecsCompare,
  renderSpecs
} from '../../templates/specs.js'

const variant = ref('single')
const VARIANTS = [
  { id: 'single', label: '単品仕様' },
  { id: 'compare', label: '複数比較' }
]

const productCount = ref(3)
const compareData = computed(() => defaultSpecsCompare(productCount.value))

const html = computed(() => {
  if (variant.value === 'compare') {
    return renderSpecs({ variant: 'compare', compare: compareData.value })
  }
  return renderSpecs({ variant: 'single' })
})
</script>

<template>
  <section id="specs" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">07</span>
      <h3 class="tpl-section__title">Specs · 仕様</h3>
      <p class="tpl-section__desc">単品仕様 / 複数比較。比較モードでは商品数を自由に設定可</p>
    </header>

    <TemplateCard
      :name="variant === 'single' ? '単品仕様表' : '複数商品比較仕様表'"
      badge="pd-specs"
      :html="html"
    >
      <template #controls>
        <SegmentControl v-model="variant" :options="VARIANTS" label="タイプ" />
        <NumberControl
          v-if="variant === 'compare'"
          v-model="productCount"
          :min="2"
          :max="6"
          label="比較商品数"
        />
      </template>
    </TemplateCard>
  </section>
</template>
