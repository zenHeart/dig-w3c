# Node.nodeType 完整指南

> 本文详细介绍 Node.nodeType 属性，整理所有节点类型常量的含义、用途与代码示例。

## 一、概述

`Node.nodeType` 是只读属性，返回一个整数，表示节点的类型。它用于区分不同种类的节点，如元素（Element）、文本（Text）、注释（Comment）等。

```javascript
element.nodeType  // 返回数字
Node.ELEMENT_NODE // 返回 1（常量值）
```

---

## 二、节点类型常量完整列表

| 常量 | 值 | 说明 |
|------|----|------|
| `Node.ELEMENT_NODE` | **1** | 元素节点，如 `<p>`、`<div>` |
| `Node.ATTRIBUTE_NODE` | 2 | 属性节点（已废弃，不建议使用） |
| `Node.TEXT_NODE` | **3** | 文本节点，元素内的文字 |
| `Node.CDATA_SECTION_NODE` | 4 | CDATA 节节点 |
| `Node.PROCESSING_INSTRUCTION_NODE` | 7 | 处理指令节点（XML 文档） |
| `Node.COMMENT_NODE` | **8** | 注释节点，如 `<!-- comment -->` |
| `Node.DOCUMENT_NODE` | **9** | Document 节点 |
| `Node.DOCUMENT_TYPE_NODE` | **10** | DocumentType 节点，如 `<!doctype html>` |
| `Node.DOCUMENT_FRAGMENT_NODE` | **11** | DocumentFragment 节点 |

**已废弃常量**（不再使用）：`Node.ENTITY_REFERENCE_NODE (5)`、`Node.ENTITY_NODE (6)`、`Node.NOTATION_NODE (12)`

---

## 三、类型详解与代码示例

### 3.1 ELEMENT_NODE (1)

最常见的节点类型，代表 HTML 元素。

```javascript
const div = document.createElement('div');
div.nodeType === Node.ELEMENT_NODE;  // true
div.nodeType === 1;                  // true

document.querySelector('p').nodeType === Node.ELEMENT_NODE;  // true
```

### 3.2 TEXT_NODE (3)

元素内的文本内容，包括空白文字。

```javascript
const p = document.createElement('p');
p.textContent = 'Hello World';

p.firstChild.nodeType === Node.TEXT_NODE;    // true
p.firstChild.nodeType === 3;                  // true
p.firstChild.textContent;                     // 'Hello World'
```

**注意**：即使元素内只有换行或空格，也会产生一个 TEXT_NODE。

```javascript
const div = document.createElement('div');
div.innerHTML = '\n  text\n';
div.childNodes.length;        // 可能 > 1（空白也是文本节点）
```

### 3.3 COMMENT_NODE (8)

HTML 注释节点。

```javascript
const comment = document.createComment('这是注释');
comment.nodeType === Node.COMMENT_NODE;  // true
comment.nodeType === 8;                  // true
```

### 3.4 DOCUMENT_NODE (9)

代表整个文档（DOM 树的根节点）。

```javascript
document.nodeType === Node.DOCUMENT_NODE;  // true
document.nodeType === 9;                    // true
```

### 3.5 DOCUMENT_TYPE_NODE (10)

文档类型声明，如 `<!doctype html>`。

```javascript
document.doctype.nodeType === Node.DOCUMENT_TYPE_NODE;  // true
document.doctype.nodeType === 10;                        // true
```

### 3.6 DOCUMENT_FRAGMENT_NODE (11)

DocumentFragment 节点，用于批量操作 DOM。

```javascript
const fragment = document.createDocumentFragment();
fragment.nodeType === Node.DOCUMENT_FRAGMENT_NODE;  // true
fragment.nodeType === 11;                            // true
```

---

## 四、element.nodeType vs Node.ELEMENT_NODE

| 对比 | `element.nodeType` | `Node.ELEMENT_NODE` |
|------|-------------------|---------------------|
| **含义** | 实例属性，返回当前节点的类型数值 | 全局常量，值为 `1` |
| **类型** | number（只读） | number（固定值 `1`） |
| **用途** | 判断某个节点是什么类型 | 与 `.nodeType` 比较 |
| **示例** | `div.nodeType // 1` | `Node.ELEMENT_NODE // 1` |

**推荐写法** — 使用常量而非硬编码数字：

```javascript
// ✅ 推荐：语义清晰，可读性好
if (node.nodeType === Node.ELEMENT_NODE) { ... }

// ⚠️ 不推荐：magic number，难以理解
if (node.nodeType === 1) { ... }

// ✅ 枚举映射（调试时常用）
const NodeTypeMap = Object.entries(Node).reduce((res, [name, value]) => {
  if (typeof value === 'number') res[value] = name;
  return res;
}, {});

NodeTypeMap[document.nodeType];  // 'DOCUMENT_NODE'
```

---

## 五、典型使用场景

### 5.1 遍历节点时过滤类型

```javascript
// 遍历所有子节点，只处理元素节点
const container = document.querySelector('.container');

container.childNodes.forEach(node => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    console.log('Element:', node.tagName);
  }
});
```

### 5.2 跳过空白文本节点

空白符在 DOM 中也是 TEXT_NODE，常导致遍历时多余处理：

```javascript
function getElementChildren(element) {
  return Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.ELEMENT_NODE);
}

getElementChildren(document.body);  // 只包含真正的元素节点
```

### 5.3 检测注释节点

```javascript
const node = document.documentElement.firstChild;

if (node.nodeType !== Node.COMMENT_NODE) {
  console.warn('文档开头缺少注释说明');
}
```

### 5.4 在 TreeWalker 中使用

`TreeWalker` 默认只遍历实体节点，可配置 `whatToShow` 过滤类型：

```javascript
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,  // 只遍历元素节点
  null
);

let node;
while (node = walker.nextNode()) {
  console.log(node.tagName);
}
```

### 5.5 判断节点是否可编辑

结合 `nodeType` 和 `isContentEditable` 判断节点是否可编辑文本：

```javascript
function isEditableTextNode(node) {
  return node.nodeType === Node.TEXT_NODE &&
         node.parentElement?.isContentEditable;
}
```

---

## 六、完整类型判断工具函数

```javascript
/**
 * 判断节点是否为指定类型
 * @param {Node} node - 待检测节点
 * @param {number} type - Node.ELEMENT_NODE 等常量
 */
function isNodeType(node, type) {
  return node && node.nodeType === type;
}

// 用法
isNodeType(document.body, Node.ELEMENT_NODE);     // true
isNodeType(document.doctype, Node.DOCUMENT_TYPE_NODE); // true
```

---

## 七、注意事项

1. **ATTRIBUTE_NODE 已废弃**：虽然值为 2，但现在通过 `element.getAttributeNode()` 获取的属性节点已不推荐使用，实际开发中几乎不会遇到。

2. **TEXT_NODE 包含空白**：DOM 中的换行、空格都会生成 TEXT_NODE，遍历时需要注意过滤。

3. **常量兼容性**：所有现代浏览器都支持 `Node.ELEMENT_NODE` 等常量，但旧版 IE（IE8 及以下）不支持，需使用数字硬编码。

4. **Node vs Element**：`nodeType` 是 `Node` 接口的属性，所有节点（元素、文本、注释、文档等）都有此属性；而 `Element` 只是其中一种节点类型。

---

## 八、参考资料

- [MDN: Node.nodeType](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)
- [DOM Spec: Node.nodeType](https://dom.spec.whatwg.org/#ref-for-dom-node-nodetype)
