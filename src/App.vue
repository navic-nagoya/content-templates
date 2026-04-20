<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import LibraryView from './views/LibraryView.vue'
import EditorView from './views/EditorView.vue'
import { draftStore } from './store/draft.js'

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
        <strong class="app-topbar__brand">PD Templates</strong>
        <button
          type="button"
          class="app-cart"
          :class="{ 'is-active': drawerOpen }"
          :aria-expanded="drawerOpen"
          aria-controls="draft-drawer"
          @click="openDrawer"
        >
          <span class="app-cart__icon" aria-hidden="true">🛒</span>
          <span>下書き</span>
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
        id="draft-drawer"
        class="app-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="下書き"
      >
        <button
          type="button"
          class="app-drawer__close"
          @click="closeDrawer"
          title="閉じる (Esc)"
          aria-label="閉じる"
        >
          ×
        </button>
        <EditorView @close-drawer="closeDrawer" />
      </aside>
    </Transition>
  </div>
</template>
