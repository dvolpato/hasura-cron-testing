console.log("backend");

const Koa = require('koa');
const Router = require('@koa/router');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url} ${ctx.body ? ctx.body : "{}"}`);
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} ${ctx.body ? ctx.body : "{}"} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

const router = new Router();
router.post("/1", async (ctx) => {
  await delay(60 * 1000);
  ctx.status = 200;
});

router.post("/2", async (ctx) => {
  console.log('2');
  await delay(40 * 1000);
  ctx.status = 200;
});

router.post("/3", async (ctx) => {
  console.log('3');
  await delay(80 * 1000);
  ctx.status = 200;
});

router.post("/4", async (ctx) => {
  console.log('4');
  await delay(30 * 1000);
  ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log("backend: listening on port 3000");