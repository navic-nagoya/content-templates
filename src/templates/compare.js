import { esc, indent, repeat } from './util.js'

const PRODUCT_PRESETS = [
  { name: '製品 A', sub: 'エントリーモデル · 軽量デザイン', price: '¥699' },
  { name: '製品 B', sub: 'スタンダードモデル · オールラウンドな選択', price: '¥999' },
  { name: '製品 C', sub: 'フラッグシップモデル · 究極の体験', price: '¥1,599' },
  { name: '製品 D', sub: 'プロフェッショナルモデル', price: '¥1,999' }
]

const ROW_PRESETS = [
  { hint: '本体重量', values: ['120g', '135g', '148g', '160g'] },
  { hint: 'バッテリー持続時間', values: ['36H', '48H', '72H', '96H'] },
  { hint: '防水等級', values: ['IPX5', 'IPX7', 'IPX8', 'IPX8'] },
  { hint: '充電方式', values: ['USB-C', 'USB-C 急速充電', 'ワイヤレス充電', '両方対応'] },
  { hint: 'アフターサービス', values: ['1年保証', '2年保証', '3年保証', '3年保証'] }
]

export function defaultCompareProduct(i) {
  const p = PRODUCT_PRESETS[i % PRODUCT_PRESETS.length]
  return {
    img: 'https://placehold.co/400x400',
    name: p.name,
    sub: p.sub,
    price: p.price
  }
}

export function defaultCompareRow(i, cols) {
  const r = ROW_PRESETS[i % ROW_PRESETS.length]
  return {
    hint: r.hint,
    values: repeat(cols, (c) => r.values[c % r.values.length])
  }
}

export function renderCompare({ cols = 2, products = [], rows = [] }) {
  const safeCols = Math.max(2, Math.min(4, cols | 0))
  const productList = products.length
    ? products.slice(0, safeCols)
    : repeat(safeCols, (i) => defaultCompareProduct(i))
  const rowList = rows.length ? rows : repeat(5, (i) => defaultCompareRow(i, safeCols))

  const cardsHtml = productList
    .map(
      (p) => `<div class="pd-compare__card">
  <img src="${esc(p.img)}" alt="商品画像" />
  <h3 class="pd-compare__name">${esc(p.name)}</h3>
  <p class="pd-compare__sub">${esc(p.sub)}</p>
  <p class="pd-compare__price">${esc(p.price)}</p>
</div>`
    )
    .join('\n')

  const rowsHtml = rowList
    .map((row) => {
      const values = (row.values || []).slice(0, safeCols)
      const cells = values
        .map(
          (v) => `<div class="pd-compare__cell">
  <span class="pd-compare__param">${esc(v)}</span>
  <span class="pd-compare__hint">${esc(row.hint)}</span>
</div>`
        )
        .join('\n')
      return `<div class="pd-compare__row">
${indent(cells, 2)}
</div>`
    })
    .join('\n')

  return `<section class="pd-section">
  <div class="pd-compare" data-cols="${safeCols}">
    <div class="pd-compare__head">
${indent(cardsHtml, 6)}
    </div>
    <div class="pd-compare__divider"></div>
    <div class="pd-compare__body">
${indent(rowsHtml, 6)}
    </div>
  </div>
</section>`
}
