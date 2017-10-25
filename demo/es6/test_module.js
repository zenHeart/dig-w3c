export var foo =1; //export 导出变量
export var sayHello = () => console.log('hello'); //export 导出方法

var arr = [1,2,3];
var add = (a,b) => a + b;
class Person {
    constructor(name) {
        this.name = name;
    }
    showName() {
        console.log(this.name);
    }
}

/*
* 可以使用大括号批量导出方法和属性
* 利用 as 实现别名
* export 无法直接导出变量,必须利用括号格式,或放在变量申明前
* export 必须处于顶层作用域
* */
export { arr,add,Person,add as autoAdd }
