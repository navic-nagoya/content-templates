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
- 不要引入新的大型依赖（Tailwind、lodash、axios 等）。项目刻意保持「原生 CSS + 最小依赖」。
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
