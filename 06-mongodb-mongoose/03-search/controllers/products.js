const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  const rawProduct = await Product.find({
    $text: {
      $search: query,
    },
  },
  {
    score:
      {
        $meta: 'textScore',
      },
  }).sort( {
    score: {
      $meta: 'textScore',
    },
  });
  const products = rawProduct.map((product) => {
    return mapProduct(product);
  });
  ctx.body = {products};
};
