<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Paragraph } from '@tiptap/extension-paragraph'

// Custom block node that mirrors the HTML shape used by the video template
// (`<div class="pd-video__ratio"><iframe ...></div>`). Defining it as a real
// schema node — rather than inserting raw HTML — is required because Tiptap's
// ProseMirror schema otherwise strips unknown tags on insert.
const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: '' }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div.pd-video__ratio',
        getAttrs: (el) => ({
          src: el.querySelector('iframe')?.getAttribute('src') || ''
        })
      }
    ]
  },
  renderHTML({ node }) {
    return [
      'div',
      { class: 'pd-video__ratio' },
      [
        'iframe',
        {
          src: node.attrs.src,
          title: 'YouTube video player',
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerpolicy: 'strict-origin-when-cross-origin',
          allowfullscreen: 'true'
        }
      ]
    ]
  },
  addCommands() {
    return {
      setVideoEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: 'videoEmbed', attrs })
    }
  }
})

// Custom indentable paragraph: stores an integer `indent` attr that maps to
// padding-left so an operator can produce the same indent visual Shopify's RTE
// gives. Lists keep their own nesting via the StarterKit listKeymap.
const IndentableParagraph = Paragraph.extend({
  addAttributes() {
    return {
      indent: {
        default: 0,
        parseHTML: (el) => Number(el.getAttribute('data-indent')) || 0,
        renderHTML: (attrs) => {
          if (!attrs.indent) return {}
          return {
            'data-indent': attrs.indent,
            style: `padding-left: ${attrs.indent * 2}em`
          }
        }
      }
    }
  }
})

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue || '<p></p>',
  extensions: [
    StarterKit.configure({
      paragraph: false, // replaced by IndentableParagraph below
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
      },
      codeBlock: false,
      code: false
    }),
    IndentableParagraph,
    TextStyle,
    Color,
    Image.configure({ inline: false, allowBase64: false }),
    Table.configure({ resizable: false, HTMLAttributes: { class: 'pd-rte-table' } }),
    TableRow,
    TableHeader,
    TableCell,
    VideoEmbed
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// Keep editor in sync if parent swaps the value (e.g., loading a saved draft).
watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    if (val === editor.value.getHTML()) return
    editor.value.commands.setContent(val || '<p></p>', false)
  }
)

onBeforeUnmount(() => editor.value?.destroy())

// ---------------- Toolbar helpers ----------------
function chain() {
  return editor.value?.chain().focus()
}
function isActive(name, attrs) {
  return editor.value?.isActive(name, attrs)
}

const PRESET_COLORS = [
  { v: '#111111', n: '黒' },
  { v: '#666666', n: 'グレー' },
  { v: '#0b62a9', n: '青' },
  { v: '#c0392b', n: '赤' },
  { v: '#1e8449', n: '緑' },
  { v: '#b7791f', n: '橙' }
]

function setHeading(level) {
  if (level === 0) chain()?.setParagraph().run()
  else chain()?.toggleHeading({ level }).run()
}

function setColor(value) {
  if (!value) chain()?.unsetColor().run()
  else chain()?.setColor(value).run()
}

// Indent: in a list, Tab/Shift-Tab handle nesting via listKeymap. For
// paragraphs we mutate the indent attr on the current paragraph node.
function changeIndent(delta) {
  const ed = editor.value
  if (!ed) return
  if (ed.isActive('listItem')) {
    if (delta > 0) ed.chain().focus().sinkListItem('listItem').run()
    else ed.chain().focus().liftListItem('listItem').run()
    return
  }
  if (!ed.isActive('paragraph')) return
  const cur = ed.getAttributes('paragraph').indent || 0
  const next = Math.max(0, Math.min(6, cur + delta))
  ed.chain().focus().updateAttributes('paragraph', { indent: next }).run()
}

// ---------------- Insertion dialogs ----------------
function promptLink() {
  const prev = editor.value?.getAttributes('link').href || ''
  const url = window.prompt('リンク URL（空欄で解除）', prev)
  if (url === null) return
  if (url === '') {
    chain()?.unsetLink().run()
    return
  }
  chain()?.extendMarkRange('link').setLink({ href: url }).run()
}

function promptImage() {
  const url = window.prompt('画像 URL（Shopify CDN など）', '')
  if (!url) return
  const alt = window.prompt('alt テキスト（SEO 用）', '') || ''
  chain()?.setImage({ src: url, alt }).run()
}

function promptVideo() {
  const url = window.prompt(
    '埋め込み URL（例: https://www.youtube.com/embed/XXXX）',
    'https://www.youtube.com/embed/'
  )
  if (!url || url.endsWith('embed/')) return
  chain()?.setVideoEmbed({ src: url }).run()
}

function insertTable() {
  chain()?.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const tableActive = computed(() => isActive('table'))
</script>

<template>
  <div class="rte">
    <div class="rte__toolbar" role="toolbar" aria-label="書式">
      <select
        class="rte__select"
        :value="
          isActive('heading', { level: 1 }) ? 1
          : isActive('heading', { level: 2 }) ? 2
          : isActive('heading', { level: 3 }) ? 3
          : isActive('heading', { level: 4 }) ? 4
          : isActive('heading', { level: 5 }) ? 5
          : isActive('heading', { level: 6 }) ? 6
          : 0
        "
        @change="setHeading(Number($event.target.value))"
        title="段落 / 見出し"
      >
        <option :value="0">本文</option>
        <option :value="1">見出し H1</option>
        <option :value="2">見出し H2</option>
        <option :value="3">見出し H3</option>
        <option :value="4">見出し H4</option>
        <option :value="5">見出し H5</option>
        <option :value="6">見出し H6</option>
      </select>

      <span class="rte__sep" />

      <button type="button" :class="{ 'is-active': isActive('bold') }" @click="chain()?.toggleBold().run()" title="太字">
        <b>B</b>
      </button>
      <button type="button" :class="{ 'is-active': isActive('italic') }" @click="chain()?.toggleItalic().run()" title="斜体">
        <i>I</i>
      </button>
      <button type="button" :class="{ 'is-active': isActive('underline') }" @click="chain()?.toggleUnderline().run()" title="下線">
        <u>U</u>
      </button>

      <span class="rte__sep" />

      <span class="rte__color">
        <button
          v-for="c in PRESET_COLORS"
          :key="c.v"
          type="button"
          class="rte__color-swatch"
          :style="{ background: c.v }"
          :title="`色: ${c.n}`"
          @click="setColor(c.v)"
        />
        <button type="button" class="rte__color-clear" title="色を解除" @click="setColor('')">×</button>
      </span>

      <span class="rte__sep" />

      <button type="button" :class="{ 'is-active': isActive('link') }" @click="promptLink" title="リンク">
        🔗
      </button>
      <button type="button" @click="promptImage" title="画像">🖼</button>
      <button type="button" @click="promptVideo" title="動画 (iframe)">🎬</button>

      <span class="rte__sep" />

      <button type="button" :class="{ 'is-active': isActive('bulletList') }" @click="chain()?.toggleBulletList().run()" title="箇条書き">
        ・
      </button>
      <button type="button" :class="{ 'is-active': isActive('orderedList') }" @click="chain()?.toggleOrderedList().run()" title="番号付き">
        1.
      </button>
      <button type="button" :class="{ 'is-active': isActive('blockquote') }" @click="chain()?.toggleBlockquote().run()" title="引用">
        ❝
      </button>

      <span class="rte__sep" />

      <button type="button" @click="changeIndent(1)" title="インデント">→|</button>
      <button type="button" @click="changeIndent(-1)" title="解除">|←</button>

      <span class="rte__sep" />

      <button type="button" @click="insertTable" title="表を挿入">⊞</button>
      <template v-if="tableActive">
        <button type="button" @click="chain()?.addRowAfter().run()" title="下に行追加">行+</button>
        <button type="button" @click="chain()?.addColumnAfter().run()" title="右に列追加">列+</button>
        <button type="button" @click="chain()?.deleteRow().run()" title="行削除">行−</button>
        <button type="button" @click="chain()?.deleteColumn().run()" title="列削除">列−</button>
        <button type="button" @click="chain()?.deleteTable().run()" title="表削除">表×</button>
      </template>
    </div>

    <EditorContent :editor="editor" class="rte__content" />
  </div>
</template>
