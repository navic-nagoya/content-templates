<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import LibraryView from './views/LibraryView.vue'
import EditorView from './views/EditorView.vue'
import Icon from './components/Icon.vue'
import { draftStore } from './store/draft.js'
import { PREVIEW_MODES, previewState, setPreviewMode } from './store/previewMode.js'

const drawerOpen = ref(false)
const count = computed(() => draftStore.blocks.length)

function openDrawer() {
  drawerOpen.value = true
}
function closeDrawer() {
  drawerOpen.value = false
}

// ESC closes the drawer — matches typical "side panel" affordance.
function onKeydown(e) {
  if (e.key === 'Escape' && drawerOpen.value) closeDrawer()
}
window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// Body scroll lock while the drawer is open so background gallery doesn't
// move under the panel.
watch(drawerOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <div class="app-root">
    <div class="app-topbar">
      <div class="app-topbar__inner">
        <strong class="app-topbar__brand">Shopify Editor</strong>
        <div
          class="app-preview-modes"
          role="tablist"
          aria-label="プレビュー幅"
          :title="`プレビュー幅：セクションの container query を切り替えて、ウィンドウ幅を変えずに各デバイスのレイアウトを確認できます`"
        >
          <button
            v-for="m in PREVIEW_MODES"
            :key="m.id"
            type="button"
            role="tab"
            :aria-selected="previewState.mode === m.id"
            :class="['app-preview-modes__btn', { 'is-active': previewState.mode === m.id }]"
            @click="setPreviewMode(m.id)"
          >
            {{ m.label }}
          </button>
        </div>
        <button
          type="button"
          class="app-cart"
          :class="{ 'is-active': drawerOpen }"
          :aria-expanded="drawerOpen"
          aria-controls="editor-drawer"
          @click="openDrawer"
        >
          <Icon name="article" :size="16" />
          <span>エディター</span>
          <span v-if="count" class="app-cart__count">{{ count }}</span>
        </button>
      </div>
    </div>

    <LibraryView @open-draft="openDrawer" />

    <Transition name="drawer-fade">
      <div
        v-if="drawerOpen"
        class="app-drawer__backdrop"
        @click="closeDrawer"
      />
    </Transition>
    <Transition name="drawer-slide">
      <aside
        v-show="drawerOpen"
        id="editor-drawer"
        class="app-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="エディター"
      >
        <button
          type="button"
          class="app-drawer__close"
          @click="closeDrawer"
          title="閉じる (Esc)"
          aria-label="閉じる"
        >
          <Icon name="x" :size="20" />
        </button>
        <EditorView @close-drawer="closeDrawer" />
      </aside>
    </Transition>
  </div>
</template>
