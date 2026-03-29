# input[type=number] 负值和非法数值的最优处理策略

> 前端数字输入最常见的需求之一：禁止负数、过滤非法字符、保证数值范围。本文梳理从 HTML 原生到 JavaScript 的完整策略。

## 1. 问题背景

### 1.1 input[type=number] 的内置验证机制

浏览器为 `<input type="number">` 提供了内置验证能力：

| 特性 | 说明 |
|------|------|
| `min` | 最小值 |
| `max` | 最大值 |
| `step` | 递进增量 |
| 合法性伪类 | `:valid` / `:invalid` |

```html
<input type="number" min="0" max="100" step="1">
```

### 1.2 为什么单纯依赖浏览器验证不够

- **体验问题**：用户可以输入负号和小数点，输入过程中不会阻止
- **科学计数法**：`1e5`、`1E-3` 会被接受
- **精度问题**：浮点数精度丢失（`0.1 + 0.2 !== 0.3`）
- **边界情况**：`1.5` 在 `step=1` 时被认为无效，但用户仍可输入
- **移动端**：键盘直接输入，无法拦截
- **复制粘贴**：粘贴内容不受 onkeydown 拦截

> **结论**：HTML 属性是基础保障，JavaScript 是必要补充。

---

## 2. 核心处理策略

### 策略一：min 属性（禁止负数）

最简单的方式，直接从 UI 层面限制：

```html
<input type="number" min="0">
```

- 浏览器会在提交时验证
- UI 上会禁用 `-` 键（部分浏览器）
- 配合 `step` 控制精度

```html
<!-- 整数 -->
<input type="number" min="0" step="1">

<!-- 货币（2位小数）-->
<input type="number" min="0" step="0.01">
```

### 策略二：max 属性（上限控制）

配合 min 限制完整范围：

```html
<input type="number" min="0" max="999999" step="1">
```

### 策略三：JavaScript 输入拦截

#### onkeydown 层级拦截

```js
input.addEventListener('keydown', (e) => {
  // 阻止负号
  if (e.key === '-') {
    e.preventDefault();
    return;
  }
  // 允许数字、小数点、方向键等
  if (!/[\d.]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault();
  }
});
```

#### oninput 实时过滤

```js
input.addEventListener('input', (e) => {
  let value = e.target.value;
  
  // 移除已输入的负号
  if (value.includes('-')) {
    e.target.value = value.replace(/-/g, '');
  }
  
  // 移除科学计数法
  if (/[eE]/.test(value)) {
    e.target.value = value.replace(/[eE]/g, '');
  }
});
```

#### onblur 离开时校正

```js
input.addEventListener('blur', (e) => {
  let value = parseFloat(e.target.value);
  
  if (isNaN(value) || value < 0) {
    e.target.value = '';
    // 或设置为默认值
    // e.target.value = 0;
  }
});
```

### 策略四：step 验证

```html
<input type="number" min="0" step="1">
```

`step` 配合 `min` 决定了有效值的集合：`min, min+step, min+2*step, ...`

- `step=1`：只能是整数
- `step=0.01`：2 位小数
- `step=any`：接受任意小数

### 策略五：完整防注入方案

```js
/**
 * 净化数字输入
 * @param {string|number} value - 输入值
 * @param {Object} options - 配置项
 * @param {number} options.min - 最小值，默认 -Infinity
 * @param {number} options.max - 最大值，默认 Infinity
 * @param {boolean} options.allowFloat - 是否允许小数，默认 true
 * @param {number} options.decimalDigits - 小数位数，默认不限制
 * @param {number} options.defaultValue - 非法值时的默认值，默认 ''
 */
function sanitizeNumberInput(value, options = {}) {
  const {
    min = -Infinity,
    max = Infinity,
    allowFloat = true,
    decimalDigits = null,
    defaultValue = ''
  } = options;

  // 1. 转字符串并移除科学计数法符号
  let str = String(value).replace(/[eE]/g, '').trim();
  
  if (!str || str === '-') return defaultValue;

  // 2. 移除非数字字符（保留小数点和负号）
  const allowedPattern = allowFloat ? /[^0-9.-]/g : /[^0-9-]/g;
  str = str.replace(allowedPattern, '');

  // 3. 解析数字
  let num = allowFloat ? parseFloat(str) : parseInt(str, 10);

  // 4. 处理 NaN
  if (isNaN(num)) return defaultValue;

  // 5. 范围限制
  num = Math.max(min, Math.min(max, num));

  // 6. 小数位数限制
  if (decimalDigits !== null) {
    num = parseFloat(num.toFixed(decimalDigits));
  }

  return num;
}
```

---

## 3. 负数检测与阻止

| 场景 | 方法 | 优点 | 缺点 |
|------|------|------|------|
| 键盘按下 | `onkeydown` 检测 `-` 键 | 即时阻止 | 无法拦截粘贴 |
| 实时过滤 | `oninput` 移除负号 | 处理粘贴 | 用户可能看到闪烁 |
| 离开校正 | `onblur` 校正为 0 或清空 | 彻底 | 最后一刻才反馈 |

**推荐组合**：`onkeydown` + `onblur`

```js
input.addEventListener('keydown', (e) => {
  if (e.key === '-') e.preventDefault();
});

input.addEventListener('blur', (e) => {
  if (parseFloat(e.target.value) < 0) {
    e.target.value = '';
  }
});
```

---

## 4. 非法数值处理

### 4.1 常见非法值处理

| 输入 | 处理方式 |
|------|----------|
| `NaN` | 返回空字符串或默认值 |
| `Infinity` | 通过 `max` 限制 |
| `1e5` / `1E-3` | 过滤 `e` / `E` 字符 |
| `1.2.3` | `parseFloat` 截断为 `1.2` |
| `-0` | 判断后转为 `0` |

### 4.2 过滤科学计数法

```js
function removeScientificNotation(value) {
  return String(value).replace(/[eE][+-]?\d+/g, '');
}
```

### 4.3 去除首位零

```js
function normalizeNumber(value) {
  let num = parseFloat(value);
  if (num === 0) return 0;
  return num;
}
```

---

## 5. 最佳实践

### 5.1 组合策略推荐

```
HTML 层：min + max + step（基础保障）
         ↓
JS 层：onkeydown 拦截 + oninput 过滤（体验优化）
         ↓
JS 层：onblur 最终校正（兜底处理）
```

### 5.2 实时反馈 vs 离开校正

| 场景 | 推荐策略 |
|------|----------|
| 表单必填 | 实时反馈 + 红色边框 |
| 金额输入 | 离开校正 + 确认提示 |
| 搜索框 | 轻量过滤，不打断输入 |

### 5.3 移动端兼容性

- iOS Safari：数字键盘使用 `inputmode="numeric"`
- Android：部分浏览器支持 `pattern="\d*"`
- 粘贴拦截：必须依赖 `oninput`

```html
<input type="number" min="0" inputmode="numeric" pattern="\d*">
```

### 5.4 屏幕阅读器无障碍性

- 使用 `<label>` 关联输入框
- 使用 `aria-describedby` 说明限制
- 验证失败时设置 `aria-invalid="true"`

```html
<label for="price">价格（仅正值）</label>
<input 
  type="number" 
  id="price" 
  min="0" 
  step="0.01"
  aria-describedby="price-hint"
>
<span id="price-hint">请输入大于等于 0 的数字</span>
```

---

## 6. 完整示例

### 6.1 基础版本

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>数字输入验证 - 基础版</title>
  <style>
    input[type="number"] {
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      width: 200px;
    }
    input[type="number"]:focus {
      border-color: #007bff;
      outline: none;
    }
    input[type="number"].invalid {
      border-color: #dc3545;
      background: #fff8f8;
    }
  </style>
</head>
<body>
  <h1>基础验证</h1>
  
  <label>
    数量（整数，≥0）：
    <input 
      type="number" 
      id="quantity" 
      min="0" 
      step="1"
      placeholder="请输入数量"
    >
  </label>

  <script>
    const input = document.getElementById('quantity');
    
    // 阻止负号键
    input.addEventListener('keydown', (e) => {
      if (e.key === '-') e.preventDefault();
    });
    
    // 过滤非法字符
    input.addEventListener('input', (e) => {
      let value = e.target.value;
      
      // 移除负号
      if (value < 0 || value.includes('-')) {
        e.target.value = value.replace(/-/g, '');
      }
      
      // 移除科学计数法
      if (/[eE]/.test(value)) {
        e.target.value = value.replace(/[eE]/g, '');
      }
    });
    
    // 离开时校正
    input.addEventListener('blur', (e) => {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 0) {
        e.target.value = '';
      }
    });
  </script>
</body>
</html>
```

### 6.2 增强版本（带验证反馈）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>数字输入验证 - 增强版</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    
    .form-group { margin-bottom: 20px; }
    
    label { display: block; margin-bottom: 6px; font-weight: 500; }
    
    input[type="number"] {
      padding: 10px 14px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    
    input[type="number"]:focus {
      border-color: #007bff;
    }
    
    input[type="number"].invalid {
      border-color: #dc3545;
      background: #fff8f8;
    }
    
    input[type="number"].valid {
      border-color: #28a745;
    }
    
    .hint { font-size: 12px; color: #666; margin-top: 4px; }
    .error-msg { font-size: 12px; color: #dc3545; margin-top: 4px; display: none; }
    input.invalid + .hint + .error-msg { display: block; }
  </style>
</head>
<body>
  <h1>增强验证</h1>
  
  <div class="form-group">
    <label for="price">价格（元）</label>
    <input 
      type="number" 
      id="price" 
      min="0" 
      step="0.01"
      placeholder="0.00"
      aria-describedby="price-hint price-error"
    >
    <div class="hint" id="price-hint">请输入 ≥ 0 的金额，最多 2 位小数</div>
    <div class="error-msg" id="price-error">请输入有效的金额</div>
  </div>

  <div class="form-group">
    <label for="quantity">数量（件）</label>
    <input 
      type="number" 
      id="quantity" 
      min="1" 
      max="9999"
      step="1"
      placeholder="1"
      aria-describedby="quantity-hint quantity-error"
    >
    <div class="hint" id="quantity-hint">请输入 1-9999 的整数</div>
    <div class="error-msg" id="quantity-error">请输入有效的数量</div>
  </div>

  <script>
    function createNumberInput(config) {
      const { id, min = -Infinity, max = Infinity, step = 1, allowFloat = true, defaultValue = '' } = config;
      const input = document.getElementById(id);
      
      input.addEventListener('keydown', (e) => {
        // 阻止负号
        if (e.key === '-') e.preventDefault();
        
        // 允许的键
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
        if (!/[\d.]/.test(e.key) && !allowed.includes(e.key)) {
          e.preventDefault();
        }
      });
      
      input.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // 过滤科学计数法
        value = value.replace(/[eE]/g, '');
        
        // 处理负号
        if (value < 0) {
          value = value.replace(/-/g, '');
        }
        
        // 限制小数位数
        const decimals = String(step).includes('.') 
          ? String(step).split('.')[1].length 
          : 0;
        if (decimals > 0 && value.includes('.')) {
          const [int, dec] = value.split('.');
          if (dec && dec.length > decimals) {
            value = int + '.' + dec.slice(0, decimals);
          }
        }
        
        e.target.value = value;
        validate();
      });
      
      input.addEventListener('blur', () => {
        const value = sanitizeNumberInput(input.value, { min, max, allowFloat, defaultValue });
        input.value = value;
        validate();
      });
      
      function validate() {
        const value = sanitizeNumberInput(input.value, { min, max, allowFloat, defaultValue });
        const isEmpty = input.value === '';
        const isValid = !isEmpty && !isNaN(value) && value >= min && value <= max;
        
        input.classList.remove('valid', 'invalid');
        if (!isEmpty) {
          input.classList.add(isValid ? 'valid' : 'invalid');
          input.setAttribute('aria-invalid', !isValid);
        }
      }
      
      return { input, validate };
    }
    
    // 初始化
    createNumberInput({ id: 'price', min: 0, step: 0.01, allowFloat: true });
    createNumberInput({ id: 'quantity', min: 1, max: 9999, step: 1, allowFloat: false, defaultValue: 1 });
  </script>
  <script src="../../utils/sanitize-number.js"></script>
</body>
</html>
```

### 6.3 Vue 组件示例

```vue
<template>
  <div class="number-input">
    <label v-if="label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      type="number"
      :value="displayValue"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
      :aria-describedby="hintId"
      @keydown="handleKeydown"
      @input="handleInput"
      @blur="handleBlur"
    >
    <span v-if="hint" :id="hintId" class="hint">{{ hint }}</span>
  </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    value: { type: Number, default: null },
    label: { type: String, default: '' },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    step: { type: Number, default: 1 },
    placeholder: { type: String, default: '' },
    hint: { type: String, default: '' },
  },
  data() {
    return { inputId: `num-${Math.random().toString(36).slice(2, 9)}` };
  },
  computed: {
    displayValue() {
      return this.value === null ? '' : this.value;
    },
    hintId() {
      return this.hint ? `${this.inputId}-hint` : null;
    },
  },
  methods: {
    handleKeydown(e) {
      if (e.key === '-') e.preventDefault();
    },
    handleInput(e) {
      let value = e.target.value.replace(/[eE]/g, '');
      if (value < 0) value = value.replace(/-/g, '');
      this.$emit('input', value === '' ? null : parseFloat(value));
    },
    handleBlur() {
      let value = this.value;
      if (value === null) return;
      value = Math.max(this.min, Math.min(this.max, value));
      this.$emit('input', value);
    },
  },
};
</script>
```

### 6.4 React Hook 示例

```jsx
import { useState, useCallback, useId } from 'react';

function useNumberInput({ 
  min = -Infinity, 
  max = Infinity, 
  step = 1, 
  allowFloat = true,
  defaultValue = null 
}) {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState(true);
  const inputId = useId();
  
  const sanitize = useCallback((raw) => {
    if (raw === '' || raw === '-') return defaultValue;
    let num = allowFloat ? parseFloat(raw) : parseInt(raw, 10);
    if (isNaN(num)) return defaultValue;
    num = Math.max(min, Math.min(max, num));
    return num;
  }, [min, max, allowFloat, defaultValue]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === '-') e.preventDefault();
  }, []);
  
  const handleChange = useCallback((e) => {
    let value = e.target.value.replace(/[eE]/g, '');
    if (value < 0) value = value.replace(/-/g, '');
    const num = sanitize(value);
    setValue(num);
    setIsValid(e.target.value === '' || !isNaN(num));
  }, [sanitize]);
  
  const handleBlur = useCallback(() => {
    const num = sanitize(value);
    setValue(num);
  }, [sanitize, value]);
  
  return {
    value,
    isValid,
    inputId,
    inputProps: {
      type: 'number',
      min,
      max,
      step,
      value: value ?? '',
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': !isValid,
    },
  };
}

// 使用示例
function PriceInput() {
  const { value, isValid, inputProps } = useNumberInput({
    min: 0,
    step: 0.01,
    allowFloat: true,
    defaultValue: null,
  });
  
  return (
    <div>
      <label htmlFor={inputProps.id}>价格</label>
      <input {...inputProps} id={inputProps.id} />
      {!isValid && <span>请输入有效数字</span>}
    </div>
  );
}
```

---

## 7. 总结

| 策略 | 适用场景 | 实现成本 |
|------|----------|----------|
| `min/max/step` | 基础验证 | ⭐ 零成本 |
| `onkeydown` | 阻止特定按键 | ⭐ 简单 |
| `oninput` | 实时过滤 | ⭐⭐ 中等 |
| `onblur` | 最终校正 | ⭐⭐ 中等 |
| 完整工具函数 | 复杂业务逻辑 | ⭐⭐⭐ 较高 |

**推荐组合**：
- 简单场景：`min="0" step="1"` + `onkeydown` 阻止负号
- 标准场景：+ `onblur` 校正 + 视觉反馈
- 复杂场景：完整工具函数 + 组件封装

---

*文档版本：v1.0.0 | 更新日期：2026-03-29*
