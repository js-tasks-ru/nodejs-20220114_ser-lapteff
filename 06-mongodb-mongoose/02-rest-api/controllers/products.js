const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const rawProduct = await Product.find({subcategory: subcategory});
  const products = rawProduct.map((product)=> {
    return mapProduct(product)
  })
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const rawProduct = await Product.find();
  const products = rawProduct.map((product)=> {
    return mapProduct(product)
  })
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.status = 400;
    return next();
  }
  const rawProduct = await Product.findById(productId);
  if (!rawProduct) {
    ctx.status = 404;
    return next();
  } else {
    const product = mapProduct(rawProduct)
    ctx.body = {product};
  }

};

