// Force any paste into a contenteditable element to be plain text only.
// Bind via `@paste="pastePlainText"` on the editable element.
//
// We use `document.execCommand('insertText', ...)` even though it's marked
// "deprecated" in the spec — it remains the only browser-supported way to
// insert text at the caret while properly participating in the element's
// undo stack and firing the native `input` event (so existing
// `@input` handlers re-run with no extra wiring on the call site).
export function pastePlainText(event) {
  const text = event.clipboardData?.getData('text/plain')
  if (text == null) return
  event.preventDefault()

  if (document.execCommand?.('insertText', false, text)) return

  // Fallback for environments that no longer expose execCommand: insert a
  // text node manually at the current selection.
  const sel = window.getSelection?.()
  if (!sel || sel.rangeCount === 0) return
  const range = sel.getRangeAt(0)
  range.deleteContents()
  const node = document.createTextNode(text)
  range.insertNode(node)
  range.setStartAfter(node)
  range.setEndAfter(node)
  sel.removeAllRanges()
  sel.addRange(range)
  // execCommand fires `input` automatically; the manual path needs to dispatch
  // it so the Vue side picks up the change.
  event.target?.dispatchEvent(new Event('input', { bubbles: true }))
}
