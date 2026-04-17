<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { renderSteps } from '../../templates/steps.js'

const count = ref(3)

const html = computed(() => renderSteps({ count: count.value }))
</script>

<template>
  <section id="steps" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">08</span>
      <h3 class="tpl-section__title">Steps · ステップフロー</h3>
      <p class="tpl-section__desc">番号付きサークルと接続線付き。ステップ数を入力してください</p>
    </header>

    <TemplateCard name="ステップリスト" badge="pd-steps" :html="html">
      <template #controls>
        <NumberControl v-model="count" :min="1" :max="10" label="ステップ数" />
      </template>
    </TemplateCard>
  </section>
</template>
