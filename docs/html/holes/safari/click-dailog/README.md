# block pop up

在 safari 中如果不是用户行为触发的 window.open 会被拦截, 该行为来源于 safari 的安全策略，详见 [阻止 Safari 浏览器中的弹出式广告和窗口](https://support.apple.com/zh-cn/102524)，典型场景如下

1. 延迟打开页面，比如利用超时检测 custom schema link 的场景
2. 异步打开 window.open

safari 浏览器的行为如下

1. 如果配置了 `block pop-ups` 为打开，则移动和 web 端会静默此行为
   1. 移动端 safari 搜索 `block pop-ups`，配置开启会直接静默
   2. mac 配置详见 [pop ups](https://support.apple.com/zh-cn/guide/safari/sfri40696/mac)
2. 如果配置为关闭，则会弹出额外弹窗用户确认后才会再跳转

## 修复策略

不使用 window.open 通过自定义 modal 组件，利用动态添加一个重定向策略来跳转
