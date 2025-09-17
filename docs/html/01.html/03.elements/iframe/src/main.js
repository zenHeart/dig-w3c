const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const app = new Koa();
app.use(serve(path.join(__dirname, './public')));
app.listen(3000, () => console.log('主页面服务运行在 http://localhost:3000'));


const app1 = new Koa();
app1.use(serve(path.join(__dirname, './public')));
app1.listen(4000, () => console.log('iframe 服务运行在 http://localhost:4000'));
