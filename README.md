# 商品详情页模板使用说明

## 文件清单

| 文件 | 模板类型 | 说明 |
|------|---------|------|
| `style-block.html` | 样式块 | **必须**，每个商品粘贴一次 |
| `01-heading.html` | 标题 | 5种风格，H2标签 |
| `02-hgroup.html` | 标题组 | 3种风格，标题+副标题 |
| `03-images.html` | 图片 | 1/2/3/4列，支持图注 |
| `04-media.html` | 图文并排 | 图左文右 / 图右文左 |
| `05-highlights.html` | 亮点 | 2/3/4列，图+标题+描述 |
| `06-features.html` | 特性数据 | 大字数据，最多4列 |
| `07-specs.html` | 规格参数 | 单品参数 / 多品对比 |
| `08-steps.html` | 步骤流程 | 带序号和连接线 |
| `09-video.html` | 视频 | 1/2列，粘贴iframe |

---

## 使用步骤

**第一步：粘贴 style 块**
打开商品说明编辑器，切换到 HTML 模式，将 `style-block.html` 的全部内容粘贴在最顶部。每个商品只需操作一次。

**第二步：按需复制 section**
从对应模板文件中复制需要的 `<section>` 代码，粘贴在 style 块下方。

**第三步：替换内容**
修改 `<img src="...">` 替换为真实图片地址，修改文字内容，不要改动 class 名称。

---

## 注意事项

- `style-block.html` 只需粘贴一次，不要重复粘贴
- 图片地址替换 `https://placehold.co/...` 为真实 CDN 地址
- 视频模板中替换 `VIDEO_ID` 为实际的 YouTube / Bilibili 视频 ID
- 不需要的元素（如图注、CTA按钮）直接删除对应标签即可
- 不要修改任何 `class="pd-..."` 属性，样式依赖这些 class 名称
