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

export function renderSpecs({ variant = 'single', single, compare }) {
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
