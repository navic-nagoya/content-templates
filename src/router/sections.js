// Single source of truth for the component gallery.
// Consumed by: router/index.js (routes), ComponentsLayout.vue (sidebar nav),
// HomeView.vue (card grid on the landing page).
//
// Keep labels in Japanese — they're user-facing.

export const SECTIONS = [
  {
    num: '01',
    id: 'heading',
    label: 'Heading 見出し',
    summary: '見出し 5 種類。H2 タグで使えるタイトル。',
    component: () => import('../components/sections/HeadingSection.vue')
  },
  {
    num: '02',
    id: 'hgroup',
    label: 'Hgroup 見出しグループ',
    summary: 'タイトル + サブタイトルの組み合わせ。',
    component: () => import('../components/sections/HgroupSection.vue')
  },
  {
    num: '03',
    id: 'images',
    label: 'Images 画像グリッド',
    summary: '列数可変の画像グリッド（1〜6 列）。',
    component: () => import('../components/sections/ImagesSection.vue')
  },
  {
    num: '04',
    id: 'media',
    label: 'Media 画像+テキスト',
    summary: '左右反転 / CTA 切替可能な画像＋文章ブロック。',
    component: () => import('../components/sections/MediaSection.vue')
  },
  {
    num: '05',
    id: 'feature',
    label: 'Feature フィーチャー',
    summary: '特徴紹介。複数のスタイル変体を用意。',
    component: () => import('../components/sections/FeatureSection.vue')
  },
  {
    num: '06',
    id: 'stats',
    label: 'Stats 統計',
    summary: '数字を強調する統計ブロック。',
    component: () => import('../components/sections/StatsSection.vue')
  },
  {
    num: '07',
    id: 'specs',
    label: 'Specs 仕様',
    summary: '商品仕様。単品／多品比較を切り替え可。',
    component: () => import('../components/sections/SpecsSection.vue')
  },
  {
    num: '08',
    id: 'steps',
    label: 'Steps ステップ',
    summary: '縦型・横型の購入ステップ。',
    component: () => import('../components/sections/StepsSection.vue')
  },
  {
    num: '09',
    id: 'video',
    label: 'Video 動画',
    summary: '埋め込み動画（1〜2 列）。',
    component: () => import('../components/sections/VideoSection.vue')
  },
  {
    num: '10',
    id: 'compare',
    label: 'Compare 比較',
    summary: '他商品との比較表（2〜4 列）。',
    component: () => import('../components/sections/CompareSection.vue')
  },
  {
    num: '11',
    id: 'package',
    label: 'Package 同梱物',
    summary: 'セット内容・同梱物の一覧。',
    component: () => import('../components/sections/PackageSection.vue')
  },
  {
    num: '12',
    id: 'trust',
    label: 'Trust 安心ポイント',
    summary: '安心感を訴求するバッジ / 認証表示。',
    component: () => import('../components/sections/TrustSection.vue')
  },
  {
    num: '13',
    id: 'notice',
    label: 'Notice 注意事項',
    summary: '注意事項（青 / 黄 / 赤の 3 トーン）。',
    component: () => import('../components/sections/NoticeSection.vue')
  },
  {
    num: '14',
    id: 'layout',
    label: 'Layout レイアウト',
    summary: '複数セクションを並べるレイアウト枠。',
    component: () => import('../components/sections/LayoutSection.vue')
  },
  {
    num: '15',
    id: 'divider',
    label: 'Divider 区切り線',
    summary: 'セクション間の区切り線。',
    component: () => import('../components/sections/DividerSection.vue')
  }
]

export const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]))
