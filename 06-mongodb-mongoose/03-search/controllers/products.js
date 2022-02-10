const Product = require('../../02-rest-api/models/Product');
const mapProduct = require('../../02-rest-api/mappers/product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) return next();

  const rawProduct = await Product.find({
    $text: {
      $search: query,
    },
  });
  const products = rawProduct.map((product) => {
    return mapProduct(product);
  });
  ctx.body = {products};
};
