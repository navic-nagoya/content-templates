import { createApp } from "vue";
import App from "./App.vue";

// Gallery/operator UI styles (scoped to the preview site, never shipped to Shopify)
import "./styles/app.css";

// Code tab syntax highlighting (Highlight.js — same engine as Finsweet Code Highlight)
import "highlight.js/styles/stackoverflow-dark.css";

// Shopify-side product detail stylesheet. Imported here so the live preview in
// the gallery visually matches the real store page. The canonical file lives at
// the repo root (`/style.css`) and is deployed into each Shopify theme by the
// dev team — operators never touch it.
import "../style.css";

createApp(App).mount("#app");
