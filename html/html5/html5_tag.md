HTML 标签详解
=====



## 表格标签详解 ##
**内容模型：** 是为了定义 HTML 元素在文档树节点中，所能包含的数据类型，是为了避免错误的文档结构造成的渲染异常。最好遵守语义化的表达方式。

表格内容模型：流式元素、

表格元素顺序：

caption 元素  -> 描述该表格的功能

一个或多个 colgroup 元素

可选的 thead 元素

可选的 tfoot 元素

一个或多个 tbody 元素嵌套一个或多个 tr 元素

属性：全局属性、border 属性、sortable 分类属性

## 表格标签汇总 ##
<table>
<tbody><tr>
<th>标签</th>
<th>描述</th>
<th>常用属性</th>
</tr>
<tr>
<td ><a href="http://www.w3schools.com/tags/tag_table.asp">&lt;table&gt;</a></td>
<td>定义表格</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_caption.asp">&lt;caption&gt;</a></td>
<td>定义表格标题，说明表格的内容等</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_th.asp">&lt;th&gt;</a></td>
<td>表格中标题单元格</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_tr.asp">&lt;tr&gt;</a></td>
<td>定义表格中的行</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_td.asp">&lt;td&gt;</a></td>
<td>定义表格中的单元</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_thead.asp">&lt;thead&gt;</a></td>
<td>定义表格中的表头内容</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_tbody.asp">&lt;tbody&gt;</a></td>
<td>定义表格中的主体内容</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_tfoot.asp">&lt;tfoot&gt;</a></td>
<td>定义表格中的表注内容（脚注）</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_col.asp">&lt;col&gt;</a></td>
<td>定义表格中一个或多个列的属性值</td>
</tr>
<tr>
<td><a href="http://www.w3schools.com/tags/tag_colgroup.asp">&lt;colgroup&gt;</a></td>
<td>定义表格中供格式化的列组</td>
</tr>
</tbody></table>

## 常用模式 ##

## link 等标签
* integrity 资源完整性标签
`script` 或 `link` 获取服务器资源文件时若出现此标签
 浏览器执行如下：
1. 校验此标签内容
2. 若不合法则不执行对应内容，并返回提取错误
