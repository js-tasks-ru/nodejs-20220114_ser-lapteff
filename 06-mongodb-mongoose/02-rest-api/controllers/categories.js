const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const rawCategories = await Category.find();
  const categories = rawCategories.map((category)=> {
    return mapCategory(category)
  })

  ctx.body = {categories};
};
