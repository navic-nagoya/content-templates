<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import ComponentsSidebar from '../components/ComponentsSidebar.vue'
import { SECTION_MAP } from '../router/sections.js'

const route = useRoute()

const current = computed(() => SECTION_MAP[route.params.id])

// Build an async component keyed by route id so Vue creates a fresh instance
// when navigating between sections (otherwise internal section state could
// leak between pages).
const SectionComponent = computed(() => {
  const entry = current.value
  if (!entry) return null
  return defineAsyncComponent(entry.component)
})
</script>

<template>
  <div class="app-shell">
    <ComponentsSidebar />

    <main class="app-main">
      <template v-if="current">
        <Suspense :timeout="0">
          <component :is="SectionComponent" :key="current.id" />
          <template #fallback>
            <div class="app-section-skeleton" aria-hidden="true">
              <div class="app-section-skeleton__bar" style="width: 38%" />
              <div class="app-section-skeleton__bar" style="width: 72%" />
              <div class="app-section-skeleton__bar" style="width: 58%" />
              <div class="app-section-skeleton__block" />
            </div>
          </template>
        </Suspense>
      </template>
      <template v-else>
        <header class="app-header">
          <h2>コンポーネントが見つかりません</h2>
          <p>
            URL をご確認ください。左のナビゲーションから各コンポーネントへ移動できます。
          </p>
        </header>
      </template>
    </main>
  </div>
</template>
