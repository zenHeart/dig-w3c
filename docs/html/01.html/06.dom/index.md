# DOM

**前言: 详解 DOM 中涉及的知识点**

---

## 概述

该章节详解 DOM 的使用

## Node

节点类型，详见 [NodeType](./examples/dom/nodeTypes.html)

节点树结构, 参考 [nodeTree](./examples/dom/nodeTree.html)

1. **childNodes** 子节点数组，注意文本节点例如换行导致的 `\n` 节点
2. **firstChild** 第一个子节点
3. **lastChild** 最后一个子节点
4. **parentNode** 父节点
5. **nextSibling** 下一个兄弟节点
6. **previousSibling** 上一个兄弟节点

:::tip
不是所有节点都有 `childNodes` 属性，只有 `Element` 节点才有 `childNodes` 属性
:::

## 参考资料

- [DOM 最新规范](https://github.com/whatwg/dom)
- [DOM4 标准](https://www.w3.org/TR/2015/REC-dom-20151119/)
- [javascript dom 编程艺术第 2 版](https://book.douban.com/subject/6038371/)
