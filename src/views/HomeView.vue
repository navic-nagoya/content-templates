<script setup>
import { RouterLink } from 'vue-router'
import { SECTIONS } from '../router/sections.js'
import { draftStore } from '../store/draft.js'

const emit = defineEmits(['open-draft'])
</script>

<template>
  <div class="home-root">
    <section class="home-hero">
      <div class="home-hero__inner">
        <p class="home-hero__eyebrow">Shopify 商品詳細ページ テンプレートギャラリー</p>
        <h1 class="home-hero__title">
          統一感のある商品ページを、<br />
          コピー＆ペーストで。
        </h1>
        <p class="home-hero__lead">
          本サイトは、Shopify 商品説明に貼り付けられる HTML テンプレート集です。
          列数や項目数などのパラメータをその場で調整し、<br />プレビューを確認してから
          HTML をコピー。複数のブロックを「下書き」に集めて、1 回の貼り付けで
          ページ全体を組み立てることもできます。
        </p>
        <div class="home-hero__cta">
          <RouterLink to="/components/heading" class="btn btn--primary">
            コンポーネントを見る
          </RouterLink>
          <button type="button" class="btn btn--ghost" @click="emit('open-draft')">
            エディターを開く
            <span v-if="draftStore.blocks.length" class="home-hero__badge">
              {{ draftStore.blocks.length }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <section class="home-flow">
      <header class="home-section-head">
        <span class="home-section-head__num">使い方</span>
        <h2>3 ステップで完成</h2>
      </header>
      <ol class="home-flow__list">
        <li class="home-flow__item">
          <span class="home-flow__step">01</span>
          <h3>コンポーネントを選ぶ</h3>
          <p>
            左のナビゲーションから目的のテンプレートを開きます。列数・項目数・スタイル変体などを
            カード上部のコントロールで調整できます。
          </p>
        </li>
        <li class="home-flow__item">
          <span class="home-flow__step">02</span>
          <h3>下書きに追加 または 個別にコピー</h3>
          <p>
            1 つのブロックだけ使う場合は「HTML コピー」をクリック。複数のブロックを
            組み合わせる場合は「下書きに追加」で右上のエディターへ集めます。
          </p>
        </li>
        <li class="home-flow__item">
          <span class="home-flow__step">03</span>
          <h3>Shopify へ貼り付け</h3>
          <p>
            エディターで順序を並び替え、ブロック間に自由なテキストを挿入。最後に
            「全 HTML をコピー」して、Shopify 商品説明の HTML モードに貼り付けます。
          </p>
        </li>
      </ol>
    </section>

    <section class="home-grid-section">
      <header class="home-section-head">
        <span class="home-section-head__num">一覧</span>
        <h2>コンポーネント</h2>
        <p class="home-section-head__desc">
          全 {{ SECTIONS.length }} 種類。クリックすると各コンポーネントの詳細ページに移動します。
        </p>
      </header>
      <ul class="home-grid">
        <li v-for="s in SECTIONS" :key="s.id">
          <RouterLink :to="`/components/${s.id}`" class="home-grid__card">
            <span class="home-grid__num">{{ s.num }}</span>
            <h3 class="home-grid__label">{{ s.label }}</h3>
            <p class="home-grid__summary">{{ s.summary }}</p>
            <span class="home-grid__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="home-notes">
      <header class="home-section-head">
        <span class="home-section-head__num">備考</span>
        <h2>使用上の注意</h2>
      </header>
      <ul class="home-notes__list">
        <li>
          スタイル（<code>style.css</code>）は開発チームが各 Shopify テーマに導入済みです。
          運用担当が <code>&lt;style&gt;</code> ブロックを貼り付ける必要はありません。
        </li>
        <li>
          プレビュー上の文字は直接編集できます。編集後の内容がそのままコピーされます。
        </li>
        <li>
          貼り付けはプレーンテキストとして処理されます。Word / Notion / 他ページからコピーした
          スタイルは自動的に除去されます。
        </li>
        <li>
          画面右上の「流動 / PC / タブレット / スマホ」でプレビュー幅を切り替えて、
          デバイスごとのレイアウトを確認できます。
        </li>
      </ul>
    </section>
  </div>
</template>
