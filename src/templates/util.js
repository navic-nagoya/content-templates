// Lightweight HTML helpers shared by every template generator.
// The goal: emit clean, human-readable HTML that an operator can paste into
// Shopify's rich text editor (HTML mode) without further cleanup.

export function esc(value) {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Indent every line of `text` by `indent` spaces.
export function indent(text, spaces = 2) {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n')
}

// Pick a placeholder image size per column count so the preview keeps a
// reasonable aspect ratio regardless of how many columns are requested.
export function placeholderForCols(cols) {
  if (cols <= 1) return '1200x600'
  if (cols === 2) return '800x600'
  if (cols === 3) return '600x450'
  return '400x300'
}

// Create an array of length n filled by calling fn(i).
export function repeat(n, fn) {
  return Array.from({ length: Math.max(0, n | 0) }, (_, i) => fn(i))
}
