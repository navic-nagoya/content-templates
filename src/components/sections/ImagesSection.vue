<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import SwitchControl from '../SwitchControl.vue'
import { renderImages } from '../../templates/images.js'

const cols = ref(2)
const showCaption = ref(true)

const html = computed(() => {
  // Passing empty items lets the generator auto-fill with defaults matching `cols`.
  // When the operator toggles captions off we re-hydrate items with `showCaption: false`.
  if (showCaption.value) {
    return renderImages({ cols: cols.value })
  }
  const size =
    cols.value <= 1
      ? '1200x600'
      : cols.value === 2
        ? '800x600'
        : cols.value === 3
          ? '600x450'
          : '400x300'
  const items = Array.from({ length: cols.value }, () => ({
    src: `https://placehold.co/${size}`,
    alt: '画像の説明',
    showCaption: false
  }))
  return renderImages({ cols: cols.value, items })
})
</script>

<template>
  <section id="images" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">03</span>
      <h3 class="tpl-section__title">Images · 画像グリッド</h3>
      <p class="tpl-section__desc">
        列数を入力すると、対応する数のセルが自動生成されます。キャプション表示の切替も可能
      </p>
    </header>

    <TemplateCard name="レスポンシブ画像グリッド" badge="pd-images" :html="html">
      <template #controls>
        <NumberControl v-model="cols" :min="1" :max="6" label="列数" />
        <SwitchControl v-model="showCaption" label="キャプション表示" />
      </template>
    </TemplateCard>
  </section>
</template>
