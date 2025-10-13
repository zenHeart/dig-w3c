---
sidebar: h3
---

# web components

web components 浏览器原生支持的组件化方案，实现自定义标签，隔离样式和行为。

## 核心概念

参看示例定义一个可复用的自定义元素，涉及如下核心概念

- **Custom Elements** 自定义元素
  - 采用 `extends HTMLElement` 采用扩展 HTMlElement 或者内置的标签元实现自定义元素和原生标签的增强使
  - `customElements.define` 利用该方法注册自定义元素，使得浏览器可以正确识别并解析自定义标签
  - `connectedCallback` 通过内置的生命周期钩子控制自定义元素的行为
- **Shadow DOM** 通过 Element 的 `attachShadow` 方法创建 shadow DOM, 利用 HTMLElement 的 `shadowRoot` 属性访问 shadowRoot ，通过 `shadowRoot.innerHTML` 或者 `appendChild` 等方法注入 `style` 和标签实现自定义元素的内容和样式，注意 shadow DOM 的样式和 DOM 树的样式完全隔离不会互相影响
- **Templates and slots** 通过 `template` 标签定义模板，利用 `<slot>、<slot name="xx">` 定义插槽, 在消费自定义组件的时候通过 `slot="xx"` 指定默认和具名插槽，实现定制化的嵌套组件

上面技术共同实现了 Web Components 的核心特性。涉及的规范如下， 具体细节可以参考 [webcomponents 规范](https://www.webcomponents.org/specs)

<<< ./01.basic.html

## Shadow DOM

浏览器在 Element 元素的实例上定义了 [`attachShadow`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow) 方法，用于创建一个新的 shadow root。可以在元素上通过 `shadowRoot` 属性访问 shadow root。

<<< ./02.attachShadow.html

### [attachShadow](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow)

attachShadow(options) 支持的核心配置 `options` 包括

- `mode`
  - `open` 通过 `element.shadowRoot` 可以访问 shadow root
  - `closed` 通过 `element.shadowRoot` 无法访问 shadow root, 返回的为 null, 如果不期望外部通过 api 修改 shadow dom 则可以设置为 closed
- `delegatesFocus` 该配置决定了当 shadow host 获取焦点时，焦点是否会自动转移到 shadow DOM 内部的第一个可聚焦元素上，默认值为 false

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

### innerHTML vs appendChild

可以采用 `innerHTML` 或者 `appendChild` 来设置 shadow DOM 内的元素。
由于 innerHTML 是一个字符串，因此对于 script 标签内容无法正常解析，但是可以创建
script 标签后通过 `appendChild` 添加到 shadow DOM 内部。触发执行，具体可以参考
[script in shadow dom](https://stackoverflow.com/questions/51101473/script-inside-shadow-dom-not-working)

<<< ./03.01.innerHTML-vs-appendChild.html

### style

shadowroot 内部的样式和外部完全隔离不会相互影响

<<< ./style/01.isolation.html

你也可以通过导入外部样式表来控制 shadow DOM 内部的样式

<<< ./style/02.link.html

#### 继承属性

#### custom properties {#custom-properties}

虽然 shadow DOM 内部的样式和外部完全隔离，但是 shadow dom 内部元素任然可以通过属性集成和 custom properties 继承外部的样式。

详细的继承属性可以参考 [继承属性](https://web.dev/learn/css/inheritance) 参看示例， font-size 和 color 作为继承属性， shadow DOM 内部的元素可以继承外部的样式

<<< ./style/08.inherit.html

:::tip

页面可能引用了全局的重置样式，为了避免这些外部重置样式对 shadow DOM 内部的影响，可以通过 `all: initial` 重置 shadow DOM 内部的样式，避免受到属性继承导致的影响

<<< ./style/09.inherit-reset.html

示例中的 `:host` 用来表示 shadow DOM 的宿主元素， 此处为 `<div id="root">` 元素， 后续会讲解

:::

由于继承属性的副作用，对于 shadow dom 元素更标准的策略是采用自定义属性控制内部元素的核心样式。

<<< ./style/10.custom-property.html

### 伪元素

为了实现对 shadow DOM 内部样式的控制，浏览器提供了一系列伪元素

#### :host

`:host` 伪类选择器用于选择 shadow DOM 的宿主元素，可以通过 `:host` 选择器为宿主元素设置样式。
注意 `:host` 只在 shadow DOM 内部有效， 无法在 shadow DOM 外部使用

<<< ./style/03.host.html

你可以把采用 `:host` 设置样式理解为 shadow DOM 的默认样式，而外部定义的宿主元素样式为用户样式可以覆盖内部的默认样式行为。

<<< ./style/04.host-over.html

:::warning

注意示例中只能覆盖根元素的样式，但是内部元素无法覆盖。

:::

#### `:host()`

`:host()` 伪类选择器用于根据条件选择 shadow DOM 的宿主元素，可以通过 `:host()` 选择器为宿主元素设置条件样式。来匹配满足特定选择器规则的宿主元素

<<< ./style/05.host-selector.html

#### `:host-context()`

基于祖先的选择器来控制样式。

<<< ./style/06.host-context.html

:::warning
参考 [MDN :host-context](https://developer.mozilla.org/en-US/docs/Web/CSS/:host-context) 该属性后续可能会被废弃不推荐使用
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

#### extends 内置标签

<<< ./04.01.extendsBuiltIn.html

采用自定义标签， 可以使用自定义标签覆盖内置标签的默认行为

### connectedCallback

一般我们会在自定义元素上定义属性，参考如下示例

<<< ./05.attribute.html

:::waning
此处 contructor 会在浏览器解析到自定义标签时触发一次，由于 HTML 标签是流式解析的，所以当读取到标签 token 时就会立即触发 contructor，
而此时并未读取到属性值，所以在 contructor 中通过 `getAttribute` 获取属性值会返回 null， 从而显示默认值。
:::

因此自定义元素提供了 `connectedCallback` 确保在元素标签完全解析，并且插入到 DOM 树后才触发。

<<< ./06.connectedCallback.html

可以打开断点查看示例，会先显示默认内容，然后触发 `connectedCallback` 获取到

### disconnectedCallback

除了 `connectedCallback` 之外， 自定义元素还提供了 `disconnectedCallback` 生命周期钩子，当自定义元素从 DOM 树中移除时触发。
可以利用 `disconnectedCallback` 释放资源，例如取消定时器，取消网络请求等。

<<< ./07.disconnectedCallback.html

通过定时器实现高亮闪烁自定义元素，当移除元素的时候自动销毁定时器

### connectedMoveCallback

除了添加或者删除元素，当调用 `moveBefore` 方法移动元素时，会触发 `connectedMoveCallback` 钩子。

<<< ./08.connectedMoveCallback.html

:::warning
注意只有通过 moveBefore 方法移动元素，才会触发 connectedMoveCallback 钩子, 采用
insertBefore 方法添加元素，则不会触发 connectedMoveCallback 钩子。

<<< ./09.insertBefore.html

:::

### attributeChangedCallback

为了实现修改属性的时候，触发内容也实时变化可以采用 `attributeChangedCallback` 钩子。监听属性的修改。

<<< 10.attributeChangedCallback.html

#### observedAttributes

为了优化性能，示例中必须采用 `observedAttributes`  属性定义需要监听的属性，只有在 `observedAttributes` 定义的属性修改时才会触发 `attributeChangedCallback` 钩子。

### adoptedCallback

当自定义元素被移动到新的文档时，会触发 `adoptedCallback` 钩子。
一般在自定义元素移动到 iframe 时触发

<<< ./11.adoptedCallback.html

:::waring

注意由于此时挂载到了新的文档，所以不会触发 connectedMoveCallback 钩子，同时由于在新文档上挂载会重新触发
connectedCallback 钩子，为了避免此情况，可以参考示例中的逻辑，判断自定义元素所属的文档不是主文档时，不执行初次渲染逻辑， 避免重新挂载覆盖 adoptedCallback 的行为

```js
// 只在主文档插入时渲染，adopted 后不重复渲染
if (this.ownerDocument === document) {
  this.render("已插入文档");
}
```

:::

### hooks 总结

整个自定义元素的生命周期如下

1. **constructor** 每次解析到自定义元素标签就会触发，此时无法读取属性，用于初始化自定义元素基本信息
2. **connectedCallback** 添加元素到 DOM 树时触发，此时可以读取属性，可以在此时初始化或者更新元素
3. **attributeChangedCallback** 修改属性时触发
4. **disconnectedCallback** 从 DOM 树移除元素时触发
5. **connectedMoveCallback** 通过 moveBefore 方法移动元素时触发
6. **adoptedCallback** 元素被移动到新的文档时触发， 注意由于移动到新的 document 会重新触发 `connectedCallback` 钩子, 可以利用 `this.ownerDocument` 判断是否是主文档，避免重复渲染

### attribute vs prperty

- **attribute**  属于 HTML 标签上定义的属性，可以通过 `getAttribute、setAttribute、removeAttribute` 方法访问和修改
- **property** 采用自定义元素时实例上的属性，可以通过 `this.xx` 访问和修改

HTML 规范在处理 attribute 和 property 上有一系列规则，可以阅读 [HTML attributes vs DOM properties](https://jakearchibald.com/2024/attributes-vs-properties/) 了解细节

#### 属性反射 {#attribute-reflect}

除了直接通过 `getAttribute、setAttribute、removeAttribute` 方法访问和修改属性之外，你也可以直接修改
`this.xx` 的值，值的改变会同步到 attribute 上， 这种行为称为属性反射。详细资料可以参考 [attribute reflection](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes)

<<< ./10.1.attributeReflect.html

可以看到当修改元素上内置属性 `id` 的时候，属性值会同步到 attribute 上

但是针对 content 采用 `this.content` 修改并不会触发内容更新。
核心的原因在于 `attributeChangedCallback`  只会监听采用 `setAttribute` 等方式来修改属性，为了实现属性反射的效果，可以额外添加
`content` 的 setter 和 getter 方法,结合 `attributeChangedCallback` 实现属性反射

<<< ./10.3.reflect-content.html

### 事件处理

由于自定义元素继承自 HTMLElement, 因此根元素上的可以直接绑定事件，参看示例

<<< ./event/rootEvent.html

#### 自定义事件

对于内部元素可以使用 `dispatchEvent` 触发自定义事件，参看示例

<<< ./event/dispatchEvent.html

:::tip

由于内置事件属性例如 `onclick` 会自动处理绑定的表达式，而自定义事件没有此功能，可以通过监听属性绑定结合属性反射的功能实现支持在属性上绑定事件表达式， 此外需要设置 `bubbles: true, composed: true` 使得事件可以冒泡到 shadow DOM 外部。注意内部元素会被隐藏所以，事件的  target 始终为 shadow host

:::

## template 和 slot

为了实现可复用的结构来简化自定义元素的的创建，同时提供内置的扩展能力，web components 提供了 template 和 slot 来实现此功能

<<< 12.template.html

示例中

1. template 定义模版可以被多个自定义元素引用
2. slot 使得可以在自定义组件内部插入不同的标签实现自定义的高亮内容，而不受通过 content 属性只能注入文本的限制

### template

除了直接使用 template 标签定义模版外，你可以直接将 template 模版写在自定义元素内部，采用
`shadowrootmode="open"` 的方式创建 shadow DOM, 浏览器会自动将 template 内部的内容注入到 shadow DOM 内部

<<< 12.1.template-shadowrootmode.html

:::tip

对于不复用的自定义组件可以简单采用此方式定义，一般还是通过 CustomElement 的方式来创建 web components

:::

### name slot

slot 支持 name 属性插入多个插槽，在自定义组件内部使用 `slot` 属性制定具体的插入点

<<< ./13.name-slot.html

### duplicate slot

你可以在 template 中定义多个同名的插槽，但是浏览器只会默认使用第一个插槽，
在自定义元素中，你也可以同时插入多个同名的插槽，浏览器会自动根据插槽的 name 属性匹配，一次插入对应位置。

<<< ./14.duplicate-slot.html

:::tip

注意示例说明的规则

1. 当在 template 中定义多个同名插槽的时候，默认使用第一个插槽作为插入点
2. 当自定义元素消费插槽时，浏览器会自定基于插槽名称插入对应的插槽点，如果重复注入多个同名插槽内容，会依次按顺序插入对应的插槽点

在 Vue 的框架中不允许定义和注入重复插槽，此时会触发报错，因为框架在做 update 操作的时候如果定义重复的插槽或者注入重复的插槽会导致更新算法没法利用 key 或者其他属性来高性能的更新视图，注意此问题

:::

### ::part

除了之前介绍的 [custom properties](#custom-properties) 之外，shadow DOM 还提供了 `part` 属性来实现对 shadow DOM 内部元素的样式控制, 你可以在 元素上定义 part 属性， 然后通过  `::part(xx)` 伪元素选择器控制 shadow dom 内部元素样式

<<< ./style/11.part.html

### ::slotted

此外可以通过 `::slotted(xx)` 伪元素选择器控制插入到 slot 内部的元素样式

<<< ./style/12.slotted.html

## 最佳实践

### 组件设计

### 结构定义

### attribute 和 property

### 样式控制

#### :defined

采用 `:defined` 伪类解决自定义组件 FOUC 问题

`:defined` 伪类选择器用于选择已经定义的自定义元素，可以通过 `:defined` 选择器为已经定义的自定义元素设置样式。一般通过该元素解决样式闪烁问题

<<< ./style/07.defined.html

### 事件处理

## 库和框架

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

- [规范自定义元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
- [shadow tree](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/dom/README.md#shadow-tree) chromium 详细讲解 shadow tree 的源码表示
- [Shadow DOM v1 - Self-Contained Web Components](https://web.dev/articles/shadowdom-v1)
- [Custom Elements v1 - Reusable Web Components](https://web.dev/articles/custom-elements-v1)
- [old version shadow dom](https://web.dev/articles/shadowdom)
- [shadow dom compare](https://hayatoito.github.io/2016/shadowdomv1/)
- [Shadow tree](https://dom.spec.whatwg.org/#shadow-trees) Shadow tree
- [custome element](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [声明式 Shadow DOM](https://web.dev/articles/declarative-shadow-dom)
- [声明式 shadow dom 规范](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
- [可构造样式表](https://web.dev/articles/constructable-stylesheets?hl=zh-cn)
- [css shadow parts](https://www.w3.org/TR/css-shadow-parts-1/?utm_source=chatgpt.com)
