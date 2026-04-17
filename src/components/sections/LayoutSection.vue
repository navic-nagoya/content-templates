<script setup>
import { computed, reactive, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import SwitchControl from '../SwitchControl.vue'
import { LAYOUT_VARIANTS, renderLayout } from '../../templates/layout.js'

const equalCols = ref(2)
const asymmetric = reactive({ mainRight: false })

const cards = computed(() =>
  LAYOUT_VARIANTS.map((v) => ({
    ...v,
    html: renderLayout({
      variant: v.id,
      cols: equalCols.value,
      mainRight: asymmetric.mainRight
    })
  }))
)
</script>

<template>
  <section id="layout" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">11</span>
      <h3 class="tpl-section__title">Layout · レイアウトコンテナ</h3>
      <p class="tpl-section__desc">
        純粋なコンテナです。指定したカラム構成でコンテンツを並べるだけで、見た目の装飾はありません。プレビュー内のプレースホルダを直接編集するか、他のセクション HTML をそのまま差し込んでご利用ください。等分カラムは列数（2〜4）を切り替えられます。非対称 2 カラムはスイッチでメイン側を左右入れ替えられます。
      </p>
    </header>

    <TemplateCard
      v-for="card in cards"
      :key="card.id"
      :name="card.label"
      badge="pd-layout"
      :html="card.html"
    >
      <template v-if="card.id === 'equal'" #controls>
        <NumberControl v-model="equalCols" :min="2" :max="4" label="列数" />
      </template>
      <template v-else-if="card.id === 'asymmetric'" #controls>
        <SwitchControl v-model="asymmetric.mainRight" label="メインを右に配置" />
      </template>
    </TemplateCard>
  </section>
</template>
