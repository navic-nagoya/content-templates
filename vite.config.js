import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Project Pages is served under /<repo>/ (e.g. org.github.io/product-templates/).
// GITHUB_REPOSITORY is "owner/repo" and is set automatically in GitHub Actions.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoName ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
