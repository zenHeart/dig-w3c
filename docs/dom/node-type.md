# Node.nodeType

## 概述

`Node.nodeType` 是只读属性，返回一个整数，表示节点的类型。它用于区分不同种类的节点，如元素（Element）、文本（Text）、注释（Comment）等。

## NodeType 常量完整对照表

| 常量名 | 值 | 说明 |
|--------|-----|------|
| `Node.ELEMENT_NODE` | 1 | 元素节点，如 `<div>`、`<p>` |
| `Node.ATTRIBUTE_NODE` | 2 | 元素的属性节点（已废弃，不推荐使用） |
| `Node.TEXT_NODE` | 3 | 元素或属性内的文本节点 |
| `Node.CDATA_SECTION_NODE` | 4 | CDATA 区段，如 `<![CDATA[ ... ]]>` |
| `Node.PROCESSING_INSTRUCTION_NODE` | 7 | XML 处理指令，如 `<?xml-stylesheet ... ?>` |
| `Node.COMMENT_NODE` | 8 | 注释节点，如 `<!-- comment -->` |
| `Node.DOCUMENT_NODE` | 9 | Document 节点，代表整个文档 |
| `Node.DOCUMENT_TYPE_NODE` | 10 | 文档类型声明节点，如 `<!doctype html>` |
| `Node.DOCUMENT_FRAGMENT_NODE` | 11 | DocumentFragment 节点 |

**已废弃常量**（不再使用）：
- `Node.ENTITY_REFERENCE_NODE` (5)
- `Node.ENTITY_NODE` (6)
- `Node.NOTATION_NODE` (12)

## 基本用法

### 获取节点类型值

```javascript
// 检测 document 的类型
document.nodeType === Node.DOCUMENT_NODE; // true

// 检测文档类型声明
document.doctype.nodeType === Node.DOCUMENT_TYPE_NODE; // true

// 检测 DocumentFragment
document.createDocumentFragment().nodeType === Node.DOCUMENT_FRAGMENT_NODE; // true
```

### 创建并检测元素节点

```javascript
const p = document.createElement('p');
p.textContent = 'Hello World';

// 元素节点的 nodeType 为 1
p.nodeType === Node.ELEMENT_NODE; // true
p.nodeType === 1;                  // true

// 元素内的文本是 TEXT_NODE
p.firstChild.nodeType === Node.TEXT_NODE; // true
```

## 常用判断函数

### 判断是否为元素节点

```javascript
function isElementNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}
```

### 判断是否为文本节点

```javascript
function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
}
```

### 判断是否为注释节点

```javascript
function isCommentNode(node) {
  return node && node.nodeType === Node.COMMENT_NODE;
}
```

### 综合判断

```javascript
function getNodeTypeName(node) {
  const typeNames = {
    [Node.ELEMENT_NODE]: 'Element',
    [Node.TEXT_NODE]: 'Text',
    [Node.COMMENT_NODE]: 'Comment',
    [Node.DOCUMENT_NODE]: 'Document',
    [Node.DOCUMENT_TYPE_NODE]: 'DocumentType',
    [Node.DOCUMENT_FRAGMENT_NODE]: 'DocumentFragment',
    [Node.CDATA_SECTION_NODE]: 'CDataSection',
    [Node.PROCESSING_INSTRUCTION_NODE]: 'ProcessingInstruction'
  };
  return typeNames[node.nodeType] || 'Unknown';
}
```

## 典型使用场景

### 1. 遍历节点并过滤

```javascript
// 遍历所有子节点，只处理元素节点
function getElementChildren(node) {
  const children = node.childNodes;
  const elements = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i].nodeType === Node.ELEMENT_NODE) {
      elements.push(children[i]);
    }
  }
  return elements;
}

// 使用 Array.from 过滤
const elements = Array.from(node.childNodes)
  .filter(child => child.nodeType === Node.ELEMENT_NODE);
```

### 2. 检测注释节点

```javascript
// 检查文档第一个子节点是否为注释
const firstNode = document.documentElement.firstChild;
if (firstNode.nodeType !== Node.COMMENT_NODE) {
  console.warn('Document should start with a comment!');
}
```

### 3. 文本内容处理

```javascript
// 获取元素内所有纯文本（忽略子元素）
function getTextContent(node) {
  let text = '';
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    }
  }
  return text;
}
```

## element.nodeType vs Node.ELEMENT_NODE

两者在功能上完全等价：

```javascript
// 两种写法效果相同
element.nodeType === Node.ELEMENT_NODE; // 推荐
element.nodeType === 1;                  // 不推荐，硬编码值
```

**推荐使用 `Node.ELEMENT_NODE` 的原因**：
1. 可读性更好，代码意图清晰
2. 避免硬编码数字，减少错误
3. 符合 MDN 推荐实践

## NodeType 与 Element 接口

`Element` 继承自 `Node`，因此所有 Element 都满足 `nodeType === Node.ELEMENT_NODE`：

```javascript
const div = document.createElement('div');
console.log(div.nodeType);        // 1
console.log(div.nodeType === Node.ELEMENT_NODE); // true

// Element 也可直接使用 tagName
console.log(div.tagName);         // "DIV"
```

## 浏览器支持

`Node.nodeType` 属于 Baseline 定义，在所有现代浏览器中均已支持。

## 参考

- [MDN: Node.nodeType](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)
- [WHATWG DOM Spec](https://dom.spec.whatwg.org/#ref-for-dom-node-nodetype①)
