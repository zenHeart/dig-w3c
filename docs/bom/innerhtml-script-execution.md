# innerHTML 鎻掑叆 script 鏍囩涓轰粈涔堜笉鎵ц

## 闂鑳屾櫙

閫氳繃 `element.innerHTML` 璧嬪€煎寘鍚?`<script>` 鏍囩鐨?HTML 瀛楃涓叉椂锛屾彃鍏ョ殑 script 鏍囩鍐呭涓嶄細浣滀负 JavaScript 鎵ц銆傝繖鏄祻瑙堝櫒瀹夊叏鏈哄埗鐨勪竴閮ㄥ垎銆?
## 鏍规湰鍘熷洜

### HTML 瑙ｆ瀽鍣ㄧ殑琛屼负宸紓

褰撲娇鐢?`innerHTML` 璁剧疆 HTML 鍐呭鏃讹紝娴忚鍣ㄧ殑 **HTML 瑙ｆ瀽鍣紙HTML Parser锛?* 浼氾細

1. 瑙ｆ瀽 HTML 瀛楃涓诧紝鏋勯€?DOM 鑺傜偣
2. **涓嶆墽琛?* `<script>` 鏍囩鍐呭锛堣涓哄畠浠槸"灏氭湭鎻掑叆鐨勮剼鏈?锛?3. 鑴氭湰浠?鎻掑叆鏃舵墽琛?鐨勬柟寮忚璇嗗埆锛屼絾 `innerHTML` 璁剧疆鍚庣殑鐘舵€佹槸"宸茶В鏋愪絾涓嶆墽琛?

### 涓庢甯?DOM 鎻掑叆鐨勫尯鍒?
| 鎿嶄綔鏂瑰紡 | script 鏄惁鎵ц |
|---------|---------------|
| `document.createElement('script')` + `appendChild()` | 鉁?鎵ц |
| `innerHTML` 璧嬪€?| 鉂?涓嶆墽琛?|
| `insertAdjacentHTML()` | 鉂?涓嶆墽琛?|
| `document.write()` | 鉁?鎵ц锛堜絾浼氶樆濉炴覆鏌擄紝宸插簾寮冿級 |

### 瑙勮寖瀹氫箟

鏍规嵁 HTML 瑙勮寖锛圵HATWG HTML Living Standard锛夛細

> When the `innerHTML` attribute is set, the user agent must run the **innerHTML fragment parsing algorithm** on the given value, inserting the resulting nodes into the context node.

鍦ㄨВ鏋愯繃绋嬩腑锛宍<script>` 鏍囩琚?鎻掑叆"浣嗚鏍囪涓?already started"锛堝凡鍚姩锛夌姸鎬併€傛牴鎹鑼冿細

> The script element must be **marked as "already started"** when it is inserted into a document, which prevents it from executing.

## 姝ｇ‘鐨勬彃鍏ユ柟寮?
### 鏂规涓€锛歝reateElement + appendChild锛堟帹鑽愶級

```javascript
const script = document.createElement('script');
script.src = 'https://example.com/bundle.js';
script.type = 'module';
document.body.appendChild(script);

// 瀵逛簬鍐呰仈鑴氭湰
const inlineScript = document.createElement('script');
inlineScript.textContent = 'console.log("Hello");';
document.body.appendChild(inlineScript);
```

### 鏂规浜岋細replaceWith + 鍏嬮殕

```javascript
// 鍒涘缓涓€涓复鏃跺鍣?const template = document.createElement('template');
template.innerHTML = '<script>console.log("test")<\/script>';

// 鑾峰彇鑴氭湰鍏冪礌骞舵浛鎹?const oldScript = document.querySelector('#target-script');
oldScript.replaceWith(template.content.cloneNode(true));
```

### 鏂规涓夛細getSVGDocument锛圫VG 鍦烘櫙鐗规畩锛?
瀵逛簬 SVG 鍐呯殑鑴氭湰锛岄渶瑕佷娇鐢ㄤ笉鍚岀殑鏂规硶銆?
## CSP 涓?innerHTML 鐨勫叧绯?
**Content Security Policy (CSP)** 浼氳繘涓€姝ラ檺鍒惰剼鏈墽琛岋細

```html
<!-- CSP 绂佹鍐呰仈鑴氭湰 -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">

<!-- 杩欑鎯呭喌鍗充娇浣跨敤 createElement 涔熶細琚樆姝?-->
<script>
  const script = document.createElement('script');
  script.textContent = 'console.log("test")'; // 鉂?琚?CSP 闃绘
  document.body.appendChild(script);
</script>
```

### CSP 鎸囦护褰卞搷

| CSP 鎸囦护 | 褰卞搷 |
|---------|-----|
| `script-src 'unsafe-inline'` | 鍏佽鍐呰仈鑴氭湰锛堜絾鏈夋洿濂界殑鏂规锛?|
| `script-src 'self'` | 鍙厑璁稿悓婧愯剼鏈?|
| `script-src nonce-xxx` | 鍙厑璁稿甫姝ｇ‘ nonce 鐨勮剼鏈?|
| `script-src 'strict-dynamic'` | 鍏佽鍙椾俊浠昏剼鏈姞杞界殑鑴氭湰 |

## 浣曟椂 innerHTML 鎻掑叆鐨?script 鍙兘浼氭墽琛?
### 鍦烘櫙 1锛氳法鍩熻剼鏈€氳繃 document.write

```javascript
// 鈿狅笍 闈炲父涓嶆帹鑽愶紝document.write 浼氶樆濉炴覆鏌撲笖鏈夊畨鍏ㄩ闄?document.write('<script src="https://other.com/bundle.js"><\/script>');
```

### 鍦烘櫙 2锛歋VG/XML 瑙ｆ瀽

鏌愪簺 SVG 鍦烘櫙涓嬭剼鏈涓轰笉鍚屻€?
### 鍦烘櫙 3锛氬凡鎵ц杩囩殑鑴氭湰閲嶆柊鎻掑叆

濡傛灉涓€涓剼鏈箣鍓嶅凡缁忔墽琛岃繃锛岄噸鏂版彃鍏ュ埌 DOM 涓嶄細鍐嶆鎵ц銆?
## 瀹夊叏鑰冭檻

### XSS 椋庨櫓

浣跨敤 `innerHTML` 鎻掑叆鐢ㄦ埛杈撳叆鍐呭鏄?**XSS锛堣法绔欒剼鏈敾鍑伙級** 鐨勫父瑙佹潵婧愶細

```javascript
// 鉂?鍗遍櫓锛佺敤鎴疯緭鍏ュ彲鑳芥槸鎭舵剰鑴氭湰
userInput = '<script>stealCookies()</script>';
element.innerHTML = userInput;

// 鉁?瀹夊叏鍋氭硶锛氫娇鐢?textContent 鎴?sanitize
element.textContent = userInput; // 绾枃鏈彃鍏?```

### 鎺ㄨ崘鐨勫畨鍏ㄥ仛娉?
```javascript
// 1. 浣跨敤 textContent 鎻掑叆绾枃鏈?element.textContent = '<script>alert("xss")</script>'; // 涓嶆墽琛?
// 2. 浣跨敤 DOMPurify 娓呯悊 HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// 3. 浣跨敤妯℃澘瀛楅潰閲?+ 鎵嬪姩鏋勯€?const div = document.createElement('div');
const span = document.createElement('span');
span.textContent = userInput;
div.appendChild(span);
```

## 娴忚鍣ㄥ吋瀹规€?
| 娴忚鍣?| 琛屼负 |
|-------|------|
| Chrome | innerHTML 鑴氭湰涓嶆墽琛?|
| Firefox | innerHTML 鑴氭湰涓嶆墽琛?|
| Safari | innerHTML 鑴氭湰涓嶆墽琛?|
| Edge | innerHTML 鑴氭湰涓嶆墽琛?|

鎵€鏈夌幇浠ｆ祻瑙堝櫒琛屼负涓€鑷淬€?
## 鎬荤粨

| 闂 | 绛旀 |
|-----|-----|
| 涓轰粈涔?innerHTML 鎻掑叆鐨?script 涓嶆墽琛岋紵 | HTML 瑙ｆ瀽鍣ㄥ皢鑴氭湰鏍囪涓?already started"锛岄槻姝㈤噸澶嶆墽琛?|
| 瑙勮寖鍚嶇О鏄粈涔堬紵 | HTML 瑙勮寖涓О涓?already started"妫€鏌?|
| 濡備綍姝ｇ‘鎻掑叆鑴氭湰锛?| `document.createElement('script')` + `appendChild()` |
| CSP 浼氬奖鍝嶅悧锛?| 鏄紝CSP 浼氳繘涓€姝ラ檺鍒惰剼鏈墽琛屾潵婧?|
| innerHTML 鏈?XSS 椋庨櫓鍚楋紵 | 鏈夛紝鎻掑叆鐢ㄦ埛杈撳叆鏃跺繀椤诲厛娓呯悊 |

## 鍙傝€冭祫鏂?
- [WHATWG HTML Living Standard - The innerHTML attribute](https://html.spec.whatwg.org/multipage/parsing.html#innerhtml)
- [MDN - innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP - XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
