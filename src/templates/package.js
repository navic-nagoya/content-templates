import { esc, indent, repeat } from './util.js'

// Japanese EC pages very commonly include a "同梱物" / "セット内容" section
// that lists what's inside the box. Each item has thumb + name + qty + optional note.

const ITEM_PRESETS = [
  { name: '本体', qty: '× 1', note: '' },
  { name: '充電ケーブル', qty: '× 1', note: 'USB-C 1.5m' },
  { name: '専用収納ポーチ', qty: '× 1', note: '' },
  { name: '取扱説明書', qty: '× 1', note: '日本語 / English' },
  { name: '予備イヤーピース', qty: '× 2', note: 'S / L サイズ' },
  { name: '保証書', qty: '× 1', note: '3年公式保証' }
]

export function defaultPackageItem(i = 0) {
  const p = ITEM_PRESETS[i % ITEM_PRESETS.length]
  return {
    img: 'https://placehold.co/300x300',
    name: p.name,
    qty: p.qty,
    note: p.note
  }
}

const VARIANT_CLASS = {
  grid: 'pd-package--grid',
  list: 'pd-package--list'
}

/** Gallery labels; `id` is passed to renderPackage({ variant }). */
export const PACKAGE_VARIANTS = [
  { id: 'grid', label: 'グリッド（画像＋名称＋数量）' },
  { id: 'list', label: '横並びリスト（サムネ＋名称＋数量＋備考）' }
]

// Build item list: trim to n, pad with defaults, or synthesize when empty.
function listForPackage(n, items) {
  if (!items.length) return repeat(n, (i) => defaultPackageItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [
    ...items,
    ...repeat(n - items.length, (i) => defaultPackageItem(items.length + i))
  ]
}

export function renderPackage({ count = 4, items = [], variant = 'grid' } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForPackage(n, items)
  const mod = VARIANT_CLASS[variant] ?? VARIANT_CLASS.grid

  if (variant === 'list') return renderList(list, mod)
  return renderGrid(list, mod)
}

function renderGridItem(it) {
  const noteHtml = it.note
    ? `\n    <p class="pd-package__note">${esc(it.note)}</p>`
    : ''
  return `<div class="pd-package__item">
  <div class="pd-package__thumb">
    <img src="${esc(it.img)}" alt="${esc(it.name)}" />
  </div>
  <div class="pd-package__info">
    <p class="pd-package__name">${esc(it.name)}</p>
    <p class="pd-package__qty">${esc(it.qty)}</p>${noteHtml}
  </div>
</div>`
}

function renderGrid(list, mod) {
  // Cap columns at 4 desktop / 2 tablet so partial rows don't leave empty cells.
  const colsD = Math.min(list.length, 4)
  const colsT = Math.min(list.length, 2)
  const itemsHtml = list.map(renderGridItem).join('\n')

  return `<section class="pd-section pd-package ${mod}">
  <div class="pd-package__grid" style="--cols-d:${colsD};--cols-t:${colsT};">
${indent(itemsHtml, 4)}
  </div>
</section>`
}

function renderListItem(it) {
  const noteHtml = it.note
    ? `\n    <p class="pd-package__note">${esc(it.note)}</p>`
    : ''
  return `<div class="pd-package__row">
  <div class="pd-package__row-thumb">
    <img src="${esc(it.img)}" alt="${esc(it.name)}" />
  </div>
  <div class="pd-package__row-info">
    <p class="pd-package__name">${esc(it.name)}</p>${noteHtml}
  </div>
  <p class="pd-package__row-qty">${esc(it.qty)}</p>
</div>`
}

function renderList(list, mod) {
  const itemsHtml = list.map(renderListItem).join('\n')
  return `<section class="pd-section pd-package ${mod}">
  <div class="pd-package__rows">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
