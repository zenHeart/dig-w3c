# WebView 检测

> 讨论如何检测当前页面运行在移动端 App WebView 中，而非独立浏览器

## 背景

移动端 WebView 是嵌入在原生 App 中的 Web 渲染引擎，广泛应用于：
- 社交 App 内置浏览器（微信、微博、小红书）
- 电商 App 商品详情页
- 跨平台 Hybrid App（React Native、Flutter WebView）

识别 WebView 环境对以下场景至关重要：
- 禁用某些浏览器 API（如 `navigator.share` 在部分 WebView 中行为不同）
- 调整 UI 以适应 WebView 特有的导航栏和安全区域
- 埋点分析 App vs 浏览器流量来源
- 绕过 WebView 限制（如文件选择、摄像头权限）

---

## 一、各平台 WebView UA 字符串对照表

### 1.1 基础平台

#### iOS WKWebView

**iOS Safari:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```

**iOS WKWebView（App 内嵌，未修改 UA）:**  
与 Safari 基本一致，无法单从 UA 区分：
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```

#### Android WebView

**Chrome 浏览器（Android）:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36
```

**Android WebView（App 内嵌，未修改 UA）:**  
与 Chrome 浏览器基本一致：
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36
```

> ⚠️ **注意：** 自 Android 16 (Chrome 120+) 起，Android WebView 默认 UA 改为桌面版，以增强隐私：
> ```
> Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
> ```

---

### 1.2 社交 App WebView

#### 微信（WeChat）

**iOS 微信 WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.48(0x18003030) NetType/WIFI Language/zh_CN
```

**Android 微信 WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.33 Mobile Safari/537.36 MicroMessenger/8.0.48.2560(0x28003037) NetType/WIFI Language/zh_CN
```

**特征关键词:** `MicroMessenger/`

---

#### 微博（Weibo）

**iOS 微博 WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone10,3__weibo__7.99.0__iphone__os17.0__zh_CN__zh_CN)
```

**Android 微博 WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 Weibo (Xiaomi_M2004jaby__weibo__7.99.0__android__zh_CN__zh_CN)
```

**特征关键词:** `Weibo`

---

#### 小红书（Xiaohongshu）

**iOS 小红书 WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 AppFramework/7.99.0 RN/0.72.8小红书/7.99.0
```

**Android 小红书 WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.33 Mobile Safari/537.36  小红书/7.99.0 ( Xiaotuxian App/7.99.0; Android 10;zh_CN )
```

**特征关键词:** `小红书` 或 `Xiaotuxian`

---

#### Twitter / X

**iOS Twitter App WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone
```

**Android Twitter App WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Twitter for Android
```

**特征关键词:** `Twitter for iPhone` / `Twitter for Android`

---

#### Facebook

**iOS Facebook App WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBAV/600.0.0.0.0]; FBAV/600.0.0.0.0
```

**Android Facebook App WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 [FBAN/FBAV/600.0.0.0.0]
```

**特征关键词:** `[FBAN/FBAV` 或 `FBAN/FBAV`

---

#### Instagram

**iOS Instagram WebView:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.0.0 (iPhone10,3 __iphone12,3__zh_CN)
```

**Android Instagram WebView:**
```
Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Instagram 300.0.0.0.0 (Android 10; Redmi 8 Prozh_CN)
```

**特征关键词:** `Instagram`

---

### 1.3 App WebView UA 特征速查表

| App | iOS 特征 | Android 特征 |
|-----|---------|-------------|
| 微信 | `MicroMessenger/` | `MicroMessenger/` |
| 微博 | `Weibo` | `Weibo` |
| 小红书 | `小红书` / `Xiaotuxian` | `小红书` / `Xiaotuxian` |
| Twitter/X | `Twitter for iPhone` | `Twitter for Android` |
| Facebook | `FBAN/FBAV` 或 `[FBAN/FBAV` | `[FBAN/FBAV` |
| Instagram | `Instagram` | `Instagram` |
| QQ | `QQ/` | `QQ/` |
| 百度 | `BaiduApp` | `BaiduApp` |
| 支付宝 | `AlipayClient` | `AlipayClient` |
| 淘宝 | `AliApp(` | `AliApp(` |

---

## 二、检测原理与 isWebView() 实现

### 2.1 检测策略

WebView 检测通常依赖以下几种手段：

#### 策略 1: UA 字符串特征匹配（最常用）

检查 `navigator.userAgent` 中是否包含特定 App 标识符。

```javascript
function isWebView() {
  const ua = navigator.userAgent;
  
  // 微信
  if (/MicroMessenger/.test(ua)) return { is: true, name: 'wechat' };
  
  // 微博
  if (/Weibo/.test(ua)) return { is: true, name: 'weibo' };
  
  // 小红书
  if (/小红书|Xiaotuxian/.test(ua)) return { is: true, name: 'xiaohongshu' };
  
  // Twitter / X
  if (/Twitter for iPhone|Twitter for Android/.test(ua)) return { is: true, name: 'twitter' };
  
  // Facebook
  if (/FBAN\/FBAV|\[FBAN\/FBAV/.test(ua)) return { is: true, name: 'facebook' };
  
  // Instagram
  if (/Instagram/.test(ua)) return { is: true, name: 'instagram' };
  
  // QQ
  if (/QQ\//.test(ua)) return { is: true, name: 'qq' };
  
  // 支付宝
  if (/AlipayClient/.test(ua)) return { is: true, name: 'alipay' };
  
  // 淘宝/天猫
  if (/AliApp\(/.test(ua)) return { is: true, name: 'taobao' };
  
  return { is: false, name: null };
}
```

#### 策略 2: 平台与浏览器特性检测

区分 iOS WKWebView 与 Safari（两者 UA 几乎相同）：

```javascript
// iOS WKWebView 检测：没有某些 Safari 特有对象
function isIOSWKWebView() {
  if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) return false;
  
  // Safari 有 universal search provider，WKWebView 没有
  const hasSearchProvider = window.getComputedStyle(
    document.documentElement
  ).getPropertyValue('-webkit-search-decoration') !== undefined;
  
  // 或者检查 WebKit 媒体查询支持差异
  return !hasSearchProvider && /AppleWebKit/.test(navigator.userAgent);
}
```

#### 策略 3: Android WebView 检测

```javascript
// Android WebView 检测（基于 webkit 头）
function isAndroidWebView() {
  if (!/Android/.test(navigator.userAgent)) return false;
  
  // Android Chrome 有 "Chrome/" 版本号
  // Android WebView 可能只有 "Chrome/" 但不带具体版本
  const webkitMatch = navigator.userAgent.match(/AppleWebKit\/(\d+)/);
  if (!webkitMatch) return false;
  
  // 检查是否有 Chrome token
  const hasChromeToken = /Chrome\/\d+/.test(navigator.userAgent);
  
  // Android 16+ 简化了 UA，更难区分
  // 可以结合 webview 特定 API 辅助判断
  return !hasChromeToken || /wv/.test(navigator.userAgent);
}
```

#### 策略 4: App 注入的 JS 接口（深度检测）

部分 App WebView 会向 window 注入特定对象：

```javascript
function detectInjectedInterfaces() {
  const interfaces = [
    'WeixinJSCore',           // 微信 JSSDK
    'WXWebviewObject',        // 微信早期
    'TBAppJsInterface',       // 淘宝
    'AlipayJsInterface',      // 支付宝
    'webkit.messageHandlers.cordova', // Cordova
    'ReactNativeWebView',     // React Native
  ];
  
  for (const name of interfaces) {
    if (window[name] !== undefined) {
      return { is: true, interface: name };
    }
  }
  
  return { is: false, interface: null };
}
```

---

### 2.2 完整 isWebView() 函数

综合上述策略，实现一个健壮的检测函数：

```javascript
/**
 * 检测当前环境是否为 App WebView
 * @returns {Object} { is: boolean, name: string|null, platform: string|null }
 */
function isWebView() {
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  
  // ---- App 特征 UA 检测 ----
  const patterns = [
    // 微信
    { regex: /MicroMessenger\//, name: 'wechat', platform: 'ios|android' },
    // 微博
    { regex: /Weibo/i, name: 'weibo', platform: 'ios|android' },
    // 小红书
    { regex: /小红书|Xiaotuxian/i, name: 'xiaohongshu', platform: 'ios|android' },
    // Twitter / X
    { regex: /Twitter for iPhone|Twitter for Android/i, name: 'twitter', platform: 'ios|android' },
    // Facebook
    { regex: /FBAN\/FBAV|\[FBAN\/FBAV/i, name: 'facebook', platform: 'ios|android' },
    // Instagram
    { regex: /Instagram/i, name: 'instagram', platform: 'ios|android' },
    // QQ
    { regex: /QQ\//i, name: 'qq', platform: 'ios|android' },
    // 支付宝
    { regex: /AlipayClient/i, name: 'alipay', platform: 'ios|android' },
    // 淘宝/天猫
    { regex: /AliApp\(/i, name: 'taobao', platform: 'ios|android' },
    // 京东
    { regex: /JDJR|JingDong/i, name: 'jd', platform: 'ios|android' },
    // 百度
    { regex: /BaiduApp/i, name: 'baidu', platform: 'ios|android' },
  ];
  
  for (const p of patterns) {
    if (p.regex.test(ua)) {
      const platform = /iPhone|iPad|iPod/.test(ua) ? 'ios' : 
                       /Android/.test(ua) ? 'android' : 'unknown';
      return { is: true, name: p.name, platform };
    }
  }
  
  // ---- iOS WKWebView 特殊检测 ----
  if (/iPhone|iPad|iPod/.test(ua)) {
    // WKWebView vs Safari: 检查 Safari 特有的 CSS 特性
    const div = document.createElement('div');
    div.style.cssText = '-webkit-appearance:search-decoration';
    const hasSearchDecoration = div.style.webkitAppearance !== '';
    
    if (hasSearchDecoration === false && /AppleWebKit/.test(ua)) {
      // Safari 有这个特性，WKWebView 默认没有（除非 App 自定义）
      return { is: true, name: 'wkwebview', platform: 'ios' };
    }
  }
  
  // ---- Android WebView 检测 ----
  if (/Android/.test(ua)) {
    // wv 参数表示 WebView
    if (/wv/.test(ua)) {
      return { is: true, name: 'android-webview', platform: 'android' };
    }
    
    // Android 16+ 简化 UA，检查 webkit 版本 + 缺少 Chrome 详细版本
    const webkitMatch = ua.match(/AppleWebKit\/(\d+)/);
    if (webkitMatch && parseInt(webkitMatch[1]) >= 537) {
      // 检查是否有精确的 Chrome 版本
      const chromeMatch = ua.match(/Chrome\/(\d+)/);
      if (!chromeMatch || parseInt(chromeMatch[1]) < 30) {
        // Android WebView 通常没有精确的 Chrome 版本
        return { is: true, name: 'android-webview', platform: 'android' };
      }
    }
  }
  
  // ---- 注入接口检测 ----
  const injectedInterfaces = [
    'WeixinJSCore', 'WXWebviewObject', 'TBAppJsInterface',
    'AlipayJsInterface', 'ReactNativeWebView', 'TBappJsInterface'
  ];
  for (const name of injectedInterfaces) {
    if (window[name] !== undefined) {
      return { is: true, name: name.toLowerCase().replace('jsinterface', ''), platform: 'app' };
    }
  }
  
  return { is: false, name: null, platform: null };
}
```

---

## 三、is-webview 工具库原理分析

npm 上的 `is-webview` 库（wuliqiangqiang/is-webview）采用类似的 UA 特征匹配策略：

```javascript
// 简化版原理
function isWebView(ua) {
  ua = ua || navigator.userAgent;
  
  const webviews = {
    // 国内 App
    MicroMessenger: /MicroMessenger\//,
    Weibo: /Weibo/,
    Xiaotuxian: /Xiaotuxian/,
    QQ: /QQ\//,
    // 海外 App
    Twitter: /Twitter for iPhone/,
    Facebook: /FBAN\/FBAV/,
    Instagram: /Instagram/,
    // 其他
    Android: /Android.*AppleWebKit\/537.36.*Chrome/,
    iOS: /iPhone.*AppleWebKit\/.*Version\/.*Safari/,
  };
  
  const list = [];
  for (const [name, regex] of Object.entries(webviews)) {
    if (regex.test(ua)) {
      list.push(name);
    }
  }
  
  return {
    isWebView: list.length > 0,
    names: list,
    isIOS: /iPhone|iPad|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
  };
}
```

**局限性：**
1. UA 字符串可以被 App 任意修改（开发者可自定义 UA）
2. iOS WKWebView 与 Safari UA 几乎相同，难以可靠区分
3. Android 16+ WebView UA 进一步简化，检测更困难
4. 建议结合业务场景综合判断，不依赖单一检测方式

---

## 四、实战建议

### 4.1 检测场景推荐

| 场景 | 推荐方案 |
|------|---------|
| 区分微信/微博/小红书 | UA 特征匹配 |
| 区分 App WebView vs 浏览器 | UA + 注入接口双重检测 |
| 区分 iOS Safari vs WKWebView | 不可靠，建议业务侧解决 |
| 区分 Android Chrome vs WebView | UA + webkit 版本号分析 |

### 4.2 注意事项

1. **不要完全依赖客户端检测** — 可被 Hook 绕过
2. **安全敏感的接口** — 配合后端验证
3. **渐进增强** — 检测失败时降级处理
4. **持续更新** — App 版本更新可能导致 UA 变化

### 4.3 Demo 演示

运行 `demo.html` 查看当前环境的实时检测结果。

---

## 五、参考

- [MDN: User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
- [Android WebView UA Reduction](https://android-developers.googleblog.com/2024/12/user-agent-reduction-on-android-webview.html)
- [WeChat WebView Adaptation](https://developers.weixin.qq.com/doc/service/en/guide/h5/adapt_ios.html)
