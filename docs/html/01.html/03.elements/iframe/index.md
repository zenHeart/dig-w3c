## MessageChannel 双 iframe 通信示例

本示例演示如何通过 MessageChannel 实现两个 iframe 间的直接通信。

### 目录结构

```
src/public/message-channel.html      # 主页面，包含两个 iframe
public-iframe/iframeA.html          # iframeA 页面
public-iframe/iframeB.html          # iframeB 页面
```

### 启动与体验

1. 启动主页面服务（3000端口）和 iframe 服务（4000端口）。
2. 访问 `http://localhost:3000/src/public/message-channel.html`
3. 点击“A -> B 发送消息”按钮，A 会通过 MessageChannel 发送消息到 B。
4. 在 B 页面点击“回复 A”按钮，可通过 MessageChannel 发送消息回 A。

### 关键代码说明

- 主页面创建 MessageChannel，将 port1 发送给 A，port2 发送给 B。
- 两个 iframe 页面通过 port.onmessage 监听消息，实现互通。

# iframe 同源与跨源通信示例

本示例通过 Koa 启动两个静态服务，分别以 public 和 public-iframe 目录为根，模拟不同端口下的 iframe 通信。

## 目录结构

```
iframe/
 public/
  index.html      # 主页面
 public-iframe/
## 启动服务
1. 安装依赖：
 ```bash
 ```

2. 启动主页面服务：

 ```bash
 ```

3. 启动 iframe 服务：

 ```bash
 ```

## 访问与体验

- 打开浏览器访问 `http://localhost:3000`
- 点击“向 iframe 发送消息”按钮，主页面会向 iframe 发送消息。
- 在 iframe 页面点击“回复主页面”按钮，iframe 会向主页面发送消息。

## 通信原理说明

- 主页面与 iframe 通过 `window.postMessage` 实现跨源通信。
- 两个服务分别监听 3000 和 4000 端口，模拟不同源环境。
- `postMessage` 的第二个参数为目标源，需严格指定。

# iframe

## 知识点

- iframe 和 mainFrame 通信
  - 同源，iframe 直接访问 `window.parent` 操作 mainFrame
  - 同源，iframe 通过 BroadcastChannel 通信
  - 同源/跨域
    - iframe 通过 `window.parent.postMessage` 发送消息给 mainFrame ，mainFrame 通过 `window.addEventListener('message', callback)` 监听消息
    - mainFrame 通过 `iframe.contentWindow.postMessage` 发送消息，iframe 通过 `window.addEventListener('message', callback)` 监听消息
    - MessageChannel
      - 通过 new MessageChannel() 创建一个消息通道，返回两个端口 port1 和 port2
      - 主窗口通过 `frame.contentWindow` 分发句斌
         ```js
         // 将 port2 发送给 B
         frameB.onload = () => {
            frameB.contentWindow.postMessage({type: 'port'}, '*', [channel.port2]);
         };
         // 将 port1 发送给 A
         frameA.onload = () => {
            frameA.contentWindow.postMessage({type: 'port'}, '*', [channel.port1]);
         };
         ```
      - 通过 port1 和 port2 进行双向通信
      - 调用 postMessage() 方法发送消息
      - **注意 MessageChannel 是点对点通信，不支持多播**
- 沙盒属性 [Iframe](https://web.dev/articles/sandboxed-iframes?hl=zh-cn)

- [嵌套 iframe](https://ciphrd.com/2021/02/10/iframe-feedback-a-fun-technique-with-iframes-on-the-web/)
