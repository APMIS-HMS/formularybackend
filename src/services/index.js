const products = require('./products/products.service.js');
const productTypes = require('./product-types/product-types.service.js');
const searchBrands = require('./search-brands/search-brands.service.js');
const users = require('./users/users.service.js');

const rxnconso = require('./rxnconso/rxnconso.service.js');

const prescriptions = require('./prescriptions/prescriptions.service.js');

const rxnrel = require('./rxnrel/rxnrel.service.js');

const searchIngredients = require('./search-ingredients/search-ingredients.service.js');

const searchProducts = require('./search-products/search-products.service.js');

module.exports = function(app) {
    app.configure(products);
    app.configure(productTypes);
    app.configure(searchBrands);
    app.configure(users);
    app.configure(rxnconso);
    app.configure(prescriptions);
    app.configure(rxnrel);
    app.configure(searchIngredients);
    app.configure(searchProducts);
};