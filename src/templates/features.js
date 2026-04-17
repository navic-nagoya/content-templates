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

export function renderFeatures({ count = 4, items = [] }) {
  const n = Math.max(1, count | 0)
  const list = items.length ? items : repeat(n, (i) => defaultFeatureItem(i))

  const itemsHtml = list
    .map(
      (item) => `<div class="pd-features__cell">
    <dt class="pd-features__label">${esc(item.label)}</dt>
    <dd class="pd-features__value">${esc(item.value)}</dd>
  </div>`
    )
    .join('\n')

  return `<section class="pd-section pd-features">
  <dl class="pd-features__grid">
${indent(itemsHtml, 4)}
  </dl>
</section>`
}
