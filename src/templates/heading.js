import { esc } from './util.js'

export const HEADING_VARIANTS = [
  { id: 'a', label: 'A · ミニマル左寄せ' },
  { id: 'b', label: 'B · 中央揃え + 装飾線' },
  { id: 'c', label: 'C · 左側カラーブロック' },
  { id: 'd', label: 'D · 淡色背景文字' },
  { id: 'e', label: 'E · 番号プレフィックス' }
]

export function renderHeading({ variant = 'a', text = '商品タイトルテキスト', bgText = 'PRODUCT', num = '01' }) {
  switch (variant) {
    case 'a':
      return `<section class="pd-section">
  <h2 class="pd-heading--a">${esc(text)}</h2>
</section>`
    case 'b':
      return `<section class="pd-section" style="text-align: center">
  <div class="pd-heading--b-wrap">
    <h2 class="pd-heading--b">${esc(text)}</h2>
  </div>
</section>`
    case 'c':
      return `<section class="pd-section">
  <div class="pd-heading--c-wrap">
    <h2 class="pd-heading--c">${esc(text)}</h2>
  </div>
</section>`
    case 'd':
      return `<section class="pd-section">
  <div class="pd-heading--d-wrap">
    <div class="pd-heading--d-bg">${esc(bgText)}</div>
    <h2 class="pd-heading--d">${esc(text)}</h2>
  </div>
</section>`
    case 'e':
      return `<section class="pd-section">
  <div class="pd-heading--e-wrap">
    <span class="pd-heading--e-num">${esc(num)}</span>
    <h2 class="pd-heading--e">${esc(text)}</h2>
  </div>
</section>`
    default:
      return ''
  }
}
