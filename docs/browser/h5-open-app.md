# H5 打开 APP 并判断 APP 是否安装

> 如何通过 H5 页面检测 APP 是否已安装，并拉起 APP 或引导用户下载。

## 背景

在 Hybrid 开发中，H5 页面经常需要与 Native APP 交互：
- **拉起 APP**：从 H5 跳转到 APP 的指定页面
- **判断安装状态**：检测用户设备是否安装了该 APP
- **兜底处理**：未安装时引导用户去应用市场下载

## 方案总览

| 方案 | 原理 | 兼容性 | 可靠性 |
|------|------|--------|--------|
| URL Scheme | 自定义协议 `myapp://` | 广泛 | ❌ 容易被劫持 |
| Universal Links (iOS) | HTTPS 关联域名 | iOS 9+ | ✅ 系统级 |
| App Links (Android) | HTTPS 关联域名 | Android 6+ | ✅ 系统级 |
| iframe + visibilitychange | 监听页面可见性变化 | 广泛 | ⚠️ 部分失效 |

---

## 1. URL Scheme（自定义协议）

### 原理

在 APP 中注册自定义 URL Scheme（如 `myapp://`），浏览器通过 `location.href` 或 `<a href="myapp://">` 跳转即可拉起 APP。

### APP 端注册（Native）

**iOS (Info.plist)**

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.example.myapp</string>
  </dict>
</array>
```

**Android (AndroidManifest.xml)**

```xml
<activity android:name=".MainActivity">
  <intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="myapp"/>
  </intent-filter>
</activity>
```

### H5 端调用

```js
// 直接跳转
window.location.href = 'myapp://path?param=value';

// 或使用 <a> 标签
// <a href="myapp://path">打开 APP</a>
```

### ❌ 缺陷：无法可靠检测是否安装

坊间流传的 `setTimeout` 兜底检测法不可靠：

```js
// ❌ 错误写法：无法准确判断
let opened = false;
window.location.href = 'myapp://';
setTimeout(() => {
  if (!opened) {
    // 假设未安装 → 弹下载
    alert('未安装，跳转下载');
  }
}, 1000);
```

**为什么失效？**
1. 无论是否安装，JS 代码都会继续执行，`setTimeout` 必定触发
2. 页面被后台挂起时（APP 成功拉起），计时器仍会执行
3. iOS Safari 从 iOS 9 开始会在 APP 拉起时**直接杀死 H5 页面**，计时器被中断——但这不代表"未安装"

---

## 2. iframe 尝试跳转 + visibilitychange 监听（改进方案）

### 原理

通过创建隐藏 iframe 尝试拉起 APP，然后监听页面可见性变化：
- 如果 APP 被拉起，H5 页面会被隐藏（`document.hidden = true`）
- 如果 APP 未安装，iframe 跳转失败，H5 页面保持可见

### 实现

```js
function openApp(urlScheme, downloadUrl) {
  const ifr = document.createElement('iframe');
  ifr.style.display = 'none';
  ifr.src = urlScheme;

  let timer = null;
  let fellBack = false;

  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    if (timer) clearTimeout(timer);
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      // 页面被隐藏 → APP 已拉起
      fallback(); // 清理 iframe
    } else {
      // 页面恢复可见 → APP 未安装，或用户切回来了
      // 等待一段时间后仍无隐藏，判定为未安装
      timer = setTimeout(fallback, 1500);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  document.body.appendChild(ifr);

  // 兜底定时器
  timer = setTimeout(fallback, 3000);

  // 清理函数（外部可调用）
  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (timer) clearTimeout(timer);
    if (ifr.parentNode) ifr.parentNode.removeChild(ifr);
  };
}

// 使用
const cleanup = openApp('myapp://home', 'https://example.com/download');
// 在适当时候调用 cleanup() 清理
```

### ⚠️ 局限性

| 环境 | 效果 |
|------|------|
| iOS Safari / UIWebView | ✅ 基本可靠 |
| iOS WKWebView (部分版本) | ⚠️ iframe src 可能不执行 |
| Android Chrome / WebView | ⚠️ 现代版本限制 iframe 跳转 |
| 微信 webview | ❌ 完全失效（见下文） |
| 企业微信 / 钉钉 | ❌ 同样限制 iframe |

---

## 3. Universal Links（iOS）/ App Links（Android）

### 原理

不再使用自定义协议，而是使用 HTTPS 链接：
- APP 与网站配置关联（通过 `/.well-known/apple-app-site-association` 或 `assetlinks.json`）
- 用户点击链接时，操作系统先检查 APP 是否关联该域名
- **已安装** → 拉起 APP，**未安装** → 打开网页

### APP 端配置

**iOS — apple-app-site-association 文件（托管在网站根目录）**

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.myapp"],
        "components": [
          {
            "/": "/open/*",
            "comment": "匹配 /open/ 下的所有路径"
          }
        ]
      }
    ]
  }
}
```

**Xcode 配置 entitlements**

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:yourdomain.com</string>
</array>
```

**Android — assetlinks.json（托管在 `.well-known/` 下）**

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.myapp",
      "sha256_cert_fingerprints": ["AA:BB:CC:..."]
    }
  }
]
```

**AndroidManifest.xml**

```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="https" android:host="yourdomain.com"/>
  </intent-filter>
</activity>
```

### H5 端调用

```js
// 只需打开普通 HTTPS 链接，操作系统自动处理
window.location.href = 'https://yourdomain.com/open/product/123';
```

### ✅ 优点

- **系统级**：不被浏览器劫持，不受 webview 限制
- **精确**：能区分"打开 APP"和"打开网页"
- **iOS Safari 完美支持**

### ❌ 缺点

- 需要 APP 和网站同时配合配置
- Android 兼容性参差不齐（各厂商魔改可能失效）
- 不支持传递自定义参数（需要通过 URL path/param 解决）

---

## 4. 微信内特殊处理

微信对大多数拉起 APP 的方案都做了限制，需要使用微信开放标签或微下载。

### 方案一：微信开放标签（需要认证）

已认证的公众号可使用微信开放标签 `wx-open-launch-app`：

```html
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

<wx-open-launch-app
  id="launch-btn"
  appid="wxxxxxxxx"
  extraData="{&quot;key&quot;:&quot;value&quot;}"
  xmlns:wx="http://www.wx.qq.com"
>
  <template>
    <button style="background:#07c160;color:#fff;padding:10px 20px;border:none;">
      打开 APP
    </button>
  </template>
</wx-open-launch-app>

<script>
  document.getElementById('launch-btn').addEventListener('launch', (e) => {
    console.log('APP 已拉起');
  });
  document.getElementById('launch-btn').addEventListener('error', (e) => {
    console.log('APP 未安装或不可用', e.detail);
    // 引导下载
    window.location.href = 'https://example.com/download';
  });
</script>
```

### 方案二：微下载（无需认证）

微信官方提供的 APP 拉起/下载中间页，适用于 Android：

```
https://common.jump.wxcmi.com/
```

iOS 可引导到 App Store 链接。

### 方案三： Universal Links（微信 7.0+ 支持）

微信 7.0 之后的版本支持 Universal Links，可在微信内直接拉起 APP：

```js
// 直接使用 HTTPS 链接，微信会自动尝试拉起关联 APP
window.location.href = 'https://yourdomain.com/open/product/123';
```

---

## 5. 综合最佳实践

### 推荐组合方案

```js
/**
 * 综合拉起 APP 函数
 * @param {Object} options
 * @param {string} options.scheme - URL Scheme（如 'myapp://'）
 * @param {string} options.universalLink - Universal Link / App Link（如 'https://yourdomain.com/open/'）
 * @param {string} options.packageName - Android 包名（可选，用于 App Links 验证）
 * @param {string} options.downloadUrl - 未安装时的下载链接
 * @param {number} options.timeout - 检测超时时间（ms），默认 2000
 */
function openAppOrFallback({
  scheme,
  universalLink,
  packageName,
  downloadUrl,
  timeout = 2000,
}) {
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isWeixin = /micromessenger/i.test(navigator.userAgent);

  // 优先使用 Universal Links / App Links（系统级，最可靠）
  if (isIOS && universalLink) {
    window.location.href = universalLink;
    // iOS Universal Links 未安装时会打开网页
    // 如果需要更精确的判断，建议在服务端做 302 重定向上判断
    setTimeout(() => {
      // 如果 2s 后页面还在（未跳转/未拉起），引导下载
      window.location.href = downloadUrl;
    }, timeout);
    return;
  }

  if (isAndroid && universalLink) {
    // Android App Links
    window.location.href = universalLink;
    // Android 没有页面自动打开网页的机制，需要借助 iframe
    const ifr = document.createElement('iframe');
    ifr.style.display = 'none';
    ifr.src = universalLink;
    document.body.appendChild(ifr);
    setTimeout(() => {
      if (document.hidden) return;
      // 未拉起，清理并跳转下载
      window.location.href = downloadUrl;
    }, timeout);
    return;
  }

  // 降级：URL Scheme + visibilitychange 兜底
  const cleanup = _openViaSchemeWithVisibility(scheme, downloadUrl, timeout);
  return cleanup;
}

function _openViaSchemeWithVisibility(scheme, downloadUrl, timeout) {
  const ifr = document.createElement('iframe');
  ifr.style.display = 'none';
  ifr.src = scheme;

  let fellBack = false;
  let timer = null;

  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    if (timer) clearTimeout(timer);
    if (downloadUrl) window.location.href = downloadUrl;
    document.removeEventListener('visibilitychange', onVisibility);
    if (ifr.parentNode) ifr.parentNode.removeChild(ifr);
  };

  const onVisibility = () => {
    if (document.hidden) {
      // APP 拉起成功，清理
      fallback();
    } else {
      timer = setTimeout(fallback, timeout);
    }
  };

  document.addEventListener('visibilitychange', onVisibility);
  document.body.appendChild(ifr);
  timer = setTimeout(fallback, timeout);

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    if (timer) clearTimeout(timer);
    if (ifr.parentNode) ifr.parentNode.removeChild(ifr);
  };
}
```

### 调用示例

```js
// iOS 优先 Universal Links
openAppOrFallback({
  scheme: 'myapp://',
  universalLink: 'https://yourdomain.com/open/',
  downloadUrl: 'https://itunes.apple.com/cn/app/myapp/id123456789',
});

// Android 优先 App Links
openAppOrFallback({
  scheme: 'myapp://',
  universalLink: 'https://yourdomain.com/open/',
  packageName: 'com.example.myapp',
  downloadUrl: 'https://example.com/myapp.apk',
});
```

---

## 6. 服务端配合：精确判断 APP 安装状态

通过服务端重定向逻辑，可以更精确地区分"拉起成功"和"打开网页"。

### 思路

1. H5 发起请求到 `https://yourdomain.com/open/?url=xxx`
2. 服务端检测 UA 和环境，返回：
   - **可拉起**：302 跳转到 APP 的 URL Scheme
   - **不可拉起**：200 返回一个 HTML，该 HTML 在 `window.onload` 时执行 `window.location` 到下载页

```js
// Node.js 示例
app.get('/open/', (req, res) => {
  const ua = req.headers['user-agent'];
  const referer = req.headers['referer'];

  // 检测环境
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isWeixin = /micromessenger/i.test(ua);

  if (isWeixin) {
    // 微信内，跳转微下载或开放标签页
    return res.redirect('https://common.jump.wxcmi.com/?appid=xxx');
  }

  if (isIOS) {
    // iOS，跳转 Universal Link
    // 如果 APP 未安装，iOS 会自动打开 App Store
    return res.redirect('myapp://open?url=' + encodeURIComponent(req.query.url));
  }

  if (isAndroid) {
    // Android，跳转 App Link
    return res.redirect('myapp://open?url=' + encodeURIComponent(req.query.url));
  }

  // 兜底：返回引导页
  res.send(`<!DOCTYPE html>
<html>
<body>
<script>
  window.location.href = '/download';
</script>
</body>
</html>`);
});
```

---

## 7. 常见问题

### Q：URL Scheme 会被劫持吗？

**会**。国内部分浏览器、第三方 APP 会拦截 `myapp://` 协议，伪装成"浏览器安全提示"引导用户下载仿冒 APP。Universal Links / App Links 使用 HTTPS 域名验证，无法被劫持。

### Q：为什么 setTimeout 无法准确判断？

因为 `setTimeout` 是 JS 定时器，无论 APP 是否被拉起都会执行。iOS Safari 拉起 APP 时会直接关闭页面（计时器中断），但这在 Android 和微信 webview 中不成立。正确做法是监听 `visibilitychange` 事件。

### Q：Android App Links 在国内为什么经常失效？

Android 碎片化严重，各手机厂商（华为、小米、OPPO 等）对 App Links 的实现不一致，部分厂商有额外的白名单校验。**Universal Links（iOS）可靠性远高于 App Links（Android）**。

### Q：如何传递参数给 APP？

| 方式 | 示例 | 说明 |
|------|------|------|
| URL Path | `myapp://open/product/123` | 路径参数 |
| URL Query | `myapp://open?productId=123` | 查询参数 |
| Universal Link 路径 | `https://domain.com/open/product/123` | 与 Path 相同 |

### Q：APP 如何解析 H5 传递的参数？

**iOS (Swift)**

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
  // url.scheme = "myapp"
  // url.host = "open"
  // url.path = "/product/123"
  // url.queryParameters?["productId"]
  return true
}

// SwiftUI / iOS 13+
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
  if let url = URLContexts.first?.url {
    print(url) // 处理 URL
  }
}
```

**Android (Kotlin)**

```kotlin
override fun onNewIntent(intent: Intent?) {
  super.onNewIntent(intent)
  intent?.data?.let { uri ->
    // uri.scheme = "myapp"
    // uri.host = "open"
    // uri.path = "/open/product/123"
    // uri.getQueryParameter("productId")
  }
}
```

---

## 参考

- [Apple: Supporting Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [Android: App Links](https://developer.android.com/training/app-links)
- [微信开放标签文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html)
- [Universal Links 深度解析](https://www.raymondcamden.com/2019/10/10/universal-links-and-how-ios-handles-them)
