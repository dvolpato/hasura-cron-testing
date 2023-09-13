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
router.post('/quick', async (ctx) => {
  console.log('/quick - doing some work');
  await delay(5 * 1000);
  ctx.status = 200;
});

router.post('/medium', async (ctx) => {
  console.log('/medium - doing some work');
  await delay(40 * 1000);
  ctx.status = 200;
});

router.post('/long', async (ctx) => {
  console.log('/long - doing some work');
  await delay(120 * 1000);
  ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('backend: listening on port 3000');