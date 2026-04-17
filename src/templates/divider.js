import { esc } from './util.js'

const DEFAULT_LABEL = '続きを読む'

const PLUS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>`

export const DIVIDER_VARIANTS = [
  { id: 'text-center', label: 'テキスト中央（両側ライン）' },
  { id: 'icon-center', label: 'アイコン中央（両側ライン）' },
  { id: 'text-start', label: 'テキスト左揃え（右側ライン）' }
]

export function renderDivider({ variant = 'text-center', label = DEFAULT_LABEL } = {}) {
  const safeLabel = esc(label)

  if (variant === 'icon-center') {
    return `<section class="pd-section pd-divider pd-divider--icon-center">
  <span class="pd-divider__line" aria-hidden="true"></span>
  <span class="pd-divider__icon" aria-hidden="true">
    ${PLUS_ICON_SVG}
  </span>
  <span class="pd-divider__line" aria-hidden="true"></span>
</section>`
  }

  if (variant === 'text-start') {
    return `<section class="pd-section pd-divider pd-divider--text-start">
  <span class="pd-divider__label">${safeLabel}</span>
  <span class="pd-divider__line" aria-hidden="true"></span>
</section>`
  }

  return `<section class="pd-section pd-divider pd-divider--text-center">
  <span class="pd-divider__line" aria-hidden="true"></span>
  <span class="pd-divider__label">${safeLabel}</span>
  <span class="pd-divider__line" aria-hidden="true"></span>
</section>`
}
