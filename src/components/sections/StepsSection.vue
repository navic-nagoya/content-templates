<script setup>
import { computed, reactive } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { STEPS_VARIANTS, renderSteps } from '../../templates/steps.js'

const counts = reactive({
  vertical: 3,
  horizontal: 4
})

const cards = computed(() =>
  STEPS_VARIANTS.map((v) => ({
    ...v,
    html: renderSteps({ count: counts[v.id], variant: v.id })
  }))
)
</script>

<template>
  <section id="steps" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">08</span>
      <h3 class="tpl-section__title">Steps · ステップフロー</h3>
      <p class="tpl-section__desc">
        縦型は番号サークルと接続線で詳しい手順を、横型は 3〜5
        ステップの購入フローや利用ガイド向けです。文言はプレビュー内を直接編集してください。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-steps"
      :html="card.html"
    >
      <template #controls>
        <NumberControl v-model="counts[card.id]" :min="1" :max="10" label="ステップ数" />
      </template>
    </TemplateCard>
  </section>
</template>
