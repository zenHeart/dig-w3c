// 大括号对变量提升有影响,只会提升到大括号一层
function a(res) {
    sayFalse();
    sayTrue();
    if (res) {
        function sayTrue() {
            console.log('true');
        }
    }
    {
        function sayFalse() {
            console.log('false');
        }
    }
}

a(1);
