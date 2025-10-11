
---

sidebar: h3

---

# web components

web components 浏览器原生支持的组件化方案，实现自定义标签，隔离样式和行为。

## 核心概念

参看示例定义一个可复用的自定义元素，涉及如下核心概念

* **Custom Elements** 自定义元素
  * 采用 `extends HTMLElement` 采用扩展 HTMlElement 或者内置的标签元实现自定义元素和原生标签的增强使
  * `customElements.define` 利用该方法注册自定义元素，使得浏览器可以正确识别并解析自定义标签
  * `connectedCallback` 通过内置的生命周期钩子控制自定义元素的行为
* **Shadow DOM** 通过 Element 的 `attachShadow` 方法创建 shadow DOM, 利用 HTMLElement 的 `shadowRoot` 属性访问 shadowRoot ，通过 `shadowRoot.innerHTML` 或者 `appendChild` 等方法注入 `style` 和标签实现自定义元素的内容和样式，注意 shadow DOM 的样式和 DOM 树的样式完全隔离不会互相影响
* **Templates and slots** 通过 `template` 标签定义模板，利用 `<slot>、<slot name="xx">` 定义插槽, 在消费自定义组件的时候通过 `slot="xx"` 指定默认和具名插槽，实现定制化的嵌套组件

上面技术共同实现了 Web Components 的核心特性。涉及的规范如下， 具体细节可以参考 [webcomponents 规范](https://www.webcomponents.org/specs)

<<< ./01.basic.html

## Shadow DOM

浏览器在 Element 元素的实例上定义了 [`attachShadow`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow) 方法，用于创建一个新的 shadow root。可以在元素上通过 `shadowRoot` 属性访问 shadow root。

<<< ./02.attachShadow.html

### [attachShadow](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow)

attachShadow(options) 支持的核心配置 `options` 包括

* `mode`
  * `open` 通过 `element.shadowRoot` 可以访问 shadow root
  * `closed` 通过 `element.shadowRoot` 无法访问 shadow root, 返回的为 null, 如果不期望外部通过 api 修改 shadow dom 则可以设置为 closed
* `delegatesFocus` 该配置决定了当 shadow host 获取焦点时，焦点是否会自动转移到 shadow DOM 内部的第一个可聚焦元素上，默认值为 false

:::warning

注意不是所有元素都支持 attachShadow 方法, 例如 `video, input` 等元素由于本省就是自定义元素所以不支持 attachShadow 方法

此外一个元素只能有一个 shadow root, 多次调用 attachShadow 方法会抛出异常

:::

### [shadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/innerHTML)

`attachShadow` 方法会返回一个 shadow root 元素， 该元素集继承 [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) 对象，整个原型链为

```
ShadowRoot -> DocumentFragment -> Node -> EventTarget -> Object
```

意味着你可以使用原型链上的所有方法和属性操作 shadow root。

可以使用例如 `innerHTML` 或者 `appendChild` 等方法向 shadow root 中注入内容和样式，注入的样式只作用于 shadow DOM 内部，不会影响外部的样式。外部的样式也无法影响 Shadow DOM 内部的元素。

<<< ./03.ShadowRoot.html

:::tip

实际上外部根元素上设置的属性，如果具有继承关系，例如 `color, font-size` 等属性，shadow DOM 内部的元素是可以继承到的，后有详述

:::

## 自定义元素

除了直接调用元素上 `attachShadow` 创建 shadow DOM 之外，更常用的方式是通过自定义元素实现组件化。
可以通过 `extends` 方法扩展 HTMLElement 或者内置的标签元素实现自定义元素。

### extends HTMLElement

<<< ./04.extendsHTMLElement.html

:::warning

注意自定义元素必须采用小写，中划线分隔的命名方式，例如 `my-element`，否则会抛出异常，详细规则参考
规范 [valid custom element name](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

:::

### extends 内置标签

<<< ./05.extendsBuiltIn.html

采用自定义标签

### 使用

### 创建模版

### 注入样式

### 添加自定义属性

### 添加生命周期模版

### 使用插槽

### 注意事项

## 最佳实践

## 总结

1. 快速使用
   1. 基础示例

   2. 注意事项
      1. 自定义元素名称必须包含连字符 `-`
      2. 自定义元素类必须继承自 `HTMLElement` 或其子类
      3. 消费自定义元素无法自闭和，必须手动闭合
2. 样式设置
   1. `:host
   2. 样式覆盖优先级
      1. 对于内置的样式可以理解为默认样式，所以用户对 slot 的样式可以覆盖默认样式，但是如果设置了 `!important` 则无法规则相反，详细资料参考
         1. [shadow 层叠](https://drafts.csswg.org/css-scoping/#shadow-cascading)
         2. [样式讨论](https://github.com/w3c/csswg-drafts/issues/2290#issuecomment-382465643)
3. `class CustomElement extends HTMLElement` 中
   1. constructor 只会初始化一次，`connectedCallback` 每次插入 DOM 都会调用， 建议对于初始化操作放在 constructor 中, 对于可以延迟和多次调用的放在 `connectedCallback` 中， 参考资料, 注意 `consturctor` 在遇到标签的时候就会解析，此时在 contructor 中直接调用 `getAttribute` 获取不到值，可以参考 [cannot-access-attributes-of-a-custom-element-from-its-constructor](https://stackoverflow.com/questions/42251094/cannot-access-attributes-of-a-custom-element-from-its-constructor) 进一步理解
      1. [Web component gotcha: constructor vs connectedCallback](https://nolanlawson.com/2024/01/13/web-component-gotcha-constructor-vs-connectedcallback/)
      2. [You're (probably) using connectedCallback wrong](https://hawkticehurst.com/2023/11/you-are-probably-using-connectedcallback-wrong/)
4. 自定义元素属性
   1. 创建属性
5. 调试
   1. Chrome DevTools -> 设置 -> Elements -> Show user agent shadow DOM 可以看到 video 标签就是自定义元素
   2. 原生的自定义元素包括
   3. `video` 视频
   4. `input` 输入框
   5. `select` 下拉框

## 延伸阅读

* [规范自定义元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [shadow tree](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/dom/README.md#shadow-tree) chromium 详细讲解 shadow tree 的源码表示
* [Shadow DOM v1 - Self-Contained Web Components](https://web.dev/articles/shadowdom-v1)
* [Custom Elements v1 - Reusable Web Components](https://web.dev/articles/custom-elements-v1)
* [old version shadow dom](https://web.dev/articles/shadowdom)
* [shadow dom compare](https://hayatoito.github.io/2016/shadowdomv1/)
* [Shadow tree](https://dom.spec.whatwg.org/#shadow-trees) Shadow tree
* [custome element](https://html.spec.whatwg.org/multipage/custom-elements.html)
