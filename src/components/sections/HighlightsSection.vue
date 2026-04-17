<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { renderHighlights } from '../../templates/highlights.js'

const count = ref(3)

const html = computed(() => renderHighlights({ count: count.value }))
</script>

<template>
  <section id="highlights" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">05</span>
      <h3 class="tpl-section__title">Highlights · ハイライト</h3>
      <p class="tpl-section__desc">
        CSS が 1 行あたりの項目数を自動計算します（minmax 200px）。総数のみ入力してください
      </p>
    </header>

    <TemplateCard name="ハイライトカード" badge="pd-highlights" :html="html">
      <template #controls>
        <NumberControl v-model="count" :min="1" :max="8" label="項目数" />
      </template>
    </TemplateCard>
  </section>
</template>
