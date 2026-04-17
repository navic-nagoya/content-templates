<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import SwitchControl from '../SwitchControl.vue'
import { renderMedia } from '../../templates/media.js'

const reverse = ref(false)
const showCta = ref(true)

const html = computed(() =>
  renderMedia({ reverse: reverse.value, showCta: showCta.value })
)
</script>

<template>
  <section id="media" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">04</span>
      <h3 class="tpl-section__title">Media · 画像+テキスト</h3>
      <p class="tpl-section__desc">画像左/テキスト右 または 画像右/テキスト左、CTA 任意</p>
    </header>

    <TemplateCard name="画像+テキスト並列" badge="pd-media" :html="html">
      <template #controls>
        <SwitchControl v-model="reverse" label="画像を右側に" />
        <SwitchControl v-model="showCta" label="CTA を表示" />
      </template>
    </TemplateCard>
  </section>
</template>
