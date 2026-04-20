import { esc, indent, repeat } from './util.js'

export function defaultStepItem(i) {
  return {
    title: `ステップ ${i + 1}`,
    desc: 'ここにステップの説明文を入力してください。具体的な操作方法、注意事項、または期待される効果を説明します。',
    img: i < 2 ? 'https://placehold.co/800x400' : ''
  }
}

const VARIANT_CLASS = {
  vertical: 'pd-steps--vertical',
  horizontal: 'pd-steps--horizontal'
}

/** Gallery labels; `id` is passed to renderSteps({ variant }). */
export const STEPS_VARIANTS = [
  { id: 'vertical', label: '縦型（番号サークル＋接続線）' },
  { id: 'horizontal', label: '横型（3〜5 ステップの購入フロー向け）' }
]

export function renderSteps({ count = 3, items = [], variant = 'vertical' } = {}) {
  const n = Math.max(1, count | 0)
  const list = items.length ? items : repeat(n, (i) => defaultStepItem(i))
  const mod = VARIANT_CLASS[variant] ?? VARIANT_CLASS.vertical

  if (variant === 'horizontal') return renderHorizontal(list, mod)
  return renderVertical(list, mod)
}

function renderVertical(list, mod) {
  const itemsHtml = list
    .map((item, i) => {
      const img = item.img
        ? `\n    <img src="${esc(item.img)}" alt="ステップの説明図" />`
        : ''
      return `<div class="pd-steps__item">
  <div class="pd-steps__left">
    <div class="pd-steps__num">${i + 1}</div>
    <div class="pd-steps__line"></div>
  </div>
  <div class="pd-steps__body">
    <h4>${esc(item.title)}</h4>
    <p>${esc(item.desc)}</p>${img}
  </div>
</div>`
    })
    .join('\n')

  return `<section class="pd-section pd-steps ${mod}">
  <div class="pd-steps__list">
${indent(itemsHtml, 4)}
  </div>
</section>`
}

function renderHorizontal(list, mod) {
  // Cap at 5 visual columns desktop to keep each card readable; more steps wrap.
  const colsD = Math.min(list.length, 5)
  const itemsHtml = list
    .map(
      (item, i) => `<li class="pd-steps__h-item">
  <div class="pd-steps__num">${i + 1}</div>
  <h4>${esc(item.title)}</h4>
  <p>${esc(item.desc)}</p>
</li>`
    )
    .join('\n')

  return `<section class="pd-section pd-steps ${mod}">
  <ol class="pd-steps__row" style="--cols-d:${colsD};">
${indent(itemsHtml, 4)}
  </ol>
</section>`
}
