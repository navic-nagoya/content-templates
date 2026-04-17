// Syntax highlighting for Shopify HTML snippets in the gallery "コード" tab.
// Finsweet Attributes "Code Highlight" is built on Highlight.js — same approach:
// https://finsweet.com/attributes/code-highlight

import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('xml', xml)

/**
 * Highlight a product-detail HTML fragment (mostly tags + text).
 * Uses the XML grammar with ignoreIllegals so partial snippets still render.
 */
export function highlightShopifyHtml(source) {
  if (!source) return ''
  try {
    return hljs.highlight(source, { language: 'xml', ignoreIllegals: true }).value
  } catch {
    return hljs.highlightAuto(source).value
  }
}
