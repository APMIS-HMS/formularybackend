const products = require('./products/products.service.js');
const productTypes = require('./product-types/product-types.service.js');
module.exports = function (app) {
  app.configure(products);
  app.configure(productTypes);
};
