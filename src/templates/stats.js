import { esc, indent, repeat } from './util.js'

const PRESETS = [
  { value: '48H', label: '超長時間バッテリー' },
  { value: '120g', label: '超軽量ボディ' },
  { value: 'IPX7', label: 'プロ防水等級' },
  { value: '3年', label: '公式保証サービス' }
]

export function defaultStatItem(i) {
  return PRESETS[i % PRESETS.length]
}

const VARIANT_CLASS = {
  tiles: 'pd-stats--tiles',
  rail: 'pd-stats--rail'
}

/** Gallery labels; `id` is passed to renderStats({ variant }). */
export const STATS_VARIANTS = [
  { id: 'tiles', label: 'タイルグリッド' },
  { id: 'rail', label: '左ボーダー列' }
]

/** Build row list: trim to n, pad with defaults, or synthesize when empty. */
function listForStats(n, items) {
  if (!items.length) return repeat(n, (i) => defaultStatItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [...items, ...repeat(n - items.length, (i) => defaultStatItem(items.length + i))]
}

export function renderStats({ count = 4, items = [], variant = 'tiles' } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForStats(n, items)
  const mod = VARIANT_CLASS[variant] ?? VARIANT_CLASS.tiles

  const rowsHtml = list
    .map(
      (item) => `<div class="pd-stats__cell">
    <dt class="pd-stats__label">${esc(item.label)}</dt>
    <dd class="pd-stats__value">${esc(item.value)}</dd>
  </div>`
    )
    .join('\n')

  return `<section class="pd-section pd-stats ${mod}">
  <dl class="pd-stats__grid">
${indent(rowsHtml, 4)}
  </dl>
</section>`
}
