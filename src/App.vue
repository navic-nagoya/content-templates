<script setup>
import { ref } from 'vue'
import LibraryView from './views/LibraryView.vue'
import EditorView from './views/EditorView.vue'
import { draftStore } from './store/draft.js'

const view = ref('library') // 'library' | 'editor'

function switchView(next) {
  view.value = next
  // Scroll to top so each view feels fresh.
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="app-root">
    <div class="app-viewbar">
      <div class="app-viewbar__inner">
        <strong class="app-viewbar__brand">PD Templates</strong>
        <div class="app-viewbar__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="view === 'library'"
            :class="{ 'is-active': view === 'library' }"
            @click="switchView('library')"
          >
            ライブラリ
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="view === 'editor'"
            :class="{ 'is-active': view === 'editor' }"
            @click="switchView('editor')"
          >
            エディター
            <span v-if="draftStore.blocks.length" class="app-viewbar__count">
              {{ draftStore.blocks.length }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <LibraryView v-if="view === 'library'" @switch-view="switchView" />
    <EditorView v-else @switch-view="switchView" />
  </div>
</template>
