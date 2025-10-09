# web components

## 知识点

1. 定义自定义元素流程， 参考示例 [basic](./basic.html)
   1. 采用 `class MyElement extends HTMLElement {}` 定义自定义元素
      ```js
      // 采用 extends 扩展基础元素
      class MyElement extends HTMLElement {}
      ```
      1. 自定义元素名称必须包含连字符 `-`
      2. 自定义元素类必须继承自 `HTMLElement` 或其子类
      3. 消费自定义元素无法自闭和，必须手动闭合
   2. 利用 `this.attachShadow({ mode: 'open' })` 创建 shadow Root
   3. 在构造函数中初始化状态，通过 `connnnectedCallback` 定义元素
   4. 调用 shadowRoot 的 innerHTML 或者 appendChild 方法添加内容
   5. 挂载自定义元素 `window.customElements.define('my-element', MyElement)`
   6. 使用自定义元素 `<my-element></my-element>`， 不能使用自闭和标签
      1. 自定义元素规则

         ```html
         <!-- 错误 -->
         <my-element />
         <!-- 正确 -->
         <my-element></my-element>
         ```
2. `class CustomElement extends HTMLElement` 中
   1. constructor 只会初始化一次，`connectedCallback` 每次插入 DOM 都会调用， 建议对于初始化操作放在 constructor 中, 对于可以延迟和多次调用的放在 `connectedCallback` 中， 参考资料, 注意 `consturctor` 在遇到标签的时候就会解析，此时在 contructor 中直接调用 `getAttribute` 获取不到值，可以参考 [cannot-access-attributes-of-a-custom-element-from-its-constructor](https://stackoverflow.com/questions/42251094/cannot-access-attributes-of-a-custom-element-from-its-constructor) 进一步理解
      1. [Web component gotcha: constructor vs connectedCallback](https://nolanlawson.com/2024/01/13/web-component-gotcha-constructor-vs-connectedcallback/)
      2. [You're (probably) using connectedCallback wrong](https://hawkticehurst.com/2023/11/you-are-probably-using-connectedcallback-wrong/)
3. 自定义元素属性
   1. 创建属性
4. 调试
   1. Chrome DevTools -> 设置 -> Elements -> Show user agent shadow DOM 可以看到 video 标签就是自定义元素
   2. 原生的自定义元素包括
   3. `video` 视频
   4. `input` 输入框
   5. `select` 下拉框

## 延伸阅读

* [规范自定义元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [specification](https://www.webcomponents.org/specs) web components 规范
* [Shadow DOM v1 - Self-Contained Web Components](https://web.dev/articles/shadowdom-v1#working_with_slots_in_js)
* [Custom Elements v1 - Reusable Web Components](https://web.dev/articles/custom-elements-v1)
