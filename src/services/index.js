const products = require('./products/products.service.js');
const productTypes = require('./product-types/product-types.service.js');
const searchBrands = require('./search-brands/search-brands.service.js');
const users = require('./users/users.service.js');

const rxnconso = require('./rxnconso/rxnconso.service.js');

const prescriptions = require('./prescriptions/prescriptions.service.js');

const rxnrel = require('./rxnrel/rxnrel.service.js');

const searchIngredients = require('./search-ingredients/search-ingredients.service.js');

const searchProducts = require('./search-products/search-products.service.js');

const createBrandedProducts = require('./create-branded-products/create-branded-products.service.js');

const rxcuiIds = require('./rxcui-ids/rxcui-ids.service.js');

const manufacturers = require('./manufacturers/manufacturers.service.js');

const productImgs = require('./product-imgs/product-imgs.service.js');

const frequencies = require('./frequencies/frequencies.service.js');

const roles = require('./roles/roles.service.js');

const createProduct = require('./create-product/create-product.service.js');

const doseForms = require('./dose-forms/dose-forms.service.js');

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
    app.configure(createBrandedProducts);
    app.configure(rxcuiIds);
    app.configure(manufacturers);
    app.configure(productImgs);
    app.configure(frequencies);
    app.configure(roles);
    app.configure(createProduct);
    app.configure(doseForms);
};