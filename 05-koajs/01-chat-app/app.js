const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribeResolvers = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.response.body = await new Promise((resolve) => {
    subscribeResolvers.push((message) => resolve(message));
  });
  ctx.response.status = 200;
  next();
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;
  if (!message) return next();

  subscribeResolvers.forEach((resolve) => resolve(message));
  subscribeResolvers = [];
  ctx.response.status = 200;
  ctx.response.body = 'message send';
  next();
});

app.use(router.routes());

module.exports = app;
