// 验证能否动态修改 arguments
function demo(a,b) {
	console.log(arguments);
	a={a:1}
	console.log(arguments);
}

demo(1,2)