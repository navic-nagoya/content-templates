# 新增模板 / 新增样式 推荐流程

本文档面向开发者（或指挥 AI 工作的人），给出三种典型变更的标准 playbook：

- [场景 A：给已有模板加一个样式变体](#场景-a给已有模板加一个样式变体)（最常见，5 分钟）
- [场景 B：新增一个完整的模板类型](#场景-b新增一个完整的模板类型)（20–40 分钟）
- [场景 C：修改已上线模板的样式 / class 名](#场景-c修改已上线模板的样式--class-名)（⚠️ 高风险）

> 阅读前请先看 `AGENTS.md` §2 语言约定：**UI 文案必须是日语，代码注释必须是英文**。

---

## 场景 A：给已有模板加一个样式变体

**适用**：`Heading` 已经有 A–E 五种风格，想加一个 F 风格。`Hgroup`、`Specs` 类似。

### 涉及文件

```
style.css
src/templates/<模板>.js
```

通常 **不需要** 改 Section 组件、App.vue，也不需要运营做任何事 —— 只要 class 是新增的，就不影响线上已有商品；样式更新由主题侧统一同步。

### 步骤

**① 设计 class 名**

遵循现有 BEM 风格，用 `--f` 作为新变体后缀：

```
.pd-heading--f        # 主元素
.pd-heading--f-wrap   # 外层包裹（如果需要）
.pd-heading--f-xxx    # 辅助子元素
```

**② 加样式到 `style.css`**

追加到对应模板的注释区块末尾（不要插在中间，以免别人 diff 难看）：

```css
/* 风格 F：XXX 风格说明 */
.pd-heading--f {
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  color: #111;
  /* Prefer `clamp()` for font-size and `var(--brand-color, #0b62a9)` for
     brand color — this matches existing conventions. */
}
```

**约定复用**：
- 字号尽量用 `clamp(min, vw, max)`；
- 品牌色永远用 `var(--brand-color, #0b62a9)`，不要硬编码；
- 响应式媒体查询写在文件底部已有的 `@media` 块里，不要到处散。

**③ 在生成器里注册新变体**

打开 `src/templates/heading.js`：

```js
export const HEADING_VARIANTS = [
  { id: 'a', label: 'A · ミニマル左寄せ' },
  // …
  { id: 'f', label: 'F · <日语风格名>' }  // ← 追加
]

export function renderHeading({ variant = 'a', text = '商品タイトルテキスト', ... }) {
  switch (variant) {
    // …
    case 'f':
      return `<section class="pd-section">
  <div class="pd-heading--f-wrap">
    <h2 class="pd-heading--f">${esc(text)}</h2>
  </div>
</section>`
  }
}
```

**④ 验证**

```bash
pnpm dev       # 本地预览，确认 F 变体出现且样式正确
pnpm build     # 确认不报错
```

新变体会自动出现在画廊里，因为 `HeadingSection.vue` 是基于 `HEADING_VARIANTS` 数组 `v-for` 渲染的 —— 这是组件化带来的红利，加变体 **不用改 Vue 代码**。

**⑤ 同步样式到 Shopify 主题**

新变体对应了新 class，需要通知主题侧开发把更新后的 `style.css` 同步到各 Shopify 项目（`theme.liquid` 引用的资源目录里）。旧商品不受影响（它们不用 F 类名）。**运营不需要做任何事**。

---

## 场景 B：新增一个完整的模板类型

**适用**：需求像「加一个 FAQ 折叠模板」「加一个时间轴模板」「加一个用户评价模板」。

### 涉及文件

```
style.css                                    # 新增样式段
src/templates/<新模板>.js                      # 新增纯函数生成器
src/components/sections/<新模板>Section.vue   # 新增可交互 Section
src/App.vue                                  # 追加导航 + 挂载组件
```

### 步骤

**① 先定义清楚参数维度**

在开工前写 3 行笔记，问自己：

- 运营想改什么？列数？项数？左右反向？变体切换？
- 每个参数的合理范围是什么？（默认值 / min / max）
- 有没有「每一项」独立的内容编辑需求？（像 Stats 用预览内编辑，或单独做 `#fields` 表单）

确定参数决定了你在 Section 组件里要用 `NumberControl` / `SwitchControl` / `SegmentControl` 中的哪一个。

**② 在 `style.css` 加样式**

- 把新段放在文件末尾，用现有注释风格标号：

  ```css
  /* ============================================================
     11. FAQ 模板 pd-faq
     ============================================================ */
  .pd-faq__list { … }
  .pd-faq__item { … }
  /* … */
  ```

- class 命名：`.pd-<模板名>__<元素>`（双下划线）用于子元素，`.pd-<模板名>--<变体>` 用于变体修饰符。
- 参数化维度（如列数）优先用 `data-cols` 属性选择器：

  ```css
  .pd-faq__grid { grid-template-columns: 1fr; }
  .pd-faq__grid[data-cols="2"] { grid-template-columns: repeat(2, 1fr); }
  ```

  这样生成器只要往 HTML 里写 `data-cols="${n}"` 就能切换布局，不用动态生成 CSS。

**③ 写纯函数生成器 `src/templates/faq.js`**

骨架：

```js
import { esc, indent, repeat } from './util.js'

// Default content used when the operator hasn't customized items yet.
export function defaultFaqItem(i) {
  return {
    q: `よくある質問 ${i + 1}`,
    a: 'ここに回答を入力してください。'
  }
}

export function renderFaq({ count = 3, items = [] }) {
  const n = Math.max(1, count | 0)
  const list = items.length ? items : repeat(n, (i) => defaultFaqItem(i))

  const itemsHtml = list
    .map(
      (item) => `<details class="pd-faq__item">
  <summary class="pd-faq__q">${esc(item.q)}</summary>
  <div class="pd-faq__a">${esc(item.a)}</div>
</details>`
    )
    .join('\n')

  return `<section class="pd-section">
  <div class="pd-faq__list">
${indent(itemsHtml, 4)}
  </div>
</section>`
}
```

**关键约束**（不要违反）：

- 生成器返回的必须是可以 **直接粘贴到 Shopify** 的静态 HTML 字符串；
- 所有用户输入的文本都要用 `esc()` 转义；
- 缩进用 `indent()` 帮忙，不要手动拼空格；
- 文件里不要 import Vue / 不要写 JSX。

**④ 写 Section 组件 `src/components/sections/FaqSection.vue`**

骨架：

```vue
<script setup>
import { computed, ref } from 'vue'
import TemplateCard from '../TemplateCard.vue'
import NumberControl from '../NumberControl.vue'
import { renderFaq } from '../../templates/faq.js'

const count = ref(3)
const html = computed(() => renderFaq({ count: count.value }))
</script>

<template>
  <section id="faq" class="tpl-section">
    <header class="tpl-section__head">
      <span class="tpl-section__num">11</span>
      <h3 class="tpl-section__title">FAQ · よくある質問</h3>
      <p class="tpl-section__desc">
        折りたたみ式の Q&amp;A リスト。項目数を入力してください
      </p>
    </header>

    <TemplateCard name="FAQ リスト" badge="pd-faq" :html="html">
      <template #controls>
        <NumberControl v-model="count" :min="1" :max="12" label="項目数" />
      </template>
    </TemplateCard>
  </section>
</template>
```

**组件层约束**：

- 所有 `<TemplateCard>` 的 `name` / `label` / 描述文字 **必须是日语**；
- 控件标签（`label="項目数"`）**必须是日语**；
- 不要直接在 `<template>` 里写 Shopify 的 HTML 结构，一律通过 `renderFaq()` 生成 → `v-html` 渲染；
- 如果有逐项字段编辑需求，在对应 `XxxSection.vue` 使用 `#fields` slot；或沿用 `TemplateCard` 的可编辑预览（见 `StatsSection.vue`）。

**⑤ 挂到 `src/App.vue`**

三处改动：

```vue
<script setup>
// …
import FaqSection from './components/sections/FaqSection.vue'

const NAV = [
  // … 已有 10 项
  { num: '11', id: 'faq', label: 'FAQ よくある質問' }  // 日语 label
]
</script>

<template>
  <!-- … 在 <CompareSection /> 后追加 -->
  <FaqSection />
</template>
```

**⑥ 验证清单**

```bash
pnpm dev                          # 1. 本地预览，按列数/项数等控件各拨一下
pnpm build                        # 2. 生产构建不能报错
```

浏览器里手动检查：

- [ ] 新模块出现在左侧导航，锚点跳转工作；
- [ ] 所有参数控件拨动后，预览和代码区 **同步** 变化；
- [ ] 点「コードをコピー」复制出来的代码，手动贴到一个 `<html><body><style>…style.css…</style>[粘贴]</body></html>` 临时文件，浏览器打开样式正确；
- [ ] 响应式：缩小浏览器到手机宽度，布局没崩。

**⑦ 收尾**

- **同步 `style.css` 到 Shopify 主题**：因为 `style.css` 多了新段，需要主题开发把最新版部署到各 Shopify 项目的资源目录（或更新 `theme.liquid` 引用的 CDN 链接）；
- **通知运营**：新模板已上线可用，告诉他们画廊里对应位置的入口即可。运营不需要动任何已有商品，也不需要粘 `<style>`；
- 在 `AGENTS.md` §5 历史任务记录里追加一行「XXXX-XX-XX 新增 FAQ 模板」。

---

## 场景 C：修改已上线模板的样式 / class 名

> **⚠️ 这是最危险的操作。** `style.css` 由开发引入到各 Shopify 主题，线上商品的 HTML 里 **写死了 `class="pd-..."`**。这就是「class 合同」：一旦改名/删属性，所有使用它的已上架商品都会样式崩坏，哪怕你把新 `style.css` 同步到主题了也救不回来。

### 三种风险等级

| 操作 | 风险 | 是否推荐 |
|---|---|---|
| 只改视觉属性（颜色、字号、间距） | 🟡 中 | 可以，但要先跑全量回归 |
| 加新 class / 新规则 | 🟢 低 | 可以 |
| **删掉或重命名** 已有 class | 🔴 高 | **强烈不推荐**，应走"加新 + 弃用旧"渐进式 |

### 渐进式替换（推荐做法）

不要 `git mv` 一个 class 名。正确流程：

1. 在 `style.css` 里 **新增** 一套新 class（例如 `pd-heading--a-v2`）；
2. 在生成器里用新 class 输出 HTML，画廊里复制出来的都是新版；
3. 保留旧 class 样式至少 **N 个月**，让线上已使用旧 class 的商品保持正常显示；
4. 定期审计旧 class 是否还有商品在用（可以用 Shopify API 批量搜 `class="pd-xxx"`），没人用了再删。

### 如果必须改已有 class 的值

1. **先在本地改**，然后把 `style.css` 引入一个临时页面并复制线上真实商品的 HTML 片段进去 preview，确认视觉变化可接受；
2. 改的 diff 要小，一次只改一个维度（例如只改颜色），不要混着改间距和字号；
3. 改动合并后，**通知主题侧开发**把新版 `style.css` 同步到各 Shopify 项目 —— 一旦同步，所有已经上线的商品会自动受到新样式影响（因为它们的 HTML 里的 `pd-xxx` 类名没变，样式定义却变了），这就是风险点；
4. 在 `AGENTS.md` §5 记录"XXXX-XX-XX 修改 `.pd-xxx` 的 XXX 属性"。

### 永远不要做的事

- ❌ 删除 `.pd-section` / `.pd-section *` 这种基础 reset 规则；
- ❌ 把 class 名从 `.pd-xxx` 改成其他前缀（例如 `.pd2-xxx`）；
- ❌ 修改 `data-cols` / `data-reverse` 属性选择器的值（`"1"`、`"2"`、`"true"`），那些值早就被 Shopify 里的静态 HTML 写死了；
- ❌ 在 `style.css` 里写全局选择器（`*` / `body` / `h2` 而不带 `.pd-section` 前缀），会污染 Shopify 主题本身的样式。

---

## 通用清单（任何改动前）

- [ ] 读过 `AGENTS.md` §2 语言约定了吗？
- [ ] 改 `style.css` 的话，是新增还是修改已有 class？如果是后者，评估过对线上商品的影响没？
- [ ] 新增的 UI 文案 / 模板默认文案，全部是日语吗？
- [ ] 新增的代码注释，全部是英文吗？
- [ ] `pnpm build` 通过了吗？
- [ ] 本地 `pnpm dev` 里每个控件都拨过一遍，同步更新正常吗？
- [ ] 复制出来的 HTML 粘到一个干净测试页（或临时引入当前 `style.css` 的页面），能渲染出和画廊里一样的效果吗？
- [ ] 如果改了 `style.css`，是否已通知主题侧同步部署？

---

## FAQ

**Q：为什么生成器要写纯字符串拼接，不直接用 Vue template？**
A：运营要复制的代码必须是静态 HTML，不能带 Vue 指令。字符串拼接是「预览」和「可复制代码」的最小公共分母 —— 保证两者 100% 一致。详见 `AGENTS.md` §3.1。

**Q：我能不能把列数改成用 CSS Grid 的 `repeat(auto-fit, …)` 自适应，而不用 `data-cols` 属性？**
A：部分模板（像 Feature）已经这么做了 —— 运营只要指定「项数」，列数由 CSS 自己算。如果新模板也符合"不关心具体几列"的场景，尽量用 `auto-fit` 更优雅。如果需要运营精准控制几列，用 `data-cols` 方案。

**Q：我想加一个需要 JavaScript 交互的组件（例如轮播图），能做吗？**
A：慎重。Shopify 商品说明的富文本编辑器对 `<script>` 有限制，而且不同主题对内联脚本的处理不同。优先考虑纯 CSS 方案（`<details>` 做折叠、`scroll-snap` 做轮播、`:target` 做切换）。确实必须要 JS 的话，另开设计评审。

**Q：样式在画廊里正常，粘到 Shopify 却走样，可能是什么原因？**
A：排查顺序：
1. 先确认 `style.css` 已经真的同步到了当前这个 Shopify 主题的资源里（在前台页面 View Source 看有没有加载到新版 CSS）；
2. 打开浏览器 DevTools，看具体被哪条规则覆盖 —— 大多数情况是 Shopify 主题本身的 CSS 在覆盖；
3. 如果是主题的全局规则（如 `body img { max-width: 100% }` 一类），考虑在 `style.css` 里加 `.pd-section` 前缀提高优先级；
4. 不要用 `!important` 除非万不得已。
