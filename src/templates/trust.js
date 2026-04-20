import { esc, indent, repeat } from './util.js'

// Trust Badges: short icon + title + 1-line sub. Used for certifications,
// warranty promises, shipping guarantees, awards, etc. Dense / reassurance-focused.
// Kept distinct from Feature--icons (which has longer body copy).

const ITEM_PRESETS = [
  { title: '正規代理店', sub: '日本正規品のみ取扱' },
  { title: '3 年保証', sub: '公式延長保証付き' },
  { title: '送料無料', sub: '全国一律・最短翌日' },
  { title: 'IPX7 防水', sub: '国際防水等級認証' },
  { title: 'JIS 認証', sub: '国内安全規格適合' },
  { title: 'グッドデザイン賞', sub: '2024 年受賞' }
]

export function defaultTrustItem(i = 0) {
  const p = ITEM_PRESETS[i % ITEM_PRESETS.length]
  return {
    icon: 'https://placehold.co/64x64',
    title: p.title,
    sub: p.sub
  }
}

const VARIANT_CLASS = {
  band: 'pd-trust--band',
  cards: 'pd-trust--cards'
}

/** Gallery labels; `id` is passed to renderTrust({ variant }). */
export const TRUST_VARIANTS = [
  { id: 'band', label: '横並びバンド（軽量・密度高め）' },
  { id: 'cards', label: 'カードグリッド（角丸・存在感強め）' }
]

function listForTrust(n, items) {
  if (!items.length) return repeat(n, (i) => defaultTrustItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [
    ...items,
    ...repeat(n - items.length, (i) => defaultTrustItem(items.length + i))
  ]
}

export function renderTrust({ count = 4, items = [], variant = 'band' } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForTrust(n, items)
  const mod = VARIANT_CLASS[variant] ?? VARIANT_CLASS.band

  // Cap columns so partial rows don't leave empty cells.
  const colsD = Math.min(list.length, 6)
  const colsT = Math.min(list.length, 3)

  const itemsHtml = list
    .map(
      (it) => `<div class="pd-trust__item">
  <span class="pd-trust__icon">
    <img src="${esc(it.icon)}" alt="" />
  </span>
  <div class="pd-trust__text">
    <p class="pd-trust__title">${esc(it.title)}</p>
    <p class="pd-trust__sub">${esc(it.sub)}</p>
  </div>
</div>`
    )
    .join('\n')

  return `<section class="pd-section pd-trust ${mod}">
  <div class="pd-trust__grid" style="--cols-d:${colsD};--cols-t:${colsT};">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
