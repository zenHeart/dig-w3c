# 时间格式

**详解各种时间格式**

----

## 时间概述
时间格式的规定，有 
[ISO](https://en.wikipedia.org/wiki/ISO_8601)

[rfc2822](https://tools.ietf.org/html/rfc2822#section-3.3)

[date 格式讲解](https://www.wikiwand.com/en/Date_format_by_country)

> **GMT**   

格林尼标准时间，以英国伦敦格林尼治天文台作为经线的起点，
来计算的时间。现在被协调世界时 UTC 取代。


> **UTC**   

基于原子钟的计时系统，效果和 GMT 相似，但是更精确。


格式|含义
:---|:---|
YYYY|年份 2000
MM |月两位数字
DD |天两位数字
hh |小时两位
mm |分钟两位
ss |秒两位
s  |1或多位代表秒的分数
TZD|时区标志


其他语言的事件格式规定如下.

[PHP](http://www.php.net/manual/zh/function.date.php)

[java](http://stackoverflow.com/questions/4216745/java-string-to-date-conversion/)

总结通用规范如下




## 规范
### [IETF 2822](https://tools.ietf.org/html/rfc2822#section-3.3)

> 格式为: `YYYY-MM-DDTHH:mm:ss.sssZ`

各字段含义如下:

* **YYYY** 4位10进制年份范围从 `0000-9999`
* **-** 年月日的分隔符
* **MM** 月份从 `01-12`
* **DD** 日期从 `01-31`
* **T** 表示时间的起始字符
* **HH** 小时,范围 `00-24`
* **:** 时分秒分隔符
* **mm** 分钟,范围 `00-59`
* **ss** 秒,范围 `00-59`
* **.** 秒和毫秒分隔符
* **sss** ms,范围 `000-999`
* **Z** 时区,后面可接 **HH:mm** 的格式利用 `+,-` 表示时差

### 