function bindHandle(ws) {
	let wsEventHandle = {
		onopen(event) {
			console.log('connect success', event)
			console.log('ws:',ws);
		},
		onmessage(event) {
			console.log('receive from server', event)
		},
		onerror (event) {
			console.log('error', event)
		},
		onclose (event) {
			console.log('close connect', event)
		}
	}
	Object.keys(wsEventHandle).forEach(eventName => {
		ws[eventName] = wsEventHandle[eventName]
	})
}
function initWsClient() {
	ws = new WebSocket('wss://echo.websocket.org')
	bindHandle(ws)
}
function closeConnect() {
	console.log('close connect ...')
	ws.close();
}
function sendMsg() {
	ws.send(msg.value)
	console.log('send:',msg.value)
}

window.addEventListener('load',initWsClient,false)

