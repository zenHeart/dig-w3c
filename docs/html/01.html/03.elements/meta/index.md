# meta

**详解 meta 标签的使用**

----

## 概述

meta(Metadata) 用于控制 html 文档等一系列特性
更具浏览器厂商不同抱哈一系列特性。

## 核心属性

### charset

该属性决定 html 采用何种字符集进行解析.
对于解析完成的内容修改 `charset` 无效果

### name,content

用于描述文档,该描述可用于 SEO

## 知识点

* meta 用来控制浏览器的默认行为，典型的标签如下
* `<meta charset="UTF-8">` 用于指定文档的字符集, 比如常见的文档显示乱码的原因是文档比如采用 GBK 编码的文档，charset 使用 UTF-8 进行解析会导致乱码
* `<meta http-equiv="header" content="value">` 响应头模拟，用于模拟一些响应头, 规范定义了 7 个支持的响应头，详见 [Pragma directives](https://html.spec.whatwg.org/multipage/semantics.html#pragma-directives)
  * `<meta http-equiv="refresh" content="5;url=https://www.example.com">` 用于控制页面跳转
  * `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">` 用于控制内容安全策略, 详见 [CSP](https://web.dev/articles/csp?hl=zh-cn)
* `<meta name="xx" content="xx">` 添加描述信息
  * `<meta name="viewport" content="width=device-width, initial-scale=1">` 用于控制移动端视口
  * `<meta name="description" content="这是一个示例页面">` 用于添加页面描述，有利于 SEO
  * `<meta name="robots" content="index,follow">` 爬虫配置
* open graph 协议，详见 [open graph](https://ogp.me/). 可以采用 deno deploy 查看分享效果

## 查看资料

* [ ] [mac mobile meta](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)
* [element meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta)
* [meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta)
