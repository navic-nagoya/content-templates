<script setup>
import HeadingSection from './components/sections/HeadingSection.vue'
import HgroupSection from './components/sections/HgroupSection.vue'
import ImagesSection from './components/sections/ImagesSection.vue'
import MediaSection from './components/sections/MediaSection.vue'
import HighlightsSection from './components/sections/HighlightsSection.vue'
import FeaturesSection from './components/sections/FeaturesSection.vue'
import SpecsSection from './components/sections/SpecsSection.vue'
import StepsSection from './components/sections/StepsSection.vue'
import VideoSection from './components/sections/VideoSection.vue'
import CompareSection from './components/sections/CompareSection.vue'

const NAV = [
  { num: '01', id: 'heading', label: 'Heading 見出し' },
  { num: '02', id: 'hgroup', label: 'Hgroup 見出しグループ' },
  { num: '03', id: 'images', label: 'Images 画像グリッド' },
  { num: '04', id: 'media', label: 'Media 画像+テキスト' },
  { num: '05', id: 'highlights', label: 'Highlights ハイライト' },
  { num: '06', id: 'features', label: 'Features 特徴データ' },
  { num: '07', id: 'specs', label: 'Specs 仕様' },
  { num: '08', id: 'steps', label: 'Steps ステップ' },
  { num: '09', id: 'video', label: 'Video 動画' },
  { num: '10', id: 'compare', label: 'Compare 比較' }
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
          左側はカテゴリーナビ、右側は各テンプレートのライブプレビューです。列数は直接数値入力でき、コードもリアルタイムに更新されます。右上のボタンでワンクリックコピー可能です。
        </p>
      </header>

      <HeadingSection />
      <HgroupSection />
      <ImagesSection />
      <MediaSection />
      <HighlightsSection />
      <FeaturesSection />
      <SpecsSection />
      <StepsSection />
      <VideoSection />
      <CompareSection />
    </main>
  </div>
</template>
