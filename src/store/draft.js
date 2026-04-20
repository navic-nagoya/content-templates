import { reactive, watch } from 'vue'

// Persistent draft assembly: an ordered list of blocks the operator builds up
// from the gallery (kind: 'section') and inline rich-text fills (kind: 'richtext').
// The combined HTML can be copied once and pasted into Shopify's HTML mode.

const STORAGE_KEY = 'pd-templates.draft.v1'

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.blocks)) return null
    return parsed
  } catch (err) {
    console.warn('[draft] load failed', err)
    return null
  }
}

const initial = load() || { blocks: [] }

export const draftStore = reactive({
  blocks: initial.blocks
})

let saveTimer = null
watch(
  () => draftStore.blocks,
  (val) => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks: val }))
      } catch (err) {
        console.warn('[draft] save failed', err)
      }
    }, 200)
  },
  { deep: true }
)

export function addSectionBlock({ html, label = '', badge = '' }) {
  draftStore.blocks.push({ id: uid(), kind: 'section', html, label, badge })
}

export function addRichTextBlock(at = draftStore.blocks.length) {
  const block = { id: uid(), kind: 'richtext', html: '' }
  draftStore.blocks.splice(at, 0, block)
  return block.id
}

export function removeBlock(id) {
  const i = draftStore.blocks.findIndex((b) => b.id === id)
  if (i >= 0) draftStore.blocks.splice(i, 1)
}

export function moveBlock(id, dir) {
  const i = draftStore.blocks.findIndex((b) => b.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= draftStore.blocks.length) return
  const [b] = draftStore.blocks.splice(i, 1)
  draftStore.blocks.splice(j, 0, b)
}

export function duplicateBlock(id) {
  const i = draftStore.blocks.findIndex((b) => b.id === id)
  if (i < 0) return
  const src = draftStore.blocks[i]
  draftStore.blocks.splice(i + 1, 0, { ...src, id: uid() })
}

export function updateBlockHtml(id, html) {
  const b = draftStore.blocks.find((b) => b.id === id)
  if (b) b.html = html
}

export function clearDraft() {
  draftStore.blocks.splice(0, draftStore.blocks.length)
}

// Combined HTML for the final paste into Shopify. Section blocks already emit
// `<section class="pd-section">…</section>`; rich-text blocks emit the raw
// Tiptap output. Joined by a blank line for readability.
export function combinedHtml() {
  return draftStore.blocks
    .map((b) => (b.kind === 'richtext' ? wrapRichText(b.html) : b.html))
    .filter(Boolean)
    .join('\n\n')
}

// Wrap rich-text HTML in a pd-section so spacing matches the other blocks
// in Shopify, and keep the marker class for future styling hooks.
function wrapRichText(html) {
  if (!html || !html.trim()) return ''
  return `<section class="pd-section pd-richtext">\n  ${html.replace(/\n/g, '\n  ')}\n</section>`
}
