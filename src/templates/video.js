import { esc, indent, repeat } from './util.js'

const DEFAULT_SRCS = [
  'https://www.youtube.com/embed/2GJfWMYCWY0',
  'https://www.youtube.com/embed/CgCVZdcKcqY',
  'https://www.youtube.com/embed/ZgLlabyz7oY'
]

export function defaultVideoItem(i) {
  return {
    src: DEFAULT_SRCS[i % DEFAULT_SRCS.length],
    caption: '動画の説明文（省略可）'
  }
}

export function renderVideo({ cols = 1, items = [] }) {
  const safeCols = Math.max(1, Math.min(2, cols | 0))
  const list = items.length ? items : repeat(safeCols, (i) => defaultVideoItem(i))

  const itemsHtml = list
    .map(
      (item) => `<div class="pd-video__item">
  <div class="pd-video__ratio">
    <iframe
      src="${esc(item.src)}"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>${item.caption ? `
  <p class="pd-video__caption">${esc(item.caption)}</p>` : ''}
</div>`
    )
    .join('\n')

  return `<section class="pd-section">
  <div class="pd-video__grid" data-cols="${safeCols}">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
