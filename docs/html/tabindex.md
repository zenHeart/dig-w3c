# tabindex

> `tabindex` 鏄?HTML 鍏ㄥ眬灞炴€э紝鐢ㄤ簬鎺у埗鍏冪礌鍦?Tab 閿鑸腑鐨勯『搴忥紝鍐冲畾鐢ㄦ埛鎸?Tab 鏃剁劍鐐圭Щ鍔ㄧ殑璺緞銆?
[tabindex - HTML: 瓒呮枃鏈爣璁拌瑷€ | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/tabindex)

## 鍙栧€艰寖鍥?
| 鍙栧€?| 琛屼负 | 浣跨敤鍦烘櫙 |
|------|------|----------|
| `tabindex="0"` | 鍏冪礌鍙鑱氱劍锛屼笖鍙備笌鑷劧 Tab 椤哄簭 | 灏嗛潪浜や簰鍏冪礌鍙樹负鍙仛鐒?|
| `tabindex="-1"` | 鍏冪礌鍙鑱氱劍锛堥€氳繃 JS `focus()`锛夛紝浣嗕笉鍙備笌 Tab 閿亶鍘?| ARIA 閿洏鏀寔銆佺▼搴忓寲鑱氱劍 |
| `tabindex="1, 2, 3..."` | 鏄惧紡 Tab 椤哄簭锛堟鏁存暟鍊艰秺灏忥紝浼樺厛绾ц秺楂橈級 | **鉂?涓嶆帹鑽?* |

---

## 鏍稿績瑙勫垯

### Tab 閿亶鍘嗛『搴?
```
1. 鍏堥亶鍘嗘墍鏈?tabindex="1" 鐨勫厓绱狅紙鎸夋暟鍊间粠灏忓埌澶э級
2. 鍐嶉亶鍘嗘墍鏈?tabindex="2, 3, ..." 鐨勫厓绱狅紙鎸夋暟鍊间粠灏忓埌澶э級
3. 鏈€鍚庨亶鍘嗘墍鏈?tabindex="0" 鍜屾棤 tabindex 鐨勫彲鑱氱劍鍏冪礌
```

> 鈿狅笍 娴忚鍣ㄤ細鍏堟敹闆嗘墍鏈夋鏁存暟 tabindex 鍏冪礌锛堟寜鏁板€煎崌搴忥級锛岀劧鍚庢敹闆?tabindex="0" 鍜屾棤 tabindex 鍏冪礌锛堟寜 DOM 椤哄簭锛夈€?
---

## 涓夌鍙栧€艰瑙?
### tabindex="0" 鈥?鑷劧椤哄簭鑱氱劍

```html
<!-- 灏?div 鍙樹负鍙仛鐒﹀厓绱?-->
<div tabindex="0" onClick="handleClick()" onKeyDown="handleKey()">
  鐜板湪鍙互鑱氱劍浜嗭紒
</div>
```

**浣跨敤鍦烘櫙锛?*
- 灏?`div`銆乣span`銆乣section` 绛夐潪鍘熺敓浜や簰鍏冪礌鍙樹负鍙仛鐒?- 鑷畾涔夊崱鐗囩粍浠堕渶瑕侀敭鐩樺彲璁块棶鏃?- 闇€瑕佸搷搴?Enter/Space 閿殑鑷畾涔夌粍浠?
---

### tabindex="-1" 鈥?浠呯▼搴忓寲鑱氱劍

```html
<!-- 鏃犳硶閫氳繃 Tab 閿仛鐒︼紝浣嗗彲閫氳繃 JS focus() 鑱氱劍 -->
<div tabindex="-1">鍙€氳繃 element.focus() 鑱氱劍</div>

<!-- 鏅€氬厓绱犳棤娉曡仛鐒?-->
<div>鏃犳硶鑱氱劍</div>
```

**浣跨敤鍦烘櫙锛?*
- ARIA 缁勪欢鍐呴儴閫夐」锛氫笅鎷夎彍鍗曠殑瀛愰€夐」鐢ㄦ柟鍚戦敭瀵艰埅锛宍tabindex="-1"` 浣块€夐」鍙 JS 鑱氱劍
- 妯℃€佹鎵撳紑鏃惰仛鐒﹀埌涓昏鍐呭锛歚modal.querySelector('button').focus()`
- "璺宠浆鍒颁富瑕佸唴瀹?閾炬帴锛堣瑙夐殣钘忥紝浠?JS 鑱氱劍锛?
```html
<!-- 璺宠繃瀵艰埅閾炬帴鐨勭粡鍏告ā寮?-->
<a href="#main" tabindex="-1" class="skip-link">璺宠繃瀵艰埅</a>
<nav>瀵艰埅鑿滃崟...</nav>
<main id="main">涓昏鍐呭</main>
```

---

### 姝ｆ暣鏁?tabindex 鈥?涓轰粈涔堜笉瑕佺敤

```html
<!-- 鉂?閿欒绀轰緥锛氱淮鎶ゅ洶闅撅紝椤哄簭涓嶇洿瑙?-->
<div tabindex="3">绗笁涓?/div>
<div tabindex="1">绗竴涓?/div>
<div tabindex="2">绗簩涓?/div>
<!-- HTML 椤哄簭鏄?3鈫?鈫?锛屼絾 Tab 椤哄簭鏄?1鈫?鈫? -->
```

**姝ｆ暣鏁?tabindex 鐨勯棶棰橈細**

| 闂 | 璇存槑 |
|------|------|
| 缁存姢鍥伴毦 | 鏂板厓绱犺鐢ㄥ摢涓暟瀛楋紵鐜版湁鏁板瓧澶熺敤鍚楋紵 |
| 椤哄簭涓嶇洿瑙?| HTML 缁撴瀯鍜?Tab 椤哄簭涓嶄竴鑷达紝闅句互瀵归綈 |
| DOM 椤哄簭鏇寸伒娲?| 渚濋潬鏂囨。缁撴瀯鍐冲畾椤哄簭锛屽鍒犲厓绱犳棤闇€鏀?tabindex |
| 鍙闂€ч棶棰?| 灞忓箷闃呰鍣ㄧ敤鎴蜂緷璧栧彲棰勬祴鐨?Tab 椤哄簭 |

**鉁?姝ｇ‘鍋氭硶锛氫緷闈?DOM 椤哄簭**

```html
<!-- 鎺ㄨ崘锛欴OM 椤哄簭鍗?Tab 椤哄簭 -->
<div>绗竴涓?/div>
<div>绗簩涓?/div>
<div>绗笁涓?/div>

<!-- 鎴栨樉寮忓０鏄庡弬涓庤嚜鐒堕『搴?-->
<div tabindex="0">鍙仛鐒?/div>
```

---

## ARIA 鏃犻殰纰嶅簲鐢?
### 鍩虹妯″紡锛氳嚜瀹氫箟鎸夐挳

```html
<div role="button"
     tabindex="-1"
     onKeyDown="if(event.key === 'Enter' || event.key === ' ') { activate(); }"
     onClick="activate()">
  鑷畾涔夋寜閽?</div>
```

- `tabindex="-1"`锛氫娇 div 鍙 JS 鑱氱劍锛屼絾涓嶅弬涓?Tab 閬嶅巻
- `role="button"`锛氬憡璇夊睆骞曢槄璇诲櫒杩欐槸鎸夐挳
- `onKeyDown`锛氱洃鍚?Enter/Space 閿Е鍙戞縺娲?
### 瀹屾暣绀轰緥锛氳嚜瀹氫箟涓嬫媺鑿滃崟

```html
<div role="menu">
  <div role="menuitem" tabindex="0">鏂囦欢</div>
  <div role="menuitem" tabindex="-1">鏂板缓</div>
  <div role="menuitem" tabindex="-1">鎵撳紑</div>
</div>

<script>
  const menuitems = document.querySelectorAll('[role="menuitem"]');
  menuitems.forEach((item, i) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = menuitems[i + 1] || menuitems[0];
        next.focus(); // JS 鑱氱劍鍒颁笅涓€涓€夐」
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = menuitems[i - 1] || menuitems[menuitems.length - 1];
        prev.focus();
      }
    });
  });
</script>
```

**妯″紡璇存槑锛?*
- 椤跺眰鑿滃崟椤?`tabindex="0"`锛氬弬涓?Tab 椤哄簭锛岀敤鎴峰彲鐩存帴 Tab 鍒?- 瀛愰€夐」 `tabindex="-1"`锛氫笉鍙備笌 Tab 椤哄簭锛岄€氳繃鏂瑰悜閿湪鑿滃崟鍐呭鑸?
---

## tabindex 涓?accesskey 鐨勫叧绯?
| 灞炴€?| 浣滅敤 | 鎺ㄨ崘绋嬪害 |
|------|------|----------|
| `accesskey` | 璁剧疆閿洏蹇嵎閿紙娴忚鍣?淇グ閿縺娲伙級 | 鉂?宸插簾寮冿紝涓嶆帹鑽?|
| `tabindex` | 鎺у埗 Tab 閿亶鍘嗛『搴?| 鉁?鏍稿績鏃犻殰纰嶅睘鎬?|

**accesskey 鐨勯棶棰橈細**
- 娴忚鍣ㄥ揩鎹烽敭鍐茬獊锛圓lt/Ctrl+key 鍦ㄥ悇娴忚鍣ㄤ腑琛屼负涓嶄竴鑷达級
- 娌℃湁鏍囧噯鍖栫殑淇グ閿害瀹?- 绉诲姩绔嚑涔庢棤鏁?
**鐜颁唬鏇夸唬鏂规锛?*
- 浣跨敤 Web Components 鎴栨鏋舵彁渚涚殑蹇嵎閿簱
- 鑷畾涔夐敭鐩樺揩鎹烽敭瀹炵幇锛屼笉渚濊禆 `accesskey`

---

## 娴忚鍣ㄨ涓?
| 娴忚鍣?| Tab 閬嶅巻 | JS focus() | 璇存槑 |
|--------|----------|------------|------|
| Chrome | 鉁?瀹屾暣鏀寔 | 鉁?| 鎸夎鑼冨疄鐜?|
| Firefox | 鉁?瀹屾暣鏀寔 | 鉁?| 鎸夎鑼冨疄鐜?|
| Safari | 鉁?瀹屾暣鏀寔 | 鉁?| 鎸夎鑼冨疄鐜?|
| Edge | 鉁?瀹屾暣鏀寔 | 鉁?| Chromium 鍐呮牳 |

**榛樿鍙仛鐒﹀厓绱狅紙鏃犻渶 tabindex锛夛細**
- `<a href="...">`
- `<button>`
- `<input>`
- `<select>`
- `<textarea>`
- `<area>`
- `<iframe>`
- `<object>`
- `<embed>`
- `<summary>`

---

## 鏈€浣冲疄璺?
| 鍦烘櫙 | 鎺ㄨ崘 tabindex | 鍘熷洜 |
|------|--------------|------|
| 鍙氦浜掔殑鍘熺敓鍏冪礌锛坆utton銆乮nput銆乤锛?| 涓嶉渶瑕?| 榛樿鍙仛鐒?|
| 鑷畾涔夊彲鑱氱劍缁勪欢 | `tabindex="0"` | 鍙備笌鑷劧 Tab 椤哄簭 |
| 闇€瑕佺▼搴忚仛鐒︿絾涓嶉渶瑕?Tab 閬嶅巻 | `tabindex="-1"` | ARIA 缁勪欢甯哥敤妯″紡 |
| 璺宠浆鍒颁富瑕佸唴瀹归摼鎺?| `tabindex="-1"` | 瑙嗚闅愯棌锛屼粎 JS 鑱氱劍 |
| **浠讳綍鎯呭喌** | 姝ｆ暣鏁?| 鉂?缁濆涓嶈浣跨敤 |

### 浠ｇ爜瑙勮寖妫€鏌ユ竻鍗?
- 鉁?浼樺厛浣跨敤鍘熺敓鍏冪礌锛坆utton, a, input锛?- 鉁?鑷畾涔夌粍浠朵娇鐢?`tabindex="0"`
- 鉁?闇€瑕佺▼搴忚仛鐒︽椂浣跨敤 `tabindex="-1"`
- 鉁?閰嶅悎 `role` 灞炴€т娇鐢紝瀹炵幇璇箟鍖?- 鉂?涓嶈浣跨敤 `tabindex > 0`
- 鉂?涓嶈瀵瑰凡鍙仛鐒﹀厓绱狅紙button, a锛夋坊鍔?tabindex
- 鉂?涓嶈鐢?`accesskey`锛屾敼鐢ㄨ嚜瀹氫箟蹇嵎閿柟妗?
---

## 甯歌閿欒

### 鉂?閿欒 1锛氱粰鍘熺敓鍏冪礌鍔?tabindex

```html
<!-- 涓嶉渶瑕侊紒button 榛樿鍙仛鐒?-->
<button tabindex="0">鎻愪氦</button>

<!-- 杩欐牱鍋氬弽鑰屽彲鑳界牬鍧忓彲璁块棶鎬?-->
```

### 鉂?閿欒 2锛氭鏁存暟瀵艰嚧椤哄簭娣蜂贡

```html
<div tabindex="5">绗簲姝?/div>
<div tabindex="1">绗竴姝?/div>
<div tabindex="2">绗簩姝?/div>
<div tabindex="3">绗笁姝?/div>
<div tabindex="4">绗洓姝?/div>
<!-- 缁存姢鏃跺鏄撳嚭閿欙細鏂板鍏冪礌璇ユ斁鍝噷锛?-->
```

### 鉂?閿欒 3锛歛ccesskey

```html
<!-- 宸插簾寮冿紝娴忚鍣ㄥ吋瀹规€у樊 -->
<button accesskey="s">淇濆瓨</button>

<!-- 鐜颁唬鏇夸唬锛氳嚜瀹氫箟蹇嵎閿鐞嗗櫒 -->
```

---

## 婕旂ず

馃憠 [tabindex 浜や簰婕旂ず](./tabindex-demo.html)

---

## 鍙傝€冮摼鎺?
- [MDN: tabindex](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/tabindex)
- [W3C HTML Spec - Editing and focus](https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute)
- [WAI-ARIA Authoring Practices - Keyboard Navigation](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
