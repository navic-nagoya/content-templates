<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import SegmentControl from '../SegmentControl.vue'
import { renderVideo } from '../../templates/video.js'

const cols = ref(1)
const width = ref('full')

const widthOptions = [
  { id: 'full', label: '全幅' },
  { id: 'half', label: '半幅' }
]

const html = computed(() => renderVideo({ cols: cols.value, width: width.value }))
</script>

<template>
  <section id="video" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">09</span>
      <h3 class="tpl-section__title">Video · 動画</h3>
      <p class="tpl-section__desc">
        1 / 2 列に対応。iframe の <code>src</code> を実際の動画 URL に置き換えてください
      </p>
    </header>

    <TemplateCard name="動画グリッド" badge="pd-video" :html="html">
      <template #controls>
        <NumberControl v-model="cols" :min="1" :max="2" label="列数" />
        <SegmentControl
          v-if="cols === 1"
          v-model="width"
          :options="widthOptions"
          label="幅"
        />
      </template>
    </TemplateCard>
  </section>
</template>
