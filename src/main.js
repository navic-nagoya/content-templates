import { createApp } from 'vue'
import App from './App.vue'

// Gallery/operator UI styles (scoped to the preview site, never shipped to Shopify)
import './styles/app.css'

// Shopify-side product detail stylesheet. Imported here ONLY so the live preview
// in the gallery looks the same as on the real store page. Operators still copy
// the contents of `style.css` at the repo root into their Shopify HTML editor.
import '../style.css'

createApp(App).mount('#app')
