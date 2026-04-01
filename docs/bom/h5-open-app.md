# H5 判断 APP 是否安装及跳转方案

> 本文档梳理 H5 页面中判断 APP 是否已安装、并通过 URL Scheme / Universal Links / App Links 等机制打开 APP 的完整方案，涵盖各平台差异、常见踩坑和最佳实践。

---

## 目录

1. [概述：H5 与 APP 交互的核心机制](#1-概述h5-与-app-交互的核心机制)
2. [URL Scheme](#2-url-scheme)
3. [Universal Links (iOS) / App Links (Android)](#3-universal-links-ios--app-links-android)
4. [判断 APP 是否安装](#4-判断-app-是否安装)
5. [Hybrid 唤端完整方案](#5-hybrid-唤端完整方案)
6. [微信内特殊处理](#6-微信内特殊处理)
7. [常见踩坑与解决方案](#7-常见踩坑与解决方案)

---

## 1. 概述：H5 与 APP 交互的核心机制

### 1.1 核心思路

H5 唤起 APP 的本质是让浏览器通过 URL 协议（URL Scheme / Universal Links）启动一个 APP：

```
H5 页面 → 浏览器 → [URL Scheme / Universal Link] → APP
```

### 1.2 方案对比

| 方案 | iOS | Android | 微信内 | 可靠性 | 需 APP 配合 |
|------|-----|---------|--------|--------|------------|
| URL Scheme | ✅ | ✅ | ❌（被屏蔽） | 较低 | 是 |
| Universal Links | ✅ | ❌ | ❌（被屏蔽） | 高 | 是 |
| App Links | ❌ | ✅ | ❌（被屏蔽） | 高 | 是 |
| Chrome Intent | ❌ | ✅ | ❌ | 高 | 否 |
| iframe 跳转 | ✅（部分） | ✅ | ❌ | 低 | 否 |

---

## 2. URL Scheme

### 2.1 原理

URL Scheme 是自定义协议，让网页通过 `<a href="myapp://action">` 或 `location.href = "myapp://action"` 唤起 APP。

```html
<!-- HTML 中使用 -->
<a href="myapp://open?url=https://example.com">打开 APP</a>
```

### 2.2 APP 端注册 URL Scheme

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
注册后，`myapp://` 开头的 URL 都会路由到本 APP。

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

### 2.3 URL Scheme 格式

```js
// 基本格式
myapp://action

// 带参数
myapp://open?url=https%3A%2F%2Fexample.com&title=hello

// iOS Universal Link 格式对比
// https://app.example.com/open?url=... （真正的 https URL）
// myapp://open?url=... （自定义 scheme）
```

### 2.4 JavaScript 唤起 APP

```js
// 方式一：location.href
location.href = 'myapp://open?url=https://example.com';

// 方式二：iframe（避免当前页面跳转）
const iframe = document.createElement('iframe');
iframe.src = 'myapp://open?url=https://example.com';
iframe.style.display = 'none';
document.body.appendChild(iframe);

// 方式三：a 标签点击
const a = document.createElement('a');
a.href = 'myapp://open';
a.click();
```

---

## 3. Universal Links (iOS) / App Links (Android)

### 3.1 原理

Universal Links（iOS 9+）和 App Links（Android 6+）是真正的 HTTPS URL，比 URL Scheme 更安全可靠。

```
用户点击 https://app.example.com/open → 
  1. iOS 系统先向 app.example.com 请求 apple-app-site-association 文件
  2. 文件中声明了 APP 的 Team ID 和 Bundle ID
  3. 系统确认后直接启动 APP，绕过浏览器
```

### 3.2 APP 端配置

**iOS: apple-app-site-association 文件**
```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.app"],
        "components": [
          {
            "/": "/open",
            "comment": "打开 APP 指定页面"
          },
          {
            "/": "/share/*",
            "comment": "分享回调"
          }
        ]
      }
    ]
  }
}
```

将此文件部署到 `https://app.example.com/.well-known/apple-app-site-association`（或根目录）。

**Android: assetlinks.json**
```json
[{
  "relation": ["delegate_permission/common.handle_all_uris"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "14:6D:E9:...:3A:82"  // 签名证书 SHA256
    ]
  }
}]
```

将此文件部署到 `https://app.example.com/.well-known/assetlinks.json`。

### 3.3 对比 URL Scheme

| 特性 | URL Scheme | Universal Links / App Links |
|------|-----------|---------------------------|
| 格式 | `myapp://...` | `https://app.example.com/...` |
| 需用户确认 | 无 | 无（系统直接唤起） |
| 被劫持风险 | 高 | 低 |
| 微信内可用 | ❌ | ❌ |
| 需 HTTPS | 否 | 是 |
| APP 配置复杂 | 低 | 高 |

---

## 4. 判断 APP 是否安装

### 4.1 iframe/对象超时检测

```js
function isAppInstalled(scheme) {
  return new Promise((resolve) => {
    const start = Date.now();
    const iframe = document.createElement('iframe');
    iframe.src = scheme;
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    
    // 检测是否成功唤起（超时则视为未安装）
    setTimeout(() => {
      const elapsed = Date.now() - start;
      document.body.removeChild(iframe);
      
      // 如果时间很短（<200ms）通常是立即失败的（未安装）
      // 如果时间长（>1000ms）可能是成功唤起后页面被隐藏
      if (elapsed < 200) {
        resolve(false); // 快速失败 = 未安装
      } else {
        resolve(true); // 慢 = 可能安装了
      }
    }, 1500);
  });
}

// 使用
isAppInstalled('myapp://open').then(installed => {
  if (installed) {
    // 已安装
  } else {
    // 未安装，引导下载
  }
});
```

### 4.2 懒狗检测法（visibilitychange）

```js
function checkAppInstalled(scheme) {
  return new Promise((resolve) => {
    const visibilityChangeThreshold = 1000; // 毫秒
    let fireDate = null;
    
    const handler = () => {
      if (document.visibilityState === 'hidden') {
        fireDate = Date.now();
      } else if (fireDate !== null) {
        const elapsed = Date.now() - fireDate;
        document.removeEventListener('visibilitychange', handler);
        resolve(elapsed > visibilityChangeThreshold);
      }
    };
    
    document.addEventListener('visibilitychange', handler);
    
    // 尝试唤起
    const iframe = document.createElement('iframe');
    iframe.src = scheme;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // 超时兜底
    setTimeout(() => {
      if (fireDate === null) {
        document.removeEventListener('visibilitychange', handler);
        document.body.removeChild(iframe);
        resolve(false);
      }
    }, 2000);
  });
}
```

### 4.3 Android Chrome Intent 协议

```js
// Android Chrome 专用方案
function openAndroidApp(packageName) {
  const intentUrl = `intent://${packageName}/#Intent;scheme=${packageName};package=${packageName};end`;
  
  // 检测是否在 Android Chrome
  const isAndroidChrome = /Android/.test(navigator.userAgent) 
    && /Chrome/.test(navigator.userAgent);
  
  if (isAndroidChrome) {
    // Chrome 可以直接用 Intent
    location.href = intentUrl;
  } else {
    // 其他浏览器用 scheme
    location.href = `${packageName}://`;
  }
}

// 完整判断安装示例
function openAppOrDownload({ scheme, universalLink, packageName, downloadUrl }) {
  const isAndroid = /Android/.test(navigator.userAgent);
  
  // 判断是 PC 还是 Mobile
  const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
  
  if (!isMobile) {
    // PC 端直接跳转下载
    location.href = downloadUrl;
    return;
  }
  
  // 移动端尝试唤起
  const link = isAndroid 
    ? `intent://${packageName}/#Intent;scheme=${packageName};package=${packageName};end`
    : universalLink;
  
  const start = Date.now();
  location.href = link;
  
  // 2秒后检测是否成功
  setTimeout(() => {
    if (Date.now() - start < 2000) {
      // 未成功，下载
      location.href = downloadUrl;
    }
  }, 2000);
}
```

---

## 5. Hybrid 唤端完整方案

### 5.1 完整实现

```js
class AppBridge {
  constructor({ scheme, universalLink, appLink, packageName, downloadUrl }) {
    this.scheme = scheme;
    this.universalLink = universalLink;
    this.appLink = appLink;
    this.packageName = packageName;
    this.downloadUrl = downloadUrl;
  }
  
  // 核心唤起逻辑
  open(params = {}) {
    const { fallback = true } = params;
    
    // 1. 优先使用 Universal Link / App Link
    // 2. 其次使用 URL Scheme
    // 3. 最后跳应用商店
    
    const link = this.getOpenLink(params);
    
    if (fallback) {
      this.openWithFallback(link);
    } else {
      location.href = link;
    }
  }
  
  getOpenLink(params = {}) {
    const isAndroid = /Android/.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isWechat = /MicroMessenger/.test(navigator.userAgent);
    const isQQ = /QQ\//.test(navigator.userAgent);
    
    // Android 优先 App Links
    if (isAndroid && !isWechat && !isQQ) {
      return this.appLink || this.scheme;
    }
    
    // iOS 优先 Universal Links
    if (isIOS && !isWechat && !isQQ) {
      return this.universalLink || this.scheme;
    }
    
    // 降级到 URL Scheme
    return this.scheme;
  }
  
  openWithFallback(link) {
    const start = Date.now();
    const TIMEOUT = 2000;
    
    // 尝试唤起
    location.href = link;
    
    // 检测唤起结果
    const timer = setInterval(() => {
      if (Date.now() - start > TIMEOUT) {
        clearInterval(timer);
        
        // 检查是否还在当前页面
        if (!document.hidden) {
          // 未成功跳转，跳下载
          if (this.downloadUrl) {
            location.href = this.downloadUrl;
          } else {
            this.openStorePage();
          }
        }
      }
    }, 100);
  }
  
  openStorePage() {
    const isAndroid = /Android/.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    if (isAndroid) {
      // Google Play
      location.href = `https://play.google.com/store/apps/details?id=${this.packageName}`;
    } else if (isIOS) {
      // App Store
      location.href = `itms-apps://itunes.apple.com/app/id${this.appId}`;
    }
  }
}

// 使用
const bridge = new AppBridge({
  scheme: 'myapp://open',
  universalLink: 'https://app.example.com/open',
  appLink: 'https://app.example.com/open',
  packageName: 'com.example.myapp',
  downloadUrl: 'https://example.com/download'
});

bridge.open({ param1: 'value1' });
```

### 5.2 参数传递

```js
// H5 → APP 传递参数

// URL Scheme 方式
// myapp://open?userId=123&token=abc
// 注意：特殊字符需 URL 编码

const params = {
  userId: '123',
  token: 'abc123',
  url: 'https://example.com/page' // 需编码
};
const query = Object.entries(params)
  .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  .join('&');

bridge.open({ extra: query });

// Universal Link 方式
// 参数直接放在 query string 中
bridge.open({ extra: `userId=123` });
```

---

## 6. 微信内特殊处理

### 6.1 微信的限制

微信内置浏览器屏蔽了大多数唤起 APP 的方案，包括：
- URL Scheme（完全屏蔽）
- Universal Links / App Links（iOS Safari 可用，微信内不可用）
- iframe 跳转（被拦截）

### 6.2 微信内可用方案

**方案一：微信开放标签（wx-open）**

```html
<!-- 需引入微信 JSSDK -->
<script src="//res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

<wx-open-launch-app 
  appid="wx1234567890" 
  extinfo="your-extinfo">
  <template>
    <button style="width:100px;height:40px;">打开 APP</button>
  </template>
</wx-open-launch-app>

<script>
  wx.config({
    jsApiList: ['wx-open-launch-app'],
    openTagList: ['wx-open-launch-app']
  });
</script>
```

**方案二：微下载（腾讯内部应用）**

对于腾讯系应用（如微信支付），可以使用腾讯提供的 SDK 跳转。

**方案三：引导用户浏览器打开**

```html
<!-- 提示用户用浏览器打开 -->
<div class="guide-browser">
  <p>请点击右上角「···」→「在浏览器中打开」</p>
  <button onclick="copyLink()">复制链接</button>
</div>
```

**方案四：Universal Link 降级**

iOS 微信 9.0 后部分场景支持通过 Universal Link 唤起（需微信开放能力配置）。

---

## 7. 常见踩坑与解决方案

### 7.1 iOS Safari URL Scheme 限制

```js
// ⚠️ iOS Safari 9+ 要求用户点击才能触发 URL Scheme
// 在 load/ready 事件中直接设置 location.href 会被屏蔽

// ❌ 错误：load 时直接跳转
window.onload = () => {
  location.href = 'myapp://open'; // 无效！
};

// ✅ 正确：用户点击触发
button.onclick = () => {
  location.href = 'myapp://open';
};
```

### 7.2 Android Intent 兼容性问题

```js
// ⚠️ Android Chrome Intent 格式变化
// 新格式（推荐）
const intent = `intent://example.com/#Intent;scheme=myapp;package=com.example;end`;

// ⚠️ 部分国产浏览器不识别 Intent
// 降级处理
if (/Chrome/.test(navigator.userAgent)) {
  location.href = intent;
} else {
  location.href = 'myapp://open';
}
```

### 7.3 唤起后 H5 页面被回收

```js
// ⚠️ 成功唤起 APP 后，H5 页面被隐藏
// 但如果 APP 未安装，页面还在，用户体验很差

// ✅ 解决方案：设置 timeout
const openTimer = setTimeout(() => {
  // 超时了，说明可能未安装（或者页面被隐藏了）
  // 此时可以尝试跳转应用商店
  if (!document.hidden) {
    location.href = appStoreUrl;
  }
}, 2000);

// ✅ 在页面可见性变化时清除定时器
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    clearTimeout(openTimer);
  }
});
```

### 7.4 Universal Link 在 iOS 13+ 的变化

```js
// ⚠️ iOS 13+ 中，如果 Universal Link 唤起失败
// 系统会回退到在当前 WKWebView 中加载这个 URL
// 这会导致页面被替换

// ✅ 解决方案：检测是否是 Universal Link 回退
function isUniversalLinkFallback() {
  return /.*\.apple\.com\/.*/.test(location.hostname);
}

// 如果是回退，手动跳转 App Store
if (isUniversalLinkFallback()) {
  location.replace('itms-apps://...');
}
```

### 7.5 Android 11+ 隐私限制

```js
// ⚠️ Android 11 (API 30+) 限制了不可列举的包名
// 如果不知道 APP 完整包名，无法直接通过 Intent 唤起

// ✅ 解决方案：APP 端配置 query 声明
// AndroidManifest.xml
/*
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="myapp"/>
  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW"/>
      <data android:scheme="https"/>
    </intent>
  </queries>
</intent-filter>
*/
```

---

## 参考资料

- [Apple Developer: Universal Links](https://developer.apple.com/documentation/technotes/tn3155-implementing-universal-links-in-your-app)
- [Android Developer: App Links](https://developer.android.com/training/app-links)
- [Chrome Intent URL](https://developer.chrome.com/blog/improved-pwa-in-navigation-and-origin-requests)
- [MDN: URL Scheme](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#origin)
- [微信开放标签文档](https://developers.weixin.qq.com/docoplatform/open-ability/instruction-point-document.html)
