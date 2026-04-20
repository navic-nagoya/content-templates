import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { previewState } from '../store/previewMode.js'

// Drag-to-resize + live-width readout for a preview container. Only active in
// fluid mode — the fixed-width modes keep their CSS-driven width. On pointer
// drag, we set an inline width on the preview element; ResizeObserver keeps
// `width` in sync so the badge tracks canvas resizes too (e.g., drawer open).
//
// The reported width is the inner `.pd-section`'s width (the @container
// query host), not the outer preview — that way the badge matches the
// breakpoints in style.css directly. Falls back to preview width if no
// `.pd-section` is present.
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

  function reportWidth(el) {
    const section = el.querySelector?.('.pd-section')
    const target = section || el
    width.value = Math.round(target.getBoundingClientRect().width)
  }

  function observe(el) {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (!el) return
    // Observe the preview: any width change propagates to the inner section,
    // and we re-query for `.pd-section` on each tick (it may be injected
    // after mount via innerHTML).
    observer = new ResizeObserver(() => reportWidth(el))
    observer.observe(el)
    reportWidth(el)
    // Section content is often injected post-mount (onMounted → innerHTML).
    // Nudge once the browser has processed that frame, in case the preview's
    // min-height swallowed the resize tick.
    requestAnimationFrame(() => reportWidth(el))
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
