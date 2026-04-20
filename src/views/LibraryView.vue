<script setup>
import HeadingSection from '../components/sections/HeadingSection.vue'
import HgroupSection from '../components/sections/HgroupSection.vue'
import ImagesSection from '../components/sections/ImagesSection.vue'
import MediaSection from '../components/sections/MediaSection.vue'
import FeatureSection from '../components/sections/FeatureSection.vue'
import StatsSection from '../components/sections/StatsSection.vue'
import SpecsSection from '../components/sections/SpecsSection.vue'
import StepsSection from '../components/sections/StepsSection.vue'
import VideoSection from '../components/sections/VideoSection.vue'
import CompareSection from '../components/sections/CompareSection.vue'
import LayoutSection from '../components/sections/LayoutSection.vue'
import DividerSection from '../components/sections/DividerSection.vue'
import { draftStore } from '../store/draft.js'

const NAV = [
  { num: '01', id: 'heading', label: 'Heading 見出し' },
  { num: '02', id: 'hgroup', label: 'Hgroup 見出しグループ' },
  { num: '03', id: 'images', label: 'Images 画像グリッド' },
  { num: '04', id: 'media', label: 'Media 画像+テキスト' },
  { num: '05', id: 'feature', label: 'Feature フィーチャー' },
  { num: '06', id: 'stats', label: 'Stats 統計' },
  { num: '07', id: 'specs', label: 'Specs 仕様' },
  { num: '08', id: 'steps', label: 'Steps ステップ' },
  { num: '09', id: 'video', label: 'Video 動画' },
  { num: '10', id: 'compare', label: 'Compare 比較' },
  { num: '11', id: 'layout', label: 'Layout レイアウト' },
  { num: '12', id: 'divider', label: 'Divider 区切り線' }
]

defineEmits(['open-draft'])
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <h1>PD Templates</h1>
      <p class="app-sidebar__sub">Shopify 商品詳細ページ テンプレートギャラリー</p>
      <nav>
        <a v-for="n in NAV" :key="n.id" :href="`#${n.id}`">
          <span class="app-nav__num">{{ n.num }}</span>
          <span>{{ n.label }}</span>
        </a>
      </nav>
      <div class="app-sidebar__footer">
        運用フロー：<br />
        ① 各テンプレートの「下書きに追加」で右上のエディターに集める<br />
        ② エディターを開いて並び替え・テキスト挿入<br />
        ③ 「全 HTML をコピー」して Shopify の HTML モードに貼り付け
      </div>
    </aside>

    <main class="app-main">
      <header class="app-header">
        <h2>ライブラリ · コンポーネントプレビューと下書き追加</h2>
        <p>
          目的のテンプレートを選び、「下書きに追加」で右上のエディターに集めます。
          パラメータ（列数など）はカード上部で調整でき、プレビュー内のテキストは直接編集できます。
          コードを単独でコピーすることもできます。
        </p>
        <div v-if="draftStore.blocks.length" class="app-draft-banner">
          <span>現在の下書き: <strong>{{ draftStore.blocks.length }}</strong> ブロック</span>
          <button type="button" class="btn btn--ghost" @click="$emit('open-draft')">
            エディターを開く →
          </button>
        </div>
      </header>

      <HeadingSection />
      <HgroupSection />
      <ImagesSection />
      <MediaSection />
      <FeatureSection />
      <StatsSection />
      <SpecsSection />
      <StepsSection />
      <VideoSection />
      <CompareSection />
      <LayoutSection />
      <DividerSection />
    </main>
  </div>
</template>
