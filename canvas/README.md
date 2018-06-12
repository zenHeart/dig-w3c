# CANVAS 使用手册
**前言：** 讲解 CANVAS 的 DEVICE_API 使用

## CANVAS 的介绍
CANVAS 是 W3C 推出的基于 JS 画图的 DEVICE_API ,可以用来实现 2 位的基本图像绘制，
并结合这些基本的画图 DEVICE_API 实现你所需要的复杂图形效果，可以用在 HTML5 的游戏制作，
图表绘制等多方面。

## 基本的使用步骤
1. 在 HTML 标签中引入 CANVAS 元素
2. 在 JS 脚本中获取 CANVAS 对象。
3. 使用 CANVAS 对象中的方法绘制你所需要的图像
[请参见范例 1](http://1.wpiiot.applinzi.com/manual_demo/canvas_demo.html#test)

## 属性参考
再导入 canvas 标签后，该标签不同于 HTML 其他元素标签，只有 *width* 和 *height* 两个标签属性，
其余属性都是可选的，在不设置宽和高的情况下，默认为宽300px高150px,采用获取元素 ID 的方式可以得到
会返回  HTMLCanvasElement 的控制句柄，句柄包含以下方法和属性。
<table>
<tdead><tr>
  <td>属性或方法</td>
  <td>作用</td>
</tr></tdead>
<tbody>
  <tr>
    <td>widtd</td>
    <td>CANVAS 标签的宽度</td>
  </tr>
  <tr>
    <td>height</td>
    <td>CANVAS 标签的高度</td>
  </tr>
  <tr>
    <td>getContext('2d')</td>
    <td>获取 context 对象，这个对象上拥有绘图的 DEVICE_API,以后 W3C 可能会更改为 3d 的获取</td>
  </tr>
  <tr>
    <td>toDataURL()</td>
    <td>将 CANVAS 对象转换为数据 URL,(不理解dataurl参看<a href="http://www.webhek.com/data-url/#1">DataURL定义</a>）</td>
  </tr>
</tbody>
</table>
在使用 HTMLCanvasElement.getContext('2d') 获取 CanvasRenderingContext2D 画图对象后，此时
若想重新调用 HTMLCanvasElement 元素上的属性比如附加点击事件等，可以采用 canvas 方法。

[请参见范例2](http://1.wpiiot.applinzi.com/manual_demo/canvas_demo.html#test)

## 画图 DEVICE_API
可以把画图风格分为填充和轮廓两种方式此时就含有 fiilStyle 和 strokeStyle 两种风格
整个画图对象是在调用 HTMLCanvasElement.getContext('2d') 获取的 CanvasRenderingContext2D
对象所有的属性和方法如下表
<table>
<tdead><tr>
  <td>属性类别</td>
  <td>属性或方法</td>
  <td>作用</td>
</tr></tdead>
<tbody>
  <td rowspan="6" style="background:green">
    全局属性
  </td>
  <tr>
    <td>canvas</td>
    <td>canvas 标签对象的引用</td>
  </tr>
  <tr>
    <td>globalAlpha</td>
    <td>决定整个 CANVAS 对象的透明度</td>
  </tr>
  <tr>
    <td>globalCompositeOperation</td>
    <td>用来确定图像堆叠规则</td>
  </tr>
  <tr>
    <td>strokeStyle</td>
    <td>存储素描对象的绘画特征默认为黑色</td>
  </tr>
  <tr>
    <td>fillStyle</td>
    <td>存储填充对象的绘画特征默认为黑色</td>
  </tr>
    <td rowspan="6" style="background:green">
      变换属性
    </td>
    <tr>
      <td>scale (x,y)</td>
      <td>x,y 表示横纵轴扩张系数</td>
    </tr>
    <tr>
      <td>rotate (angle)</td>
      <td>逆时针旋转 angle 度</td>
    </tr>
    <tr>
      <td>translate (x, y)</td>
      <td>平移向量 （x,y）</td>
    </tr>
    <tr>
      <td>transform (a, b, c, d, e, f)</td>
      <td>二维平面变换矩阵</td>
    </tr>
    <tr>
      <td>setTransform (a, b, c, d, e, f)</td>
      <td>回到初始的坐标系状态</td>
    </tr>
        <td rowspan="6" style="background:green">
          颜色和风格
        </td>
        <tr>
          <td>strokeStyle</td>
          <td>轮廓的颜色</td>
        </tr>
        <tr>
          <td>fillStyle</td>
          <td>填充的颜色</td>
        </tr>
        <tr>
          <td>createLinearGradient (x0, y0, x1, y1) and addColorStop (pos, color)</td>
          <td>线性渐变颜色</td>
        </tr>
        <tr>
          <td>createRadialGradient (x0, y0, r0, x1, y1, r1) and addColorStop (pos, color)</td>
          <td>圆形渐变</td>
        </tr>
        <tr>
          <td>createPattern (image, repetition)</td>
          <td>图像填充模式</td>
        </tr>

</tbody>
</table>

### 填充画图
#### 画图步骤
1.选择填充颜色
fillStyle 支持 CSS 颜色选择包括 16进制、字符串、rgb和rgba 的模式，但是都是以字符串的格式赋值
同时也支持渐变的对象，和图像模式三种方式。
strokeStyle 为笔画的描边颜色方法和上面相同。不支持图像模式。
2.确定颜色后就可以绘制图形了
直接使用
