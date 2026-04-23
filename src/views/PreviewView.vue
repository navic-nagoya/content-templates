<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePreviewResize } from '../utils/use-preview-resize.js'
import { highlightShopifyHtml } from '../utils/highlight-html.js'

// Free-form HTML sandbox. Operators paste a snippet they're about to push to
// Shopify and see it rendered with the real `style.css` + the same preview-mode
// simulator the rest of the gallery uses — no Shopify round-trip needed.

const STORAGE_KEY = 'shopify-editor.htmlPreview.v1'
const VIEW_MODE_KEY = 'shopify-editor.htmlPreview.viewMode.v1'

const VIEW_MODES = [
  { id: 'code', label: 'コード', hint: '編集に集中' },
  { id: 'split', label: '並列', hint: 'コード + プレビュー' },
  { id: 'preview', label: 'プレビュー', hint: '画面を広く' }
]

const html = ref('')
const viewMode = ref('split')

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) html.value = saved
  const savedMode = localStorage.getItem(VIEW_MODE_KEY)
  if (savedMode && VIEW_MODES.some((m) => m.id === savedMode)) {
    viewMode.value = savedMode
  }
} catch {
  /* ignore */
}

watch(html, (next) => {
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
})

watch(viewMode, (next) => {
  try {
    localStorage.setItem(VIEW_MODE_KEY, next)
  } catch {
    /* ignore */
  }
})

const { previewEl, width, isFluid, isResizing, onPointerDown } = usePreviewResize()

const charCount = computed(() => html.value.length)

// Tokenized HTML for the highlight overlay. Add a trailing space so a
// final newline still produces a layout line in the <pre>, keeping the
// overlay's height in sync with the textarea.
const highlightedHtml = computed(() =>
  highlightShopifyHtml(html.value.endsWith('\n') ? html.value + ' ' : html.value)
)

const editorEl = ref(null)
const highlightEl = ref(null)
function syncScroll() {
  if (!editorEl.value || !highlightEl.value) return
  highlightEl.value.scrollTop = editorEl.value.scrollTop
  highlightEl.value.scrollLeft = editorEl.value.scrollLeft
}

// Re-sync after highlight DOM is rebuilt (line wrap can shift scrollTop slightly).
watch(highlightedHtml, () => {
  requestAnimationFrame(syncScroll)
})

// Tab key inserts two spaces instead of moving focus — matches a code editor.
function onTabKey(e) {
  if (e.key !== 'Tab' || e.ctrlKey || e.metaKey || e.altKey) return
  e.preventDefault()
  const el = editorEl.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const before = html.value.slice(0, start)
  const after = html.value.slice(end)
  html.value = `${before}  ${after}`
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

// Re-sync the preview DOM whenever the input changes. We render via innerHTML
// (not v-html) so that the ResizeObserver inside `usePreviewResize` keeps
// firing as `.pd-section` is replaced.
onMounted(() => {
  if (previewEl.value) previewEl.value.innerHTML = html.value
})
watch(html, (next) => {
  if (previewEl.value) previewEl.value.innerHTML = next
})
</script>

<template>
  <div class="preview-view">
    <header class="preview-view__head">
      <p class="preview-view__eyebrow">HTML サンドボックス</p>
      <h2 class="preview-view__title">HTML プレビュー</h2>
      <p class="preview-view__lead">
        編集中の HTML を左に貼り付けると、右側で実際の表示を確認できます。
        Shopify に貼ってから何度も保存・再読込せずに、ここで仕上げてからコピーできます。
        画面右上の「流動 / PC / タブレット / スマホ」でデバイス幅も切り替えられます。
      </p>
      <div class="preview-view__tabs" role="tablist" aria-label="表示モード">
        <button
          v-for="m in VIEW_MODES"
          :key="m.id"
          type="button"
          role="tab"
          :aria-selected="viewMode === m.id"
          :title="m.hint"
          :class="['preview-view__tab', { 'is-active': viewMode === m.id }]"
          @click="viewMode = m.id"
        >
          {{ m.label }}
        </button>
      </div>
    </header>

    <div
      class="preview-view__layout"
      :class="`preview-view__layout--${viewMode}`"
    >
      <section
        v-show="viewMode !== 'preview'"
        class="preview-view__panel preview-view__panel--input"
      >
        <div class="preview-view__panel-head">
          <h3>HTML 入力</h3>
          <span class="preview-view__count">{{ charCount.toLocaleString() }} 文字</span>
        </div>
        <div class="preview-view__editor">
          <pre
            ref="highlightEl"
            class="preview-view__highlight hljs"
            aria-hidden="true"
          ><code v-html="highlightedHtml"></code></pre>
          <textarea
            ref="editorEl"
            v-model="html"
            class="preview-view__textarea"
            spellcheck="false"
            placeholder="ここに HTML を貼り付けてください。&#10;例：&lt;section class=&quot;pd-section pd-feature&quot;&gt;...&lt;/section&gt;"
            @scroll="syncScroll"
            @keydown="onTabKey"
          ></textarea>
        </div>
      </section>

      <section
        v-show="viewMode !== 'code'"
        class="preview-view__panel preview-view__panel--preview"
      >
        <div class="preview-view__panel-head">
          <h3>プレビュー</h3>
          <span class="preview-view__hint">style.css 適用済み</span>
        </div>
        <div
          class="tpl-card__canvas preview-view__canvas"
          :class="{ 'is-resizing': isResizing }"
        >
          <div
            ref="previewEl"
            class="tpl-card__preview"
          ></div>
          <div
            v-if="isFluid"
            class="preview-resizer"
            :class="{ 'is-active': isResizing }"
            role="separator"
            aria-orientation="vertical"
            aria-label="プレビュー幅を調整"
            title="ドラッグして幅を変更"
            @pointerdown="onPointerDown"
          />
          <div v-if="isFluid" class="preview-width-badge">{{ width }}px</div>
        </div>
        <p v-if="!html" class="preview-view__empty">
          左に HTML を入力すると、ここにプレビューが表示されます。
        </p>
      </section>
    </div>
  </div>
</template>
