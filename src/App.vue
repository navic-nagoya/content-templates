<script setup>
import HeadingSection from './components/sections/HeadingSection.vue'
import HgroupSection from './components/sections/HgroupSection.vue'
import ImagesSection from './components/sections/ImagesSection.vue'
import MediaSection from './components/sections/MediaSection.vue'
import FeatureSection from './components/sections/FeatureSection.vue'
import StatsSection from './components/sections/StatsSection.vue'
import SpecsSection from './components/sections/SpecsSection.vue'
import StepsSection from './components/sections/StepsSection.vue'
import VideoSection from './components/sections/VideoSection.vue'
import CompareSection from './components/sections/CompareSection.vue'
import LayoutSection from './components/sections/LayoutSection.vue'

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
  { num: '11', id: 'layout', label: 'Layout レイアウト' }
]
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
        ① 下のテンプレートから必要なものをコピー<br />
        ② 商品説明エディタの HTML モードに貼り付け<br />
        ③ 画像と文言を差し替え
      </div>
    </aside>

    <main class="app-main">
      <header class="app-header">
        <h2>運用ギャラリー · コンポーネント化プレビューとコードコピー</h2>
        <p>
          左のナビから目的のテンプレートへジャンプし、右側のライブプレビューで見た目を確認できます。
          各ブロック上部のパラメータ（列数など）は数値で調整でき、変更はプレビューとコード表示にすぐ反映されます。
          生成された HTML は右上のボタンからワンクリックでコピーできます。
        </p>
        <p>
          プレビュー内をクリックして編集できます。コードタブと「コピー」に即反映されます。上部のパラメータを変更すると、手動編集は破棄されます。
        </p>
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
    </main>
  </div>
</template>
