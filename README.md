# w3c

## 概述

深挖 w3c 文档,猛追 web 脚步. 
内容打算分为如下几部分.
所有标准参见 [w3c all standards](https://www.w3.org/TR/) 

* w3c 概述
* html 标准
    基于 [html5.1](https://www.w3.org/TR/2016/REC-html51-20161101/index.html#contents)
* emacsript 标准

### 你现在仓库的内容画像（快速判断）
- 已有大量按主题分区的 Markdown 与 HTML 示例：`html/`、`js/ecma/`、`WebAPIs/`、`worker/`、`websocket/` 等。
- 示例多、说明文档也不少，目标是“学习笔记 + 可运行 demo”的知识库与站点。

### 内容组织建议（信息架构）
建议以“学习路径 + 标准索引 + 可运行示例”的三层结构组织：

- **导引与方法论**
  - `guide/intro/`：W3C 是什么、TR 生命周期、工作组、术语表。
  - `guide/how-to-read-spec/`：如何读规范、从 TR 到 WHATWG 的差异、变更追踪方法。
  - `guide/tools/`：常用调试工具、规范检索技巧、推荐参考链接。

- **标准与能力索引（按主题聚类）**
  - `standards/`：规范流程与 IDL 基础（对应现有 `standard/idl.md`、`standard/web-security.md` 等）。
  - `html/`：语言、元素、属性、语义、可访问性（映射现有 `html/` 下结构，保持子目录）。
  - `dom-bom/`：DOM 节点模型、API、事件体系、BOM（映射 `html/dom/`、`html/bom/`）。
  - `web-apis/`：按能力域分组
    - 网络：Fetch、WebSocket（映射 `websocket/`）
    - 性能：Performance、PerformanceObserver（映射 `WebAPIs/performance.*`）
    - 存储：Storage、IndexedDB（映射 `html/client-storage/`）
    - 并发：Worker、Worklet（映射 `worker/`）
    - 传感器/硬件：Sensor API、Camera（映射 `sensorAPI/`）
    - 其他：URL、计时器、调度等（映射 `WebAPIs/` 子目录）
  - `javascript/`：ECMAScript 学习（映射 `js/ecma/`，以“语言特性 -> 对应规范章节”方式标注）。

- **示例与实验**
  - 每个专题下保留 `demo/` 子目录，放可运行 `.html/.js` 示例。
  - 在对应文档中通过内嵌 `iframe` 或直链跳转到 demo，保持“读文档→点开可跑”的体验。
  - 大型跨专题示例单独放 `examples/`，并在相关专题页互相引用。

- **知识卡片与索引**
  - `glossary/`：术语卡片。
  - `changelog/`：规范更新与你笔记的更新记录（对新旧规范对比很有帮助）。
  - 自动生成的站内“索引页”：按标准、按 API、按元素名、按事件名检索。

命名与写作约定：
- 每篇加 frontmatter：`title`、`specRefs`（规范链接数组）、`updated`、`demoLinks`。
- 每个章节“先结论、再例子、后细节”，并在末尾统一“常见误区/差异”小节。
- 示例尽量可独立运行；若需依赖，列出步骤。

### 工具链推荐（两套可选，择一为主）
我建议以 VitePress 为主，Eleventy 为备选。理由与最小落地步骤如下：

#### 方案 A：VitePress（推荐）
- 优点：上手快、文档站能力完善（导航、侧栏、搜索、版本、i18n 可扩展）、与前端技术栈契合；现有 HTML demo 可直接以静态资源形式引用或 `iframe` 内嵌。
- 适合：学习笔记/文档为主，示例为辅；需要良好主题与站内搜索。

最小落地步骤：
1) 安装
```bash
cd /Users/gufeng/self/dig-w3c
npm i -D vitepress@latest markdown-it-attrs markdown-it-footnote
```

2) 目录规划（不强制搬家，先“增量收编”）
- 新建 `docs/` 作为站点源；保留现有目录不动。
- 将顶层 `README.md` 复制为 `docs/index.md` 作为站点首页。
- 把零散专题逐步搬/链接到 `docs/` 下的主题目录；现有 HTML demo 暂放到 `docs/public/demos/`（或保持原位置，用绝对/相对路径 `iframe` 引用）。

3) 基础配置 `docs/.vitepress/config.ts`
```ts
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'W3C Notes',
  description: '深挖 W3C 与 Web 平台能力的学习笔记',
  lang: 'zh-CN',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '导引', link: '/guide/intro/' },
      { text: 'HTML', link: '/html/' },
      { text: 'DOM/BOM', link: '/dom-bom/' },
      { text: 'Web APIs', link: '/web-apis/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: '标准流程', link: '/standards/' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'W3C 是什么', link: '/guide/intro/' },
        { text: '如何读规范', link: '/guide/how-to-read-spec/' },
      ],
      '/html/': [
        { text: '语言 & 元素', link: '/html/' },
      ],
      // 其余分区逐步补齐，或接入自动侧边栏插件
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/your/repo' }]
  },
  vite: {
    server: { fs: { strict: false } } // 允许引用仓库现有 demo
  }
});
```

4) 在文档中内嵌现有 demo
```md
在这里可以直接预览示例：

<iframe src="/demos/html/dom/examples/1.basic.html" style="width:100%;height:420px;border:1px solid #ddd"></iframe>
```

5) 脚本
```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

可选增强：
- 搜索：`vitepress-plugin-search` 或集成 `pagefind`（对中文支持更好）。
- 侧边栏自动：`vitepress-sidebar` 或自写扫描脚本。
- 图表：`markdown-it-mermaid` 或使用内置 `mermaid` 支持（VitePress 1.0+）。
- 部署：GitHub Pages（`actions/setup-node` + `peaceiris/actions-gh-pages`），或 Cloudflare Pages。

#### 方案 B：Eleventy (11ty)（更擅长“把一堆 HTML/MD 直接变站点”）
- 优点：对原生 `.html/.md` 友好，几乎零侵入地把既有目录编成站点；导航/索引由插件或数据文件生成。
- 适合：示例非常多、尽量少改动目录结构；可逐步加模板与布局。

最小落地步骤：
1) 安装
```bash
cd /Users/gufeng/self/dig-w3c
npm i -D @11ty/eleventy @11ty/eleventy-navigation @11ty/eleventy-plugin-syntaxhighlight
```

2) 配置 `.eleventy.js`
```js
<code_block_to_apply_changes_from>
```

3) 建基础布局 `_layouts/base.njk`，在各 Markdown 顶部 frontmatter 指定 `layout: base`，逐步收编现有内容为有统一外观的站点。

4) 搜索：集成 `pagefind` 或 Algolia DocSearch。

对比选择建议：
- 你要“更像文档站”、主题导航与搜索开箱即用 → 选 VitePress。
- 你要“尽量不动原目录、HTML demo 原地可见” → 选 11ty。

### 迁移与落地顺序（减少一次性改动）
- 第一步：先起站点外壳（VitePress 或 11ty），只放首页与少量示例，验证构建与部署。
- 第二步：从“导引/标准流程/HTML”三个分区开始搬运，保持原路径 demo 可访问。
- 第三步：建立“规范链接”与“站内索引”惯例；补充搜索、侧边栏自动化。
- 第四步：再把 `js/ecma/` 与 `WebAPIs/` 收编，逐步在文档中内嵌对应 demo。

如果你倾向某个方案，我可以直接在仓库里加上最小配置与目录骨架，并把首页、若干示例接好。