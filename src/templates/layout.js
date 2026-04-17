import { esc, indent, repeat } from './util.js'

const PLACEHOLDER = 'コンテンツをここに配置してください。画像・テキスト・他のセクション HTML をそのまま貼り付けられます。'

export const LAYOUT_VARIANTS = [
  { id: 'equal', label: '等分カラム（2 / 3 / 4 列）' },
  { id: 'asymmetric', label: '2 カラム非対称（1:2 / 2:1）' },
  { id: 'center', label: '3 カラム（1:2:1 中央強調）' },
  { id: 'compact', label: '2 カラム（モバイルでも横並び）' }
]

const FIXED_COLS = {
  asymmetric: 2,
  center: 3,
  compact: 2
}

export function renderLayout({ variant = 'equal', cols = 2, mainRight = false } = {}) {
  const isEqual = variant === 'equal'
  const n = isEqual ? Math.min(4, Math.max(2, cols | 0)) : FIXED_COLS[variant] ?? 2

  const cellsHtml = repeat(
    n,
    () => `<div class="pd-layout__cell">
  <p>${esc(PLACEHOLDER)}</p>
</div>`
  ).join('\n')

  const colsAttr = isEqual ? ` data-cols="${n}"` : ''
  const orientAttr =
    variant === 'asymmetric' ? ` data-orient="${mainRight ? 'main-right' : 'main-left'}"` : ''

  return `<section class="pd-section pd-layout">
  <div class="pd-layout__grid" data-variant="${esc(variant)}"${colsAttr}${orientAttr}>
${indent(cellsHtml, 4)}
  </div>
</section>`
}
