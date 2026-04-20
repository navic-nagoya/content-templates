import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { previewState } from '../store/previewMode.js'

// Drag-to-resize + live-width readout for a preview container. Only active in
// fluid mode — the fixed-width modes keep their CSS-driven width. On pointer
// drag, we set an inline width on the preview element; ResizeObserver keeps
// `width` in sync so the badge tracks canvas resizes too (e.g., drawer open).
//
// The ref returned by this composable is meant to be assigned via `ref=` on
// the preview element the user resizes.

const MIN_WIDTH = 280

export function usePreviewResize() {
  const previewEl = ref(null)
  const width = ref(0)
  const isResizing = ref(false)
  const isFluid = computed(() => previewState.mode === 'fluid')

  let observer = null
  let drag = null

  function observe(el) {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (!el) return
    observer = new ResizeObserver(() => {
      width.value = Math.round(el.getBoundingClientRect().width)
    })
    observer.observe(el)
    width.value = Math.round(el.getBoundingClientRect().width)
  }

  watch(previewEl, (el) => observe(el), { immediate: true })

  function onPointerMove(e) {
    if (!drag) return
    const next = Math.max(MIN_WIDTH, drag.startWidth + (e.clientX - drag.startX))
    drag.el.style.width = `${next}px`
  }

  function endDrag() {
    if (!drag) return
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', endDrag)
    document.removeEventListener('pointercancel', endDrag)
    document.body.style.userSelect = ''
    drag = null
    isResizing.value = false
  }

  function onPointerDown(e) {
    const el = previewEl.value
    if (!el || !isFluid.value) return
    e.preventDefault()
    drag = {
      el,
      startX: e.clientX,
      startWidth: el.getBoundingClientRect().width
    }
    isResizing.value = true
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', endDrag)
    document.addEventListener('pointercancel', endDrag)
  }

  // Leaving fluid mode: clear the inline width so the fixed-mode CSS
  // (`width: var(--preview-max-w)`) wins again.
  watch(
    () => previewState.mode,
    (mode) => {
      if (mode !== 'fluid' && previewEl.value) {
        previewEl.value.style.width = ''
      }
    }
  )

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
    endDrag()
  })

  return { previewEl, width, isFluid, isResizing, onPointerDown }
}
