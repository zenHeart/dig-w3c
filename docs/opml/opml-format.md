# OPML 格式完整指南

> OPML (Outline Processor Markup Language) 是一种基于 XML 的轮廓/大纲格式，广泛用于 RSS 订阅列表导出、笔记应用大纲、播客订阅等场景。

## 一、OPML 简介

### 1.1 什么是 OPML

OPML 全称 Outline Processor Markup Language，是一种基于 XML 的轻量级轮廓标记语言。

**核心特点：**
- 纯文本 XML 格式，人类可读
- 层级结构（树形大纲）
- 跨平台、跨应用兼容
- 主要用于描述有层级关系的数据

### 1.2 OPML 历史

- **2000 年**：Dave Winer 创建 OPML，最初用于博客roll
- **2005 年**：Google Reader 使用 OPML 导入/导出订阅列表
- **当前**：仍是 RSS 生态系统的标准交换格式

### 1.3 常见应用场景

| 场景 | 说明 |
|------|------|
| RSS 订阅导出 | Google Reader、Feedly 等导出/导入订阅列表 |
| 播客订阅 | 播客客户端之间的订阅迁移 |
| 笔记大纲 | 笔记应用的层级结构 |
| 思维导图 | 层级化思维导图数据 |
| 博客roll | 博客订阅列表 |

## 二、OPML 文件结构

### 2.1 基本语法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>我的订阅列表</title>
    <dateCreated>Fri, 27 Mar 2026 08:00:00 GMT</dateCreated>
    <ownerName>用户名</ownerName>
    <ownerEmail>email@example.com</ownerEmail>
  </head>
  <body>
    <!-- 大纲内容 -->
  </body>
</opml>
```

### 2.2 必需元素

| 元素 | 描述 | 必需 |
|------|------|------|
| `<?xml>` | XML 声明 | 是 |
| `<opml>` | 根元素，需指定 version 属性 | 是 |
| `<head>` | 元数据区域 | 是 |
| `<body>` | 实际大纲内容 | 是 |

### 2.3 `<head>` 子元素

| 元素 | 描述 |
|------|------|
| `title` | OPML 文档标题 |
| `dateCreated` | 创建时间（RFC 822/RFC 2822 格式） |
| `dateModified` | 修改时间 |
| `ownerName` | 所有者名称 |
| `ownerEmail` | 所有者邮箱 |
| `ownerId` | 所有者 ID（URI 格式） |
| `docs` | 相关文档链接 |
| `expansionState` | 展开状态（逗号分隔的索引列表） |

### 2.4 `<body>` 和 `<outline>` 元素

```xml
<body>
  <outline text="父节点">
    <outline text="子节点1" />
    <outline text="子节点2" />
  </outline>
</body>
```

### 2.5 outline 元素属性

OPML 的核心是 `<outline>` 元素，支持丰富的属性：

```xml
<outline
  text="显示文本"
  type="类型（rss、link、outline）"
  title="标题"
  description="描述"
  xmlUrl="XML Feed URL（RSS/Atom）"
  htmlUrl="HTML 页面 URL"
  language="语言代码"
  version="版本信息"
  />
```

**type 属性值：**

| type 值 | 说明 | 必需属性 |
|---------|------|----------|
| `rss` | RSS/Atom Feed | xmlUrl, htmlUrl |
| `atom` | Atom Feed | xmlUrl, htmlUrl |
| `link` | 通用链接 | htmlUrl |
| `outline` | 普通大纲节点 | 无 |

**常用属性详解：**

| 属性 | 说明 | 示例 |
|------|------|------|
| `text` | 节点显示文本（必需） | `text="我的博客"` |
| `type` | 节点类型 | `type="rss"` |
| `xmlUrl` | Feed URL | `xmlUrl="https://example.com/feed.xml"` |
| `htmlUrl` | 网站 URL | `htmlUrl="https://example.com"` |
| `title` | 标题（可与text不同） | `title="RSS Title"` |
| `description` | 描述信息 | `description="博客描述"` |

## 三、RSS Feed OPML 示例

### 3.1 完整 RSS 订阅列表

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>我的 RSS 订阅</title>
    <dateCreated>Fri, 27 Mar 2026 08:00:00 GMT</dateCreated>
    <ownerName>John Doe</ownerName>
    <ownerEmail>john@example.com</ownerEmail>
  </head>
  <body>
    <outline text="技术博客" description="技术相关博客">
      <outline
        text="阮一峰的网络日志"
        type="rss"
        xmlUrl="https://www.ruanyifeng.com/blog/atom.xml"
        htmlUrl="https://www.ruanyifeng.com/blog/"
        description="科技与人文"
        />
      <outline
        text="张鑫旭的博客"
        type="rss"
        xmlUrl="https://www.zhangxinxu.com/wordpress/feed/"
        htmlUrl="https://www.zhangxinxu.com/"
        />
    </outline>
    
    <outline text="AI/机器学习" description="AI 相关博客">
      <outline
        text="机器之心"
        type="rss"
        xmlUrl="https://arxiv.org/rss/cs.AI.xml"
        htmlUrl="https://arxiv.org/"
        />
    </outline>
  </body>
</opml>
```

### 3.2 Google Reader 导出的 OPML

Google Reader 导出格式的典型特征：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.1">
  <head>
    <title>Google Reader 的订阅</title>
    <dateCreated>Wed, 01 Jan 2025 00:00:00 GMT</dateCreated>
  </head>
  <body>
    <!-- 分组 -->
    <outline text="订阅">
      <outline text="博客名称"
        type="rss"
        xmlUrl="https://example.com/feed.xml"
        htmlUrl="https://example.com"/>
    </outline>
  </body>
</opml>
```

## 四、OPML 解析与生成

### 4.1 JavaScript 解析 OPML

```javascript
// 解析 OPML 字符串
function parseOPML(opmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlString, 'text/xml');
  
  // 检查解析错误
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('OPML 解析失败: ' + parseError.textContent);
  }
  
  // 提取 head 元数据
  const head = {
    title: getText(doc, 'head title'),
    dateCreated: getText(doc, 'head dateCreated'),
    ownerName: getText(doc, 'head ownerName'),
    ownerEmail: getText(doc, 'head ownerEmail'),
  };
  
  // 提取 body 中的 outline
  const outlines = [];
  const body = doc.querySelector('body');
  parseOutlines(body, outlines);
  
  return { head, outlines };
}

// 递归解析 outline 层级
function parseOutlines(element, results, level = 0) {
  const outlines = element.querySelectorAll(':scope > outline');
  
  outlines.forEach(outline => {
    const node = {
      text: outline.getAttribute('text') || '',
      type: outline.getAttribute('type') || 'outline',
      xmlUrl: outline.getAttribute('xmlUrl') || '',
      htmlUrl: outline.getAttribute('htmlUrl') || '',
      title: outline.getAttribute('title') || '',
      description: outline.getAttribute('description') || '',
      level,
      children: [],
    };
    
    // 递归处理子节点
    const childOutlines = outline.querySelectorAll(':scope > outline');
    if (childOutlines.length > 0) {
      parseOutlines(outline, node.children, level + 1);
    }
    
    results.push(node);
  });
}

// 辅助函数：获取元素文本
function getText(doc, selector) {
  const el = doc.querySelector(selector);
  return el ? el.textContent : '';
}
```

### 4.2 JavaScript 生成 OPML

```javascript
// 生成 OPML 字符串
function generateOPML(data) {
  const { head, outlines } = data;
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(head.title || '')}</title>
    <dateCreated>${new Date().toUTCString()}</dateCreated>`;
  
  if (head.ownerName) {
    xml += `\n    <ownerName>${escapeXml(head.ownerName)}</ownerName>`;
  }
  if (head.ownerEmail) {
    xml += `\n    <ownerEmail>${escapeXml(head.ownerEmail)}</ownerEmail>`;
  }
  
  xml += `\n  </head>
  <body>`;
  
  // 递归生成 outline
  xml += generateOutlines(outlines, 2);
  
  xml += `
  </body>
</opml>`;
  
  return xml;
}

// 递归生成 outline XML
function generateOutlines(outlines, indent) {
  const spaces = '  '.repeat(indent);
  let xml = '';
  
  outlines.forEach(outline => {
    const attrs = [`text="${escapeXml(outline.text || '')}"`];
    
    if (outline.type && outline.type !== 'outline') {
      attrs.push(`type="${escapeXml(outline.type)}"`);
    }
    if (outline.xmlUrl) {
      attrs.push(`xmlUrl="${escapeXml(outline.xmlUrl)}"`);
    }
    if (outline.htmlUrl) {
      attrs.push(`htmlUrl="${escapeXml(outline.htmlUrl)}"`);
    }
    if (outline.title) {
      attrs.push(`title="${escapeXml(outline.title)}"`);
    }
    if (outline.description) {
      attrs.push(`description="${escapeXml(outline.description)}"`);
    }
    
    const hasChildren = outline.children && outline.children.length > 0;
    
    if (hasChildren) {
      xml += `\n${spaces}<outline ${attrs.join(' ')}>`;
      xml += generateOutlines(outline.children, indent + 1);
      xml += `\n${spaces}</outline>`;
    } else {
      xml += `\n${spaces}<outline ${attrs.join(' ')} />`;
    }
  });
  
  return xml;
}

// XML 特殊字符转义
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
```

### 4.3 提取所有 RSS Feed URL

```javascript
// 提取 OPML 中所有 RSS Feed URL
function extractFeedUrls(opmlString) {
  const feeds = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlString, 'text/xml');
  
  const outlines = doc.querySelectorAll('outline[type="rss"], outline[type="atom"]');
  
  outlines.forEach(outline => {
    feeds.push({
      text: outline.getAttribute('text'),
      xmlUrl: outline.getAttribute('xmlUrl'),
      htmlUrl: outline.getAttribute('htmlUrl'),
      description: outline.getAttribute('description'),
    });
  });
  
  return feeds;
}
```

## 五、OPML 与 RSS

### 5.1 OPML 在 RSS 生态中的作用

```
┌─────────────┐     OPML      ┌─────────────┐
│  Feedly     │ ────────────> │  Inoreader  │
│  (导出)      │   (迁移)     │  (导入)      │
└─────────────┘               └─────────────┘
       │
       │ OPML
       ▼
┌─────────────┐
│  RSS 阅读器  │
│  订阅列表    │
└─────────────┘
```

### 5.2 OPML 格式版本差异

| 版本 | 特点 |
|------|------|
| OPML 1.0 | 早期版本，outline 属性较少 |
| OPML 2.0 | 增加 dateCreated、ownerName 等 head 元素；outline 增加更多属性 |
| OPML 2.0+ | 事实标准，大多数阅读器支持 |

### 5.3 常见 RSS 阅读器 OPML 导出

**Feedly：**
```xml
<outline text="Feedly" type="rss" 
  xmlUrl="https://feedly.com/..." 
  htmlUrl="https://feedly.com/..."/>
```

**Inoreader：**
```xml
<outline text="Inoreader Categories" description="订阅分组">
  <outline text="博客" categoryId="...">
    <outline type="rss" xmlUrl="..." htmlUrl="..."/>
  </outline>
</outline>
```

## 六、OPML 验证工具

### 6.1 XML 有效性检查

```javascript
// 验证 OPML 是否为有效 XML
function validateOPML(opmlString) {
  const errors = [];
  
  // 1. 检查是否是有效 XML
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlString, 'text/xml');
  
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    errors.push('XML 解析错误: ' + parseError.textContent);
    return { valid: false, errors };
  }
  
  // 2. 检查必需元素
  if (!doc.querySelector('opml')) {
    errors.push('缺少 <opml> 根元素');
  }
  if (!doc.querySelector('head')) {
    errors.push('缺少 <head> 元素');
  }
  if (!doc.querySelector('body')) {
    errors.push('缺少 <body> 元素');
  }
  
  // 3. 检查 version 属性
  const opml = doc.querySelector('opml');
  const version = opml?.getAttribute('version');
  if (!version) {
    errors.push('<opml> 缺少 version 属性');
  }
  
  // 4. 检查 RSS outline 是否同时有 xmlUrl 和 htmlUrl
  const rssOutlines = doc.querySelectorAll('outline[type="rss"]');
  rssOutlines.forEach((outline, i) => {
    if (!outline.getAttribute('xmlUrl')) {
      errors.push(`第 ${i + 1} 个 RSS outline 缺少 xmlUrl`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 6.2 在线验证工具

- **W3C Markup Validation Service**: https://validator.w3.org/
- **XML validation tools**: https://www.xmlvalidation.com/

## 七、常见问题

### 7.1 text vs title 属性

- `text`：用于显示的必需文本
- `title`：可选的标题，可与 text 相同或不同

```xml
<!-- 最小化 -->
<outline text="博客名称" xmlUrl="..."/>

<!-- 完整写法 -->
<outline text="博客简称" 
         title="博客全称" 
         description="博客描述"
         xmlUrl="..."/>
```

### 7.2 中文编码问题

```xml
<!-- 推荐：UTF-8 编码 -->
<?xml version="1.0" encoding="UTF-8"?>

<!-- 旧格式：GBK/GB2312 -->
<?xml version="1.0" encoding="GBK"?>
```

### 7.3 OPML 与 JSON 转换

```javascript
// OPML to JSON
function opmlToJson(opmlString) {
  return JSON.stringify(parseOPML(opmlString), null, 2);
}

// JSON to OPML
function jsonToOpml(jsonString) {
  const data = JSON.parse(jsonString);
  return generateOPML(data);
}
```

## 八、参考资料

- [OPML 规范 (opml.org)](http://opml.org/spec2.opml)
- [Dave Winer 的 OPML 文档](https://dev.opml.org/spec.html)
- [Wikipedia: OPML](https://en.wikipedia.org/wiki/OPML)

---

**Reminder ID**: AD158F8B-5378-493E-BB04-CDAF55D23150
**创建时间**: 2026-03-27
**仓库**: dig-w3c
