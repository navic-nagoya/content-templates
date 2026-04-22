import { esc, indent, repeat } from './util.js'

const SINGLE_ROWS = [
  ['カラー', 'マットブラック / パールホワイト'],
  ['サイズ', '120 × 60 × 8 mm'],
  ['重量', '120g'],
  ['素材', '航空アルミ合金 + PC'],
  ['バッテリー持続', '約48時間'],
  ['充電方式', 'USB-C 急速充電'],
  ['防水等級', 'IPX7'],
  ['保証', '3年公式保証']
]

const GALLERY_IMAGES = [
  'https://placehold.co/800x600',
  'https://placehold.co/400x400',
  'https://placehold.co/400x400'
]

export function defaultSpecsGalleryImage(i) {
  return {
    src: GALLERY_IMAGES[i % GALLERY_IMAGES.length],
    alt: '商品画像'
  }
}

const COMPARE_ROWS = [
  ['カラー', ['マットブラック', 'パールホワイト', 'スターグレー', 'トワイライトゴールド']],
  ['サイズ', ['120 × 60 × 8 mm', '130 × 65 × 9 mm', '115 × 58 × 7 mm', '125 × 62 × 8 mm']],
  ['重量', ['120g', '145g', '105g', '132g']],
  ['バッテリー持続', ['48H', '36H', '60H', '48H']],
  ['防水等級', ['IPX7', 'IPX5', 'IPX7', 'IPX6']],
  ['保証', ['3年', '2年', '3年', '2年']]
]

export function defaultSpecsSingle() {
  return { rows: SINGLE_ROWS.map(([k, v]) => ({ key: k, value: v })) }
}

/** One placeholder row for single-specs table (gallery editor). */
export function defaultSpecsSingleRow(i) {
  const [k, v] = SINGLE_ROWS[i % SINGLE_ROWS.length]
  return { key: k, value: v }
}

/** One compare row with `values` length matching product column count (2–6). */
export function defaultSpecsCompareRow(productCount, rowIndex) {
  const n = Math.max(2, Math.min(6, productCount | 0))
  const [k, arr] = COMPARE_ROWS[rowIndex % COMPARE_ROWS.length]
  return {
    key: k,
    values: repeat(n, (j) => arr[j % arr.length])
  }
}

export function defaultSpecsCompare(products = 3) {
  const n = Math.max(2, Math.min(6, products | 0))
  return {
    products: repeat(n, (i) => `製品 ${String.fromCharCode(65 + i)}`),
    rows: COMPARE_ROWS.map(([k, arr]) => ({
      key: k,
      values: repeat(n, (i) => arr[i % arr.length])
    }))
  }
}

function renderRow(cells) {
  const tds = cells.map((c) => `<td>${esc(c)}</td>`).join('\n')
  return `<tr>
${indent(tds, 2)}
</tr>`
}

export function renderSpecs({ variant = 'single', single, compare, gallery }) {
  if (variant === 'withImages') {
    const rows = (gallery?.rows ?? single?.rows ?? defaultSpecsSingle().rows)
    const rawImages = gallery?.images?.length
      ? gallery.images
      : repeat(2, (i) => defaultSpecsGalleryImage(i))
    const images = rawImages.slice(0, 3)
    const head = `<tr>
  <th>スペック</th>
  <th>パラメータ</th>
</tr>`
    const body = rows.map((r) => renderRow([r.key, r.value])).join('\n')
    const imgsHtml = images
      .map((img) => `<img src="${esc(img.src)}" alt="${esc(img.alt || '')}" />`)
      .join('\n')

    return `<section class="pd-section pd-specs pd-specs--gallery">
  <div class="pd-specs__gallery">
    <div class="pd-specs__gallery-images" data-count="${images.length}">
${indent(imgsHtml, 6)}
    </div>
    <div class="pd-specs__wrap">
      <table class="pd-specs__table">
        <thead>
${indent(head, 10)}
        </thead>
        <tbody>
${indent(body, 10)}
        </tbody>
      </table>
    </div>
  </div>
</section>`
  }

  if (variant === 'compare') {
    const data = compare || defaultSpecsCompare(3)
    const headRow = `<tr>
  <th>スペック</th>
${indent(data.products.map((p) => `<th>${esc(p)}</th>`).join('\n'), 2)}
</tr>`
    const bodyRows = data.rows.map((r) => renderRow([r.key, ...r.values])).join('\n')

    return `<section class="pd-section">
  <div class="pd-specs__wrap">
    <table class="pd-specs__table">
      <thead>
${indent(headRow, 8)}
      </thead>
      <tbody>
${indent(bodyRows, 8)}
      </tbody>
    </table>
  </div>
</section>`
  }

  const data = single || defaultSpecsSingle()
  const head = `<tr>
  <th>スペック</th>
  <th>パラメータ</th>
</tr>`
  const body = data.rows.map((r) => renderRow([r.key, r.value])).join('\n')

  return `<section class="pd-section">
  <div class="pd-specs__wrap">
    <table class="pd-specs__table">
      <thead>
${indent(head, 8)}
      </thead>
      <tbody>
${indent(body, 8)}
      </tbody>
    </table>
  </div>
</section>`
}
