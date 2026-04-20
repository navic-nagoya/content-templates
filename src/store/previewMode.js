import { reactive, watch } from 'vue'

// Preview viewport simulator. Drives the `data-preview-mode` attribute on
// <html>, which `.tpl-card__preview` / `.ed-block__preview` consume via the
// `--preview-max-w` CSS variable. Combined with `container-type: inline-size`
// on the preview wrapper, switching modes narrows the container and triggers
// the @container queries added at the bottom of style.css — operators can
// check mobile layout without resizing the whole browser window.

const STORAGE_KEY = 'shopify-editor.previewMode.v1'

// `desktop` width is intentionally larger than a typical gallery card
// (~850px wide). When the simulated viewport overflows the card, the
// canvas wrapper (`.tpl-card__canvas` / `.ed-block__canvas`) handles
// horizontal scrolling — see app.css.
export const PREVIEW_MODES = [
  { id: 'fluid', label: '流動', icon: 'devices', width: null },
  { id: 'desktop', label: 'PC', icon: 'desktop', width: 1280 },
  { id: 'tablet', label: 'タブレット', icon: 'device-tablet-speaker', width: 768 },
  { id: 'mobile', label: 'スマホ', icon: 'device-mobile-camera', width: 390 }
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 'fluid'
    if (PREVIEW_MODES.some((m) => m.id === raw)) return raw
    return 'fluid'
  } catch {
    return 'fluid'
  }
}

export const previewState = reactive({
  mode: load()
})

function apply() {
  const root = document.documentElement
  root.setAttribute('data-preview-mode', previewState.mode)
  const active = PREVIEW_MODES.find((m) => m.id === previewState.mode)
  if (active?.width) {
    root.style.setProperty('--preview-max-w', `${active.width}px`)
  } else {
    root.style.removeProperty('--preview-max-w')
  }
}

apply()

watch(
  () => previewState.mode,
  () => {
    apply()
    try {
      localStorage.setItem(STORAGE_KEY, previewState.mode)
    } catch {
      /* ignore */
    }
  }
)

export function setPreviewMode(id) {
  if (PREVIEW_MODES.some((m) => m.id === id)) {
    previewState.mode = id
  }
}
