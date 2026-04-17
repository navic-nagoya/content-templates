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

export function defaultFeatureItem(i = 0) {
  const preset = ITEM_PRESETS[i % ITEM_PRESETS.length]
  return {
    src: 'https://placehold.co/600x450',
    alt: preset.title,
    icon: 'https://placehold.co/64x64',
    title: preset.title,
    desc: preset.desc
  }
}

const VARIANT_CLASS = {
  cards: 'pd-feature--cards',
  icons: 'pd-feature--icons',
  split: 'pd-feature--split'
}

/** Gallery labels; `id` is passed to renderFeature({ variant }). */
export const FEATURE_VARIANTS = [
  { id: 'cards', label: '画像カードグリッド' },
  { id: 'icons', label: 'アイコングリッド' },
  { id: 'split', label: '画像＋特性リスト' }
]

/** Build item list: trim to n, pad with defaults, or synthesize when empty. */
function listForFeature(n, items) {
  if (!items.length) return repeat(n, (i) => defaultFeatureItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [...items, ...repeat(n - items.length, (i) => defaultFeatureItem(items.length + i))]
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

  if (variant === 'split') return renderSplit(list, mod, split)
  if (variant === 'icons') return renderIcons(list, mod)
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

function renderSplit(list, mod, split) {
  const s = { ...SPLIT_DEFAULTS, ...split }

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
