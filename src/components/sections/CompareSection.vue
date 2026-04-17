<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { renderCompare } from '../../templates/compare.js'

const cols = ref(3)

const html = computed(() => renderCompare({ cols: cols.value }))
</script>

<template>
  <section id="compare" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">10</span>
      <h3 class="tpl-section__title">Compare · 商品比較</h3>
      <p class="tpl-section__desc">
        上部にカード、下部にパラメータ行。2 / 3 / 4 列に対応
      </p>
    </header>

    <TemplateCard name="商品比較" badge="pd-compare" :html="html">
      <template #controls>
        <NumberControl v-model="cols" :min="2" :max="4" label="比較数" />
      </template>
    </TemplateCard>
  </section>
</template>
