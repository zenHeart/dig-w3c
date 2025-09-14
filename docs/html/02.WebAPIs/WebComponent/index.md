# web components

## 知识点

1. 定义自定义元素流程

   1. 扩展基础元素， 参考示例 [basic](./basic.html)

      ```js
      // 采用 extends 扩展基础元素
      class MyElement extends HTMLElement {}
      ```

   2. 挂载自定义元素 `window.customElements.define('my-element', MyElement)`
   3. 自定义元素规则
      1. 自定义元素名称必须包含连字符 `-`
      2. 自定义元素类必须继承自 `HTMLElement` 或其子类
      3. 消费自定义元素无法自闭和，必须手动闭合

         ```html
         <!-- 错误 -->
         <my-element />
         <!-- 正确 -->
         <my-element></my-element>
         ```
2. 自定义元素属性

   1. 创建属性


## 延伸阅读

* [规范自定义元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [自定义元素](https://web.dev/articles/custom-elements-v1?hl=zh-cn)
