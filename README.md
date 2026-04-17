# PD Templates — Shopify 商品详情页模板画廊

面向运营的 Shopify 商品说明富文本模板库。通过 Vue 3 + Vite 提供组件化的实时预览与代码复制页面，样式使用原生 CSS 编写，可直接粘贴到 Shopify 商品说明的 HTML 模式。

---

## 快速开始

```bash
# 安装依赖
pnpm install        # 或 npm install

# 启动运营画廊（默认打开 http://localhost:5173）
pnpm dev

# 生产构建
pnpm build
pnpm preview        # 本地预览生产版
```

打开画廊后，左侧是模板分类导航，右侧是每个模板的实时预览 + HTML 代码区。运营可以：

- 通过「列数 / 项数」等控件直接调整组件结构，预览与代码同步更新；
- 点击每张卡片右上角「复制代码」获得可直接粘贴到 Shopify 的静态 HTML；
- 对 Features 等模板，可直接编辑卡片内字段（数值、文案），所见即所得。

---

## 运营使用流程（在 Shopify 后台）

1. 打开商品说明编辑器，切换到 **HTML 模式**。
2. 在最顶部粘贴一次 **Style Block**（画廊顶部「★ Style Block」卡片，内容等于仓库根目录 `style.css` 包一层 `<style>…</style>`）。**每个商品只需贴一次。**
3. 按需从画廊中复制对应 `<section>` 片段，粘贴在 Style Block 下方。
4. 替换图片地址（`https://placehold.co/...` → 真实 CDN）和文案。不要改动 `class="pd-..."` 属性。

---

## 目录结构

```
.
├── style.css                # 【Shopify 使用】产品详情页样式，粘贴到商品说明顶部
├── index.html               # Vite 入口
├── vite.config.js
├── package.json
├── src/
│   ├── main.js              # Vue 入口：引入画廊 UI 样式 + style.css
│   ├── App.vue              # 主页面：侧边导航 + 各模板 Section
│   ├── styles/app.css       # 画廊站点自身的 UI 样式（不会进入 Shopify）
│   ├── templates/           # 纯函数 HTML 生成器：输入 props → 返回可粘贴的静态 HTML
│   │   ├── util.js
│   │   ├── heading.js
│   │   ├── hgroup.js
│   │   ├── images.js
│   │   ├── media.js
│   │   ├── highlights.js
│   │   ├── features.js
│   │   ├── specs.js
│   │   ├── steps.js
│   │   ├── video.js
│   │   └── compare.js
│   └── components/
│       ├── TemplateCard.vue # 统一的预览卡片（预览 + 代码块 + 复制按钮）
│       ├── CopyButton.vue
│       ├── NumberControl.vue
│       ├── SegmentControl.vue
│       ├── SwitchControl.vue
│       └── sections/        # 每个模板类别的可交互区块
│           ├── HeadingSection.vue
│           ├── HgroupSection.vue
│           ├── ImagesSection.vue
│           ├── MediaSection.vue
│           ├── HighlightsSection.vue
│           ├── FeaturesSection.vue
│           ├── SpecsSection.vue
│           ├── StepsSection.vue
│           ├── VideoSection.vue
│           └── CompareSection.vue
├── preview.html             # 【旧版】静态预览页（保留作为历史参考）
├── preview.css              # 旧版静态预览页的 UI 样式
└── test.html                # 供设计/运营验证的本地测试页
```

### 架构要点

- **单一真相来源**：每个模板都由 `src/templates/*.js` 中的纯函数生成 HTML 字符串。`TemplateCard.vue` 用 `v-html` 把同一串 HTML 渲染成「所见」，`<pre>` 渲染成「所得」，保证预览和复制出来的代码永远一致。
- **原生 CSS**：所有 Shopify 侧样式全部写在 `style.css`。站点 UI 样式写在 `src/styles/app.css`。没有引入任何 CSS 框架 / 预处理器 / CSS-in-JS。
- **列数通用化**：图片、亮点、特性、视频、对比、步骤等模板都改造成了接受数字参数的通用组件。原先的「1/2/3/4 列各写一遍」被统一替换为「输入数字 → 组件自行生成」。

---

## 新增模板怎么做

1. 在 `src/templates/` 下新增一个 `xxx.js`，导出 `renderXxx(props)` 返回可粘贴的 HTML 字符串。
2. 在 `src/components/sections/` 下新增一个 `XxxSection.vue`，通过 `TemplateCard` 渲染预览 + 代码，并通过 `NumberControl` / `SegmentControl` / `SwitchControl` 暴露可交互参数。
3. 在 `src/App.vue` 的 `NAV` 数组和 `<template>` 中插入对应导航与组件。
4. 如涉及新样式，把规则加入 `style.css`，并告知运营重新粘贴一次 Style Block。

---

## 注意事项

- `style.css` 是真正进入 Shopify 商品说明的样式，**不要改 class 名**，否则现有商品会失效。
- 占位图 `https://placehold.co/...` 仅用于预览，上线前替换为真实 CDN 地址。
- 视频模板中替换 YouTube / Bilibili iframe 的实际 `src`。
- 预览站点仅为运营内部使用，不需要部署到生产环境。
