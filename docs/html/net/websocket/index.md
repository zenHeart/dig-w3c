# websocket

**详细讲解 websocket 的使用**

---

## 概述
websocket 是一个应用层协议,
实现了浏览器和服务端的长连接通讯。
基于此协议可以在 BS 架构中实现一些需要实时通讯的应用,例如聊天室,在线游戏等。

学习 websocket 主要分为三部分：
* websocket 协议学习,理解该协议基本定义
* 客户端学习,前端主要指浏览器环境如何利用 `Websocket` 对象创建连接
* 服务端学习,如何搭建 websocket 服务

## 快速入门
采用 [websocket echo](https://www.websocket.org/echo.html) 验证 websocket

## 浏览器中的 websocket 对象
HTML5 中定义了 WebSocket 宿主对象,实现基于 websocket 协议的客户端。

### 客户端实例
浏览器暴露了 `WebSocket` 对象创建  ws 客户端。采用 `var ws = new WebSocket(url,protocols)` 的方法实例化客户端。
* `url` 表示需连接的服务端地址
* `protocols` 表示协议的配置

连接成功后,可采用 `ws.send` 方法向服务端发送消息。发送支持类型详见 [mdn send 入参类型](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/send#%E8%AF%AD%E6%B3%95) 

利用 `ws.close(code,reason)` 方法关闭连接,参数含义详见 [mdn close](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/close)


### 核心事件
在客户端和 ws 服务器交互时,
提供了如下事件。

* `onopen` 当 `readyState` 的状态值从 0（CONNECTING） -> 1（OPEN） 时触发此事件,返回 event 事件
* `onmessage` 当从服务端接收到数据时,触发此事件,返回 event 事件
* `onerror` 当连接出错时触发该事件,返回 event 事件
* `onclose` 当 `readyState` 的状态值切换到 3（CLOSED） 时触发此事件,返回 [Close​Event
](https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent) 事件

### 协议信息
实例化后的 ws 客户端,暴露了如下属性,来获取当前连接信息。

* `binary​Type` 返回websocket连接所传输二进制数据的类型,返回值可以为如下字符串
  * `blob` 采用 blob 模式传输
  * `arraybuffer` 采用 ArrayBuffer 模式传输
* `bufferedAmount` 只读属性,返回放入发送缓冲区的字节长度
* `extensions` 只读属性,返回服务器已选择的扩展值
* `protocol` 只读属性,返回实例化此客户端时传入的 protocol 的值
* `url` 只读属性,返回实例化此客户端时传入的 url 的值
* `ready​State` 返回 ws 客户端当前的连接状态,各值对应含义如下:
  * `0` 连接中,CONNECTING
  * `1` 连接成功,OPEN
  * `2` 连接正在关闭,CLOSING
  * `3` 连接已关闭, CLOSED



