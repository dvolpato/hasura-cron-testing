console.log('backend');

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

const app = new Koa();

app.use(bodyParser());

// logger
app.use(async (ctx, next) => {
  console.log(`${new Date().toISOString()} | ${ctx.method} ${ctx.url}`, ctx.request.body);
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${new Date().toISOString()} | ${ctx.method} ${ctx.url}`, ctx.request.body, `- ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

const router = new Router();
router.post('/1', async (ctx) => {
  console.log('/1 - doing some work');
  await delay(60 * 1000);
  ctx.status = 200;
});

router.post('/2', async (ctx) => {
  console.log('/2 - doing some work');
  await delay(40 * 1000);
  ctx.status = 200;
});

router.post('/3', async (ctx) => {
  console.log('/3 - doing some work');
  await delay(80 * 1000);
  ctx.status = 200;
});

router.post('/4', async (ctx) => {
  console.log('/4 - doing some work');
  await delay(10 * 1000);
  ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('backend: listening on port 3000');