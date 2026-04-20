import { esc, indent, repeat } from './util.js'
import infoIcon from '../assets/icons/info-fill.svg?raw'
import warningIcon from '../assets/icons/warning-fill.svg?raw'

// Notice block: bordered callout with optional title + bullet list.
// Three tones control the color palette: info (blue), warn (amber, default), caution (red).

const DEFAULT_ITEMS = [
  'モニターの設定により、画像と実物の色味が異なる場合があります。',
  '製品仕様は改良のため予告なく変更される場合があります。',
  '初期不良以外の返品・交換はお受けできません。'
]

export function defaultNoticeItem(i = 0) {
  return DEFAULT_ITEMS[i % DEFAULT_ITEMS.length]
}

const TONE_CLASS = {
  info: 'pd-notice--info',
  warn: 'pd-notice--warn',
  caution: 'pd-notice--caution'
}

// Strip hard-coded fill/size so CSS can drive color (currentColor) and dimensions.
function prepIcon(raw) {
  return raw
    .replace(/\sfill="[^"]*"/g, '')
    .replace(/\swidth="[^"]*"/g, '')
    .replace(/\sheight="[^"]*"/g, '')
}

const TONE_ICON = {
  info: prepIcon(infoIcon),
  warn: prepIcon(warningIcon),
  caution: prepIcon(warningIcon)
}

const TONE_DEFAULT_TITLE = {
  info: 'お知らせ',
  warn: 'ご注意ください',
  caution: '重要事項'
}

/** Gallery labels; `id` is passed to renderNotice({ tone }). */
export const NOTICE_TONES = [
  { id: 'info', label: 'インフォ（青・お知らせ）' },
  { id: 'warn', label: 'ワーニング（黄・注意喚起）' },
  { id: 'caution', label: 'コーション（赤・重要事項）' }
]

function listForNotice(n, items) {
  if (!items.length) return repeat(n, (i) => defaultNoticeItem(i))
  if (items.length >= n) return items.slice(0, n)
  return [
    ...items,
    ...repeat(n - items.length, (i) => defaultNoticeItem(items.length + i))
  ]
}

export function renderNotice({ tone = 'warn', title, count = 3, items = [] } = {}) {
  const n = Math.max(1, count | 0)
  const list = listForNotice(n, items)
  const mod = TONE_CLASS[tone] ?? TONE_CLASS.warn
  const icon = TONE_ICON[tone] ?? TONE_ICON.warn
  const headingText = title ?? TONE_DEFAULT_TITLE[tone] ?? TONE_DEFAULT_TITLE.warn

  const itemsHtml = list.map((it) => `<li>${esc(it)}</li>`).join('\n')

  return `<section class="pd-section pd-notice ${mod}">
  <div class="pd-notice__icon" aria-hidden="true">${icon}</div>
  <div class="pd-notice__body">
    <p class="pd-notice__title">${esc(headingText)}</p>
    <ul class="pd-notice__list">
${indent(itemsHtml, 6)}
    </ul>
  </div>
</section>`
}
