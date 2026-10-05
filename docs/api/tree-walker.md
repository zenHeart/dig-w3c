# TreeWalker API

> DOM Level Traversal API 提供的树遍历工具，支持按深度优先顺序遍历 DOM 节点子树

## 概述

TreeWalker 是浏览器原生提供的 DOM 遍历 API，比递归遍历性能更好，且支持 6 个方向的移动。

```js
const walker = document.createTreeWalker(root, whatToShow, filter);
```

## 核心概念

### 创建 TreeWalker

```js
// 遍历所有元素节点
const walker = document.createTreeWalker(
  document.body,                    // 根节点
  NodeFilter.SHOW_ELEMENT,          // 过滤条件
  null                              // 过滤函数
);

// 遍历文本节点
const textWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  null
);
```

### whatToShow 常量

| 常量 | 值 | 说明 |
|------|-----|------|
| SHOW_ALL | -1 | 所有节点 |
| SHOW_ELEMENT | 1 | 元素节点 |
| SHOW_TEXT | 4 | 文本节点 |
| SHOW_COMMENT | 128 | 注释节点 |
| SHOW_DOCUMENT | 256 | 文档节点 |
| SHOW_DOCUMENT_TYPE | 512 | 文档类型节点 |

### filter 函数

```js
const filter = (node) => {
  if (node.nodeName === 'SCRIPT') {
    return NodeFilter.FILTER_REJECT;  // 拒绝节点及其子节点
  }
  if (node.nodeName === 'STYLE') {
    return NodeFilter.FILTER_SKIP;    // 跳过节点但继续其子节点
  }
  return NodeFilter.FILTER_ACCEPT;    // 接受节点
};

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, filter);
```

## TreeWalker 方法（6 个方向）

```js
// 移动到父节点
walker.parentNode();

// 移动到首子节点
walker.firstChild();

// 移动到末子节点
walker.lastChild();

// 深度优先下一节点
walker.nextNode();

// 深度优先上一节点
walker.previousNode();

// 兄弟节点
walker.nextSibling();
walker.previousSibling();
```

## 与 NodeIterator 对比

| 特性 | TreeWalker | NodeIterator |
|------|-----------|--------------|
| 移动方向 | 6 个方向 | 仅 nextNode/previousNode |
| firstChild() | ✓ | ✗ |
| lastChild() | ✓ | ✗ |
| parentNode() | ✓ | ✗ |
| nextSibling() | ✓ | ✗ |
| previousSibling() | ✓ | ✗ |

## 典型应用

### 1. 遍历所有元素并过滤

```js
function walkElements(root, callback) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    callback(node);
  }
}

// 使用
walkElements(document.body, (el) => {
  console.log(el.tagName);
});
```

### 2. 排除 script/style 节点

```js
const filter = (node) => {
  const tag = node.nodeName.toUpperCase();
  if (tag === 'SCRIPT' || tag === 'STYLE') {
    return NodeFilter.FILTER_REJECT;
  }
  return NodeFilter.FILTER_ACCEPT;
};

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, filter);
```

### 3. 查找特定父元素

```js
function findParent(node, predicate) {
  const walker = document.createTreeWalker(node.parentNode, NodeFilter.SHOW_ELEMENT, null);
  
  let current = walker.currentNode;
  while (current) {
    if (predicate(current)) {
      return current;
    }
    current = walker.parentNode();
  }
  return null;
}

// 使用：查找最近的 <section> 祖先
const section = findParent(element, (el) => el.tagName === 'SECTION');
```

### 4. 计算文本内容长度

```js
function calculateTextLength(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    (node) => node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  );

  let length = 0;
  let node;
  while (node = walker.nextNode()) {
    length += node.textContent.length;
  }
  return length;
}
```

## 完整示例

```js
// 创建一个 TreeWalker 遍历文档
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  {
    acceptNode: (node) => {
      if (node.classList.contains('exclude')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  }
);

// 遍历所有匹配节点
let node = walker.currentNode = document.body;
const elements = [];

while (node) {
  elements.push(node);
  node = walker.nextNode();
}

console.log(`Found ${elements.length} elements`);
```

## 浏览器支持

所有现代浏览器均支持 TreeWalker API，包括：
- Chrome 1+
- Firefox 2+
- Safari 3+
- Edge 12+

## 性能优势

TreeWalker 由浏览器原生实现，相比 JavaScript 递归遍历：
1. **更快的节点过滤**：filter 在 C++ 层执行
2. **内存效率**：无需创建大量中间数组
3. **可中断遍历**：可随时停止，不影响已有节点

## 相关链接

- [MDN TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
- [MDN NodeIterator](https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator)
- [DOM Traversal Specification](https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html)
