import { esc, indent, repeat } from './util.js'

const PRESETS = [
  { value: '48H', label: '超長時間バッテリー' },
  { value: '120g', label: '超軽量ボディ' },
  { value: 'IPX7', label: 'プロ防水等級' },
  { value: '3年', label: '公式保証サービス' }
]

export function defaultFeatureItem(i) {
  return PRESETS[i % PRESETS.length]
}

const VARIANT_MOD = {
  tiles: 'pd-features--tiles',
  rail: 'pd-features--rail'
}

/** Gallery labels + ids passed to renderFeatures({ variant }). */
export const FEATURE_VARIANTS = [
  { id: 'tiles', label: 'タイルグリッド' },
  { id: 'rail', label: '左ボーダー列' }
]

/** Build the row list: trim to n, pad with defaults, or synthesize when empty. */
function listForFeatures(n, items) {
  if (!items.length) return repeat(n, (i) => defaultFeatureItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [...items, ...repeat(n - items.length, (i) => defaultFeatureItem(items.length + i))]
}

export function renderFeatures({ count = 4, items = [], variant = 'tiles' } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForFeatures(n, items)
  const mod = VARIANT_MOD[variant] ?? VARIANT_MOD.tiles

  const itemsHtml = list
    .map(
      (item) => `<div class="pd-features__cell">
    <dt class="pd-features__label">${esc(item.label)}</dt>
    <dd class="pd-features__value">${esc(item.value)}</dd>
  </div>`
    )
    .join('\n')

  return `<section class="pd-section pd-features ${mod}">
  <dl class="pd-features__grid">
${indent(itemsHtml, 4)}
  </dl>
</section>`
}
