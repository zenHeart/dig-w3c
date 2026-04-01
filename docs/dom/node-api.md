# Node API 瀹屽叏鎸囧崡

> 鏈枃浠?`insertBefore` 鍒囧叆锛岀郴缁熸⒊鐞?DOM Node 鎺ュ彛鐨勬牳蹇?API銆?
## 鐩綍

- [姒傝堪](#姒傝堪)
- [鑺傜偣灞炴€(#鑺傜偣灞炴€?
- [鑺傜偣鍏崇郴 API](#鑺傜偣鍏崇郴-api)
- [鑺傜偣澧炲垹鏀规煡](#鑺傜偣澧炲垹鏀规煡)
- [鑺傜偣姣旇緝涓庡垽瀹歖(#鑺傜偣姣旇緝涓庡垽瀹?
- [DocumentFragment](#documentfragment)
- [甯歌浣跨敤鍦烘櫙](#甯歌浣跨敤鍦烘櫙)

---

## 姒傝堪

`Node` 鏄?DOM 鏍戜腑鎵€鏈夎妭鐐圭殑鍩虹被锛屽畾涔変簡鎵€鏈夎妭鐐瑰叡鏈夌殑灞炴€у拰鏂规硶銆?
```
Node (鎶借薄鍩虹被)
鈹溾攢鈹€ Element
鈹?  鈹溾攢鈹€ HTMLElement
鈹?  鈹?  鈹溾攢鈹€ HTMLDivElement
鈹?  鈹?  鈹斺攢鈹€ ...
鈹?  鈹斺攢鈹€ SVGElement
鈹溾攢鈹€ Text
鈹溾攢鈹€ Comment
鈹溾攢鈹€ Document
鈹溾攢鈹€ DocumentFragment
鈹斺攢鈹€ ProcessingInstruction
```

### nodeType 瀵圭収琛?
| 甯搁噺 | 鍊?| 瀵瑰簲鎺ュ彛 |
|------|----|----------|
| `Node.ELEMENT_NODE` | 1 | `Element` |
| `Node.TEXT_NODE` | 3 | `Text` |
| `Node.COMMENT_NODE` | 8 | `Comment` |
| `Node.DOCUMENT_NODE` | 9 | `Document` |
| `Node.DOCUMENT_FRAGMENT_NODE` | 11 | `DocumentFragment` |

```js
document.body.nodeType      // 鈫?1
document.body.nodeName      // 鈫?"BODY"
Node.ELEMENT_NODE === 1     // 鈫?true
```

---

## 鑺傜偣灞炴€?
### nodeType

杩斿洖鑺傜偣鐨勭被鍨嬶紙鏁存暟锛夈€?
```js
document.nodeType              // 鈫?9 (DOCUMENT_NODE)
document.documentElement.nodeType  // 鈫?1 (ELEMENT_NODE)
```

### nodeName

杩斿洖鑺傜偣鐨勬爣绛惧悕锛堝ぇ鍐欙級銆?
```js
document.createElement('div').nodeName  // 鈫?"DIV"
document.createTextNode('hi').nodeName   // 鈫?"#text"
```

### textContent

杩斿洖/璁剧疆鑺傜偣鍙婂叾鍚庝唬鐨勬墍鏈夋枃鏈唴瀹广€?
```js
// 鑾峰彇
element.textContent

// 璁剧疆锛堜細绉婚櫎鎵€鏈夊瓙鑺傜偣骞舵浛鎹负鍗曚釜 Text 鑺傜偣锛?element.textContent = 'Hello World'

// 涓?innerText 鐨勫尯鍒細
// - textContent 浼氳繑鍥炴墍鏈夋枃鏈紝鍖呮嫭 <script> 鍜?<style> 鍐呭
// - innerText 鍙繑鍥炲彲瑙佹枃鏈紝浼氬彈 CSS 鏍峰紡褰卞搷锛堜笉浼氳繑鍥為殣钘忔枃鏈級
// - innerText 浼氳Е鍙戝洖娴侊紙reflow锛夛紝textContent 涓嶄細
```

### baseURI

杩斿洖鑺傜偣鐨勭粷瀵瑰熀纭€ URL銆?
```js
document.baseURI   // 鈫?"https://example.com/page"
iframe.baseURI      // 鈫?iframe 鍐呯殑鍩虹 URL
```

---

## 鑺傜偣鍏崇郴 API

### 鐖跺瓙鍏崇郴

```js
node.parentNode       // 鐖惰妭鐐癸紙Element/Document/DocumentFragment锛夛紝涓嶅彲鐢ㄦ椂杩斿洖 null
node.parentElement    // 鐖?Element 鑺傜偣锛屼笉鏄?Element 鏃惰繑鍥?null

// 绀轰緥
document.body.parentNode        // 鈫?Document
document.body.parentElement      // 鈫?null锛圖ocument 涓嶆槸 Element锛?```

### 瀛愯妭鐐归泦鍚?
```js
node.childNodes        // NodeList锛圠ive锛夛紝鍖呭惈鎵€鏈夊瓙鑺傜偣锛圗lement銆乀ext銆丆omment 绛夛級
node.children          // HTMLCollection锛圠ive锛夛紝鍙寘鍚瓙 Element
node.firstChild        // 绗竴涓瓙鑺傜偣锛屾病鏈夋椂杩斿洖 null
node.lastChild         // 鏈€鍚庝竴涓瓙鑺傜偣锛屾病鏈夋椂杩斿洖 null
node.hasChildNodes()   // 鏄惁鏈夊瓙鑺傜偣锛堟瘮 childNodes.length > 0 鏇存竻鏅帮級
```

### 鍏勫紵鍏崇郴

```js
node.nextSibling        // 涓嬩竴涓厔寮熻妭鐐?node.previousSibling    // 涓婁竴涓厔寮熻妭鐐?```

### 绀轰緥锛氶亶鍘嗘墍鏈夊瓙鍏冪礌

```js
// 鏂规硶1锛氫娇鐢?children
for (let child of element.children) {
  console.log(child.tagName)
}

// 鏂规硶2锛氫娇鐢?childNodes + nodeType 杩囨护
const elementChildren = [...element.childNodes].filter(
  node => node.nodeType === Node.ELEMENT_NODE
)

// 鏂规硶3锛氫娇鐢?TreeWalker锛堟洿鐏垫椿锛?const walker = document.createTreeWalker(
  element,
  NodeFilter.SHOW_ELEMENT,
  null,
  false
)
while (walker.nextNode()) {
  console.log(walker.currentNode.tagName)
}
```

### ownerDocument 涓?document

```js
node.ownerDocument      // 杩斿洖鎵€灞炵殑 Document 瀵硅薄锛堣妭鐐逛笉鍦ㄥ綋鍓嶆枃妗ｄ腑鏃舵湁鐢級
node.document           // 浠?Document 瀵硅薄鏈夛紝杩斿洖鑷韩
```

---

## 鑺傜偣澧炲垹鏀规煡

### appendChild(child)

灏嗚妭鐐规坊鍔犲埌瀛愯妭鐐瑰垪琛?*鏈熬**锛岃繑鍥炶娣诲姞鐨勮妭鐐广€?
```js
const p = document.createElement('p')
p.textContent = 'Hello'
document.body.appendChild(p)  // 鈫?杩斿洖 p
```

濡傛灉 `child` 宸插湪鏂囨。涓紝浼氬皢鍏朵粠鍘熶綅缃Щ鍔ㄥ埌鏂颁綅缃紙鍏堢Щ闄ゅ啀娣诲姞锛夈€?
### insertBefore(newNode, referenceNode)

鍦?`referenceNode` **涔嬪墠**鎻掑叆 `newNode`銆傝繑鍥炴彃鍏ョ殑鑺傜偣銆?
```js
parent.insertBefore(newNode, referenceNode)

// 鍦ㄥ瓙鑺傜偣鏈熬鎻掑叆锛堢瓑鏁堜簬 appendChild锛?parent.insertBefore(newNode, null)

// 鍦ㄥ紑澶存彃鍏?parent.insertBefore(newNode, parent.firstChild)
```

#### 鍏抽敭鐗规€?
1. **绉诲姩鑰岄潪澶嶅埗**锛氬鏋滆妭鐐瑰凡鍦ㄦ枃妗ｄ腑锛屼細鍏堢Щ闄ゅ啀鎻掑叆
2. **referenceNode 涓?null**锛氭彃鍏ュ埌鏈熬锛堢瓑鏁?appendChild锛?3. **杩斿洖鏂板鑺傜偣**锛氫究浜庨摼寮忔搷浣?4. **DocumentFragment**锛氭暣涓墖娈靛唴瀹硅绉诲姩

```js
// 瀹炵幇 insertAfter
function insertAfter(newNode, referenceNode) {
  return referenceNode.parentNode.insertBefore(
    newNode,
    referenceNode.nextSibling
  )
}

// 绀轰緥锛氬湪鐗瑰畾浣嶇疆鎻掑叆
const ul = document.querySelector('ul')
const li3 = ul.children[2]  // 鍋囪瑕佹彃鍦ㄧ涓変釜 li 涔嬪墠
const newLi = document.createElement('li')
newLi.textContent = 'New Item'
ul.insertBefore(newLi, li3)
```

### removeChild(child)

浠庡瓙鑺傜偣鍒楄〃涓Щ闄?`child`锛岃繑鍥炶绉婚櫎鐨勮妭鐐广€?
```js
const removed = parent.removeChild(child)
// removed 浠嶇劧瀛樺湪浜庡唴瀛樹腑锛屽彲閲嶆柊鎻掑叆鍏朵粬浣嶇疆
```

### replaceChild(newChild, oldChild)

鐢?`newChild` 鏇挎崲 `oldChild`锛岃繑鍥炶鏇挎崲鐨勮妭鐐广€?
```js
const replaced = parent.replaceChild(newChild, oldChild)
```

### cloneNode(deep)

鍏嬮殕鑺傜偣銆俙deep=true` 鏃堕€掑綊鍏嬮殕鎵€鏈夊瓙鑺傜偣銆?
```js
const clone = node.cloneNode(false)  // 娴呭厠闅嗭紙涓嶅厠闅嗗瓙鑺傜偣锛?const deepClone = node.cloneNode(true)  // 娣卞厠闅?```

#### 閲嶈鐗规€?
- **浜嬩欢鐩戝惉鍣ㄤ笉澶嶅埗**锛氫娇鐢?`addEventListener` 娣诲姞鐨勭洃鍚櫒涓嶄細琚厠闅?- **HTML 灞炴€т笉澶嶅埗**锛氱洿鎺ュ湪 DOM 涓婅缃殑灞炴€т細琚厠闅嗭紙IDL 灞炴€у `id` 浼氳鍏嬮殕锛?- **涓嶄細澶嶅埗鐖跺紩鐢?*锛氬厠闅嗙殑鑺傜偣鏄嫭绔嬭妭鐐?
```js
// 娣卞厠闅嗙ず渚?const original = document.querySelector('.card')
const clone = original.cloneNode(true)
clone.id = 'card-clone'
document.body.appendChild(clone)
```

### contains(node)

鍒ゆ柇鏌愯妭鐐规槸鍚︽槸褰撳墠鑺傜偣鐨勫瓙瀛欒妭鐐癸紙鍖呮嫭鑷韩锛夈€?
```js
document.body.contains(document.body)          // 鈫?true
document.body.contains(document.head)           // 鈫?false
document.body.contains(document.createElement('div'))  // 鈫?false锛堟湭鎸傝浇锛?```

### compareDocumentPosition(node)

姣旇緝涓や釜鑺傜偣鐨勬枃妗ｄ綅缃紝杩斿洖浣嶆帺鐮併€?
| 浣嶆帺鐮?| 鍚箟 |
|--------|------|
| `1` | 鏂紑锛堜笉鍦ㄥ悓涓€鏂囨。锛墊
| `2` | 棰嗗厛锛堝弬鏁拌妭鐐瑰湪鍓嶏級|
| `4` | 钀藉悗锛堝弬鏁拌妭鐐瑰湪鍚庯級|
| `8` | 鍖呭惈 |
| `16` | 琚寘鍚?|

```js
// 甯哥敤姣旇緝
const pos = node1.compareDocumentPosition(node2)

// 妫€鏌ユ槸鍚﹀悓涓€鑺傜偣
pos === 0

// 妫€鏌ユ槸鍚﹀湪鑺傜偣涔嬪墠
pos & Node.DOCUMENT_POSITION_PRECEDING

// 妫€鏌ユ槸鍚﹀湪鑺傜偣涔嬪悗
pos & Node.DOCUMENT_POSITION_FOLLOWING
```

### isSameNode(node) 涓?isEqualNode(node)

```js
node.isSameNode(otherNode)   // 鏄惁鏄悓涓€鑺傜偣锛?==锛夛紝宸插簾寮冿紝鎺ㄨ崘浣跨敤 ===
node.isEqualNode(otherNode)  // 鏄惁鍏锋湁鐩稿悓灞炴€у拰瀛愯妭鐐癸紙绫诲瀷鐩稿悓锛?```

---

## DocumentFragment

`DocumentFragment` 鏄交閲忕骇瀹瑰櫒锛屽彲鍖呭惈澶氫釜鑺傜偣銆?
### 鐗规€?
- 涓嶅睘浜庢枃妗ｆ爲锛氭彃鍏ユ椂鍙彃鍏ュ叾瀛愯妭鐐癸紝Fragment 鑷韩涓嶈鎻掑叆
- 鎵归噺鎿嶄綔浼樺寲锛氬噺灏戝洖娴佹鏁?- 鑴辩鏂囨。锛氬瓙鑺傜偣鍏ㄩ儴绉诲姩鍒扮洰鏍囦綅缃悗锛孎ragment 涓虹┖

```js
// 鎵归噺鎻掑叆浼樺寲
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li')
  li.textContent = `Item ${i}`
  fragment.appendChild(li)
}
ul.appendChild(fragment)  // 鍙Е鍙戜竴娆″洖娴?
// 绛夋晥浜?insertBefore + DocumentFragment
const fragment = document.createDocumentFragment()
fragment.appendChild(node1)
fragment.appendChild(node2)
parent.insertBefore(fragment, referenceNode)  // 涓€娆℃€ф彃鍏ヤ袱涓妭鐐?```

---

## 甯歌浣跨敤鍦烘櫙

### 鍦烘櫙1锛氱Щ鍔ㄨ妭鐐瑰埌鍙︿竴涓綅缃?
```js
// 灏嗙涓€涓瓙鑺傜偣绉诲埌鏈€鍚?const first = parent.firstChild
parent.appendChild(first)  // appendChild 浼氳嚜鍔ㄧЩ闄ゅ啀娣诲姞
```

### 鍦烘櫙2锛氭竻绌烘墍鏈夊瓙鑺傜偣

```js
// 鏂规硶1锛歵extContent锛堟渶绠€娲侊紝浼氱Щ闄ゆ墍鏈夊瓙鑺傜偣鍖呮嫭鏂囨湰锛?parent.textContent = ''

// 鏂规硶2锛歸hile 寰幆锛堜繚鐣?parent 寮曠敤锛?while (parent.firstChild) {
  parent.removeChild(parent.firstChild)
}

// 鏂规硶3锛歩nnerHTML锛堝彲鑳芥湁 XSS 椋庨櫓锛?parent.innerHTML = ''
```

### 鍦烘櫙3锛氬氨鍦版浛鎹㈣妭鐐癸紙鏃犻棯鐑侊級

```js
// 鏇挎崲鍗曚釜鑺傜偣
function replaceNode(oldNode, newNode) {
  oldNode.parentNode.replaceChild(newNode, oldNode)
}

// 鎵归噺鏇挎崲锛堜繚鐣欑埗鑺傜偣寮曠敤锛?function replaceAllChildren(parent, newChildren) {
  const fragment = document.createDocumentFragment()
  newChildren.forEach(child => fragment.appendChild(child))
  parent.textContent = ''
  parent.appendChild(fragment)
}
```

### 鍦烘櫙4锛氭娴嬪厓绱犳槸鍚︿负绌?
```js
function isEmpty(element) {
  return !element.firstChild
}

function hasOnlyWhitespace(element) {
  return element.textContent.trim() === ''
}
```

### 鍦烘櫙5锛氳幏鍙栨墍鏈夋枃鏈妭鐐?
```js
function getTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  const nodes = []
  let node
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      nodes.push(node)
    }
  }
  return nodes
}
```

### 鍦烘櫙6锛歩nsertAfter 瀹炵幇

```js
function insertAfter(newNode, referenceNode) {
  return referenceNode.parentNode.insertBefore(
    newNode,
    referenceNode.nextSibling
  )
}

// 鎻掑叆鍒版湯灏?function appendTo(parent, newNode) {
  return parent.insertBefore(newNode, null)
}
```

---

## 娉ㄦ剰浜嬮」

1. **Live Collections**锛歚childNodes` 鍜?`children` 鏄?Live Collection锛岄亶鍘嗘椂娉ㄦ剰蹇収
2. **鑺傜偣绉诲姩鑷姩绉婚櫎**锛歚appendChild`/`insertBefore` 浼氳嚜鍔ㄤ粠鍘熶綅缃Щ闄よ妭鐐?3. **DocumentFragment 琛屼负**锛氭彃鍏ユ椂鍙彃鍏ュ瓙鑺傜偣锛孎ragment 鏈韩涓虹┖
4. **鎬ц兘浼樺寲**锛氶绻?DOM 鎿嶄綔鏃朵娇鐢?`DocumentFragment` 鍑忓皯鍥炴祦

---

## 鍙傝€?
- [MDN: Node](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)
- [MDN: Node.insertBefore](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)
- [DOM Spec: Node](https://dom.spec.whatwg.org/#interface-node)
