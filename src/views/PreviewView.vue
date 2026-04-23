<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Icon from '../components/Icon.vue'
import { usePreviewResize } from '../utils/use-preview-resize.js'

// Free-form HTML sandbox. Operators paste a snippet they're about to push to
// Shopify and see it rendered with the real `style.css` + the same preview-mode
// simulator the rest of the gallery uses — no Shopify round-trip needed.

const STORAGE_KEY = 'shopify-editor.htmlPreview.v1'

const html = ref('')

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) html.value = saved
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

const { previewEl, width, isFluid, isResizing, onPointerDown } = usePreviewResize()

const charCount = computed(() => html.value.length)

function clearAll() {
  if (!html.value) return
  if (window.confirm('入力した HTML をすべて削除しますか？')) {
    html.value = ''
  }
}

const SAMPLE = `<section class="pd-section pd-hgroup">
  <p class="pd-hgroup__eyebrow">サンプル見出し</p>
  <h2 class="pd-hgroup__title">ここに商品タイトル</h2>
  <p class="pd-hgroup__sub">ここにサブタイトル / 補足説明</p>
</section>`

function fillSample() {
  if (html.value && !window.confirm('現在の内容を上書きしてサンプルを挿入しますか？')) return
  html.value = SAMPLE
}

const copied = ref(false)
let copiedTimer = null
async function copyHtml() {
  if (!html.value) return
  try {
    await navigator.clipboard.writeText(html.value)
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = false), 1400)
  } catch {
    /* ignore */
  }
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
    </header>

    <div class="preview-view__layout">
      <section class="preview-view__panel preview-view__panel--input">
        <div class="preview-view__panel-head">
          <h3>HTML 入力</h3>
          <span class="preview-view__count">{{ charCount.toLocaleString() }} 文字</span>
        </div>
        <textarea
          v-model="html"
          class="preview-view__textarea"
          spellcheck="false"
          placeholder="ここに HTML を貼り付けてください。&#10;例：&lt;section class=&quot;pd-section pd-feature&quot;&gt;...&lt;/section&gt;"
        ></textarea>
        <div class="preview-view__actions">
          <button
            type="button"
            class="btn btn--ghost btn--sm"
            @click="fillSample"
          >
            <Icon name="plus" :size="14" />
            <span>サンプルを挿入</span>
          </button>
          <button
            type="button"
            class="btn btn--ghost btn--sm"
            :disabled="!html"
            @click="clearAll"
          >
            <Icon name="trash" :size="14" />
            <span>クリア</span>
          </button>
          <button
            type="button"
            class="btn btn--primary btn--sm"
            :class="{ 'is-copied': copied }"
            :disabled="!html"
            @click="copyHtml"
          >
            <template v-if="copied">
              <Icon name="check" :size="14" />
              <span>コピーしました</span>
            </template>
            <template v-else>
              <Icon name="copy" :size="14" />
              <span>HTML をコピー</span>
            </template>
          </button>
        </div>
      </section>

      <section class="preview-view__panel preview-view__panel--preview">
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
