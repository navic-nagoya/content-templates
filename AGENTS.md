# AGENTS.md — 给未来 AI 的项目说明

> 这是一份面向 AI 编程助手（Cursor / Claude / Codex 等）的项目指引与历史任务记录。仓库里还有一份面向人类读者的 `README.md`（中文）。

---

## 1. 项目本质

这是一个给 **日语公司的 Shopify 运营同学** 使用的商品详情页富文本模板库。运营在 Shopify 后台商品说明编辑器的 HTML 模式里粘贴本仓库提供的 `<section>` 片段，从而获得统一、美观的产品详情排版。

**样式引入方式**：`style.css` 由 **开发** 以主题资源的形式引入各 Shopify 项目（例如通过 `theme.liquid` 里的 `<link>`，或打包进主题的资源目录），对运营透明。运营 **不需要** 在商品说明里贴 `<style>` 块，只需要贴 `<section>` 片段。

- **Shopify 侧真正生效的样式**：`/style.css`（class 全部以 `pd-` 开头）。class 命名对现有商品有强依赖，**不能随意改动**。
- **运营使用的画廊工具**：本仓库自带一个 Vue 3 + Vite 的本地站点，提供每个模板的实时预览、可交互参数调整、一键复制 HTML 代码。画廊站点本身 **不会被部署到 Shopify**，只是运营同学本地跑着用。

## 2. 语言约定（⚠️ 重要）

| 场景 | 语言 |
| --- | --- |
| 画廊站点里所有面向运营的 UI 文案（按钮、标题、提示、导航…） | **日语** |
| 模板内的默认占位文本（如 `商品タイトルテキスト`） | **日语** |
| 代码注释 | **英文** |
| `README.md` | 中文（面向中国开发者） |
| 本文件 `AGENTS.md` | 中文（面向中国开发者） |
| 和用户聊天 | 简体中文 |

**修改或新增任何面向运营的文案时，一定要用日语。** 不要因为代码上下文是中文就把 UI 也写成中文。

## 3. 目录与架构

```
.
├── style.css                     # Shopify 侧样式，class 名是运营资产，改名前必须评估
├── preview.html + preview.css    # 旧版静态预览页（保留作为历史参考，勿删）
├── test.html                     # 早期本地测试页
├── index.html                    # Vite 入口
├── vite.config.js
├── package.json                  # 用 pnpm 安装（npm 在本机环境有问题，见 §7）
├── src/
│   ├── main.js                   # Vue 入口：依次引入 app.css + 上层 ../style.css
│   ├── App.vue                   # 侧边导航 + 各 Section
│   ├── styles/app.css            # 画廊 UI 样式（不会进 Shopify）
│   ├── templates/*.js            # 纯函数 HTML 生成器，每类模板一个文件
│   │   ├── util.js               # esc / indent / placeholderForCols / repeat
│   │   ├── heading.js / hgroup.js / images.js / media.js / feature.js
│   │   ├── stats.js / specs.js / steps.js / video.js / compare.js
│   └── components/
│       ├── TemplateCard.vue      # 统一的预览卡片（preview + code + copy）
│       ├── CopyButton.vue / NumberControl.vue / SegmentControl.vue / SwitchControl.vue
│       └── sections/             # 每种模板的可交互区块，一一对应 templates/*.js
├── docs/
│   └── adding-templates.md       # 新增模板 / 新增样式 详细流程（面向开发者）
├── README.md                     # 面向人类开发者的项目说明（中文）
└── AGENTS.md                     # 本文件（面向 AI 助手）
```

### 3.1 核心架构约定 —— 单一真相来源

**每一个模板都有一个对应的 `renderXxx(props)` 纯函数**，位于 `src/templates/*.js`。这个函数返回一段 **可以直接粘贴到 Shopify HTML 编辑器** 的静态 HTML 字符串（不是 Vue template，不是 JSX）。

- `TemplateCard.vue` 用 `v-html="html"` 把这串 HTML 渲染成「所见」的预览；
- 同一串 HTML 放进 `<pre><code>{{ html }}</code></pre>` 就是「所得」的可复制代码；
- 点 Copy 按钮把它写进剪贴板。

这样预览和复制出来的代码永远完全一致，不会出现预览好看但粘出来样式跑偏。**新增模板必须遵循这个模式**，不要直接在 Vue `<template>` 里写 Shopify 的 HTML 结构。

### 3.2 组件通用化约定 —— 反对机械重复

原始项目（见 `preview.html`）把图片网格 1/2/3/4 列各写了一份，把对比表 2/3/4 列各写了一份。**本次改造的核心动机就是消灭这类机械重复**。

新增或修改模板时遵循：

- 列数 / 项数 / 步骤数 之类的数量参数：用 `NumberControl` 暴露一个数字输入框，生成器根据数字 `repeat(n, ...)` 动态生成 HTML。
- 方向 / 开关：用 `SwitchControl`。
- 枚举变体：用 `SegmentControl`。
- 多种互斥结构（如 Specs 的单品 / 多品）：在生成器里用 `variant` 字段分派。

## 4. 如何新增模板 / 新增样式

**完整流程文档在 [`docs/adding-templates.md`](./docs/adding-templates.md)**，包含三种场景的代码骨架和验证清单：

- 场景 A：给已有模板加一个样式变体
- 场景 B：新增一个完整的模板类型
- 场景 C：修改已上线模板的样式 / class 名（高风险）

快速版（场景 B）：

1. `src/templates/xxx.js` 写 `renderXxx(props)` 纯函数，返回 HTML 字符串。
2. `src/components/sections/XxxSection.vue` 用 `<TemplateCard>` 包裹，通过 `NumberControl` / `SwitchControl` / `SegmentControl` 暴露参数。
3. `src/App.vue` 的 `NAV` 追加一项（**label 必须是日语**）并挂载组件。
4. 若加了新 class，通知主题侧开发把新版 `style.css` 同步到各 Shopify 项目（不涉及运营）。
5. `pnpm build` 通过 + 手动在浏览器里验证所有控件。

## 4.5 エディター（下书き装配台）— 第二个核心功能

除了「ライブラリ」（原本的画廊 + 单卡复制）之外，仓库现在还有「エディター」视图：运营把多个 section 攒进一个有序的"下书き"，在 section 之间插入富文本块（自由文案），最后一键复制整段 HTML 一次性贴进 Shopify。

- **状态层**：`src/store/draft.js`（Vue `reactive` + localStorage 自动保存，无 Pinia）。Block: `{ id, kind: 'section'|'richtext', html, label?, badge? }`。Section block 存的是 HTML 快照（要再调参数得删掉重加）。
- **入口**：`src/App.vue` 顶部 tab 切换 `LibraryView` / `EditorView`。
- **加入下书き**：`TemplateCard.vue` 上的「下書きに追加」按钮调用 `addSectionBlock`。
- **RTE**：`src/components/editor/RichTextEditor.vue`，基于 **Tiptap v3**（StarterKit + TextStyle/Color/Image/Table 系列 + 自定义 `IndentableParagraph` + 自定义 `VideoEmbed` 节点）。视频用自定义 schema 节点产出 `<div class="pd-video__ratio"><iframe ...></div>`，与 `templates/video.js` 的 markup 保持一致。
- **缩进**：在 list 内部用 listKeymap 的 Tab/Shift-Tab；在普通段落上修改 `paragraph` 节点的 `indent` 数字属性，输出 `data-indent` + `style="padding-left: Xem"`。
- **输出**：`combinedHtml()` 把所有块按顺序拼接，richtext 块外面包一层 `<section class="pd-section pd-richtext">` 让 Shopify 端的间距一致。
- **依赖新增**：`@tiptap/core`、`@tiptap/vue-3`、`@tiptap/starter-kit`、`@tiptap/extension-paragraph`、`@tiptap/extension-text-style`、`@tiptap/extension-color`、`@tiptap/extension-image`、`@tiptap/extension-table` 系列、`@tiptap/extension-link`/`underline`（StarterKit 默认带，不要再单独装一份）。这是项目第一次破例引入大型依赖，以后再加东西仍要谨慎。

> ⚠️ Tiptap 的 ProseMirror schema 会丢弃未注册的标签。如果将来想在 RTE 里支持新的 Shopify 自定义结构（如自定义按钮、卡片），**必须** 给它注册一个 Node 扩展，不能直接 `insertContent('<div class="...">...')`。

## 5. 历史任务记录

### 2026-04-17 组件化改造（首次重构）

**背景**：原始仓库只有静态 `preview.html` + `style.css`，所有模板的多列变体都是手写复制的。运营每次要改列数就得自己改 HTML。

**改动**：
- 用 Vue 3 + Vite 搭建画廊站点（纯原生 CSS，无 Tailwind 等框架）。
- 把所有模板改写为 `templates/*.js` 里的纯函数 HTML 生成器。
- 把「1/2/3/4 列各写一份」统一改成「输入数字 → 动态生成」。
- 新增可调参数：
  - Images：列数（1–6）、图注开关
  - Feature：项数（1–8）
  - Stats：各样式项数（1–8）、双变体平铺；文案在预览内编辑
  - Specs：单品 / 多品切换 + 比较商品数（2–6）
  - Steps：步骤数（1–10）
  - Video：列数（1–2）
  - Compare：比较数（2–4）
  - Media：左右反向 + CTA 开关
- 保留 `preview.html` / `preview.css` / `test.html` 作为历史参考，未删除。

**未做的事情**：
- 没有把字段级表单加到全部模板（Stats 等用 `TemplateCard` 的可编辑预览改文案）。未来若要逐项表单，可在对应 `XxxSection.vue` 增加 `#fields` slot，参考 `TemplateCard.vue`。
- 没有持久化（刷新就丢）。如果未来要让运营保存配置，可以考虑 `localStorage`。
- 没做国际化框架。目前 UI 文案直接硬编码为日语，对小型内部工具足够；若未来需要中/日/英切换再引入 vue-i18n。

### 2026-04-17 全站日语化

把所有面向运营的 UI 文案从中文改成日语，同时把 `app.css` 的中文分区注释改成英文（遵守用户规则：代码注释一律英文）。

### 2026-04-17 新增贡献流程文档

新增 `docs/adding-templates.md`，详细说明三种常见变更（加变体 / 加模板 / 改样式）的 playbook，含代码骨架、风险说明、验证清单。README 和本文件都已挂链接。

### 2026-04-20 新增 3 个 section + 2 个变体

**背景**：日本 EC 详情页常见但仓库未覆盖的场景补齐。用户明确拒绝了 FAQ（由结构化数据模块另行处理）。

**新增 section**：
- **Package（同梱物・セット内容）** `pd-package`：2 个变体 `grid` / `list`。字段 `img / name / qty / note`。
- **Trust（安心ポイント・認証）** `pd-trust`：2 个变体 `band`（横排轻量） / `cards`（角丸卡片）。与 `pd-feature--icons` 的区别是文字更短、密度更高。
- **Notice（注意事項）** `pd-notice`：3 个 tone `info`（青）/ `warn`（黄，默认）/ `caution`（红）。字段 `title / items`。

**现有 section 追加变体**：
- **Feature** 加 `checklist`：✓ 标记 + 单行 title，1〜2 列列表，用于「こんな方におすすめ」。`desc` 字段有意不输出。
- **Steps** 从单一布局改为 `vertical`（既定，保留原样）+ `horizontal` 两个变体切换。横型带箭头连接符，3〜5 ステップの購入フロー向け。

**导航编号**：Package/Trust/Notice 插在 Compare 之后、Layout 之前，Layout/Divider 重新编号为 14/15。

**影响**：
- 全部是「新增 class」，不改已有 class 的定义或语义，线上已上架商品不受影响。
- `style.css` 末尾追加了 3 个 section 的样式区块（§13〜§15）以及 Feature checklist / Steps horizontal 两个新变体的规则，主题侧需同步新版 `style.css`。
- `StepsSection.vue` 从单一 `renderSteps({ count })` 改为 variant 驱动的多卡片渲染，画廊里 Steps 现在显示两张卡。

### 2026-04-20 粘贴 = 纯文本

**背景**：在「下书 / 草稿箱」编辑器里编辑 section 文本时，从 Word / Notion / 网页复制过来的内容会带样式（color / font-family / 行内 style 等），污染目标段落，破坏统一排版。

**改动**：
- `src/utils/paste-plain-text.js`：通用 `paste` 处理器，给 `contenteditable` 用。读取 `text/plain` 内容、`preventDefault`、用 `document.execCommand('insertText')` 插入纯文本（保留撤销栈 + 自动触发 `input` 事件），并附带选区 API 的回退路径。
- `TemplateCard.vue`、`editor/BlockItem.vue`：section 预览的 `contenteditable` 元素绑定 `@paste="pastePlainText"`。
- `editor/RichTextEditor.vue`（Tiptap）：通过 `editorProps.handlePaste` 自定义粘贴行为。读取 `text/plain`，按换行切成多个空属性 `paragraph` 节点，组成 `Slice` 后 `replaceRange` 插入。这样所有外部样式（包括 Tiptap 自身能识别的 bold / heading / color 等）都被丢弃，只保留段落结构。
- 新增直接依赖 `@tiptap/pm`（之前是 transitive；要直接 import `Slice` / `Fragment`）。

### 2026-04-20 Container Query 预览模式 + Shopify 端启用

**背景**：之前所有 section 的响应式布局都由 `@media` 驱动。运营在画廊里预览移动端效果必须拖窗口宽度；Shopify 端的 section 也只能根据 viewport 决定布局，无法感知自身实际可用宽度（例如左右栏布局里被压缩的 section 仍按 viewport 选 desktop 排版）。

**改动**：
- 在 `style.css` 末尾追加「Container Query Overlay」区块，把 §3〜§15 里所有和内部布局有关的 `@media` 规则镜像为 `@container` 规则（带必要的 reset 以应对渐进增强的 `min-width` 分档）。
- **`.pd-section` 直接声明 `container-type: inline-size`**（在 §1 间距规则旁边），所有 section 自身就是查询容器。这样 Shopify 端也按"section 实际宽度"驱动布局；老浏览器（Chrome <105 / Safari <16 / Firefox <110）不识别 `container-type` 与 `@container`，会被 CSS 静默忽略，自动回退到原本的 `@media` 路径，**无需 `@supports` 包装**。
- `.pd-compare` 由 `overflow: hidden` 改为 `overflow-x: auto`：因为 section 不能查询自身，要让窄 container 下的 head/row `min-width` 能正常滚动，overflow 必须由基础规则常态开启（auto 模式下没有溢出时不出现滚动条）。
- 画廊侧 `.tpl-card__preview` / `.ed-block__preview` 不再自挂 `container-type`（已由 `.pd-section` 提供），非 fluid 模式只需 `max-width: var(--preview-max-w)` 把预览收窄即可触发对应分档；外层 `.tpl-card__canvas` / `.ed-block__canvas` 提供中性画布背景。
- 顶部栏「流動 / PC / タブレット / スマホ」四挡切换持久化到 localStorage（`src/store/previewMode.js`）：
  - 流動：不强制宽度，预览随卡片自然宽度（~850px → tablet 分档）。
  - PC（1280px）/ タブレット（768px）/ スマホ（390px）：通过 `width: var(--preview-max-w)` **强制**预览到指定宽度。当强制宽度超过卡片宽度（PC 模式必然如此），由 `.tpl-card__canvas` / `.ed-block__canvas` 上的 `overflow-x: auto` 提供横向滚动。

**Shopify 侧的影响**：**会更智能但也属于行为变化**。当 `.pd-section` 在被压缩的位置（左右两栏、嵌套布局）时，原本 `@media` 仍判 desktop 但其实空间已不够；现在会按 section 自身宽度切换到 tablet / mobile 排版，更贴近实际可用空间。如果某个客户主题的 section 容器宽度刚好处在原 `@media` 临界点稍下方（例如 vp 1024 但 section 仅 ~960），他看到的将是 tablet 而非 desktop 排版——这是设计预期内的"修正"，不是 bug。

**画廊 fluid 模式**：因为 `.pd-section` 也是容器了，画廊卡片宽度（~850px）会触发 tablet 分档，而不像之前按 viewport 显示 desktop。要确认 desktop 排版可切到「PC」预设（1280px，超出卡片宽度，canvas 横向滚动）。

### 2026-04-17 移除 Style Block 流程

确认 `style.css` 由开发以主题资源形式引入各 Shopify 项目，运营完全不用关心样式注入。因此：

- 删除了 `App.vue` 里的「★ Style Block」侧边栏导航、顶部 callout、卡片及对应的 `fetch('style.css')` 逻辑。
- 侧边栏运用フロー从三步（Style Block → 复制 section → 改内容）简化为三步（复制 section → 粘贴 → 改内容）。
- README §「运营使用流程」去掉「粘贴 Style Block」步骤，新增"前置条件：开发已在各项目引入 style.css"说明。
- `docs/adding-templates.md` 里所有「通知运营重新粘贴 Style Block」改为「通知主题开发同步 style.css」。
- **运营使用层面的流程此后都不应再提 Style Block。**

## 6. 代码风格 / 规则

- 代码注释一律英文（用户规则）。
- Vue 组件用 `<script setup>` 语法 + JS（项目未引入 TypeScript，不要主动改）。
- **依赖策略（⚠️ 请分清两侧）**：
  - **Shopify 侧（`/style.css` 里实现的效果）**：不得依赖任何外部库。动画用原生 CSS（`@keyframes` / `transition`），不要 framer-motion / GSAP / AOS 等运行时动画库；交互效果用 CSS 伪类和 `:has()` 等现代选择器，避免引入 JS。这是硬性约束：`style.css` 会作为主题资源被导入到 Shopify，必须保持自包含且体积可控。
  - **画廊 / 编辑器站点（`src/` 下的 Vite 应用）**：本身就是本地工具，引入依赖的门槛是普通水平（有用即可用）。Tiptap、vue-router、各种 UI 库都 OK。不要再按过去那条「零大依赖」标准来评审站点本身的依赖。
- 画廊站点自身的 class 用 `.app-*` / `.tpl-*` / `.ctl-*` 前缀，避免跟 Shopify 的 `.pd-*` 冲突。
- 修改 `/style.css` 要谨慎：它是线上商品 HTML 片段依赖的 class 合同（运营已经把 `class="pd-..."` 贴进了大量商品），改 class 名、删属性都可能让已上线商品样式崩溃。`style.css` 由开发统一维护并引入各 Shopify 主题，改完后需要主题侧同步更新。

## 7. 环境注意事项

- 本机 `npm install` 会报 `Unsupported URL Type "link:": link:./src/types`（疑似缓存 / 全局配置问题），**请用 `pnpm install`**。`pnpm-lock.yaml` 已提交。
- Node 版本：开发时使用 v24；最低应 ≥ 18（Vite 6 要求）。
- 启动：`pnpm dev` → http://localhost:5173
- 生产构建：`pnpm build`（产物在 `dist/`，.gitignore 已忽略）

## 8. 对未来 AI 的行为期望

- 运营同学大概率会用中文 / 日语描述需求（比如「我想加一个 FAQ 模板」），需要你：
  1. 到 `src/templates/` 加生成器；
  2. 到 `src/components/sections/` 加可交互区块；
  3. 到 `src/App.vue` 挂上导航；
  4. 必要时到 `/style.css` 加样式；
  5. UI 文案用 **日语** 填写。
- 不要删除 `preview.html` / `preview.css` / `test.html`（用户明确表示保留历史）。
- 做完改动建议跑一次 `pnpm build` 确认没报错。
- 修改 `/style.css` 的 class 名前，先跟用户确认是否会影响线上已上线商品。
