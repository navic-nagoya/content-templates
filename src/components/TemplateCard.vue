<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import CopyButton from "./CopyButton.vue";
import { highlightShopifyHtml } from "../utils/highlight-html.js";
import { addSectionBlock } from "../store/draft.js";

const props = defineProps({
  name: { type: String, required: true },
  badge: { type: String, default: "" },
  html: { type: String, required: true },
  /** When true, preview is contenteditable; edits sync to code tab + copy (raw HTML). */
  editablePreview: { type: Boolean, default: true },
});

// Tab state: 'preview' (default) renders the live HTML, 'code' shows syntax-highlighted
// source (Highlight.js — same stack as Finsweet Code Highlight).
const tab = ref("preview");

// Manual edits in the preview DOM (innerHTML). Cleared whenever generated `html` changes.
const previewRoot = ref(null);
const draftHtml = ref(null);

const effectiveHtml = computed(() =>
  props.editablePreview && draftHtml.value !== null
    ? draftHtml.value
    : props.html,
);

const highlightedHtml = computed(() =>
  highlightShopifyHtml(effectiveHtml.value),
);

function syncPreviewFromProp() {
  draftHtml.value = null;
  nextTick(() => {
    const el = previewRoot.value;
    if (el && props.editablePreview) el.innerHTML = props.html;
  });
}

onMounted(() => {
  if (props.editablePreview && previewRoot.value) {
    previewRoot.value.innerHTML = props.html;
  }
});

watch(
  () => props.html,
  () => {
    if (props.editablePreview) syncPreviewFromProp();
  },
);

function onPreviewInput() {
  if (!props.editablePreview || !previewRoot.value) return;
  draftHtml.value = previewRoot.value.innerHTML;
}

const added = ref(false);
let addedTimer = null;
function addToDraft() {
  addSectionBlock({
    html: effectiveHtml.value,
    label: props.name,
    badge: props.badge,
  });
  added.value = true;
  clearTimeout(addedTimer);
  addedTimer = setTimeout(() => (added.value = false), 1400);
}
</script>

<template>
  <div class="tpl-card">
    <div class="tpl-card__head">
      <h4 class="tpl-card__name">{{ name }}</h4>
      <span v-if="badge" class="tpl-card__badge">{{ badge }}</span>

      <div class="tpl-card__controls">
        <slot name="controls" />
      </div>

      <div class="tpl-card__tabs" role="tablist" aria-label="表示切替">
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'preview'"
          :class="{ 'is-active': tab === 'preview' }"
          @click="tab = 'preview'"
        >
          プレビュー
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'code'"
          :class="{ 'is-active': tab === 'code' }"
          @click="tab = 'code'"
        >
          コード
        </button>
      </div>

      <button
        type="button"
        class="btn btn--primary"
        :class="{ 'is-copied': added }"
        @click="addToDraft"
      >
        {{ added ? '追加しました ✓' : '下書きに追加' }}
      </button>
      <CopyButton :text="effectiveHtml" label="コードをコピー" variant="ghost" />
    </div>

    <!-- Editable preview: DOM is driven by innerHTML so contenteditable + Vue stay in sync. -->
    <div
      v-if="editablePreview"
      v-show="tab === 'preview'"
      ref="previewRoot"
      contenteditable="true"
      spellcheck="false"
      tabindex="0"
      class="tpl-card__preview tpl-card__preview--editable"
      @input="onPreviewInput"
    ></div>
    <div
      v-else
      v-show="tab === 'preview'"
      class="tpl-card__preview"
      v-html="html"
    ></div>

    <div v-show="tab === 'code'" class="tpl-card__code">
      <pre><code class="hljs" v-html="highlightedHtml"></code></pre>
    </div>

    <slot name="fields" />
  </div>
</template>
