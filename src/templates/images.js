import { esc, indent, placeholderForCols, repeat } from './util.js'

export function defaultImageItem(i, cols) {
  const size = placeholderForCols(cols)
  return {
    src: `https://placehold.co/${size}`,
    alt: '画像の説明',
    title: '画像タイトル',
    desc: '画像の説明文（省略可）',
    showCaption: true
  }
}

export function renderImages({ cols = 1, items = [] }) {
  const safeCols = Math.max(1, cols | 0)
  const list = items.length ? items : repeat(safeCols, (i) => defaultImageItem(i, safeCols))

  const itemsHtml = list
    .map((item) => {
      const caption = item.showCaption !== false
        ? `
  <div class="pd-images__caption">
    <h4>${esc(item.title || '')}</h4>
    <p>${esc(item.desc || '')}</p>
  </div>`
        : ''
      return `<div class="pd-images__item">
  <img src="${esc(item.src)}" alt="${esc(item.alt || '')}" />${caption}
</div>`
    })
    .join('\n')

  return `<section class="pd-section">
  <div class="pd-images__grid" data-cols="${safeCols}">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
