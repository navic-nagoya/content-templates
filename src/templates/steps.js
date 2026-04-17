import { esc, indent, repeat } from './util.js'

export function defaultStepItem(i) {
  return {
    title: `ステップ ${i + 1}`,
    desc: 'ここにステップの説明文を入力してください。具体的な操作方法、注意事項、または期待される効果を説明します。',
    img: i < 2 ? 'https://placehold.co/800x400' : ''
  }
}

export function renderSteps({ count = 3, items = [] }) {
  const n = Math.max(1, count | 0)
  const list = items.length ? items : repeat(n, (i) => defaultStepItem(i))

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

  return `<section class="pd-section">
  <div class="pd-steps__list">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
