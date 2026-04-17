import { esc, indent, repeat } from './util.js'

export function defaultHighlightItem() {
  return {
    src: 'https://placehold.co/600x450',
    alt: 'ハイライト画像',
    title: 'ハイライトタイトル',
    desc: 'ここにハイライトの説明文を入力してください。その特性の具体的な価値と体験を紹介します。2〜3文を推奨します。'
  }
}

// Shopify CSS uses `auto-fit minmax(200px, 1fr)` so the column count adapts
// automatically; the operator only controls how many items to render.
export function renderHighlights({ count = 3, items = [] }) {
  const n = Math.max(1, count | 0)
  const list = items.length ? items : repeat(n, () => defaultHighlightItem())

  const itemsHtml = list
    .map(
      (item) => `<div class="pd-highlights__item">
  <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />
  <h4>${esc(item.title || '')}</h4>
  <p>${esc(item.desc || '')}</p>
</div>`
    )
    .join('\n')

  return `<section class="pd-section">
  <div class="pd-highlights__grid">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
