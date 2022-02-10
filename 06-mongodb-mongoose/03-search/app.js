const Koa = require('koa');
const Router = require('koa-router');
const {productsByQuery} = require('./controllers/products');
// const Category = require('./models/Category');
// const Product = require('./models/Product');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});
// (async function() {
//   await Category.deleteMany();
//   await Product.deleteMany();
//
//   const category = await Category.create({
//     title: 'Category1',
//     subcategories: [{
//       title: 'Subcategory1',
//     }],
//   });
//
//   await Product.create({
//     title: 'ProductA',
//     description: 'тест',
//     price: 10,
//     category: category.id,
//     subcategory: category.subcategories[0].id,
//     images: ['image1'],
//   });
//
//   await Product.create({
//     title: 'ProductB',
//     description: 'better than ProductA',
//     price: 10,
//     category: category.id,
//     subcategory: category.subcategories[0].id,
//     images: ['image1'],
//   });
//   await Product.create({
//     title: 'ProductC',
//     description: 'тес тест',
//     price: 10,
//     category: category.id,
//     subcategory: category.subcategories[0].id,
//     images: ['image1'],
//   });
// })();

const router = new Router({prefix: '/api'});

router.get('/products', productsByQuery);

app.use(router.routes());

module.exports = app;
