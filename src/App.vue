<script setup>
import { ref } from 'vue'
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
import CopyButton from './components/CopyButton.vue'

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

// The `style.css` file content is fetched once and exposed as a <style>…</style>
// block operators can paste at the top of their Shopify HTML editor.
const styleBlock = ref('style.css を読み込み中…')
fetch(new URL('../style.css', import.meta.url))
  .then((r) => r.text())
  .then((css) => {
    styleBlock.value = `<style>\n${css}\n</style>`
  })
  .catch(() => {
    styleBlock.value =
      '読み込みに失敗しました。リポジトリ直下の style.css を直接開いてコピーしてください。'
  })
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
        <a href="#style-block">
          <span class="app-nav__num">★</span>
          <span>Style Block（必須）</span>
        </a>
      </nav>
      <div class="app-sidebar__footer">
        運用フロー：<br />
        ① 商品ごとに Style Block を一度貼り付け<br />
        ② 下のテンプレートから必要なものをコピー<br />
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

      <div class="app-callout">
        <div>
          <strong>ステップ 1：Style Block を貼り付け</strong><br />
          商品説明エディタを開き、HTML モードに切り替え、下の「Style Block」の内容を最上部に貼り付けてください。<u>商品ごとに一度だけ</u>で OK。以降すべてのテンプレートがこのスタイルを共有します。
        </div>
      </div>

      <section id="style-block" class="tpl-section">
        <header class="tpl-section__head">
          <span class="tpl-section__num">★</span>
          <h3 class="tpl-section__title">Style Block · 必須</h3>
          <p class="tpl-section__desc">style.css を包んだ &lt;style&gt; ブロック</p>
        </header>
        <div class="tpl-card">
          <div class="tpl-card__head">
            <h4 class="tpl-card__name">商品ごとに一度だけ貼り付け</h4>
            <span class="tpl-card__badge">required</span>
            <div class="tpl-card__controls">
              <CopyButton :text="styleBlock" label="Style Block をコピー" />
            </div>
          </div>
          <div class="tpl-card__code">
            <div class="tpl-card__code-head">
              <span class="tpl-card__code-title">商品説明の最上部に貼り付け</span>
            </div>
            <pre><code>{{ styleBlock }}</code></pre>
          </div>
        </div>
      </section>

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
