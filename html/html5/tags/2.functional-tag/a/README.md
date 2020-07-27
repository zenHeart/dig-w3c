# a

**详解 anchor 标签的使用**

----


## 概述
a(anchor) 标签用于创建一个链接,


## 核心属性
* `href` 全称 `Hypertext Reference` 设定连接的跳转地址
* `title` 当悬停在连接上时会显示此文本
* `download` 设定保存资源的信息

### 典型场景
## 片段定位 
可以采用 `#` 定位到包含 `id` 的片段,
<!-- TODO: 浏览器如何确定具体的定位点需搞清楚 -->

### scheme
除了打开网页,a 可以打开多种 scheme.
例如邮箱参见 [mail demo](./a-href_mail.html) 不仅可以打开邮箱还可利用 query 传入一系列参数。

一个典型的场景是在需要通过链接打开应用时可以采用 scheme 策略。

> 前提是应用有配置 scheme 策略!


## 最佳实践
1. 保持简单,不需要再说明 link 等额外信息
2. 相对由于绝对路径,相对路径避免了浏览器进行额外的域名解析等操作