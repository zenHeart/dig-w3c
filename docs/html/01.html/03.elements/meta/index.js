const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const app = new Koa();

app.use(serve(path.join(__dirname, 'public'), {
   maxage: 0,
}));

const port = 3000;
app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`);
});