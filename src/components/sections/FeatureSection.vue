<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { renderFeature } from '../../templates/feature.js'

const count = ref(3)

const html = computed(() => renderFeature({ count: count.value }))
</script>

<template>
  <section id="feature" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">05</span>
      <h3 class="tpl-section__title">Feature · フィーチャー</h3>
      <p class="tpl-section__desc">
        CSS が 1 行あたりの項目数を自動計算します（minmax 200px）。総数のみ入力してください
      </p>
    </header>

    <TemplateCard name="フィーチャーカード" badge="pd-feature" :html="html">
      <template #controls>
        <NumberControl v-model="count" :min="1" :max="8" label="項目数" />
      </template>
    </TemplateCard>
  </section>
</template>
