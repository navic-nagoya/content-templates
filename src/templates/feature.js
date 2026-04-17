import { esc, indent, repeat } from './util.js'

const ITEM_PRESETS = [
  {
    title: '長時間バッテリー',
    desc: '一度の充電で 48 時間使用可能。出張や旅行でも安心してお使いいただけます。'
  },
  {
    title: '超軽量設計',
    desc: '本体わずか 120g。長時間の装着でも疲れにくく、毎日の持ち運びに最適です。'
  },
  {
    title: 'プロ防水等級',
    desc: 'IPX7 防水仕様。雨の日や水回りなど、あらゆるシーンで安心です。'
  },
  {
    title: '3 年保証',
    desc: '購入から 3 年間の公式保証付き。万が一の不具合も安心のサポート体制。'
  },
  {
    title: '高速接続',
    desc: '最新の Bluetooth 5.3 で安定した接続と低遅延を実現します。'
  },
  {
    title: 'スマートアプリ対応',
    desc: '専用アプリで設定や更新を簡単に管理。直感的な操作ですぐに使えます。'
  }
]

/** Optional panel label for the "panels" variant (stacked category blocks). */
const PANEL_LABELS = ['デザイン', '素材', '品質', '同梱内容']

export function defaultFeatureItem(i = 0) {
  const preset = ITEM_PRESETS[i % ITEM_PRESETS.length]
  return {
    src: 'https://placehold.co/600x450',
    alt: preset.title,
    icon: 'https://placehold.co/64x64',
    title: preset.title,
    desc: preset.desc,
    panel: PANEL_LABELS[i % PANEL_LABELS.length]
  }
}

const VARIANT_CLASS = {
  cards: 'pd-feature--cards',
  icons: 'pd-feature--icons',
  split: 'pd-feature--split',
  heroSpecs: 'pd-feature--hero-specs',
  specGrid: 'pd-feature--spec-grid',
  stackedMedia: 'pd-feature--stacked-media',
  heroAside: 'pd-feature--hero-aside',
  panels: 'pd-feature--panels',
  detailGallery: 'pd-feature--detail-gallery'
}

/** Gallery labels; `id` is passed to renderFeature({ variant }). */
export const FEATURE_VARIANTS = [
  { id: 'cards', label: '画像カードグリッド' },
  { id: 'icons', label: 'アイコングリッド' },
  { id: 'split', label: '画像＋特性リスト' },
  { id: 'heroSpecs', label: 'フル幅ヒーロー＋仕様リスト' },
  { id: 'specGrid', label: '文案＋仕様／画像2×2' },
  { id: 'stackedMedia', label: '大画像＋テキストの積み重ね' },
  { id: 'heroAside', label: '半幅ヒーロー＋サイド仕様' },
  { id: 'panels', label: 'カテゴリ見出し付き（縦並び）' },
  { id: 'detailGallery', label: 'メイン画像＋サムネ＋仕様' }
]

/** Build item list: trim to n, pad with defaults, or synthesize when empty. */
function listForFeature(n, items) {
  if (!items.length) return repeat(n, (i) => defaultFeatureItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [...items, ...repeat(n - items.length, (i) => defaultFeatureItem(items.length + i))]
}

/** Ensure at least `n` items by cycling / padding from `base`. */
function listPadded(n, base) {
  const list = base.length ? base : repeat(n, (i) => defaultFeatureItem(i))
  return repeat(n, (i) => list[i % list.length])
}

const SPLIT_DEFAULTS = {
  heroSrc: 'https://placehold.co/900x700',
  heroAlt: '商品メイン画像',
  eyebrow: 'プロダクト特徴',
  heading: '快適な毎日を支える、こだわりの設計',
  lead: '日常から本格的なシーンまで、長く愛用いただける品質と機能をご紹介します。'
}

export function renderFeature({ count = 3, items = [], variant = 'cards', split = {} } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForFeature(n, items)
  const mod = VARIANT_CLASS[variant] ?? VARIANT_CLASS.cards
  const mergedSplit = { ...SPLIT_DEFAULTS, ...split }

  if (variant === 'split') return renderSplit(list, mod, mergedSplit)
  if (variant === 'icons') return renderIcons(list, mod)
  if (variant === 'heroSpecs') return renderHeroSpecs(list, mod, mergedSplit)
  if (variant === 'specGrid') return renderSpecGrid(list, mod, mergedSplit)
  if (variant === 'stackedMedia') return renderStackedMedia(list, mod, mergedSplit)
  if (variant === 'heroAside') return renderHeroAside(list, mod, mergedSplit)
  if (variant === 'panels') return renderPanels(list, mod, mergedSplit)
  if (variant === 'detailGallery') return renderDetailGallery(list, mod, mergedSplit)
  return renderCards(list, mod)
}

function renderCards(list, mod) {
  const itemsHtml = list
    .map(
      (item) => `<div class="pd-feature__item">
  <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />
  <div class="pd-feature__body">
    <h4>${esc(item.title || '')}</h4>
    <p>${esc(item.desc || '')}</p>
  </div>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__grid">
${indent(itemsHtml, 4)}
  </div>
</section>`
}

function renderIcons(list, mod) {
  const itemsHtml = list
    .map(
      (item) => `<div class="pd-feature__item">
  <span class="pd-feature__icon">
    <img src="${esc(item.icon)}" alt="" />
  </span>
  <h4>${esc(item.title || '')}</h4>
  <p>${esc(item.desc || '')}</p>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__grid">
${indent(itemsHtml, 4)}
  </div>
</section>`
}

function renderSplit(list, mod, s) {
  const itemsHtml = list
    .map(
      (item) => `<div class="pd-feature__row">
  <img class="pd-feature__bullet" src="${esc(item.icon)}" alt="" />
  <div class="pd-feature__row-body">
    <h4>${esc(item.title || '')}</h4>
    <p>${esc(item.desc || '')}</p>
  </div>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__split">
    <div class="pd-feature__hero">
      <img src="${esc(s.heroSrc)}" alt="${esc(s.heroAlt)}" />
    </div>
    <div class="pd-feature__list">
      <p class="pd-feature__eyebrow">${esc(s.eyebrow)}</p>
      <h2 class="pd-feature__heading">${esc(s.heading)}</h2>
      <p class="pd-feature__lead">${esc(s.lead)}</p>
      <div class="pd-feature__rows">
${indent(itemsHtml, 8)}
      </div>
    </div>
  </div>
</section>`
}

/** Full-width hero, gradient fade, centered intro + bordered spec grid (product-feature-02 style). */
function renderHeroSpecs(list, mod, s) {
  const dlHtml = list
    .map(
      (item) => `<div class="pd-feature__spec-cell">
  <dt>${esc(item.title || '')}</dt>
  <dd>${esc(item.desc || '')}</dd>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__hero-band" aria-hidden="true">
    <img src="${esc(s.heroSrc)}" alt="" class="pd-feature__hero-cover" />
    <div class="pd-feature__hero-fade"></div>
  </div>
  <div class="pd-feature__hero-specs-body">
    <div class="pd-feature__intro-center">
      <h2 class="pd-feature__intro-heading">${esc(s.heading)}</h2>
      <p class="pd-feature__intro-lead">${esc(s.lead)}</p>
    </div>
    <dl class="pd-feature__spec-sheet">
${indent(dlHtml, 6)}
    </dl>
  </div>
</section>`
}

/** Two-column: copy + spec dl | 2×2 image grid (product-feature-03 style). */
function renderSpecGrid(list, mod, s) {
  const imgs = listPadded(4, list)
  const gridHtml = imgs
    .map(
      (item) => `<div class="pd-feature__quad-cell">
  <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />
</div>`
    )
    .join('\n')

  const dlHtml = list
    .map(
      (item) => `<div class="pd-feature__spec-cell">
  <dt>${esc(item.title || '')}</dt>
  <dd>${esc(item.desc || '')}</dd>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__spec-grid-wrap">
    <div class="pd-feature__spec-grid-copy">
      <h2 class="pd-feature__intro-heading">${esc(s.heading)}</h2>
      <p class="pd-feature__intro-lead">${esc(s.lead)}</p>
      <dl class="pd-feature__spec-sheet pd-feature__spec-sheet--in-copy">
${indent(dlHtml, 8)}
      </dl>
    </div>
    <div class="pd-feature__quad-grid">
${indent(gridHtml, 6)}
    </div>
  </div>
</section>`
}

/** Stacked rows: text + large image per item (product-feature-04 style). */
function renderStackedMedia(list, mod, s) {
  const rowsHtml = list
    .map(
      (item) => `<div class="pd-feature__stack-row">
  <div class="pd-feature__stack-copy">
    <h3>${esc(item.title || '')}</h3>
    <p>${esc(item.desc || '')}</p>
  </div>
  <div class="pd-feature__stack-visual">
    <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />
  </div>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__stack-wrap">
    <div class="pd-feature__stack-intro">
      <p class="pd-feature__eyebrow">${esc(s.eyebrow)}</p>
      <h2 class="pd-feature__stack-tagline">${esc(s.heading)}</h2>
      <p class="pd-feature__intro-lead">${esc(s.lead)}</p>
    </div>
    <div class="pd-feature__stack-rows">
${indent(rowsHtml, 6)}
    </div>
  </div>
</section>`
}

/** Half-width hero + copy panel with 2-col spec grid (product-feature-05 style). */
function renderHeroAside(list, mod, s) {
  const dlHtml = list
    .map(
      (item) => `<div class="pd-feature__aside-cell">
  <dt>${esc(item.title || '')}</dt>
  <dd>${esc(item.desc || '')}</dd>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__aside-layout">
    <div class="pd-feature__aside-hero-wrap">
      <img src="${esc(s.heroSrc)}" alt="${esc(s.heroAlt)}" class="pd-feature__aside-hero-img" />
    </div>
    <div class="pd-feature__aside-panel">
      <p class="pd-feature__eyebrow">${esc(s.eyebrow)}</p>
      <h2 class="pd-feature__aside-title">${esc(s.heading)}</h2>
      <p class="pd-feature__intro-lead">${esc(s.lead)}</p>
      <dl class="pd-feature__aside-dl">
${indent(dlHtml, 8)}
      </dl>
    </div>
  </div>
</section>`
}

/**
 * Stacked blocks with a category label each (Tailwind "tabs" layout as static vertical sections).
 */
function renderPanels(list, mod, s) {
  const blocksHtml = list
    .map(
      (item, i) => {
        const label = esc(item.panel || `詳細 ${i + 1}`)
        return `<div class="pd-feature__panel-block">
  <p class="pd-feature__panel-label">${label}</p>
  <div class="pd-feature__panel-row">
    <div class="pd-feature__panel-text">
      <h3>${esc(item.title || '')}</h3>
      <p>${esc(item.desc || '')}</p>
    </div>
    <div class="pd-feature__panel-media">
      <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />
    </div>
  </div>
</div>`
      }
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__panels-wrap">
    <div class="pd-feature__panels-intro">
      <p class="pd-feature__eyebrow">${esc(s.eyebrow)}</p>
      <h2 class="pd-feature__intro-heading">${esc(s.heading)}</h2>
      <p class="pd-feature__intro-lead">${esc(s.lead)}</p>
    </div>
    <div class="pd-feature__panels-list">
${indent(blocksHtml, 6)}
    </div>
  </div>
</section>`
}

/** Main square image + 2 thumbs + spec list (product-feature-09 style). */
function renderDetailGallery(list, mod, s) {
  const padded = listPadded(3, list)
  const main = padded[0]
  const t1 = padded[1]
  const t2 = padded[2]

  const dlHtml = list
    .map(
      (item) => `<div class="pd-feature__detail-spec-row">
  <dt>${esc(item.title || '')}</dt>
  <dd>${esc(item.desc || '')}</dd>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-feature ${mod}">
  <div class="pd-feature__detail-wrap">
    <div class="pd-feature__detail-copy">
      <div class="pd-feature__detail-header">
        <p class="pd-feature__eyebrow">${esc(s.eyebrow)}</p>
        <h2 class="pd-feature__intro-heading">${esc(s.heading)}</h2>
      </div>
      <dl class="pd-feature__detail-dl">
${indent(dlHtml, 8)}
      </dl>
    </div>
    <div class="pd-feature__detail-visual">
      <img src="${esc(main.src)}" alt="${esc(main.alt || '')}" class="pd-feature__detail-main" />
      <div class="pd-feature__detail-thumbs">
        <img src="${esc(t1.src)}" alt="${esc(t1.alt || '')}" />
        <img src="${esc(t2.src)}" alt="${esc(t2.alt || '')}" />
      </div>
    </div>
  </div>
</section>`
}
