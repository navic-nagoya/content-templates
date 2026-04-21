<script setup>
import { RouterLink } from "vue-router";
import { SECTIONS } from "../router/sections.js";
</script>

<template>
  <aside class="app-sidebar">
    <RouterLink to="/" class="app-sidebar__brand-link">
      <div class="app-sidebar__brand">
        <h1>Shopify Editor</h1>
        <span class="app-sidebar__seal" aria-hidden="true">編</span>
      </div>
      <p class="app-sidebar__sub">
        Shopify 商品詳細ページ テンプレートギャラリー
      </p>
    </RouterLink>
    <nav>
      <RouterLink
        v-for="n in SECTIONS"
        :key="n.id"
        :to="`/components/${n.id}`"
        active-class="is-active"
      >
        <span class="app-nav__num">{{ n.num }}</span>
        <span>{{ n.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
