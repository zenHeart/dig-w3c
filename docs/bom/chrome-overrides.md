# Chrome DevTools Overrides 完全指南

> 本文详细介绍 Chrome DevTools Overrides 功能的使用方法、持久化原理及与 Workspace 的区别。

## 一、概念概述

### 1.1 Overrides 是什么？

Chrome DevTools Overrides（覆盖）功能允许将远程网络资源映射到本地文件，持久化保存修改后，刷新页面仍然生效。主要用于：

- 本地调试线上问题
- 临时修改线上样式/脚本
- 模拟 API 响应
- 绕过跨域限制进行调试

**核心特点**：

| 特点 | 说明 |
|------|------|
| 持久化 | 映射关系保存在 DevTools 内部，刷新后仍然有效 |
| 透明劫持 | 页面发起请求时，DevTools 拦截并返回本地文件 |
| 覆盖范围 | 可覆盖任何网络资源（HTML/CSS/JS/图片/字体等） |
| 与 Workspace 的区别 | Overrides 更适合临时调试，Workspace 适合开发阶段 |

---

## 二、启用 Overrides

### 2.1 操作步骤

1. 打开 Chrome DevTools（F12 或右键 → 检查）
2. 进入 **Sources** 面板
3. 点击 **Overrides** 标签（左侧导航栏）
4. 点击 **"+ Select folder for overrides"**
5. 选择一个本地目录作为覆盖文件存放位置
6. 浏览器弹出授权提示，确认允许写入

### 2.2 界面说明

```
Sources 面板
├── Page         # 页面资源树
├── Search       # 全局搜索
├── Snippets     # 代码片段
├── Overrides    # ← 覆盖文件管理
└── [Workspace]  # 工作区（可选）
```

**Overrides 面板元素**：

| 元素 | 说明 |
|------|------|
| 文件夹图标 | 点击可更改覆盖文件目录 |
| 勾选框 | 启用/禁用所有覆盖 |
| 文件列表 | 显示所有已覆盖的文件 |
| 右键菜单 | 删除/还原单个覆盖文件 |

---

## 三、覆盖文件

### 3.1 保存覆盖文件

1. 打开 **Network** 面板
2. 找到要覆盖的资源（右键点击）
3. 选择 **"Save for overrides"**
4. 文件自动保存到之前选择的覆盖目录
5. 修改本地文件内容
6. 刷新页面生效

### 3.2 覆盖单个文件

```
Network 面板
    └── xhr/foo.json        # 右键 → Save for overrides
    └── css/style.css       # 右键 → Save for overrides
    └── js/bundle.js       # 右键 → Save for overrides
```

### 3.3 查看覆盖状态

覆盖后的资源在 Network 面板中有以下标识：

| 标识 | 含义 |
|------|------|
| 紫色圆点 + overrides 图标 | 该资源使用了本地覆盖 |
| 绿色文字 "override" | 资源正被覆盖 |
| 橙色文字 "mismatched" | 本地文件与远程不一致 |

---

## 四、持久化原理

### 4.1 工作机制

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器请求                            │
│                     https://example.com/foo.js              │
└─────────────────────────────┬───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Chrome DevTools                          │
│                                                             │
│   1. 检查 Overrides 映射表                                  │
│      └─ 本地目录 + 远程 URL → 本地文件路径                   │
│                                                             │
│   2. 如果存在映射 → 返回本地文件内容                          │
│      如果不存在映射 → 发起真实网络请求                        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 映射表结构

DevTools 内部维护的映射关系：

```javascript
{
  "https://example.com/foo.js": "/Users/xxx/chrome-overrides/example.com/foo.js",
  "https://example.com/style.css": "/Users/xxx/chrome-overrides/example.com/style.css"
}
```

### 4.3 刷新行为

| 场景 | 行为 |
|------|------|
| 覆盖启用 + 本地文件存在 | 返回本地文件 |
| 覆盖启用 + 本地文件不存在 | 请求远程资源（自动清除映射） |
| 覆盖禁用 | 正常请求远程资源 |

---

## 五、与 Workspace 的区别

| 维度 | Overrides | Workspace |
|------|-----------|-----------|
| **用途** | 临时调试线上问题 | 日常开发 |
| **文件位置** | DevTools 内部映射 | 直接映射到页面路径 |
| **持久性** | 跨会话持久化 | 随工作区配置持久化 |
| **适合场景** | 线上 Bug 快速修复 | 项目开发调试 |
| **网络请求** | 仍然走 DevTools 拦截 | 真正替代远程资源 |

### 5.1 使用建议

- **临时调试线上问题** → 用 Overrides
- **日常开发** → 用 Workspace
- **需要版本控制** → 用 Workspace + Git
- **快速验证修复** → 用 Overrides

---

## 六、常见问题

### 6.1 覆盖不生效

**可能原因**：

| 原因 | 解决方法 |
|------|----------|
| Overrides 未启用 | 检查 Overrides 面板勾选状态 |
| 文件路径不匹配 | 确认本地文件路径与远程 URL 对应 |
| 缓存问题 | 勾选 "Disable cache" 或 Cmd+Shift+R 强制刷新 |
| Service Worker 拦截 | 在 Network 面板禁用 SW |

### 6.2 覆盖文件夹丢失

当清除浏览器数据时，Overrides 映射可能丢失。可通过以下方式预防：

1. 将覆盖文件纳入 Git 版本控制
2. 定期备份覆盖目录
3. 使用 Workspace 替代 Overrides

### 6.3 多人协作

Overrides 的映射信息保存在本地，不适合团队共享。建议：

1. 将修改后的本地文件推送到仓库
2. 使用 Git 分支管理修改
3. 通知团队成员已做的修改

---

## 七、实战案例

### 7.1 调试线上 CSS 问题

**场景**：线上样式错误，需要快速验证修复

**步骤**：

1. Network 面板找到 `style.css`
2. 右键 → Save for overrides
3. 修改本地 CSS 文件
4. 刷新页面，验证修复
5. 确认无误后，将修改同步到开发环境

### 7.2 模拟 API 响应

**场景**：后端接口未就绪，需要前端先行开发

**步骤**：

1. 在 Network 面板找到 API 请求
2. 右键 → Save for overrides
3. 修改本地 JSON 文件为期望的响应
4. 刷新页面，前端拿到模拟数据
5. 后端就绪后，移除覆盖，恢复正常请求

### 7.3 调试生产环境 JavaScript

**场景**：生产环境 JS 报错，本地无法复现

**步骤**：

1. Network 面板找到 `bundle.js`
2. 右键 → Save for overrides
3. 在本地文件中添加 `console.log` 或断点
4. 刷新页面，观察输出
5. 使用 "Continue to here" 跳过无关代码

---

## 八、参考资料

- [Chrome DevTools Updates: Overrides](https://developer.chrome.com/blog/new-in-devtools-65/#overrides)
- [Chrome DevTools Docs: Override web requests](https://developer.chrome.com/docs/devtools/resources/)
- [Workspace: Edit files with Persistence](https://developer.chrome.com/docs/devtools/workspaces/)
