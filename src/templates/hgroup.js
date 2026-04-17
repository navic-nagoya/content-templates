import { esc } from './util.js'

export const HGROUP_VARIANTS = [
  { id: 'a', label: 'A · 中央揃え' },
  { id: 'b', label: 'B · 左寄せ（前置ライン）' }
]

export function renderHgroup({
  variant = 'a',
  sub = 'サブタイトル / シリーズ名',
  title = '商品メインタイトル',
  desc = 'ここにメインタイトルを補足する説明文を入力してください。製品のポジショニング、主な訴求ポイント、またはデザインコンセプトをご紹介ください。2行以内に収めることをお勧めします。'
}) {
  return `<section class="pd-section">
  <hgroup class="pd-hgroup--${variant}">
    <p class="pd-hgroup__sub">${esc(sub)}</p>
    <h2 class="pd-hgroup__title">${esc(title)}</h2>
    <p class="pd-hgroup__desc">${esc(desc)}</p>
  </hgroup>
</section>`
}
